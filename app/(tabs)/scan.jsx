import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { supabase } from "../../utils/supabase";
import { images } from "../../constants";



const Scan = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async (data) => {
    if (isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {

      if (selectedOption === null) {
        throw new Error("Please select an option to scan");
      }

      if(selectedOption === "attendance"){

      const arrival = new Date().toISOString();
      const { data: ticketData, error } = await supabase
        .from("tickets")
        .update({ attendance: 1, arrival: arrival })
        .eq("id", data)
        .eq("attendance", 0)
        .select();

      if (error) {
        console.error(error);
        throw new Error("An error occurred while activating ticket");
      }

      if (ticketData.length === 0) {
        throw new Error("Ticket not found or already scanned");
      }

      Alert.alert("Ticket Valid", "Marked as Attended");
    }
    else if(selectedOption === "lunch"){
      const { data: ticketData, error } = await supabase
        .from("tickets")
        .update({ lunch: 1 })
        .eq("id", data)
        .eq("lunch", 0)
        .select();

      if (error) {
        console.error(error);
        throw new Error("An error occurred while activating ticket");
      }

      if (ticketData.length === 0) {
        throw new Error("Ticket not found or already scanned");
      }

      Alert.alert("Ticket Valid", "Marked as Lunch Collected");

    }

    else if(selectedOption === "refreshments"){
      const { data: ticketData, error } = await supabase
        .from("tickets")
        .update({ refreshments: 1 })
        .eq("id", data)
        .eq("refreshments", 0)
        .select();

      if (error) {
        console.error(error);
        throw new Error("An error occurred while activating ticket");
      }

      if (ticketData.length === 0) {
        throw new Error("Ticket not found or already scanned");
      }

      Alert.alert("Ticket Valid", "Marked as Refreshments Collected");

    }

      // if (ticketData[0].status === 1) {
      //   Alert.alert("Ticket Invalid", "This ticket is invalid.");
      // } else {
      //   
      // }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setTimeout(() => {
        setScanned(false);
        setIsProcessing(false);
      }, 3000); // Wait time of 3 seconds before allowing another scan
    }
  };

  if (!isPermissionGranted) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex justify-center items-center h-full p-4">
          <Text className="text-white justify-center mb-4">
            Requesting for camera permission
          </Text>
          <TouchableOpacity
            className="p-2 m-2 rounded bg-gray-700"
            onPress={requestPermission}
          >
            <Text className="text-white">Request Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex justify-center items-center h-full p-4">
      <Image
                source={images.logoH}
                className="h-10  mr-4 mb-5"
                resizeMode="contain"
              />
        <Text className="text-white text-2xl mb-4">
          Scan QR Code
        </Text>
        <View className="flex flex-row mb-4">
          <TouchableOpacity
            className={`p-2 m-2 rounded ${
              selectedOption === "attendance" ? "bg-blue-500" : "bg-gray-700"
            }`}
            onPress={() => setSelectedOption("attendance")}
          >
            <Text className="text-white">Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 m-2 rounded ${
              selectedOption === "lunch" ? "bg-blue-500" : "bg-gray-700"
            }`}
            onPress={() => setSelectedOption("lunch")}
          >
            <Text className="text-white">Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 m-2 rounded ${
              selectedOption === "refreshments" ? "bg-blue-500" : "bg-gray-700"
            }`}
            onPress={() => setSelectedOption("refreshments")}
          >
            <Text className="text-white">Refreshments</Text>
          </TouchableOpacity>
        </View>
        <CameraView
        facing="back"
        style={{ width: 400, height: 400 }}
         onBarcodeScanned={({ data }) => {
          handleBarCodeScanned(data);
        }}
          

        />

        {/* FOR DEBUG - MANUALLY CALL ON BUTTON PRESS */}
        {/* <TouchableOpacity
          onPress={() => handleBarCodeScanned("b71aa4fd-7df3-40cb-bb10-f08a6cda5a1a")}
          className="p-2 m-2 rounded bg-gray-700"
        >
          <Text className="text-white">Scan</Text>
        </TouchableOpacity> */}
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            className="p-2 m-2 rounded bg-gray-700"
          >
            <Text className="text-white">Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Scan;