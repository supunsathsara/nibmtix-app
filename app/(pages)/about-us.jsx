import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // React Navigation hook
import { Ionicons } from '@expo/vector-icons'; // For back icon
import { images } from "../../constants";
import { Link } from 'expo-router';

const AboutUs = () => {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
      <Link href="/profile" className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
        <Text className="text-white text-xl font-bold">About Us</Text>
        {/* Empty view to balance the header space */}
        <View style={{ width: 24 }} />
      </View>

      {/* Body Content */}
      <View className="flex justify-center items-center p-4 h-full my-auto">
        {/* Logo */}
        <Image
          source={images.logoH}
          className="h-12 mb-10 -mt-8"
          resizeMode="contain"
        />

        {/* About Us Text */}
        <Text className="text-white text-2xl font-bold text-center mb-4">
          About NIBMTix
        </Text>

        <Text className="text-white text-base text-center leading-relaxed px-4">
          At NIBMTix, we’re transforming how events are managed at NIBM. 
          Our innovative digital ticketing platform offers seamless, efficient, 
          and eco-friendly solutions for all your event needs. Say goodbye to 
          manual ticketing hassles and hello to effortless event experiences.
        </Text>

        <Text className="text-white text-base text-center leading-relaxed px-4 mt-4">
          With NIBMTix, you can easily book, transfer, and manage your tickets online, 
          all with a few clicks. Whether you’re a student, lecturer, or event organizer, 
          NIBMTix brings convenience to your fingertips.
        </Text>

        <Text className="text-white text-base text-center leading-relaxed px-4 mt-4">
          Embrace the future of event management with us and make every event at NIBM a 
          memorable one!
        </Text>
        <View className="flex items-center justify-center mt-6">
                <Text className="text-gray-400 text-sm">
                  Made in 🇱🇰 with ❤️
                </Text>
                <Text className="text-gray-400 text-sm">
                  App version 1.0.0
                </Text>
              </View>
      </View>
    </SafeAreaView>
  );
};

export default AboutUs;