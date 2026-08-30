import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    phone: string;
    email?: string;
    inquiryType: string;
    message: string;
    createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    inquiryType: { type: String, required: true, default: "retail" },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const ContactMessage: Model<IContactMessage> =
    mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);