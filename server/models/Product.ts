import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: 'laptops' | 'smartphones' | 'smartwatches' | 'audio' | 'gaming' | 'components';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  specifications: ISpecification[];
  warranty: string;
  inBox: string[];
}

const SpecificationSchema = new Schema<ISpecification>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ['laptops', 'smartphones', 'smartwatches', 'audio', 'gaming', 'components'],
      required: true,
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    specifications: [SpecificationSchema],
    warranty: { type: String, default: '1 Year Official Warranty' },
    inBox: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
