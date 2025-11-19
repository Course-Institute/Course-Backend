import mongoose, { Model, Document, Schema, Types } from "mongoose";

interface ISubject extends Document {
  name: string;
  courseId: Types.ObjectId;
  semester: number;
  code?: string;
  credits?: number;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "courses", required: true },
    semester: { type: Number, required: true },
    code: { type: String, required: false },
    credits: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
subjectSchema.index({ courseId: 1, semester: 1 });

const SubjectModel: Model<ISubject> = mongoose.model<ISubject>(
  "subjects",
  subjectSchema,
  "subjects"
);

export { SubjectModel, ISubject };

