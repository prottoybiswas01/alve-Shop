import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { ProductModel } from './models/Product';
import { OrderModel } from './models/Order';
import { CourierSettingsModel } from './models/CourierSettings';
import { INITIAL_PRODUCTS } from '../src/data/mockProducts';
import { INITIAL_ORDERS } from '../src/data/mockOrders';
import { DEFAULT_COURIER_SETTINGS, dispatchToPathao, dispatchToSteadfast } from '../src/services/courierService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// ---------------- API ENDPOINTS ---------------- //

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: 'MongoDB Atlas (alve_shop)',
    cluster: 'cluster0.kwgejnu.mongodb.net',
    timestamp: new Date().toISOString(),
  });
});

// 2. Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products from MongoDB' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProductData = {
      ...req.body,
      id: 'prod-' + Date.now(),
    };
    const product = await ProductModel.create(newProductData);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product in MongoDB', details: err });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await ProductModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product in MongoDB' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await ProductModel.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: `Product ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 3. Orders API
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders from MongoDB' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      id: 'ALV-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: req.body.status || 'pending',
    };

    const order = await OrderModel.create(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order in MongoDB', details: err });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const updated = await OrderModel.findOneAndUpdate(
      { id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

app.put('/api/orders/:id/courier', async (req, res) => {
  try {
    const { provider } = req.body; // 'pathao' | 'steadfast'
    const order = await OrderModel.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const courierSettings = (await CourierSettingsModel.findOne({ key: 'default' })) || DEFAULT_COURIER_SETTINGS;

    let consignment;
    if (provider === 'pathao') {
      consignment = await dispatchToPathao(order as any, courierSettings as any);
    } else {
      consignment = await dispatchToSteadfast(order as any, courierSettings as any);
    }

    order.status = 'shipped';
    order.courierConsignment = consignment as any;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to dispatch order via courier API' });
  }
});

// 4. Courier Settings API
app.get('/api/courier-settings', async (req, res) => {
  try {
    let settings = await CourierSettingsModel.findOne({ key: 'default' });
    if (!settings) {
      settings = await CourierSettingsModel.create({ key: 'default', ...DEFAULT_COURIER_SETTINGS });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courier settings' });
  }
});

app.put('/api/courier-settings', async (req, res) => {
  try {
    const updated = await CourierSettingsModel.findOneAndUpdate(
      { key: 'default' },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save courier settings' });
  }
});

// 5. Database Seed Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await ProductModel.deleteMany({});
    await OrderModel.deleteMany({});
    await CourierSettingsModel.deleteMany({});

    await ProductModel.insertMany(INITIAL_PRODUCTS);
    await OrderModel.insertMany(INITIAL_ORDERS);
    await CourierSettingsModel.create({ key: 'default', ...DEFAULT_COURIER_SETTINGS });

    res.json({ message: 'MongoDB Atlas Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express Server running on http://localhost:${PORT}`);
  console.log(`🔗 Connected MongoDB URI: ${process.env.MONGODB_URI}`);
});
