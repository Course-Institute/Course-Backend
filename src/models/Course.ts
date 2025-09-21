import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  duration: string;
  createdAt: Date;
}

const courseSchema: Schema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
