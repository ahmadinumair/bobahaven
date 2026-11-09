import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { colors, shadows } from '../theme';

export default function CustomizeModal({
  visible,
  product,
  options,
  onClose,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSugar, setSelectedSugar] = useState('Normal Sugar (100%)');
  const [selectedIce, setSelectedIce] = useState('Normal Ice');
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Reset opsi ketika produk berganti
  useEffect(() => {
    if (visible && product) {
      setQuantity(1);
      setSelectedSugar('Normal Sugar (100%)');
      setSelectedIce('Normal Ice');
      setSelectedToppings([]);
    }
  }, [visible, product]);

  if (!product) return null;

  // Toggle pilihan topping
  const toggleTopping = (topping) => {
    const exists = selectedToppings.find((t) => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Hitung total harga
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = product.price + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const formatRupiah = (number) => `Rp ${number.toLocaleString('id-ID')}`;

  const handleConfirm = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      price: product.price,
      quantity,
      sugarLevel: selectedSugar,
      iceLevel: selectedIce,
      toppings: selectedToppings,
      subtotal: totalPrice,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Kustomisasi Minuman</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Ringkasan Produk */}
            <View style={styles.productBanner}>
              <Image source={{ uri: product.image }} style={styles.bannerImage} />
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>{product.name}</Text>
                <Text style={styles.bannerCategory}>{product.category}</Text>
                <Text style={styles.bannerPrice}>{formatRupiah(product.price)}</Text>
              </View>
            </View>

            {/* Pilihan Level Gula */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Gula (Sugar Level)</Text>
              <View style={styles.optionsGrid}>
                {options.sugarLevels.map((s) => {
                  const isSelected = selectedSugar === s.label;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.optionChip, isSelected && styles.activeChip]}
                      onPress={() => setSelectedSugar(s.label)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.activeChipText,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Pilihan Level Es */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Es (Ice Level)</Text>
              <View style={styles.optionsGrid}>
                {options.iceLevels.map((i) => {
                  const isSelected = selectedIce === i.label;
                  return (
                    <TouchableOpacity
                      key={i.id}
                      style={[styles.optionChip, isSelected && styles.activeChip]}
                      onPress={() => setSelectedIce(i.label)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.activeChipText,
                        ]}
                      >
                        {i.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Pilihan Topping Tambahan */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Topping Tambahan (Opsional)</Text>
              {options.toppings.map((top) => {
                const isChecked = selectedToppings.some((t) => t.id === top.id);
                return (
                  <TouchableOpacity
                    key={top.id}
                    style={[styles.toppingRow, isChecked && styles.toppingRowActive]}
                    onPress={() => toggleTopping(top)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.toppingLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          isChecked && styles.checkboxChecked,
                        ]}
                      >
                        {isChecked && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={styles.toppingName}>{top.name}</Text>
                    </View>
                    <Text style={styles.toppingPrice}>
                      +{formatRupiah(top.price)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Atur Jumlah (Quantity) */}
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Jumlah Pesanan</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[styles.counterBtn, quantity <= 1 && styles.disabledBtn]}
                  disabled={quantity <= 1}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer Modal: Total & Tombol Tambah */}
          <View style={styles.modalFooter}>
            <View>
              <Text style={styles.footerPriceLabel}>Total Harga</Text>
              <Text style={styles.footerPrice}>{formatRupiah(totalPrice)}</Text>
            </View>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>+ Masukkan Keranjang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bannerCategory: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  bannerPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFF',
  },
  toppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  toppingRowActive: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FAF5EE',
  },
  toppingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.textLight,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toppingName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  toppingPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  counterBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFF',
  },
  footerPriceLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  footerPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.accent,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

