import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";
import { Redirect, router } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getUser();
      if (sessionError) {
        console.error(sessionError);
        throw new Error("An error occurred while fetching data");
      }
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          mobile,
          avatar_url
        `
        )
        .eq("id", sessionData.user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        console.log("Fetched profile:", data);
        setUser(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    console.log("User logged out");

    router.replace("/login");
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex justify-center items-center h-full p-4">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex justify-center items-center h-full p-4">
        {user && (
          <>
            <Image
              source={{ uri: user.avatar_url }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <Text className="text-white text-2xl mb-4">{user.full_name}</Text>
          </>
        )}
        <TouchableOpacity
          className="p-2 m-2 rounded bg-red-500"
          onPress={handleLogout}
        >
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
