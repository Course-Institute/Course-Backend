import express from 'express';
import centerController from '../controller/center.controller.js';
import { authenticateToken, authorizeCenter } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// Existing route
router.get('/getCenterAutoCompleteList', centerController.centerListAutoCompleteController);

// Protected center routes (require authentication and center role)
// Must be placed before /:centerId route to avoid route conflicts
router.get('/dashboard-stats', authenticateToken, authorizeCenter, centerController.getDashboardStatsController);

// New center management routes
router.post('/create', centerController.createCenterController);
router.get('/search', centerController.searchCentersController);
router.get('/:centerId', centerController.getCenterByIdController);
router.put('/:centerId', centerController.updateCenterController);
router.delete('/:centerId', centerController.deleteCenterController);
router.patch('/:centerId/status', centerController.updateCenterStatusController);

export default router;
