import mongoose, { Model, Schema, Document } from "mongoose";


interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    dob?: string;
    registrationNo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dob: { type: String, required: false },
    registrationNo: { type: String, required: false, unique: true, sparse: true },
},
    {
        timestamps: true
    }
);

const UserModel: Model<IUser> =
    mongoose.model<IUser>(
        "users",
        userSchema,
        "users"
    );

export { UserModel, IUser }