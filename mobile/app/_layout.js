import { Stack } from "expo-router";

/*
  Root Layout of app, contains all possible routes
*/
export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(home)" options={{headerShown: false}} />
        <Stack.Screen name="(profile)" options={{headerShown: false}} />
      </Stack>
  );
}
