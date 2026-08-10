import mongoose, { Schema, Document } from 'mongoose';

export interface ICourierSettings extends Document {
  key: string; // e.g. 'default'
  pathao: {
    enabled: boolean;
    sandbox: boolean;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    storeId: string;
  };
  steadfast: {
    enabled: boolean;
    sandbox: boolean;
    apiKey: string;
    secretKey: string;
  };
}

const CourierSettingsSchema = new Schema<ICourierSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    pathao: {
      enabled: { type: Boolean, default: true },
      sandbox: { type: Boolean, default: true },
      clientId: { type: String, default: '' },
      clientSecret: { type: String, default: '' },
      username: { type: String, default: '' },
      password: { type: String, default: '' },
      storeId: { type: String, default: '' },
    },
    steadfast: {
      enabled: { type: Boolean, default: true },
      sandbox: { type: Boolean, default: true },
      apiKey: { type: String, default: '' },
      secretKey: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const CourierSettingsModel =
  mongoose.models.CourierSettings || mongoose.model<ICourierSettings>('CourierSettings', CourierSettingsSchema);
