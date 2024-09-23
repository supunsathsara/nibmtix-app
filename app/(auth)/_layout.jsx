import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../utils/supabase";
import { AppState } from "react-native";
const AuthLayout = () => {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

  
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
export default AuthLayout