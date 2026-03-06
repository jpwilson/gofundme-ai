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
import { getCommunityBySlug } from "../../lib/api";
import type { Community } from "../../lib/types";
import { formatCurrency, formatNumber } from "../../lib/format";

export default function CommunityDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setError(null);
        const data = await getCommunityBySlug(slug);
        setCommunity(data);
        setIsFollowing(data.isFollowing ?? false);
        navigation.setOptions({ title: data.name });
      } catch (err) {
        setError("Unable to load community details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  if (error || !community) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.secondary} />
        <Text style={styles.errorText}>{error || "Community not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Banner */}
      {community.bannerImageUrl ? (
        <Image
          source={{ uri: community.bannerImageUrl }}
          style={styles.banner}
        />
      ) : (
        <View style={styles.bannerPlaceholder}>
          <Ionicons name="people" size={48} color={Colors.white} />
        </View>
      )}

      {/* Community info */}
      <View style={styles.infoSection}>
        {community.iconUrl ? (
          <Image source={{ uri: community.iconUrl }} style={styles.icon} />
        ) : (
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>
              {community.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{community.name}</Text>
        <Text style={styles.description}>{community.description}</Text>

        {/* Follow button */}
        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followButtonActive,
          ]}
          onPress={() => setIsFollowing(!isFollowing)}
        >
          <Ionicons
            name={isFollowing ? "checkmark" : "add"}
            size={18}
            color={isFollowing ? Colors.white : Colors.green}
          />
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followButtonTextActive,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatNumber(community.followerCount)}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCurrency(community.totalRaised)}
          </Text>
          <Text style={styles.statLabel}>Raised</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatNumber(community.totalFundraisers)}
          </Text>
          <Text style={styles.statLabel}>Fundraisers</Text>
        </View>
      </View>

      {/* Start a GoFundMe CTA */}
      <TouchableOpacity style={styles.startCta} activeOpacity={0.8}>
        <Ionicons name="add-circle" size={24} color={Colors.white} />
        <Text style={styles.startCtaText}>Start a GoFundMe</Text>
      </TouchableOpacity>

      {/* Placeholder for fundraisers list */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fundraisers</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Community fundraisers will appear here.
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
  banner: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.background,
  },
  bannerPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -30,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  iconText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark,
    marginTop: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.green,
    gap: 4,
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
  startCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.green,
    borderRadius: 24,
    paddingVertical: 14,
    gap: 8,
  },
  startCtaText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
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
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondary,
  },
});
