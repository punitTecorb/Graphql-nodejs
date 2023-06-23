import { Schema, model } from 'mongoose';
interface User {
    name: string;
    email: string;
    phoneNumber: number;
    details: any;
    count: Number
}

const schema = new Schema<User>({
    name: { type: String },
    phoneNumber: { type: Number },
    email: { type: String },
    details: {
        address: { type: String },
        qualification: { type: String }
    },
    count: { type: Number }}, {
    timestamps: true,
    versionKey: false
});

const userModel = model<User>('User', schema);
export = userModel