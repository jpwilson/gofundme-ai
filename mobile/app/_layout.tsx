import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../lib/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.dark,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: Colors.white },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="fundraiser/[slug]"
          options={{
            title: "Fundraiser",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="community/[slug]"
          options={{
            title: "Community",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="user/[username]"
          options={{
            title: "Profile",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </>
  );
}
