import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../lib/colors";
import { formatCurrency, formatPercentage } from "../lib/format";
import type { Fundraiser } from "../lib/types";

interface FundraiserCardProps {
  fundraiser: Fundraiser;
  onPress?: () => void;
}

export default function FundraiserCard({
  fundraiser,
  onPress,
}: FundraiserCardProps) {
  const percentage = formatPercentage(
    fundraiser.raisedAmount,
    fundraiser.goalAmount
  );

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image
        source={{ uri: fundraiser.coverImageUrl }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {fundraiser.title}
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${percentage}%` }]}
          />
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.raised}>
            {formatCurrency(fundraiser.raisedAmount)}
          </Text>
          <Text style={styles.goal}>
            raised of {formatCurrency(fundraiser.goalAmount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    lineHeight: 22,
    marginBottom: 10,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.green,
    borderRadius: 3,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
    gap: 4,
  },
  raised: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.dark,
  },
  goal: {
    fontSize: 13,
    color: Colors.secondary,
  },
});
