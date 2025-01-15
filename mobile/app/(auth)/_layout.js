import { Stack } from "expo-router";

/*
  Auth layout of app, contains all possible routes in (auth) subfolder
*/
export default function AuthLayout() {
  return (
      <Stack>
        <Stack.Screen name="login" options={{headerShown: false}} />
        <Stack.Screen name="register" options={{headerShown: false}} />
      </Stack>
  );
}
