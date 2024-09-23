import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";
const PageLayout = () => {
  return (
    <View className='bg-primary'>
      <StatusBar style="light" />
      <Slot />
    </View>
  );
};
export default PageLayout;
