import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../utils/supabase";
import Loader from "../../components/Loader";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: events, error } = await supabase
        .from("events_view")
        .select();

      if (error) {
        console.error(error);
      } else {
        setEvents(events);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleLongPress = (event) => {
    Alert.alert("Event Options", "Choose an action", [
      {
        text: "Copy Event Link",
        onPress: async () => {
          await Clipboard.setStringAsync(
            `https://nibmtix.vercel.app/events/${event.slug}`
          );
          Alert.alert("Copied!", "Event link copied to clipboard.");
        },
      },
      {
        text: "Mark as Default",
        onPress: async () => {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getUser();
          if (sessionError) {
            console.error(sessionError);
            throw new Error("An error occurred while fetching session data");
          }

          const { data, error } = await supabase.rpc("mark_event_as_default", {
            _event_id: event.id,
            _user_id: sessionData.user.id,
          });
          if (error) {
            console.error(error);
            Alert.alert("Error", "Could not mark the event as default.");
          } else {
            Alert.alert("Success", "Event marked as default.");
            // Optionally refresh the event list or update the state here
            setEvents((prevEvents) =>
              prevEvents.map((e) =>
                e.default
                  ? { ...e, default: false }
                  : e.id === event.id
                  ? { ...e, default: true }
                  : e
              )
            );
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <Loader isLoading={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
        <Link href="/profile" className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
        <Text className="text-white text-xl font-bold">Events</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Events List */}
      <ScrollView className="p-4 mb-4">
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            className={`p-4 mb-4 rounded-lg ${
              event.default ? "bg-blue-500" : "bg-gray-800"
            }`}
            onPress={() => router.push(`/events/${event.slug}`)}
            onLongPress={() => handleLongPress(event)}
          >
            <Image
              source={{ uri: event.image }}
              className="w-full h-40 rounded-lg mb-2"
            />
            <Text className="text-white text-xl font-bold">{event.name}</Text>
            <Text className="text-gray-300">
              {event.date} at {event.time}
            </Text>
            <Text className="text-gray-300">{event.location}</Text>
            <Text className="text-gray-300 mt-2">
              {event.available_tickets} Tickets Available |{" "}
              {event.ticket_price > 0 ? `Rs. ${event.ticket_price}` : "Free"}
            </Text>
            {event.default && (
              <Text className="text-white bg-green-600 px-2 py-1 mt-2 rounded-lg self-start">
                Default Event
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsPage;
