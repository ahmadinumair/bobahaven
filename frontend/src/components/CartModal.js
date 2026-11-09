import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, shadows } from '../theme';
import { api } from '../api';

export default function CartModal({
  visible,
  cartItems,
  onClose,
  onRemoveItem,
  onCheckout,
  isLoading,
}) {
  const [customerName, setCustomerName] = useState('');
  const [tableOrTakeaway, setTableOrTakeaway] = useState('Dine In - Meja 1');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  const formatRupiah = (number) => `Rp ${number.toLocaleString('id-ID')}`;

  const subtotalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const totalAmount = Math.max(0, subtotalAmount - discountAmount);

  // Terapkan voucher
  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) {
      setVoucherError('Masukkan kode voucher');
      return;
    }
    setVoucherError('');
    setIsCheckingVoucher(true);
    try {
      const res = await api.validateVoucher(voucherInput.trim(), subtotalAmount);
      setAppliedVoucher(res);
      setVoucherInput('');
    } catch (err) {
      setVoucherError(err.message || 'Voucher tidak valid');
      setAppliedVoucher(null);
    } finally {
      setIsCheckingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
  };

  const handleCheckoutPress = () => {
    if (!customerName.trim()) {
      Alert.alert('Perhatian', 'Mohon isi nama pemesan terlebih dahulu!');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih minuman sebelum memesan.');
      return;
    }

    onCheckout({
      customerName: customerName.trim(),
      tableOrTakeaway,
      voucherCode: appliedVoucher ? appliedVoucher.code : null,
      items: cartItems.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.basePrice || item.price,
        quantity: item.quantity,
        sugarLevel: item.sugarLevel,
        iceLevel: item.iceLevel,
        toppings: (item.toppings || []).map((t) =>
          typeof t === 'string' ? t : `${t.name} (+Rp ${t.price.toLocaleString('id-ID')})`
        ),
      })),
    });
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
          {/* Header Keranjang */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Keranjang Pesanan</Text>
              <Text style={styles.headerSubtitle}>
                ({cartItems.length} jenis minuman)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>Keranjang Anda masih kosong</Text>
              <Text style={styles.emptyDesc}>
                Yuk pilih varian milk tea favoritmu dan nikmati sensasi kenyalnya boba!
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {/* Daftar Minuman di Keranjang */}
              <View style={styles.itemsList}>
                {cartItems.map((item, index) => (
                  <View key={`${item.productId}-${index}`} style={styles.cartItem}>
                    <View style={styles.itemMain}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <TouchableOpacity
                          onPress={() => onRemoveItem(index)}
                          style={styles.deleteBtn}
                        >
                          <Text style={styles.deleteBtnText}>Hapus</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Detail Kustomisasi */}
                      <Text style={styles.itemDetail}>
                        • {item.sugarLevel} | {item.iceLevel}
                      </Text>
                      {item.toppings && item.toppings.length > 0 && (
                        <Text style={styles.itemDetail}>
                          • Topping: {item.toppings.map((t) => t.name || t).join(', ')}
                        </Text>
                      )}

                      <View style={styles.itemFooter}>
                        <Text style={styles.itemQty}>Jumlah: {item.quantity}x</Text>
                        <Text style={styles.itemPrice}>
                          {formatRupiah(item.subtotal)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Form Data Pelanggan */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Nama Pemesan *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Budi Santoso"
                  placeholderTextColor={colors.textLight}
                  value={customerName}
                  onChangeText={setCustomerName}
                />

                <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
                  Tipe Pesanan / Meja
                </Text>
                <View style={styles.typeRow}>
                  {['Dine In - Meja 1', 'Dine In - Meja 2', 'Takeaway'].map((type) => {
                    const isSelected = tableOrTakeaway === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeChip,
                          isSelected && styles.activeTypeChip,
                        ]}
                        onPress={() => setTableOrTakeaway(type)}
                      >
                        <Text
                          style={[
                            styles.typeChipText,
                            isSelected && styles.activeTypeChipText,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Input Voucher Promo */}
              <View style={styles.voucherSection}>
                <Text style={styles.sectionLabel}>Kupon Promo / Diskon</Text>
                {appliedVoucher ? (
                  <View style={styles.appliedVoucherBox}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.voucherCodeText}>
                        🎉 Voucher Aktif: {appliedVoucher.code}
                      </Text>
                      <Text style={styles.voucherDesc}>
                        {appliedVoucher.description} (-{formatRupiah(appliedVoucher.discountAmount)})
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleRemoveVoucher}
                      style={styles.removeVoucherBtn}
                    >
                      <Text style={styles.removeVoucherText}>Batal</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.voucherInputRow}>
                      <TextInput
                        style={styles.voucherInput}
                        placeholder="Masukkan kode: BOBA20 atau HEMAT10"
                        placeholderTextColor={colors.textLight}
                        autoCapitalize="characters"
                        value={voucherInput}
                        onChangeText={(txt) => {
                          setVoucherInput(txt);
                          setVoucherError('');
                        }}
                      />
                      <TouchableOpacity
                        style={[
                          styles.applyVoucherBtn,
                          isCheckingVoucher && styles.disabledBtn,
                        ]}
                        onPress={handleApplyVoucher}
                        disabled={isCheckingVoucher}
                      >
                        {isCheckingVoucher ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.applyVoucherBtnText}>Pakai</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {voucherError ? (
                      <Text style={styles.voucherErrorText}>{voucherError}</Text>
                    ) : (
                      <Text style={styles.voucherHintText}>
                        💡 Coba gunakan kode: <Text style={{ fontWeight: 'bold' }}>BOBA20</Text> (Diskon 20%)
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {/* Rincian Pembayaran */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal Minuman</Text>
                  <Text style={styles.summaryVal}>{formatRupiah(subtotalAmount)}</Text>
                </View>
                {appliedVoucher && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.success }]}>
                      Diskon Kupon ({appliedVoucher.code})
                    </Text>
                    <Text style={[styles.summaryVal, { color: colors.success }]}>
                      -{formatRupiah(discountAmount)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Biaya Layanan</Text>
                  <Text style={[styles.summaryVal, { color: colors.success }]}>
                    Gratis
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Pembayaran</Text>
                  <Text style={styles.totalVal}>{formatRupiah(totalAmount)}</Text>
                </View>
              </View>
            </ScrollView>
          )}

          {/* Footer Tombol Bayar / Checkout */}
          {cartItems.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.checkoutBtn, isLoading && styles.disabledBtn]}
                onPress={handleCheckoutPress}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.checkoutBtnText}>
                    Konfirmasi & Pesan ({formatRupiah(totalAmount)})
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    maxHeight: '90%',
    ...shadows.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  body: {
    padding: 20,
  },
  itemsList: {
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemMain: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  deleteBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  deleteBtnText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EBE5DC',
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
  formSection: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
  },
  activeTypeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTypeChipText: {
    color: '#FFF',
  },
  voucherSection: {
    backgroundColor: '#FFFDF9',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accentLight,
    marginBottom: 16,
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voucherInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.text,
  },
  applyVoucherBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  applyVoucherBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  voucherErrorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  voucherHintText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  appliedVoucherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  voucherCodeText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 13,
  },
  voucherDesc: {
    color: '#047857',
    fontSize: 11,
    marginTop: 2,
  },
  removeVoucherBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  removeVoucherText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.accent,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFF',
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
