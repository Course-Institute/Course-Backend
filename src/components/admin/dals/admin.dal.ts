import { IStudent, StudentModel } from '../../students/model/student.model.js';
import { UserModel } from '../../users/models/user.model.js';
import { CenterModel } from '../../centers/models/center.model.js';
import { BillModel } from '../../bills/models/bill.model.js';

const getDashboardStatsDal = async () => {
    try {
        const now = new Date();
        
        // Calculate date ranges for monthly comparisons
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // 1. Get total active students count (approved by admin)
        const studentCount = await StudentModel.countDocuments({
            isApprovedByAdmin: true
        });

        // 2. Get total payments (sum of paid bills)
        const totalPaymentsResult = await BillModel.aggregate([
            {
                $match: {
                    'billDetails.status': 'paid',
                    'billDetails.amount': { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$billDetails.amount' }
                }
            }
        ]);
        const totalPayments = totalPaymentsResult.length > 0 && totalPaymentsResult[0].total 
            ? Math.round(totalPaymentsResult[0].total) 
            : 0;

        // 3. Get pending approvals (students not approved + centers pending)
        const [pendingStudents, pendingCenters] = await Promise.all([
            StudentModel.countDocuments({ isApprovedByAdmin: false }),
            CenterModel.countDocuments({ status: 'pending' })
        ]);
        const pendingApprovals = pendingStudents + pendingCenters;

        // 4. Get active centers count (approved)
        const activeCenters = await CenterModel.countDocuments({ status: 'approved' });

        // 5. Calculate student monthly increase
        const [currentMonthStudents, previousMonthStudents] = await Promise.all([
            StudentModel.countDocuments({
                createdAt: { $gte: currentMonthStart },
                isApprovedByAdmin: true
            }),
            StudentModel.countDocuments({
                createdAt: { 
                    $gte: previousMonthStart, 
                    $lte: previousMonthEnd 
                },
                isApprovedByAdmin: true
            })
        ]);

        const studentIncrease = previousMonthStudents > 0
            ? Math.round(((currentMonthStudents - previousMonthStudents) / previousMonthStudents) * 1000) / 10
            : (currentMonthStudents > 0 ? 100 : 0);

        // 6. Calculate center monthly increase
        const [currentMonthCenters, previousMonthCenters] = await Promise.all([
            CenterModel.countDocuments({
                createdAt: { $gte: currentMonthStart },
                status: 'approved'
            }),
            CenterModel.countDocuments({
                createdAt: { 
                    $gte: previousMonthStart, 
                    $lte: previousMonthEnd 
                },
                status: 'approved'
            })
        ]);

        const centerIncrease = previousMonthCenters > 0
            ? Math.round(((currentMonthCenters - previousMonthCenters) / previousMonthCenters) * 1000) / 10
            : (currentMonthCenters > 0 ? 100 : 0);

        return {
            studentCount,
            totalPayments,
            pendingApprovals,
            activeCenters,
            studentIncrease,
            centerIncrease
        };
    } catch (error) {
        console.log('Error in getDashboardStatsDal:', error);
        throw error;
    }
};

const getCenterDynamicsDal = async () => {
    try {
        // Get total centers count
        const totalCenters = await CenterModel.countDocuments();

        // Get active centers count (approved)
        const activeCenters = await CenterModel.countDocuments({ status: 'approved' });

        // Get inactive centers count (pending or rejected)
        const inactiveCenters = await CenterModel.countDocuments({
            status: { $in: ['pending', 'rejected'] }
        });

        // Get total students across all centers
        const totalStudents = await StudentModel.countDocuments({});

        // Get recent activity (centers created or updated in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentActivity = await CenterModel.find({
            $or: [
                { createdAt: { $gte: thirtyDaysAgo } },
                { updatedAt: { $gte: thirtyDaysAgo } }
            ]
        })
        .select('centerDetails.centerName centerDetails.centerCode status createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

        // Format recent activity
        const formattedRecentActivity = recentActivity.map((center: any) => {
            const createdAt = center.createdAt ? new Date(center.createdAt).getTime() : 0;
            const updatedAt = center.updatedAt ? new Date(center.updatedAt).getTime() : 0;
            // If updated more than 5 minutes after creation, consider it an update
            const action = (updatedAt - createdAt) > 300000 ? 'updated' : 'created';
            
            return {
                centerName: center.centerDetails?.centerName || '',
                centerCode: center.centerDetails?.centerCode || '',
                status: center.status || 'pending',
                createdAt: center.createdAt,
                updatedAt: center.updatedAt,
                action
            };
        });

        return {
            totalCenters: totalCenters || 0,
            activeCenters: activeCenters || 0,
            inactiveCenters: inactiveCenters || 0,
            totalStudents: totalStudents || 0,
            recentActivity: formattedRecentActivity || []
        };
    } catch (error) {
        console.log('Error in getCenterDynamicsDal:', error);
        throw error;
    }
};

const getDashboardStatistics = async () => {
    try {
        // Get total students count
        const totalStudents = await StudentModel.countDocuments();
        
        // Get students by faculty
        const studentsByFaculty = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$faculty',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get students by course
        const studentsByCourse = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$course',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get students by session
        const studentsBySession = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$session',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentRegistrations = await StudentModel.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        
        // Get monthly registrations for the current year
        const currentYear = new Date().getFullYear();
        const monthlyRegistrations = await StudentModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        return {
            totalStudents,
            recentRegistrations,
            studentsByFaculty,
            studentsByCourse,
            studentsBySession,
            monthlyRegistrations
        };
    } catch (error) {
        console.log('Error in getDashboardStatistics DAL:', error);
        throw error;
    }
};

export default {
    getDashboardStatistics,
    getDashboardStatsDal,
    getCenterDynamicsDal,
};
