import { Link, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from './components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Loader from './components/Loader';

export default function App() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Loader isLoading={loading} />
    );
  }

  if (session && session.user) {
    return <Redirect href='/home' />;
  }

  return (
    <SafeAreaView className="bg-[#040649] h-full">

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logoH}
            className="h-[70px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
            Revolutionize Event{"\n"}
            Ticketing with{" "}
              <Text className="text-[#7F03EA]">NIBMTix</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm text-gray-100 mt-7 text-center">
          Say goodbye to manual ticketing hassles and hello to effortless event experiences.
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/login")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}


