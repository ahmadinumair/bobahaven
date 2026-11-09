const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path file data
const productsFilePath = path.join(__dirname, 'data', 'products.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// Helper untuk membaca file JSON
function readJsonFile(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Gagal membaca ${filePath}:`, error.message);
    return defaultValue;
  }
}

// Helper untuk menulis file JSON
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Gagal menulis ${filePath}:`, error.message);
    return false;
  }
}

// Opsi kustomisasi minuman milk tea
const customizationOptions = {
  sugarLevels: [
    { id: 'sugar-100', label: 'Normal Sugar (100%)', value: '100%' },
    { id: 'sugar-70', label: 'Less Sugar (70%)', value: '70%' },
    { id: 'sugar-50', label: 'Half Sugar (50%)', value: '50%' },
    { id: 'sugar-0', label: 'No Sugar (0%)', value: '0%' }
  ],
  iceLevels: [
    { id: 'ice-normal', label: 'Normal Ice', value: 'Normal' },
    { id: 'ice-less', label: 'Less Ice', value: 'Less' },
    { id: 'ice-none', label: 'No Ice', value: 'None' }
  ],
  toppings: [
    { id: 'top-boba', name: 'Boba Pearl', price: 4000 },
    { id: 'top-pudding', name: 'Egg Pudding', price: 5000 },
    { id: 'top-jelly', name: 'Grass Jelly', price: 4000 },
    { id: 'top-cheese', name: 'Cheese Foam', price: 6000 },
    { id: 'top-aloe', name: 'Aloe Vera', price: 4000 }
  ]
};

// Daftar Voucher Promo
const availableVouchers = {
  BOBA20: { code: 'BOBA20', type: 'percent', value: 20, description: 'Diskon 20% Spesial Boba Party' },
  HEMAT10: { code: 'HEMAT10', type: 'nominal', value: 10000, description: 'Potongan Rp 10.000 (Min. Rp 30.000)', minOrder: 30000 }
};

// ==================== ROUTES ====================

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API Milk Tea Shop berjalan lancar!',
    timestamp: new Date().toISOString()
  });
});

// 2. Daftar Kategori
app.get('/api/categories', (req, res) => {
  const products = readJsonFile(productsFilePath);
  const categoriesSet = new Set(products.map(p => p.category));
  const categories = ['Semua', ...Array.from(categoriesSet)];
  res.json(categories);
});

// 3. Opsi Kustomisasi Minuman
app.get('/api/options', (req, res) => {
  res.json(customizationOptions);
});

// 4. Cek Validasi Kode Voucher
app.post('/api/voucher', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Kode voucher wajib diisi' });
  }

  const voucher = availableVouchers[code.toUpperCase()];
  if (!voucher) {
    return res.status(404).json({ error: 'Kode voucher tidak valid atau sudah kedaluwarsa' });
  }

  if (voucher.minOrder && subtotal < voucher.minOrder) {
    return res.status(400).json({
      error: `Minimal pembelian Rp ${voucher.minOrder.toLocaleString('id-ID')} untuk menggunakan voucher ini.`
    });
  }

  let discountAmount = 0;
  if (voucher.type === 'percent') {
    discountAmount = Math.round((subtotal * voucher.value) / 100);
  } else {
    discountAmount = Math.min(voucher.value, subtotal);
  }

  res.json({
    valid: true,
    code: voucher.code,
    description: voucher.description,
    discountAmount
  });
});

// 5. Daftar Minuman (Bisa filter kategori & pencarian)
app.get('/api/products', (req, res) => {
  let products = readJsonFile(productsFilePath);
  const { category, q, bestSeller } = req.query;

  if (category && category !== 'Semua') {
    products = products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (bestSeller === 'true') {
    products = products.filter(p => p.isBestSeller);
  }

  if (q) {
    const searchKeyword = q.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(searchKeyword) ||
        p.description.toLowerCase().includes(searchKeyword)
    );
  }

  res.json(products);
});

// 6. Detail Minuman Berdasarkan ID
app.get('/api/products/:id', (req, res) => {
  const products = readJsonFile(productsFilePath);
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Minuman tidak ditemukan' });
  }

  res.json(product);
});

// 7. Mendapatkan Semua Pesanan (Order History)
app.get('/api/orders', (req, res) => {
  const orders = readJsonFile(ordersFilePath);
  res.json(orders.slice().reverse());
});

// 8. Update Status Pesanan (Diproses -> Sedang Diracik -> Siap Diambil -> Selesai)
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Diproses', 'Sedang Diracik', 'Siap Diambil', 'Selesai'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status pesanan tidak valid' });
  }

  const orders = readJsonFile(ordersFilePath);
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  writeJsonFile(ordersFilePath, orders);

  res.json({ message: 'Status pesanan berhasil diperbarui', order: orders[index] });
});

// 9. Membuat Pesanan Baru (Checkout)
app.post('/api/orders', (req, res) => {
  const { customerName, tableOrTakeaway, items, voucherCode } = req.body;

  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Data pesanan tidak lengkap! Pastikan mengisi nama dan memilih item.'
    });
  }

  // Hitung subtotal
  let subtotal = 0;
  const processedItems = items.map(item => {
    const toppingsTotal = (item.toppings || []).reduce((sum, top) => {
      if (typeof top === 'object' && top.price) return sum + top.price;
      const matched = customizationOptions.toppings.find(
        t => t.name === top || `${t.name} (+Rp ${t.price.toLocaleString('id-ID')})` === top
      );
      return sum + (matched ? matched.price : 0);
    }, 0);

    const unitPrice = item.price + toppingsTotal;
    const itemSubtotal = unitPrice * (item.quantity || 1);
    subtotal += itemSubtotal;

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      sugarLevel: item.sugarLevel || 'Normal Sugar (100%)',
      iceLevel: item.iceLevel || 'Normal Ice',
      toppings: item.toppings || [],
      subtotal: itemSubtotal
    };
  });

  // Cek diskon voucher jika ada
  let discountAmount = 0;
  let appliedVoucher = null;
  if (voucherCode && availableVouchers[voucherCode.toUpperCase()]) {
    const voucher = availableVouchers[voucherCode.toUpperCase()];
    if (!voucher.minOrder || subtotal >= voucher.minOrder) {
      appliedVoucher = voucher.code;
      discountAmount = voucher.type === 'percent'
        ? Math.round((subtotal * voucher.value) / 100)
        : Math.min(voucher.value, subtotal);
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    customerName,
    tableOrTakeaway: tableOrTakeaway || 'Takeaway',
    items: processedItems,
    subtotal,
    voucher: appliedVoucher,
    discountAmount,
    totalAmount,
    status: 'Diproses',
    createdAt: new Date().toISOString()
  };

  const currentOrders = readJsonFile(ordersFilePath);
  currentOrders.push(newOrder);
  writeJsonFile(ordersFilePath, currentOrders);

  console.log(`[ORDER BARU] #${newOrder.id} - ${customerName} | Total: Rp ${totalAmount.toLocaleString('id-ID')}`);

  res.status(201).json({
    message: 'Pesanan berhasil dibuat!',
    order: newOrder
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🧋 Toko Milk Tea Backend API aktif!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🥤 Endpoints:`);
  console.log(`   - GET   /api/products`);
  console.log(`   - GET   /api/categories`);
  console.log(`   - GET   /api/options`);
  console.log(`   - POST  /api/voucher`);
  console.log(`   - GET   /api/orders`);
  console.log(`   - POST  /api/orders`);
  console.log(`   - PATCH /api/orders/:id/status`);
  console.log(`===============================================`);
});
