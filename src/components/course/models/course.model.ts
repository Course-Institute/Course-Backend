import mongoose, { Model, Document, Schema } from "mongoose";

interface ICourse extends Document {
  name: string;
  code?: string;
  coursesType?: string;
  duration?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: false, sparse: true, unique: true },
    coursesType: { type: String, required: false },
    duration: { type: Number, required: false },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
courseSchema.index({ name: 1 }, { unique: true });

const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
  "courses",
  courseSchema,
  "courses"
);

export { CourseModel, ICourse };

