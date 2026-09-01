import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBroadcast extends Document {
  title: string;
  body: string;
  intensity: string;
  cta_label?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  ends_at?: Date | null;
  created_at: Date;
}

const BroadcastSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  intensity: { type: String, default: "mild" },
  cta_label: { type: String, default: null },
  cta_url: { type: String, default: null },
  is_active: { type: Boolean, default: true },
  ends_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

export const Broadcast: Model<IBroadcast> =
  mongoose.models.Broadcast || mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);