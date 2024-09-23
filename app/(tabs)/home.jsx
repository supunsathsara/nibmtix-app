import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { supabase } from "../../utils/supabase";
import Loader from "../components/Loader";
import RevenueLineChart from "../components/RevenueLineChart";
import SalesBarChart from "../components/SalesBarChart";

const Home = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_dashboard")
        .select("*")
        .single();

      if (error) {
        if (error.message === "No data found or invalid input") {
          console.error("No data found or invalid input:", error.message);
        } else {
          console.error("Error fetching data:", error.message);
        }
      } else {
        console.log("Fetched data:", data);
        setEventData(data.event_dashboard);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary">
        <Loader isLoading={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex my-6 px-4 space-y-6">
          {session && session.user && (
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-medium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-xl font-semibold text-white">
                  {session.user.email}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10 mr-4"
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
          {eventData && (
            <View className="w-full">
              <Text className="text-4xl text-white font-regular">
                {eventData.event_name.toUpperCase()}
              </Text>
              <Text className="text-lg text-gray-100">
                {eventData.total_ticket_sales} tickets sold
              </Text>
              <Text className="text-lg text-gray-100">
                {eventData.total_unpaid_tickets} unpaid tickets
              </Text>
              <Text className="text-lg text-gray-100">
                {`${eventData.attended_people} out of ${eventData.total_paid_tickets} paid attendees have checked in.`}
              </Text>

              <View className="mt-10">
                <Text className="text-xl text-white font-regular py-4">
                  Ticket Sales by Day
                </Text>
                <SalesBarChart barData={eventData.tickets_by_day} />
              </View>
              <View className="mt-10">
                <Text className="text-xl text-white font-regular py-4">
                  Revenue by Day
                </Text>
                <RevenueLineChart
                  lineData={eventData.tickets_by_day}
                  ticketPrice={eventData.ticket_price}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
