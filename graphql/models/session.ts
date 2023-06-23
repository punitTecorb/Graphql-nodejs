import { Schema, model } from 'mongoose';
interface Sesion {
    userId: string;
    role: string;
    token: string;
    status:boolean;
}

const schema = new Schema<Sesion>({
    userId: { type: String },
    role: { type: String },
    token: { type: String },
    status:{type:Boolean}
}, {
    timestamps: true,
    versionKey: false
});

const sessionModel = model<Sesion>('Sesion', schema);
export = sessionModel