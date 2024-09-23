import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // React Navigation hook
import { Ionicons } from '@expo/vector-icons'; // For back icon

const Support = () => {
  const navigation = useNavigation(); // Access the navigation object

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@nibmtix.com'); // Open email app to send support email
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+94123456789'); // Trigger phone call to support number
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Support</Text>
        {/* Empty view to balance the header space */}
        <View style={{ width: 24 }} />
      </View>

      {/* Body Content */}
      <View className="flex justify-center items-center p-4">
        <Text className="text-white text-2xl font-bold text-center mb-4">
          Help & Support
        </Text>

        <Text className="text-white text-base text-center leading-relaxed px-4 mb-4">
          We're here to help! If you have any questions, issues, or need assistance with NIBMTix, feel free to reach out to us.
        </Text>

        {/* Email Support */}
        <TouchableOpacity onPress={handleEmailSupport} className="mb-4">
          <Text className="text-blue-400 text-base">
            Email us at: support@nibmtix.com
          </Text>
        </TouchableOpacity>

        {/* Call Support */}
        <TouchableOpacity onPress={handleCallSupport} className="mb-4">
          <Text className="text-blue-400 text-base">
            Call us: +94 123 456 789
          </Text>
        </TouchableOpacity>

        <Text className="text-white text-base text-center leading-relaxed px-4">
          You can also visit our FAQ section for quick answers to common questions.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Support;