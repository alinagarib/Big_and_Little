import Constants from "expo-constants";

export async function fetchImage(bucket, id) {
  // Get IP that Expo server is using to host app, allows to connect with the backend
  const URI = Constants.expoConfig.hostUri.split(':').shift();

  // Currently, use MOCK_IMAGE_ID instead of id
  const logoRes = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/${bucket}/MOCK_IMAGE_ID`);
  const logoUrl = await logoRes.text();

  return logoUrl;
}