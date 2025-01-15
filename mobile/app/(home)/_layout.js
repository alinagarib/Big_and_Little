import { Stack } from "expo-router";

/*
  Home layout of app, contains all possible routes in (home) subfolder
*/
export default function HomeLayout() {
  return (
      <Stack>
        <Stack.Screen name="home" options={{headerShown: false}} />
      </Stack>
  );
}
