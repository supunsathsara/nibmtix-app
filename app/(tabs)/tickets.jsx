import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Importing Icons
import { supabase } from "../../utils/supabase"; // Make sure your supabase instance is imported

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  // Fetch tickets from Supabase
  const fetchTickets = async () => {
    const { data, error } = await supabase
    .from("view_tickets_for_default_event")
    .select(
      "id,name,email,mobile,attendance,arrival,meal_type,refreshments,lunch,status,event_name"
    );

    if (error) {
      console.error("Error fetching tickets:", error);
    } else {
      setTickets(data);
    }
    setLoading(false);
    setRefreshing(false); // Stop refreshing after data is fetched
  };

  // Fetch tickets initially
  useEffect(() => {
    fetchTickets();
  }, []);

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTickets();
  }, []);

  // Filtering tickets based on the search query (email)
  const filteredTickets = tickets.filter((ticket) =>
    ticket.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Item for FlatList
  const renderTicketItem = ({ item }) => (
    <View className="bg-gray-800 rounded-lg p-4 mb-4 flex flex-row justify-between items-center">
      <View className="flex-1">
        {/* User Information */}
        <Text className="text-white text-lg font-semibold">{item.name}</Text>
        <Text className="text-gray-400 text-sm">{item.email}</Text>
      </View>

      <View className="ml-4 flex flex-row items-center">
        {/* Attendance Status */}
        {item.attendance ? (
          <Ionicons name="checkmark-circle" size={24} color="green" />
        ) : (
          <Ionicons name="close-circle" size={24} color="gray" />
        )}

        {/* Lunch Status */}
        <View className="ml-3">
          {item.lunch ? (
            <MaterialIcons name="restaurant" size={24} color="green" />
          ) : (
            <MaterialIcons name="restaurant" size={24} color="gray" />
          )}
        </View>

        {/* Refreshment Status */}
        <View className="ml-3">
          {item.refreshments ? (
            <Ionicons name="fast-food" size={24} color="green" />
          ) : (
            <Ionicons name="fast-food-outline" size={24} color="gray" />
          )}
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
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
      <View className="p-4 mb-12">
        {/* Search Input */}
        <TextInput
          className="bg-gray-700 text-white p-3 mb-4 rounded-lg"
          placeholder="Search by email"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Tickets List */}
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicketItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Text className="text-gray-400 text-center">No tickets found.</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Tickets;