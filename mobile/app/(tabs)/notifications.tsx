import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../lib/colors";

export default function NotificationsTab() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.emptyState}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="notifications-outline"
            size={56}
            color={Colors.border}
          />
        </View>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>
          When someone donates to your fundraiser, follows you, or interacts
          with your activity, you will see notifications here.
        </Text>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
