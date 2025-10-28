import mongoose, { Model, Schema, Document } from "mongoose";
import { calculateGrade } from '../helpers/grade.helper.js';

export interface SubjectMarks {
  subjectName: string;
  marks: number;
  internal: number;
  total?: number;
  minMarks: number;
  maxMarks: number;
  grade?: "A+" | "A" | "B+" | "B" | "C" | "D" | "E" | "F" | "NA";
}

interface IMarksheet extends Document {
  studentId?: string;
  subjects?: SubjectMarks[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Subject marks schema
const subjectMarksSchema = new Schema<SubjectMarks>(
  {
    subjectName: { type: String, required: true },
    marks: { type: Number, required: true, default: 0 },
    internal: { type: Number, required: true, default: 0 },
    total: { type: Number, default: 0 },
    minMarks: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "E", "F", "NA"],
      default: "NA"
    }
  },
  { _id: false }
);

// Pre-save hook to calculate total and grade
subjectMarksSchema.pre('save', function(next) {
  // Calculate total marks (marks + internal)
  this.total = (this.marks || 0) + (this.internal || 0);
  
  // Calculate grade based on total, minMarks, and maxMarks
  this.grade = calculateGrade(this.total, this.minMarks, this.maxMarks);
  
  next();
});


// Main marksheet schema
const marksheetSchema = new Schema<IMarksheet>(
  {
    studentId: { type: String, required: false },
    subjects: [subjectMarksSchema],
  },
  {
    timestamps: true
  }
);

// Pre-save hook to calculate totals and grades for all subjects
marksheetSchema.pre('save', function(next) {
  if (this.subjects && this.subjects.length > 0) {
    this.subjects.forEach((subject: any) => {
      // Calculate total marks (marks + internal)
      subject.total = (subject.marks || 0) + (subject.internal || 0);
      
      // Calculate grade based on total, minMarks, and maxMarks
      subject.grade = calculateGrade(subject.total, subject.minMarks, subject.maxMarks);
    });
  }
  next();
});

const MarksheetModel: Model<IMarksheet> = mongoose.model<IMarksheet>(
  "marksheets",
  marksheetSchema,
  "marksheets"
);

export { MarksheetModel, IMarksheet };

