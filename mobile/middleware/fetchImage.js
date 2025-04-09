import Constants from "expo-constants";

export const fetchOrganizationImage = async (bucket, id, organizationId) => {
  try {
    if (!id || id === "DEFAULT_LOGO_ID") {
      console.log("No image ID provided");
      return null;
    }

    const imageKey = `${bucket}/${organizationId}/${id}`;
    // Encode imageKey to handle special characters
    const encodedKey = encodeURIComponent(imageKey);
    const URI = Constants.expoConfig.hostUri.split(':').shift();

    const response = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/${encodedKey}`);

    if (!response.ok) {
      console.error('Server responded with error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Received image URL:', data.url);
    return data.url;
  } 
  catch (error) {
    console.error('Error fetching image:', error.message);
    return null;
  }
};

export const fetchProfileImage = async (profileId, imageId, organizationId, authToken) => {
  try {
    if (!imageId || !profileId || !organizationId) {
      console.log("Missing required data for image fetch: profileId, imageId, or organizationId");
      return null;
    }

    const imageKey = `profile-images/${organizationId}/${profileId}/${imageId}`;
    // Encode imageKey to handle special characters
    const encodedKey = encodeURIComponent(imageKey);
    const URI = Constants.expoConfig.hostUri.split(':').shift();
    
    console.log('Fetching profile image:', imageKey);
    const response = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/protected/${encodedKey}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return null;
  }
};