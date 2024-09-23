import { Redirect, Slot } from "expo-router";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const TabLayout = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#A274FF",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#010319",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="scan" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Tickets",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="ticket-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="person" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
export default TabLayout;
