import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVaultItem extends Document {
  owner: mongoose.Types.ObjectId;
  ciphertext: string;
  iv: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema = new Schema<IVaultItem>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
  },
  { timestamps: true }
);

export const VaultItem: Model<IVaultItem> =
  (mongoose.models.VaultItem as Model<IVaultItem>) ||
  mongoose.model<IVaultItem>("VaultItem", VaultItemSchema);
