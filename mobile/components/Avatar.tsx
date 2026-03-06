import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../lib/colors";

interface AvatarProps {
  displayName: string;
  avatarUrl?: string | null;
  size?: number;
}

const AVATAR_COLORS = [
  Colors.green,
  Colors.darkGreen,
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
  "#8b5cf6",
  "#ef4444",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Avatar({
  displayName,
  avatarUrl,
  size = 40,
}: AvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  const bgColor = getColorFromName(displayName);
  const initials = getInitials(displayName);
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.background,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
    color: Colors.white,
  },
});
