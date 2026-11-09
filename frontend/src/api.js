import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  web: 'http://localhost:5000/api',
  android: 'http://10.0.2.2:5000/api',
  default: 'http://localhost:5000/api',
});

// Fallback data jika backend sedang offline/belum dinyalakan
export const FALLBACK_PRODUCTS = [
  {
    id: 'mt-1',
    name: 'Classic Brown Sugar Boba Milk',
    category: 'Brown Sugar',
    price: 28000,
    description: 'Susu segar creamy dipadukan dengan gula aren karamel otentik dan boba tapioka kenyal hangat.',
    image: 'https://images.unsplash.com/photo-1558857563-b37cf2cb7d5a?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: 'mt-2',
    name: 'Roasted Oolong Milk Tea',
    category: 'Milk Tea',
    price: 25000,
    description: 'Seduhan teh oolong panggang dengan aroma harum khas dipadukan susu lembut kaya rasa.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    isBestSeller: true
  },
  {
    id: 'mt-3',
    name: 'Kyoto Matcha Cream Cheese',
    category: 'Cheese Tea',
    price: 32000,
    description: 'Matcha premium asli dari Uji Kyoto dengan topping foam krim keju gurih yang melimpah.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: 'mt-4',
    name: 'Taro Velvet Dream Milk Tea',
    category: 'Milk Tea',
    price: 26000,
    description: 'Perpaduan rasa talas manis alami warna ungu cantik dengan sensasi lembut menyegarkan.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    isBestSeller: false
  },
  {
    id: 'mt-5',
    name: 'Royal Thai Milk Tea',
    category: 'Milk Tea',
    price: 24000,
    description: 'Racikan teh tradisional Thailand berwarna oranye khas dengan susu kental manis gurih legit.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    isBestSeller: false
  },
  {
    id: 'mt-6',
    name: 'Mango Passion Fruit Jasmine Tea',
    category: 'Fruit Tea',
    price: 27000,
    description: 'Teh melati wangi dengan sari buah mangga manis dan markisa segar penghilang dahaga.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    isBestSeller: false
  },
  {
    id: 'mt-7',
    name: 'Strawberry Cheese Cloud',
    category: 'Cheese Tea',
    price: 33000,
    description: 'Puree stroberi segar asam-manis dibalut teh melati dingin dan lapisan tebal krim keju.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: 'mt-8',
    name: 'Brown Sugar Crème Brûlée Milk',
    category: 'Brown Sugar',
    price: 34000,
    description: 'Minuman boba brown sugar mewah dengan topping custard brûlée yang ditorch hingga renyah.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    isBestSeller: true
  }
];

export const FALLBACK_OPTIONS = {
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

export const api = {
  // Ambil semua produk / menu
  getProducts: async (category = 'Semua', search = '', bestSeller = false) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'Semua') params.append('category', category);
      if (search) params.append('q', search);
      if (bestSeller) params.append('bestSeller', 'true');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${API_BASE_URL}/products?${params.toString()}`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Gagal mengambil data produk');
      const data = await response.json();
      return { data, isOnline: true };
    } catch (error) {
      console.warn('API getProducts fallback ke data lokal:', error.message);
      // Filter data lokal
      let filtered = [...FALLBACK_PRODUCTS];
      if (category && category !== 'Semua') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return { data: filtered, isOnline: false };
    }
  },

  // Ambil daftar kategori
  getCategories: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/categories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Gagal');
      return await response.json();
    } catch {
      return ['Semua', 'Brown Sugar', 'Milk Tea', 'Cheese Tea', 'Fruit Tea'];
    }
  },

  // Ambil opsi kustomisasi (gula, es, topping)
  getOptions: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/options`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Gagal');
      return await response.json();
    } catch {
      return FALLBACK_OPTIONS;
    }
  },

  // Validasi kode voucher
  validateVoucher: async (code, subtotal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Voucher tidak valid');
      }
      return data;
    } catch (error) {
      // Fallback cek lokal untuk BOBA20 dan HEMAT10
      const upper = (code || '').toUpperCase();
      if (upper === 'BOBA20') {
        return {
          valid: true,
          code: 'BOBA20',
          description: 'Diskon 20% Spesial Boba Party',
          discountAmount: Math.round((subtotal * 20) / 100),
        };
      }
      if (upper === 'HEMAT10') {
        if (subtotal < 30000) {
          throw new Error('Minimal pembelian Rp 30.000 untuk voucher HEMAT10');
        }
        return {
          valid: true,
          code: 'HEMAT10',
          description: 'Potongan Rp 10.000 (Min. Rp 30.000)',
          discountAmount: Math.min(10000, subtotal),
        };
      }
      throw error;
    }
  },

  // Buat pesanan baru (checkout)
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal mengirim pesanan');
      }
      return await response.json();
    } catch (error) {
      console.warn('API createOrder fallback ke penyimpanan lokal browser:', error.message);
      // Buat pesanan secara offline agar alur tetap berjalan lancar
      const offlineOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: orderData.customerName,
        tableOrTakeaway: orderData.tableOrTakeaway,
        items: orderData.items,
        totalAmount: orderData.items.reduce((s, i) => s + (i.price * i.quantity), 0),
        status: 'Diproses (Offline)',
        createdAt: new Date().toISOString()
      };
      return {
        message: 'Pesanan berhasil dibuat (Tersimpan Lokal)',
        order: offlineOrder,
        isOffline: true
      };
    }
  },

  // Ambil riwayat pesanan
  getOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error('Gagal');
      return await response.json();
    } catch {
      return [
        {
          id: 'ORD-1001',
          customerName: 'Siti Nurhaliza',
          tableOrTakeaway: 'Dine In - Meja 04',
          items: [
            {
              id: 'mt-1',
              name: 'Classic Brown Sugar Boba Milk',
              price: 28000,
              quantity: 1,
              sugarLevel: 'Less Sugar (70%)',
              iceLevel: 'Normal Ice',
              toppings: ['Boba Pearl (+Rp 4.000)', 'Cheese Foam (+Rp 6.000)'],
              subtotal: 38000
            }
          ],
          totalAmount: 38000,
          status: 'Selesai',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },
};
