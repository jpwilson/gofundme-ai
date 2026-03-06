import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../lib/colors";
import { getUserByUsername } from "../../lib/api";
import type { User } from "../../lib/types";
import { formatNumber } from "../../lib/format";
import Avatar from "../../components/Avatar";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setError(null);
        const data = await getUserByUsername(username);
        setUser(data);
        setIsFollowing(data.isFollowing ?? false);
        navigation.setOptions({ title: data.displayName });
      } catch (err) {
        setError("Unable to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.secondary} />
        <Text style={styles.errorText}>{error || "User not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Cover image */}
      {user.coverImageUrl ? (
        <Image source={{ uri: user.coverImageUrl }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      {/* Profile header */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
            size={80}
          />
        </View>

        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>

        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {user.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.secondary} />
            <Text style={styles.locationText}>{user.location}</Text>
          </View>
        )}

        {/* Follow button */}
        {!user.isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followButtonActive,
            ]}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followButtonTextActive,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatNumber(user.followingCount)}
          </Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatNumber(user.followerCount)}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatNumber(user.inspiredCount)}
          </Text>
          <Text style={styles.statLabel}>Inspired</Text>
        </View>
      </View>

      {/* Activity placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.emptyState}>
          <Ionicons name="newspaper-outline" size={40} color={Colors.border} />
          <Text style={styles.emptyText}>No activity to show</Text>
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 12,
  },
  cover: {
    width: "100%",
    height: 140,
    backgroundColor: Colors.background,
  },
  coverPlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: Colors.lightGreen,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatarContainer: {
    borderWidth: 4,
    borderColor: Colors.white,
    borderRadius: 44,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark,
    marginTop: 8,
  },
  username: {
    fontSize: 15,
    color: Colors.secondary,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: Colors.dark,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.secondary,
  },
  followButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  followButtonActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.green,
  },
  followButtonTextActive: {
    color: Colors.white,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 8,
  },
});
