import { Schema, model } from 'mongoose';
interface Vendor {
    name: string;
    email: string;
    phoneNumber: number;
    password:string;
    count:number;
    image:string;
}

const schema = new Schema<Vendor>({
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: Number },
    password:{type:String},
    count:{type:Number},
    image:{type:String},
}, {
    timestamps: true,
    versionKey: false
});

const vendorModel = model<Vendor>('vendor', schema);
export = vendorModel