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
import Avatar from "../../components/Avatar";

const MENU_ITEMS = [
  { icon: "heart-outline" as const, label: "My fundraisers", badge: null },
  { icon: "gift-outline" as const, label: "Donations made", badge: null },
  { icon: "bookmark-outline" as const, label: "Saved fundraisers", badge: null },
  { icon: "people-outline" as const, label: "Following", badge: null },
  { icon: "settings-outline" as const, label: "Settings", badge: null },
  { icon: "help-circle-outline" as const, label: "Help & support", badge: null },
];

export default function ProfileTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar displayName="Guest User" size={72} />
        <View style={styles.profileInfo}>
          <Text style={styles.displayName}>Guest User</Text>
          <Text style={styles.username}>@guest</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Inspired</Text>
        </View>
      </View>

      {/* Start fundraiser CTA */}
      <TouchableOpacity style={styles.startCta} activeOpacity={0.8}>
        <View style={styles.ctaIcon}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </View>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Start a GoFundMe</Text>
          <Text style={styles.ctaSubtitle}>
            Fundraise for yourself, a loved one, or a cause
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.secondary}
        />
      </TouchableOpacity>

      {/* Menu items */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index === MENU_ITEMS.length - 1 && styles.menuItemLast,
            ]}
            activeOpacity={0.6}
          >
            <Ionicons name={item.icon} size={22} color={Colors.dark} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Version info */}
      <Text style={styles.version}>GoFundMe Clone v1.0.0</Text>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark,
  },
  username: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.green,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  startCta: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.lightGreen,
    borderRadius: 12,
    padding: 16,
  },
  ctaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.dark,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 2,
  },
  menuSection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 32,
  },
});
