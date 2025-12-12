import mongoose, { Model, Schema, Document } from "mongoose";

export interface SubjectMarks {
  id?: string;
  subjectName: string;
  marks: number;
  internal: number;
  total?: number;
  minMarks: number;
  maxMarks: number;
  grade?: "A+" | "A" | "B+" | "B" | "C" | "D" | "E" | "F" | "NA";
}

interface IMarksheet extends Document {
  studentId?: mongoose.Types.ObjectId;
  semester?: string;
  year?: string | number;
  courseId?: mongoose.Types.ObjectId;
  serialNo?: string;
  subjects?: SubjectMarks[];
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Subject marks schema
const subjectMarksSchema = new Schema<SubjectMarks>(
  {
    id: { type: String },
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

// Main marksheet schema
const marksheetSchema = new Schema<IMarksheet>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'students', required: true },
    // Either semester or year will be provided (mutually exclusive at the API layer)
    semester: { type: String, required: false },
    year: { type: String, required: false },
    courseId: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    serialNo: { type: String, required: false },
    subjects: [subjectMarksSchema],
    role: { type: String },
  },
  {
    timestamps: true
  }
);

// Create compound unique indexes that respect mutually exclusive term fields
marksheetSchema.index(
  { studentId: 1, courseId: 1, semester: 1 },
  {
    unique: true,
    partialFilterExpression: {
      semester: { $exists: true, $ne: null }
    }
  }
);
marksheetSchema.index(
  { studentId: 1, courseId: 1, year: 1 },
  {
    unique: true,
    partialFilterExpression: { year: { $exists: true, $ne: null } }
  }
);

// Create individual indexes for faster lookups
marksheetSchema.index({ studentId: 1 });
marksheetSchema.index({ semester: 1 });
marksheetSchema.index({ year: 1 });
marksheetSchema.index({ courseId: 1 });
// Create unique sparse index on serialNo to ensure uniqueness when provided
marksheetSchema.index({ serialNo: 1 }, { unique: true, sparse: true });

const MarksheetModel: Model<IMarksheet> = mongoose.model<IMarksheet>(
  "marksheets",
  marksheetSchema,
  "marksheets"
);

export { MarksheetModel, IMarksheet };

