import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { supabase } from "../../utils/supabase";
import { makeRedirectUri } from "expo-auth-session";
const Register = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (
      form.username === "" ||
      form.mobile === "" ||
      form.email === "" ||
      form.password === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      console.log(form);
      const redirectTo = makeRedirectUri();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${redirectTo}/auth`,
          data: {
            role: "event-manager",
            mobile: form.mobile,
            full_name: form.username,
          },
        },
      });

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Please check your email to verify your account");
      
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logoH}
            resizeMode="contain"
            className="w-[201px] h-[59px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10">
            Sign Up to NIBMTix
          </Text>

          <FormField
            title="Name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Mobile"
            value={form.mobile}
            handleChangeText={(e) => setForm({ ...form, mobile: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Register;
