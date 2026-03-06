import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../lib/colors";
import { formatCurrency, formatRelativeTime } from "../lib/format";
import type { Activity } from "../lib/types";
import Avatar from "./Avatar";

interface ActivityCardProps {
  activity: Activity;
}

function getActivityLabel(activity: Activity): string {
  switch (activity.type) {
    case "donation":
      return `donated ${activity.donationAmount ? formatCurrency(activity.donationAmount) : ""}`;
    case "fundraiser_created":
      return "started a fundraiser";
    case "fundraiser_update":
      return "posted an update";
    case "comment":
      return "commented";
    default:
      return "";
  }
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => router.push(`/user/${activity.user.username}`)}
        >
          <Avatar
            displayName={activity.user.displayName}
            avatarUrl={activity.user.avatarUrl}
            size={36}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{activity.user.displayName}</Text>
            <Text style={styles.activityMeta}>
              {getActivityLabel(activity)} - {formatRelativeTime(activity.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activity.content && (
        <Text style={styles.content} numberOfLines={3}>
          {activity.content}
        </Text>
      )}

      {/* Fundraiser link */}
      {activity.fundraiser && (
        <TouchableOpacity
          style={styles.fundraiserLink}
          onPress={() =>
            router.push(`/fundraiser/${activity.fundraiser!.slug}`)
          }
        >
          <Image
            source={{ uri: activity.fundraiser.coverImageUrl }}
            style={styles.fundraiserImage}
          />
          <View style={styles.fundraiserInfo}>
            <Text style={styles.fundraiserTitle} numberOfLines={2}>
              {activity.fundraiser.title}
            </Text>
            <Text style={styles.fundraiserRaised}>
              {formatCurrency(activity.fundraiser.raisedAmount)} raised
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Activity image */}
      {activity.imageUrl && (
        <Image
          source={{ uri: activity.imageUrl }}
          style={styles.activityImage}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons
            name={activity.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={activity.isLiked ? Colors.error : Colors.secondary}
          />
          <Text style={styles.footerCount}>{activity.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={Colors.secondary}
          />
          <Text style={styles.footerCount}>{activity.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons
            name="share-outline"
            size={18}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
  },
  activityMeta: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 1,
  },
  content: {
    fontSize: 14,
    color: Colors.dark,
    lineHeight: 20,
    marginTop: 10,
  },
  fundraiserLink: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  fundraiserImage: {
    width: 72,
    height: 72,
    backgroundColor: Colors.border,
  },
  fundraiserInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  fundraiserTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.dark,
    lineHeight: 18,
  },
  fundraiserRaised: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: Colors.background,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 20,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerCount: {
    fontSize: 13,
    color: Colors.secondary,
  },
});
