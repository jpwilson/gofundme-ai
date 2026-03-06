import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../lib/colors";

export default function GivingFundTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Hero section */}
      <View style={styles.hero}>
        <View style={styles.heroIconContainer}>
          <Ionicons name="gift" size={48} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>Your Giving Fund</Text>
        <Text style={styles.heroSubtitle}>
          Set aside money for giving and donate when you are ready.
          Your fund makes giving easy and flexible.
        </Text>
      </View>

      {/* Balance card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$0.00</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.addFundsButton}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.addFundsText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.donateButton}>
            <Ionicons name="heart-outline" size={20} color={Colors.green} />
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Monthly giving */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Giving</Text>
        <TouchableOpacity style={styles.setupCard} activeOpacity={0.7}>
          <View style={styles.setupIcon}>
            <Ionicons name="calendar-outline" size={28} color={Colors.green} />
          </View>
          <View style={styles.setupContent}>
            <Text style={styles.setupTitle}>Set up monthly giving</Text>
            <Text style={styles.setupSubtitle}>
              Choose causes and an amount to automatically give each month
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Recent activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={48}
            color={Colors.border}
          />
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptySubtitle}>
            When you add funds or make donations from your giving fund,
            they will appear here.
          </Text>
        </View>
      </View>

      {/* Tax info */}
      <View style={styles.taxBanner}>
        <Ionicons name="document-text-outline" size={24} color={Colors.darkGreen} />
        <View style={styles.taxContent}>
          <Text style={styles.taxTitle}>Tax-deductible giving</Text>
          <Text style={styles.taxSubtitle}>
            Contributions to your Giving Fund are tax-deductible.
            Access your tax receipts anytime.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: Colors.lightGreen,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.dark,
    marginTop: 4,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: "row",
    gap: 12,
  },
  addFundsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 24,
    paddingVertical: 12,
    gap: 6,
  },
  addFundsText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  donateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.green,
    borderRadius: 24,
    paddingVertical: 12,
    gap: 6,
  },
  donateButtonText: {
    color: Colors.green,
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 12,
  },
  setupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
  },
  setupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  setupContent: {
    flex: 1,
  },
  setupTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark,
  },
  setupSubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  taxBanner: {
    marginHorizontal: 16,
    marginTop: 28,
    flexDirection: "row",
    backgroundColor: Colors.lightGreen,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  taxContent: {
    flex: 1,
  },
  taxTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.darkGreen,
  },
  taxSubtitle: {
    fontSize: 13,
    color: Colors.darkGreen,
    marginTop: 2,
    lineHeight: 18,
    opacity: 0.8,
  },
});
