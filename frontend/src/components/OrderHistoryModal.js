import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, shadows } from '../theme';

export default function OrderHistoryModal({
  visible,
  orders,
  onClose,
  onRefresh,
  isLoading,
}) {
  const formatRupiah = (number) => `Rp ${number.toLocaleString('id-ID')}`;

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
              <Text style={styles.headerSubtitle}>
                Daftar pesanan toko milk tea
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                <Text style={styles.refreshBtnText}>🔄 Segarkan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Memuat riwayat pesanan...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat Pesanan</Text>
              <Text style={styles.emptyDesc}>
                Pesanan yang Anda buat akan muncul di sini secara otomatis.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {orders.map((ord) => (
                <View key={ord.id} style={styles.orderCard}>
                  {/* Atas Order Card */}
                  <View style={styles.orderTop}>
                    <View>
                      <Text style={styles.orderId}>#{ord.id}</Text>
                      <Text style={styles.customerName}>{ord.customerName}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{ord.status || 'Diproses'}</Text>
                    </View>
                  </View>

                  <Text style={styles.orderType}>
                    📍 {ord.tableOrTakeaway} • {formatDate(ord.createdAt)}
                  </Text>

                  {/* Rincian Item */}
                  <View style={styles.itemsWrapper}>
                    {ord.items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemTitle}>
                            {item.quantity}x {item.name}
                          </Text>
                          <Text style={styles.itemSubtitle}>
                            {item.sugarLevel} | {item.iceLevel}
                          </Text>
                          {item.toppings && item.toppings.length > 0 && (
                            <Text style={styles.itemTopping}>
                              + {item.toppings.join(', ')}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.itemSubtotal}>
                          {formatRupiah(item.subtotal || item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Bawah Total */}
                  <View style={styles.orderBottom}>
                    <Text style={styles.totalLabel}>Total Pembayaran</Text>
                    <Text style={styles.totalValue}>
                      {formatRupiah(ord.totalAmount)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
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
  },
  body: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  orderType: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  itemsWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemTopping: {
    fontSize: 11,
    color: colors.primaryLight,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
  },
});

