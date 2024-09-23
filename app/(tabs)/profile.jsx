import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";
import { router } from "expo-router";
import * as Application from 'expo-application';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
        if (sessionError) {
          console.error(sessionError);
          throw new Error("An error occurred while fetching session data");
        }
  
        const [profileResponse, eventResponse] = await Promise.all([
          supabase
            .from("profiles")
            .select(`
              id,
              full_name,
              mobile,
              avatar_url
            `)
            .eq("id", sessionData.user.id)
            .single(),
          supabase
            .from("events")
            .select("id,name")
            .eq("default", true)
            .eq("created_by", sessionData.user.id)
            .single(),
        ]);
  
        const { data: profileData, error: profileError } = profileResponse;
        const { data: defaultEvent, error: defaultEventError } = eventResponse;
  
        if (profileError) {
          console.error(profileError);
        } else {
          setUser((prevUser) => ({
            ...prevUser,
            ...profileData,
            email: sessionData.user.email,
          }));
        }
  
        if (defaultEventError) {
          console.error(defaultEventError);
        } else {
          setUser((prevUser) => ({
            ...prevUser,
            event: defaultEvent,
          }));
        }
      } catch (error) {
        console.error("An error occurred while fetching profile data:", error);
      }
    };
  
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out this awesome event management app: https://nibmtix.vercel.app",
      });
    } catch (error) {
      console.error("Error sharing the app:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex justify-center items-center p-6">
          {user && (
            <>
              {/* Profile Picture */}
              <Image
                source={{
                  uri: user.avatar_url || "https://placehold.co/100x100",
                }}
                className="w-28 h-28 rounded-full mb-4 border-2 border-gray-600"
              />
              {/* Full Name */}
              <Text className="text-white text-2xl font-bold mb-1">
                {user.full_name}
              </Text>
              {/* Email */}
              <Text className="text-gray-400 text-base mb-2">
                {user.email || "Email not provided"}
              </Text>
              {/* Mobile Number */}
              <Text className="text-gray-400 text-base mb-4">
                {user.mobile || "Mobile not provided"}
              </Text>

              {/* Membership Section */}
              <View className="w-full bg-gray-900 rounded-lg p-4 mt-4 flex-row items-center justify-between">
                <Text className="text-white text-lg">Events</Text>
                <Text className="text-green-400 text-sm font-bold">
                  {user.event ? user.event.name : "No default event"}
                </Text>
              </View>

              {/* Help and Support Section */}
              <TouchableOpacity
                className="w-full bg-gray-900 rounded-lg p-4 mt-4 flex-row items-center justify-between"
                onPress={() => router.push("/support")}
              >
                <Text className="text-white text-lg">Help and Support</Text>
              </TouchableOpacity>

              {/* Payment Section */}
              <TouchableOpacity
                className="w-full bg-gray-900 rounded-lg p-4 mt-4 flex-row items-center justify-between"
                onPress={() => router.push("/payments")}
              >
                <Text className="text-white text-lg">Payment</Text>
              </TouchableOpacity>

              {/* About Us Section */}
              <TouchableOpacity
                className="w-full bg-gray-900 rounded-lg p-4 mt-4 flex-row items-center justify-between"
                onPress={() => router.push("/about-us")}
              >
                <Text className="text-white text-lg">About Us</Text>
              </TouchableOpacity>

              {/* Share App Button */}
              <TouchableOpacity
                className="w-full bg-green-500 p-3 rounded-lg mt-6"
                onPress={handleShareApp}
              >
                <Text className="text-white text-center font-semibold">
                  Share App
                </Text>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                className="w-full bg-red-500 p-3 rounded-lg mt-4"
                onPress={handleLogout}
              >
                <Text className="text-white text-center font-semibold">
                  Logout
                </Text>
              </TouchableOpacity>
              {/* App Info */}
              <View className="flex items-center justify-center mt-6">
                <Text className="text-gray-400 text-sm">
                  Made in 🇱🇰 with ❤️
                </Text>
                <Text className="text-gray-400 text-sm">App version {Application.nativeApplicationVersion}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
