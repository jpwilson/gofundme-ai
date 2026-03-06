import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../lib/colors";
import { getFundraisers } from "../../lib/api";
import type { Fundraiser } from "../../lib/types";
import { formatCurrency, formatPercentage } from "../../lib/format";
import FundraiserCard from "../../components/FundraiserCard";

const CATEGORIES = [
  { key: "medical", label: "Medical", icon: "medkit-outline" as const },
  { key: "emergency", label: "Emergency", icon: "warning-outline" as const },
  { key: "education", label: "Education", icon: "school-outline" as const },
  { key: "animals", label: "Animals", icon: "paw-outline" as const },
  { key: "environment", label: "Environment", icon: "leaf-outline" as const },
  { key: "community", label: "Community", icon: "people-outline" as const },
];

export default function FundraisingTab() {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFundraisers = async () => {
    try {
      setError(null);
      const data = await getFundraisers({ limit: 10 });
      setFundraisers(data);
    } catch (err) {
      setError("Unable to load fundraisers. Make sure the API server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFundraisers();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.green}
        />
      }
    >
      {/* Give Monthly CTA */}
      <TouchableOpacity style={styles.giveMonthlyCta} activeOpacity={0.8}>
        <View style={styles.giveMonthlyContent}>
          <View style={styles.giveMonthlyIcon}>
            <Ionicons name="heart" size={24} color={Colors.white} />
          </View>
          <View style={styles.giveMonthlyText}>
            <Text style={styles.giveMonthlyTitle}>Give monthly</Text>
            <Text style={styles.giveMonthlySubtitle}>
              Set up recurring donations to causes you care about
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
        </View>
      </TouchableOpacity>

      {/* In the news section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In the news</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.green}
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={40}
              color={Colors.secondary}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchFundraisers}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {fundraisers.slice(0, 5).map((fundraiser) => (
              <TouchableOpacity
                key={fundraiser.id}
                style={styles.newsCard}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(`/fundraiser/${fundraiser.slug}`)
                }
              >
                <Image
                  source={{ uri: fundraiser.coverImageUrl }}
                  style={styles.newsCardImage}
                  defaultSource={undefined}
                />
                <View style={styles.newsCardContent}>
                  <Text style={styles.newsCardTitle} numberOfLines={2}>
                    {fundraiser.title}
                  </Text>
                  <Text style={styles.newsCardRaised}>
                    {formatCurrency(fundraiser.raisedAmount)} raised
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Discover places to give */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discover places to give</Text>
        <Text style={styles.sectionSubtitle}>
          Browse nonprofits and fundraisers by category
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.key} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <Ionicons name={cat.icon} size={24} color={Colors.green} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trending fundraisers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending fundraisers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {!loading &&
          !error &&
          fundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.id}
              fundraiser={fundraiser}
              onPress={() =>
                router.push(`/fundraiser/${fundraiser.slug}`)
              }
            />
          ))}
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
  giveMonthlyCta: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.lightGreen,
    borderRadius: 12,
    overflow: "hidden",
  },
  giveMonthlyContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  giveMonthlyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  giveMonthlyText: {
    flex: 1,
  },
  giveMonthlyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
  },
  giveMonthlySubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 2,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.green,
  },
  horizontalList: {
    paddingRight: 16,
    gap: 12,
  },
  newsCard: {
    width: 220,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  newsCardImage: {
    width: "100%",
    height: 130,
    backgroundColor: Colors.background,
  },
  newsCardContent: {
    padding: 12,
  },
  newsCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
    lineHeight: 20,
  },
  newsCardRaised: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 6,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.dark,
  },
  loader: {
    paddingVertical: 40,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 12,
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.green,
    borderRadius: 20,
  },
  retryText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
