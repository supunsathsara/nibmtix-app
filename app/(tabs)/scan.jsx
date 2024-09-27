import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { supabase } from "../../utils/supabase";

// A separate button component for scanning options
const ScanOptionButton = ({ title, selected, onPress }) => (
  <TouchableOpacity
    className={`p-3 mx-2 rounded-full ${
      selected ? "bg-[#6247AA] shadow-lg" : "bg-gray-700"
    }`}
    onPress={onPress}
  >
    <Text className="text-white text-base">{title}</Text>
  </TouchableOpacity>
);

const Scan = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    requestPermission();
  }, []);

  // Unified function to handle scanning logic
  const handleBarCodeScanned = async (data) => {
    if (isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      if (selectedOption === null) {
        throw new Error("Please select an option to scan.");
      }

      let fieldToUpdate;
      let successMessage;

      // Determine what to update based on selected option
      switch (selectedOption) {
        case "attendance":
          fieldToUpdate = { attendance: 1, arrival: new Date().toISOString() };
          successMessage = "Marked as Attended";
          break;
        case "lunch":
          fieldToUpdate = { lunch: 1 };
          successMessage = "Marked as Lunch Collected";
          break;
        case "refreshments":
          fieldToUpdate = { refreshments: 1 };
          successMessage = "Marked as Refreshments Collected";
          break;
        default:
          throw new Error("Invalid option selected.");
      }

      // Update ticket in Supabase
      const { data: ticketData, error } = await supabase
        .from("tickets")
        .update(fieldToUpdate)
        .eq("id", data)
        .eq(Object.keys(fieldToUpdate)[0], 0)
        .select();

      if (error) throw new Error("Error occurred while updating the ticket.");
      if (ticketData.length === 0) throw new Error("Ticket not found or already scanned.");

      Alert.alert("Success", successMessage);

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setTimeout(() => {
        setScanned(false);
        setIsProcessing(false);
      }, 1000);
    }
  };

  if (!isPermissionGranted) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex justify-center items-center h-full p-4">
          <Text className="text-white mb-4">Requesting camera permission...</Text>
          <TouchableOpacity className="p-2 rounded bg-gray-700" onPress={requestPermission}>
            <Text className="text-white">Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex justify-center items-center h-full p-4">
        <Image source={images.logoH} className="h-10 mb-5" resizeMode="contain" />
        <Text className="text-white text-2xl mb-6">Scan QR Code</Text>

        {/* Scan Option Buttons */}
        <View className="flex flex-row mb-6">
          <ScanOptionButton
            title="Attendance"
            selected={selectedOption === "attendance"}
            onPress={() => setSelectedOption("attendance")}
          />
          <ScanOptionButton
            title="Lunch"
            selected={selectedOption === "lunch"}
            onPress={() => setSelectedOption("lunch")}
          />
          <ScanOptionButton
            title="Refreshments"
            selected={selectedOption === "refreshments"}
            onPress={() => setSelectedOption("refreshments")}
          />
        </View>

        {/* Camera View */}
        <CameraView
          facing="back"
          style={{ width: 400, height: 400, borderRadius: 16, overflow: "hidden" }}
          onBarcodeScanned={({ data }) => !scanned && handleBarCodeScanned(data)}
        />

        {/* Scanning feedback */}
        {isProcessing && (
          <View className="absolute inset-0 justify-center items-center">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Processing...</Text>
          </View>
        )}

        {/* Rescan button if scanned */}
        {scanned && (
          <TouchableOpacity onPress={() => setScanned(false)} className="p-3 mt-4 rounded bg-gray-700">
            <Text className="text-white">Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Scan;