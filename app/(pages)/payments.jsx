import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../utils/supabase";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Payments = () => {
  const navigation = useNavigation(); // Access the navigation object
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [directoryUri, setDirectoryUri] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the payment data from Supabase
  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payouts")
      .select("id, amount, created_at, receipt_url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data);
    }
    setLoading(false);
  };

  const fetchDirectoryUri = async () => {
    const savedUri = await AsyncStorage.getItem("directoryUri");
    if (savedUri) {
      setDirectoryUri(savedUri);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayments().then(() => setRefreshing(false));
  }, []);

  // Fetch payments on component mount
  useEffect(() => {
    fetchDirectoryUri();
    fetchPayments();

    // Handle notification click to open the file
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { uri } = response.notification.request.content.data;
        console.log("Opening file at ", uri);
        Linking.openURL(uri);
      }
    );

    return () => subscription.remove();
  }, []);

  // Function to handle receipt download
  const handleDownloadReceipt = async (receiptUrl) => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        receiptUrl,
        FileSystem.documentDirectory + "receipt.png"
      );

      const { uri } = await downloadResumable.downloadAsync();
      console.log("Finished downloading to ", uri);

      if (Platform.OS === "android") {
        let dirUri = directoryUri;
        if (!dirUri) {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            dirUri = permissions.directoryUri;
            setDirectoryUri(dirUri);
            await AsyncStorage.setItem("directoryUri", dirUri);
          } else {
            console.error("Permission not granted");
            return;
          }
        }

        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
          dirUri,
          "receipt.png",
          "image/png"
        );

        await FileSystem.writeAsStringAsync(newUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("File moved to ", newUri);

        Alert.alert("Download Complete", "Your receipt has been downloaded.");

        // Show a notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Download Complete",
            body: "Your receipt has been downloaded.",
            data: { uri: newUri },
          },
          trigger: null,
        });

        console.log("Notification scheduled");
      } else {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  // Render payment items
  const renderPaymentItem = ({ item }) => {
    return (
      <View className="bg-gray-800 p-4 mb-2 rounded-lg">
        <Text className="text-white text-lg font-bold">
          Amount: LKR {item.amount}
        </Text>
        <Text className="text-white text-base">Payment ID: {item.id}</Text>
        <Text className="text-white text-base">
          Date: {new Date(item.created_at).toLocaleString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleDownloadReceipt(item.receipt_url)}
          className="mt-2"
        >
          <Text className="text-blue-400 text-base">Download Receipt</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary">
        <Loader isLoading={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Payments</Text>
        {/* Empty view to balance the header space */}
        <View style={{ width: 24 }} />
      </View>

      {/* Payment List */}
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text className="text-white text-center mt-4">
            No payments found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Payments;
