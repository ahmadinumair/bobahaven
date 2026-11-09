import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows } from '../theme';

export default function Header({ cartCount, onOpenCart, onOpenOrders }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.logoIcon}>🧋</Text>
        <View>
          <Text style={styles.title}>Boba Haven</Text>
          <Text style={styles.subtitle}>Fresh Milk Tea & Chewy Boba</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {/* Tombol Riwayat Pesanan */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={onOpenOrders}
          activeOpacity={0.7}
        >
          <Text style={styles.historyIcon}>📋</Text>
          <Text style={styles.historyText}>Riwayat</Text>
        </TouchableOpacity>

        {/* Tombol Keranjang */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={onOpenCart}
          activeOpacity={0.8}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.card,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 34,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5EBE1',
  },
  historyIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  historyText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  cartButton: {
    position: 'relative',
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  cartIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

