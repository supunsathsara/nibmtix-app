import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";

import Loader from "../../components/Loader";
import { supabase } from "../../../utils/supabase";

const EventsDetailsPage = () => {
  const { slug } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvent = async () => {
      const { data: event, error } = await supabase
        .from("events_view")
        .select()
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else {
        setEvent(event);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Loader isLoading={loading} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Text className="text-white">Event not found</Text>
      </SafeAreaView>
    );
  }

  const onShare = async (event) => {
    try {
      const eventTime = event.time.split(":").slice(0, 2).join(":");
      const result = await Share.share({
        message: `Check out this event: ${event.name} at ${event.location} on ${event.date} at ${eventTime}.
        Get your ticket at https://nibmtix.vercel.app/events/${event.slug}`,
        url: `https://nibmtix.vercel.app/events/${event.slug}`,
        title: `Event: ${event.name}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of", result.activityType);
        } else {
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
        <Link href="/events" className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
        <Text className="text-white text-xl font-bold">Event Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Event Details */}
      <ScrollView className="p-4 mb-4">
        <Image
          source={{ uri: event.image }}
          className="w-full h-48 rounded-lg mb-4"
        />
        <Text className="text-white text-2xl font-bold">{event.name}</Text>
        <Text className="text-gray-300 text-lg">
          {event.date} at {event.time}
        </Text>
        <Text className="text-gray-300">{event.location}</Text>
        <Text className="text-gray-300 mt-4">
          {event.available_tickets} Tickets Available |{" "}
          {event.ticket_price > 0 ? `Rs. ${event.ticket_price}` : "Free"}
        </Text>

        {/* Description */}
        <Text className="text-white mt-4 text-lg font-semibold">
          Description
        </Text>
        <Text className="text-gray-300 mt-2">{event.description}</Text>

        {/* Share event */}
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 mt-10 flex-row items-center justify-center"
          onPress={() => onShare(event)}
        >
          <Text className="text-white text-lg">Share Event</Text>

          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsDetailsPage;
