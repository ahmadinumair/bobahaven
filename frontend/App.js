import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors } from './src/theme';
import { api } from './src/api';
import Header from './src/components/Header';
import CategoryFilter from './src/components/CategoryFilter';
import ProductCard from './src/components/ProductCard';
import CustomizeModal from './src/components/CustomizeModal';
import CartModal from './src/components/CartModal';
import OrderHistoryModal from './src/components/OrderHistoryModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState({
    sugarLevels: [],
    iceLevels: [],
    toppings: [],
  });

  // State Keranjang & Modals
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  // Loading & Connection states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Ambil data menu produk
  const loadData = useCallback(async () => {
    try {
      const [resProducts, categoriesData, optionsData] = await Promise.all([
        api.getProducts(selectedCategory, searchQuery),
        api.getCategories(),
        api.getOptions(),
      ]);

      setProducts(resProducts.data);
      setIsBackendConnected(resProducts.isOnline);
      setCategories(categoriesData);
      setOptions(optionsData);
    } catch (err) {
      console.warn('Error saat load data:', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  // Muat data saat kategori atau pencarian berubah
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Muat riwayat pesanan
  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const ordersData = await api.getOrders();
      setOrders(ordersData);
    } catch (err) {
      console.warn('Gagal memuat pesanan:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleOpenOrders = () => {
    setIsOrdersOpen(true);
    loadOrders();
  };

  // Pilih minuman untuk kustomisasi
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsCustomizeOpen(true);
  };

  // Tambahkan item kustom ke keranjang
  const handleAddToCart = (customItem) => {
    setCart((prev) => [...prev, customItem]);
    showNotification(
      'Berhasil Ditambahkan! 🧋',
      `${customItem.name} (${customItem.quantity}x) dimasukkan ke keranjang.`
    );
  };

  // Hapus item dari keranjang
  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Checkout pesanan ke backend
  const handleCheckout = async (orderPayload) => {
    try {
      setIsSubmittingOrder(true);
      const res = await api.createOrder(orderPayload);

      // Bersihkan keranjang
      setCart([]);
      setIsCartOpen(false);

      // Tampilkan notifikasi berhasil
      const msg = res.isOffline
        ? `Nomor Pesanan: #${res.order.id}\nTotal: Rp ${res.order.totalAmount.toLocaleString('id-ID')}\n(Catatan: Tersimpan di mode lokal).`
        : `Nomor Pesanan: #${res.order.id}\nTotal: Rp ${res.order.totalAmount.toLocaleString('id-ID')}\nMinuman Anda sedang dipersiapkan!`;

      showNotification('Pesanan Berhasil! 🎉', msg);

      // Muat ulang daftar pesanan
      loadOrders();
    } catch (err) {
      showNotification(
        'Gagal Memesan',
        err.message || 'Terjadi kesalahan saat memproses pesanan.'
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Helper alert multi-platform (Web & Mobile)
  const showNotification = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Hitung jumlah total kuantitas di keranjang
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Container */}
      <View style={styles.mainContainer}>
        {/* Header Toko */}
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrders={handleOpenOrders}
        />

        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadData();
              }}
              colors={[colors.primary]}
            />
          }
        >
          {/* Status Bar Koneksi Backend */}
          <View
            style={[
              styles.connectionBadge,
              isBackendConnected ? styles.bgOnline : styles.bgOffline,
            ]}
          >
            <Text
              style={[
                styles.connectionText,
                isBackendConnected ? styles.textOnline : styles.textOffline,
              ]}
            >
              {isBackendConnected
                ? '🟢 Server Terhubung (Express API: http://localhost:5000)'
                : '🟡 Mode Data Lokal (Jalankan "npm run dev:backend" untuk Express)'}
            </Text>
            {!isBackendConnected && (
              <TouchableOpacity
                onPress={() => {
                  setIsLoading(true);
                  loadData();
                }}
                style={styles.reconnectBtn}
              >
                <Text style={styles.reconnectBtnText}>Hubungkan</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Hero Banner Promo */}
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTag}>PROMO SPESIAL HARI INI</Text>
              <Text style={styles.promoTitle}>Boba Party Diskon 20%</Text>
              <Text style={styles.promoDesc}>
                Gunakan kode voucher <Text style={{ fontWeight: 'bold', color: '#FEF08A' }}>BOBA20</Text> saat checkout!
              </Text>
            </View>
            <Text style={styles.promoEmoji}>🧋✨</Text>
          </View>

          {/* Search Bar Input */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari milk tea (contoh: Brown Sugar, Matcha, Taro)..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Kategori Minuman */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Header Bagian Menu */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>
              Menu Minuman ({products.length})
            </Text>
            <Text style={styles.menuSub}>
              {selectedCategory === 'Semua'
                ? 'Semua Varian Rasa'
                : `Kategori: ${selectedCategory}`}
            </Text>
          </View>

          {/* Daftar Produk */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Memuat menu milk tea...</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🍃</Text>
              <Text style={styles.emptyTitle}>Minuman tidak ditemukan</Text>
              <Text style={styles.emptyDesc}>
                Coba cari dengan kata kunci lain atau pilih kategori lain.
              </Text>
            </View>
          ) : (
            <View style={styles.productList}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleSelectProduct}
                />
              ))}
            </View>
          )}

          {/* Footer Info Toko */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerBrand}>🧋 Boba Haven Cafe</Text>
            <Text style={styles.footerNote}>
              Fullstack Javascript: Express.js (Backend) + React Native (Frontend Web & Mobile)
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Modal Kustomisasi Minuman */}
      <CustomizeModal
        visible={isCustomizeOpen}
        product={selectedProduct}
        options={options}
        onClose={() => setIsCustomizeOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Modal Keranjang & Checkout */}
      <CartModal
        visible={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        isLoading={isSubmittingOrder}
      />

      {/* Modal Riwayat Pesanan */}
      <OrderHistoryModal
        visible={isOrdersOpen}
        orders={orders}
        onClose={() => setIsOrdersOpen(false)}
        onRefresh={loadOrders}
        isLoading={isLoadingOrders}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFEAE2',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  scrollArea: {
    flex: 1,
  },
  connectionBadge: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bgOnline: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bgOffline: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  textOnline: {
    color: '#065F46',
  },
  textOffline: {
    color: '#92400E',
  },
  reconnectBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  reconnectBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    paddingRight: 10,
  },
  promoTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 12,
    color: '#EAE1D9',
    lineHeight: 16,
  },
  promoEmoji: {
    fontSize: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  menuSub: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  productList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingBox: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyBox: {
    padding: 50,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  footerInfo: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFF',
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});
