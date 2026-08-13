import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { store } from './server/store';
import { askCabaiAI } from './server/gemini';
import { OrderStatus } from './src/types';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'CABAI ENTERPRISE Backend API',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // --- PRODUCTS ---
  app.get('/api/products', (req: Request, res: Response) => {
    const products = store.getProducts();
    res.json(products);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct = req.body;
    if (!newProduct.name || !newProduct.price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    const created = store.addProduct({
      id: newProduct.id || `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      stockQuantity: 50,
      ...newProduct
    });
    res.status(201).json(created);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  // --- ORDERS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const orders = store.getOrders();
    res.json(orders);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customer, items, subtotal, shipping, discount, tax, total, paymentMethod, fpxBank } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ error: 'Missing customer or order items' });
    }

    const newOrderNumber = `CBI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderNumber,
      date: new Date().toISOString(),
      customer,
      items,
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      discount: discount || 0,
      tax: tax || 0,
      total: total || 0,
      paymentMethod: paymentMethod || 'fpx',
      fpxBank,
      status: 'Pending' as OrderStatus,
      statusHistory: [
        { status: 'Pending' as OrderStatus, timestamp: new Date().toISOString(), note: 'Order placed & payment authorized via API' }
      ],
      trackingNumber: `MY-CBI-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: '1-3 Business Days'
    };

    const saved = store.addOrder(newOrder);
    res.status(201).json(saved);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = store.updateOrderStatus(req.params.id, status, note);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  });

  // --- SPOOLS & INVENTORY ---
  app.get('/api/spools', (req: Request, res: Response) => {
    const spools = store.getSpools();
    res.json(spools);
  });

  app.put('/api/spools/:id', (req: Request, res: Response) => {
    const { stockKg } = req.body;
    if (typeof stockKg !== 'number') {
      return res.status(400).json({ error: 'stockKg must be a number' });
    }
    const updated = store.updateSpool(req.params.id, stockKg);
    if (!updated) {
      return res.status(404).json({ error: 'Spool not found' });
    }
    res.json(updated);
  });

  app.post('/api/spools', (req: Request, res: Response) => {
    const spool = req.body;
    if (!spool.name || !spool.material) {
      return res.status(400).json({ error: 'Spool name and material required' });
    }
    const created = store.addSpool({
      id: spool.id || `sp-${Date.now()}`,
      stockKg: spool.stockKg || 1.0,
      totalKg: spool.totalKg || 1.0,
      isLow: (spool.stockKg || 1.0) <= 3.0,
      ...spool
    });
    res.status(201).json(created);
  });

  // --- INSTANT 3D PRINT SLICER QUOTE ENGINE ---
  app.post('/api/quote', (req: Request, res: Response) => {
    const { fileName, estimatedVolumeCm3, material, infillPercent, layerHeight, quantity } = req.body;

    const volume = Number(estimatedVolumeCm3) || 12.5; // cm3
    const infill = Number(infillPercent) || 20;
    const qty = Number(quantity) || 1;
    const lHeight = Number(layerHeight) || 0.20;

    // Material density g/cm3
    const densityMap: Record<string, number> = {
      'PLA': 1.24,
      'PETG': 1.27,
      'TPU': 1.21
    };
    const density = densityMap[material] || 1.24;

    // Weight estimate (Shells + infill)
    const effectiveInfillRatio = 0.35 + (infill / 100) * 0.65;
    const weightGrams = Math.round(volume * density * effectiveInfillRatio * 10) / 10;

    // Time estimate (volume factor + layer height factor)
    const speedFactor = lHeight < 0.18 ? 1.4 : 1.0;
    const rawHours = (volume * 0.08 * speedFactor) + 0.25; // setup overhead
    const estimatedHours = Math.round(rawHours * 10) / 10;

    // Price calculation formula (RM)
    // Base setup fee: RM 3.00, Material cost: RM 0.12/g, Machine time: RM 2.50/hr
    const matRate = material === 'TPU' ? 0.18 : material === 'PETG' ? 0.14 : 0.12;
    const basePrice = 3.00 + (weightGrams * matRate) + (estimatedHours * 2.20);
    const calculatedPrice = Math.max(3.90, Math.round(basePrice * 100) / 100); // minimum RM 3.90

    const quoteResult = {
      fileName: fileName || 'Custom_3D_Model.stl',
      volumeCm3: volume,
      weightGrams,
      material: material || 'PLA',
      infillPercent: infill,
      layerHeight: lHeight,
      estimatedHours,
      calculatedPrice,
      quantity: qty,
      totalPrice: Math.round(calculatedPrice * qty * 100) / 100,
      timestamp: new Date().toISOString()
    };

    store.saveQuote(quoteResult);
    res.json(quoteResult);
  });

  // --- GEMINI AI ASSISTANT ---
  app.post('/api/ai/assistant', async (req: Request, res: Response) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const answer = await askCabaiAI(prompt, context);
      res.json({ reply: answer });
    } catch (err: any) {
      console.error('Error in AI Assistant API:', err);
      res.status(500).json({ error: 'Failed to consult Cabai AI' });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CABAI ENTERPRISE Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
