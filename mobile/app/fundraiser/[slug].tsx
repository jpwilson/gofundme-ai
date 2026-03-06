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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../lib/colors";
import { getFundraiserBySlug } from "../../lib/api";
import type { Fundraiser } from "../../lib/types";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
} from "../../lib/format";
import ProgressCircle from "../../components/ProgressCircle";
import DonationButton from "../../components/DonationButton";
import Avatar from "../../components/Avatar";

export default function FundraiserDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setError(null);
        const data = await getFundraiserBySlug(slug);
        setFundraiser(data);
        navigation.setOptions({ title: data.title });
      } catch (err) {
        setError("Unable to load fundraiser details.");
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

  if (error || !fundraiser) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.secondary} />
        <Text style={styles.errorText}>{error || "Fundraiser not found"}</Text>
      </View>
    );
  }

  const percentage = formatPercentage(
    fundraiser.raisedAmount,
    fundraiser.goalAmount
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Cover image */}
        <Image
          source={{ uri: fundraiser.coverImageUrl }}
          style={styles.coverImage}
        />

        {/* Title and organizer */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>{fundraiser.title}</Text>

          <TouchableOpacity
            style={styles.organizerRow}
            onPress={() =>
              router.push(`/user/${fundraiser.organizer.username}`)
            }
          >
            <Avatar
              displayName={fundraiser.organizer.displayName}
              avatarUrl={fundraiser.organizer.avatarUrl}
              size={36}
            />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>
                {fundraiser.organizer.displayName}
              </Text>
              <Text style={styles.organizerLabel}>Organizer</Text>
            </View>
          </TouchableOpacity>

          {/* Progress section */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <ProgressCircle percentage={percentage} size={64} strokeWidth={5} />
              <View style={styles.progressInfo}>
                <Text style={styles.raisedAmount}>
                  {formatCurrency(fundraiser.raisedAmount)}
                </Text>
                <Text style={styles.goalText}>
                  raised of {formatCurrency(fundraiser.goalAmount)} goal
                </Text>
                <Text style={styles.donationCount}>
                  {formatNumber(fundraiser.donationCount)} donations
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${percentage}%` }]}
              />
            </View>
          </View>

          {/* Community link */}
          {fundraiser.community && (
            <TouchableOpacity
              style={styles.communityLink}
              onPress={() =>
                router.push(`/community/${fundraiser.community!.slug}`)
              }
            >
              <Ionicons name="people-circle" size={20} color={Colors.green} />
              <Text style={styles.communityName}>
                {fundraiser.community.name}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          )}

          {/* Tax deductible badge */}
          {fundraiser.isTaxDeductible && (
            <View style={styles.taxBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={Colors.darkGreen}
              />
              <Text style={styles.taxBadgeText}>Tax-deductible</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Story</Text>
            <Text style={styles.description}>{fundraiser.description}</Text>
          </View>

          {/* Created date */}
          <Text style={styles.createdDate}>
            Created {formatRelativeTime(fundraiser.createdAt)} ago
          </Text>
        </View>
      </ScrollView>

      {/* Sticky donate button */}
      <View style={styles.bottomBar}>
        <DonationButton
          onPress={() => {
            // Donation flow would go here
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingBottom: 100,
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
  coverImage: {
    width: "100%",
    height: 240,
    backgroundColor: Colors.background,
  },
  mainContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark,
    lineHeight: 28,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  organizerInfo: {
    marginLeft: 10,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark,
  },
  organizerLabel: {
    fontSize: 13,
    color: Colors.secondary,
  },
  progressSection: {
    marginTop: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progressInfo: {
    flex: 1,
  },
  raisedAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark,
  },
  goalText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  donationCount: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginTop: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.green,
    borderRadius: 3,
  },
  communityLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    gap: 6,
  },
  communityName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
  },
  taxBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 4,
  },
  taxBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.darkGreen,
  },
  descriptionSection: {
    marginTop: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.dark,
    lineHeight: 24,
  },
  createdDate: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
