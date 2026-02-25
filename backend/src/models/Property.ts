import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  category: 'rental' | 'sale' | 'luxury';
  status: 'available' | 'reserved' | 'sold' | 'rented';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agent: string;
  publishedPortals: string[];
  image?: string;
  description?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  pendingChanges?: Record<string, any>;
  editedBy?: string;
  editedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['rental', 'sale', 'luxury'], required: true },
    status: { type: String, enum: ['available', 'reserved', 'sold', 'rented'], required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    agent: { type: String, required: true },
    publishedPortals: { type: [String], default: [] },
    image: String,
    description: String,
    approvalStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    pendingChanges: { type: Schema.Types.Mixed, default: null },
    editedBy: String,
    editedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

export const Property = mongoose.model<IProperty>('Property', propertySchema);
