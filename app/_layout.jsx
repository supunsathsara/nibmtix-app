import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
const RootLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Slot name="index" />
    </>
  );
};
export default RootLayout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
