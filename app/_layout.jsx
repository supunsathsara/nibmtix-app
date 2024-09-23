import { Slot } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
const RootLayout = () => {
  return (

      <Slot name="index" />

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
