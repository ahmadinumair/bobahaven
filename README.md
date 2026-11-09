# 🧋 Boba Haven - Toko Minuman Milk Tea (Fullstack JavaScript)

Aplikasi web & mobile sederhana bertema **Toko Minuman Milk Tea** yang dibangun menggunakan arsitektur **Fullstack JavaScript**:
- **Backend**: [Express.js](https://expressjs.com/) (RESTful API, validasi pesanan, penyimpanan data berbasis JSON).
- **Frontend**: [React Native](https://reactnative.dev/) dengan dukungan [Expo Web](https://docs.expo.dev/workflow/web/) & [React Native for Web](https://necolas.github.io/react-native-web/) (bisa langsung dibuka di Browser Web laptop atau di Smartphone Android/iOS).

---

## 📸 Fitur Utama

1. **Katalog Menu Minuman**:
   - Menampilkan varian minuman milk tea populer (Brown Sugar Boba, Roasted Oolong, Kyoto Matcha Cream Cheese, Taro Velvet, Thai Milk Tea, dll).
   - Label **⭐ Best Seller**, foto produk, deskripsi rasa, dan rating pelanggan.
2. **Filter & Pencarian Instan**:
   - Filter berdasarkan kategori: *Semua, Brown Sugar, Milk Tea, Cheese Tea, Fruit Tea*.
   - Kotak pencarian (*Search Bar*) berdasarkan nama minuman atau rasa.
3. **Kustomisasi Minuman (Customize Modal)**:
   - Pilih **Level Gula** (*Normal 100%, Less Sugar 70%, Half Sugar 50%, No Sugar 0%*).
   - Pilih **Level Es** (*Normal Ice, Less Ice, No Ice*).
   - Pilih **Topping Tambahan** (*Boba Pearl, Egg Pudding, Grass Jelly, Cheese Foam, Aloe Vera*).
   - Atur jumlah pesanan (*Quantity +/-*).
   - Perhitungan harga total secara *real-time*.
4. **Keranjang Belanja (Cart Modal)**:
   - Rincian item yang dipilih beserta opsi kustomisasi masing-masing.
   - Form nama pemesan dan pilihan meja (*Dine In* atau *Takeaway*).
   - Ringkasan subtotal, diskon/layanan, dan total pembayaran.
5. **Proses Checkout & Riwayat Pesanan (Order History)**:
   - Data pesanan dikirim ke backend Express via `POST /api/orders`.
   - Pop-up konfirmasi berhasil dengan nomor pesanan unik (contoh: `#ORD-291034`).
   - Riwayat pesanan tersimpan di server dan dapat dilihat kapan saja lewat tombol **📋 Riwayat**.

---

## 📁 Struktur Folder Proyek

```text
reactnative/
├── backend/                       # Backend REST API (Express.js)
│   ├── data/
│   │   ├── products.json          # Database JSON menu minuman & topping
│   │   └── orders.json            # Database JSON pesanan pelanggan
│   ├── package.json
│   └── server.js                  # Server utama Express & router API
│
├── frontend/                      # Frontend (React Native + Expo Web)
│   ├── src/
│   │   ├── api.js                 # Service pemanggil REST API backend
│   │   ├── theme.js               # Palet warna, bayangan, & gaya tema toko
│   │   └── components/
│   │       ├── Header.js          # Header toko + tombol riwayat + badge keranjang
│   │       ├── CategoryFilter.js  # Filter kategori minuman
│   │       ├── ProductCard.js     # Kartu produk minuman
│   │       ├── CustomizeModal.js  # Modal kustomisasi gula, es, & topping
│   │       ├── CartModal.js       # Modal keranjang & checkout
│   │       └── OrderHistoryModal.js # Modal daftar riwayat pesanan
│   ├── App.js                     # Komponen utama aplikasi
│   ├── app.json                   # Konfigurasi Expo & Web
│   └── package.json
│
├── package.json                   # Root package script
└── README.md
```

---

## 🚀 Panduan Menjalankan Aplikasi

Aplikasi membutuhkan **Node.js** (v18 ke atas disarankan). Buka terminal di folder proyek `c:\Users\Thinkpad T14 G2i\Desktop\reactnative`.

### 1. Jalankan Backend (Express.js)

Buka terminal pertama:
```powershell
cd backend
npm run dev
# atau: node server.js
```
Backend API akan berjalan di: **`http://localhost:5000`**

### 2. Jalankan Frontend (React Native Web)

Buka terminal kedua (terminal terpisah):
```powershell
cd frontend
npm run web
```
Expo akan otomatis membuka browser di: **`http://localhost:8081`**

> **💡 Catatan jika ingin membuka di Smartphone (Android / iOS):**
> 1. Pastikan HP dan laptop terhubung ke jaringan Wi-Fi yang sama.
> 2. Di file `frontend/src/api.js`, ubah `localhost` dengan IP lokal laptop Anda (contoh: `http://192.168.1.15:5000/api`).
> 3. Jalankan `npx expo start`, lalu scan QR code menggunakan aplikasi **Expo Go** di HP Anda.

---

## 📡 Daftar Endpoints REST API (Express)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Cek status server aktif |
| `GET` | `/api/products` | Mengambil seluruh daftar menu (`?category=...&q=...`) |
| `GET` | `/api/products/:id` | Mengambil detail satu minuman berdasarkan ID |
| `GET` | `/api/categories` | Mengambil daftar kategori minuman |
| `GET` | `/api/options` | Mengambil opsi level gula, es, dan topping |
| `GET` | `/api/orders` | Mengambil daftar riwayat pesanan pelanggan |
| `POST` | `/api/orders` | Membuat pesanan baru (checkout) |

