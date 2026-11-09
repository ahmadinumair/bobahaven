import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows } from '../theme';

export default function ProductCard({ product, onSelect }) {
  // Format harga ke Rupiah
  const formatRupiah = (number) => {
    return `Rp ${number.toLocaleString('id-ID')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.isBestSeller && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ Best Seller</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.categoryTag}>{product.category}</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>⭐ {product.rating}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>Harga</Text>
            <Text style={styles.price}>{formatRupiah(product.price)}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onSelect(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Kustom & Pesan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#F3E8DC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

