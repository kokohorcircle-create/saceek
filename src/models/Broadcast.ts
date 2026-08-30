import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBroadcast extends Document {
    title: string;
    body: string;
    intensity: string;
    cta_label?: string;
    cta_url?: string;
    is_active: boolean;
    ends_at?: Date;
    created_at: Date;
}

const BroadcastSchema = new Schema<IBroadcast>({
    title: { type: String, required: true },
    body: { type: String, required: true },
    intensity: { type: String, default: "mild" },
    cta_label: { type: String },
    cta_url: { type: String },
    is_active: { type: Boolean, default: true },
    ends_at: { type: Date },
    created_at: { type: Date, default: Date.now },
});

export const Broadcast: Model<IBroadcast> =
    mongoose.models.Broadcast || mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);