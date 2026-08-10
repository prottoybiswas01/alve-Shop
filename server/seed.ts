import { connectDB } from './db';
import { ProductModel } from './models/Product';
import { OrderModel } from './models/Order';
import { CourierSettingsModel } from './models/CourierSettings';
import { INITIAL_PRODUCTS } from '../src/data/mockProducts';
import { INITIAL_ORDERS } from '../src/data/mockOrders';
import { DEFAULT_COURIER_SETTINGS } from '../src/services/courierService';

async function seedDatabase() {
  console.log('🌱 Starting MongoDB Atlas database seeding...');
  await connectDB();

  try {
    // Clean existing
    await ProductModel.deleteMany({});
    await OrderModel.deleteMany({});
    await CourierSettingsModel.deleteMany({});
    console.log('🧹 Cleaned existing database collections');

    // Insert Products
    const createdProducts = await ProductModel.insertMany(INITIAL_PRODUCTS);
    console.log(`📦 Seeded ${createdProducts.length} electronics products into MongoDB`);

    // Insert Orders
    const createdOrders = await OrderModel.insertMany(INITIAL_ORDERS);
    console.log(`📑 Seeded ${createdOrders.length} customer & POS orders into MongoDB`);

    // Insert Courier Credentials
    const createdSettings = await CourierSettingsModel.create({
      key: 'default',
      ...DEFAULT_COURIER_SETTINGS,
    });
    console.log('🚚 Seeded Pathao & Steadfast Courier API settings into MongoDB');

    console.log('🎉 MongoDB Atlas Seeding Finished Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();
