import Constants from "expo-constants";

export const fetchImage = async (bucket, id) => {
  try {
    if (!id) return null;

    const URI = Constants.expoConfig.hostUri.split(':').shift();
    const response = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/${bucket}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    return data.url; // Return the pre-signed URL
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};