/**
 * Calculate grade based on total marks obtained and passing criteria
 * @param totalMarks - Total marks obtained (marks + internal)
 * @param minMarks - Minimum passing marks
 * @param maxMarks - Maximum marks for the subject
 * @returns Grade (A+, A, B+, B, C, D, E, F, NA)
 */
export const calculateGrade = (totalMarks: number, minMarks: number, maxMarks: number): "A+" | "A" | "B+" | "B" | "C" | "D" | "E" | "F" | "NA" => {
    // Validate inputs
    if (totalMarks < 0 || minMarks < 0 || maxMarks <= 0) {
        return "NA";
    }

    // If marks exceed maximum, return NA (invalid marks)
    if (totalMarks > maxMarks) {
        return "NA";
    }

    // Calculate percentage
    const percentage = (totalMarks / maxMarks) * 100;

    // If marks are below minimum passing marks, grade is F (Fail)
    if (totalMarks < minMarks) {
        return "F";
    }

    // Grade distribution based on percentage
    // A+: 90-100%
    if (percentage >= 90) {
        return "A+";
    }
    
    // A: 80-89%
    if (percentage >= 80) {
        return "A";
    }
    
    // B+: 70-79%
    if (percentage >= 70) {
        return "B+";
    }
    
    // B: 60-69%
    if (percentage >= 60) {
        return "B";
    }
    
    // C: 50-59%
    if (percentage >= 50) {
        return "C";
    }
    
    // D: 40-49%
    if (percentage >= 40) {
        return "D";
    }
    
    // E: 30-39%
    if (percentage >= 30) {
        return "E";
    }
    
    // F: Below 30% or below minimum marks
    return "F";
};

/**
 * Calculate and assign grades to subject marks
 * @param subject - Subject marks object
 * @returns Subject marks with calculated total and grade
 */
export const calculateSubjectGrade = (subject: {
    subjectName: string;
    marks: number;
    internal: number;
    total?: number;
    minMarks: number;
    maxMarks: number;
    grade?: "A+" | "A" | "B+" | "B" | "C" | "D" | "E" | "F" | "NA";
}): {
    subjectName: string;
    marks: number;
    internal: number;
    total: number;
    minMarks: number;
    maxMarks: number;
    grade: "A+" | "A" | "B+" | "B" | "C" | "D" | "E" | "F" | "NA";
} => {
    // Calculate total marks (marks + internal)
    const totalMarks = (subject.marks || 0) + (subject.internal || 0);

    // Calculate grade based on total marks
    const grade = calculateGrade(totalMarks, subject.minMarks, subject.maxMarks);

    return {
        ...subject,
        total: totalMarks,
        grade
    };
};

