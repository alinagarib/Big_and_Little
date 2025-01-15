import { Stack } from "expo-router";

/*
  Profile layout of app, contains all possible routes in (profile) subfolder
*/
export default function ProfileLayout() {
  return (
      <Stack>
        <Stack.Screen name="view-profile" options={{headerShown: false}} />
      </Stack>
  );
}
