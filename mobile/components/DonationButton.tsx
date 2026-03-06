import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../lib/colors";

interface DonationButtonProps {
  onPress?: () => void;
  label?: string;
  fullWidth?: boolean;
}

export default function DonationButton({
  onPress,
  label = "Donate",
  fullWidth = true,
}: DonationButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, fullWidth && styles.fullWidth]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="heart" size={18} color={Colors.white} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    gap: 8,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },
});
