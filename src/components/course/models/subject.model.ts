import mongoose, { Model, Document, Schema, Types } from "mongoose";

interface ISubject extends Document {
  name: string;
  courseId: Types.ObjectId;
  semester?: number | null;
  year?: number | null;
  code?: string;
  credits?: number;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "courses", required: true },
    // Either semester or year will be provided (mutually exclusive at the API layer)
    semester: { type: Number, required: false },
    year: { type: Number, required: false },
    code: { type: String, required: false },
    credits: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
// Index for semester-based subjects
subjectSchema.index({ courseId: 1, semester: 1 }, {
  partialFilterExpression: { semester: { $exists: true, $ne: null } }
});
// Index for year-based subjects
subjectSchema.index({ courseId: 1, year: 1 }, {
  partialFilterExpression: { year: { $exists: true, $ne: null } }
});
// Individual indexes for faster lookups
subjectSchema.index({ semester: 1 });
subjectSchema.index({ year: 1 });

const SubjectModel: Model<ISubject> = mongoose.model<ISubject>(
  "subjects",
  subjectSchema,
  "subjects"
);

export { SubjectModel, ISubject };

