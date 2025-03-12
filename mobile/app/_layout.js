import { Stack } from "expo-router";
import { SessionProvider } from "@context/ctx";

/*
  Root Layout of app, contains all possible routes
*/
export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="organizations/[org]" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
