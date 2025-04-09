import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Image, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import Constants from "expo-constants";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';
import ProfilePicture from '@components/ProfilePicture';
import useAuth from '@context/useAuth';
import { useSession } from '@context/ctx';
import { fetchProfileImage } from '@middleware/fetchImage';

export default function ViewProfile() {
  const [interests, setInterests] = useState(['+']);
  const [major, setMajor] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [images, setImages] = useState([]); // Image IDs from API
  const [imageUrls, setImageUrls] = useState([]); // Resolved image URLs
  const [tempImages, setTempImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false);

  const { userId, profiles } = useAuth();
  const params = useGlobalSearchParams();
  const [orgID, setOrgID] = useState('');
  const [profileId, setProfileId] = useState('');

  // State for scroll fix
  const scrollViewRef = useRef(null);
  const scrollFix = useRef(false);
  const { session } = useSession();

  const toggleIsEditing = (edit) => {
    setIsEditing(edit);
  };

  // Fetch initial profile data
  useEffect(() => {
    getProfile();
  }, [params.org]); // Only re-run if organization ID in URL params changes

  // Load profile images after we have both profile data and organization ID
  useEffect(() => {
    const loadProfileImages = async () => {
      try {
        if (!profileId || !orgID) {
          console.log("Missing profile ID or organization ID");
          return;
        }

        if (!images || images.length === 0) {
          console.log("No images to load");
          setImageUrls([]);
          return;
        }

        setImagesLoading(true);
        console.log("Loading profile images:", images.length);

          const imagePromises = images.map((imageId) => {
          return fetchProfileImage(profileId, imageId, orgID, session);
        }
        );

        const loadedUrls = await Promise.all(imagePromises);
        const validUrls = loadedUrls.filter(url => url !== null);
        setImageUrls(validUrls);
        setImagesLoading(false);
      } catch (error) {
        console.error("Error loading profile images:", error);
        setImagesLoading(false);
        setImageUrls([]);
      }
    };

    loadProfileImages();
  }, [profileId, orgID, images, session]);

  const getProfile = async () => {
    try {
      setIsLoading(true);

      // Find the profile that matches the organization ID from params
      const targetOrgId = params.org;
      const matchingProfile = profiles.find(profile => profile.organizationId === targetOrgId);

      if (!matchingProfile) {
        throw new Error(`No profile found for organization ID: ${targetOrgId}`);
      }

      const profileId = matchingProfile.id;
      setProfileId(profileId);

      const URI = Constants.expoConfig.hostUri.split(':').shift();
      const url = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/profiles/${profileId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
      }

      const profileData = await response.json();
      setProfileName(profileData.profileName || '');
      setMajor(profileData.major || '');
      setDescription(profileData.description || '');

      // Handle the case where images might be null or undefined
      setImages(Array.isArray(profileData.images) ? profileData.images : []);

      if (profileData.interests && profileData.interests.length > 0) {
        setInterests(profileData.interests);
      } else {
        setInterests(['+']);
      }

      setOrgID(profileData.organizationId || '');
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      Alert.alert('Error', 'Failed to fetch profile data');
      setIsLoading(false);
      setImages([]);
    }
  };

  const pickImage = async (index) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access the camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log(`Selected image for index ${index}:`, result.assets[0]);

        // If replacing an existing image, mark it for deletion
        if (imageUrls[index] && !tempImages[index]) {
          setDeletedImages(prev => [...prev, images[index]]);
        }

        // Store the image temporarily with proper metadata
        const uri = result.assets[0].uri;
        const fileExtension = uri.split('.').pop() || 'jpg';
        const fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Update tempImages as an object with index keys
        setTempImages(prev => ({
          ...prev,
          [index]: {
            uri: uri,
            type: fileType,
            name: `upload_${index}.${fileExtension}`
          }
        }));

        // Update display images
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = uri;
        setImageUrls(newImageUrls);

        console.log(`Updated tempImages, now contains ${Object.keys(tempImages).length + 1} images`);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Function to add a new image
  const addNewImage = () => {
    pickImage(imageUrls.length);
  };

  // New function to delete an image
  const handleDeleteImage = (index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // If it's an existing image (not a temp one), add to deletedImages
            if (images[index]) {
              setDeletedImages(prev => [...prev, images[index]]);
            }

            // Remove from images array
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);

            // Remove from imageUrls array
            const newImageUrls = [...imageUrls];
            newImageUrls.splice(index, 1);
            setImageUrls(newImageUrls);

            // Remove from tempImages if exists
            if (tempImages[index]) {
              const newTempImages = [...tempImages];
              newTempImages.splice(index, 1);
              setTempImages(newTempImages);
            }
          }
        }
      ]
    );
  };

  const saveProfile = async () => {
    try {
      setIsLoading(true); // Show loading indicator

      const targetOrgId = params.org;
      const matchingProfile = profiles.find(profile => profile.organizationId === targetOrgId);

      if (!matchingProfile) {
        throw new Error(`No profile found for organization ID: ${targetOrgId}`);
      }

      const profileId = matchingProfile.id;
      console.log(`Starting profile save... ProfileID: ${profileId}, OrgID: ${targetOrgId}`);

      // Delete images that were marked for deletion
      for (const imageKey of deletedImages) {
        try {
          const URI = Constants.expoConfig.hostUri.split(':').shift();
          const deleteUrl = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/delete/${encodeURIComponent(imageKey)}`;
          console.log(`Attempting to delete image: ${imageKey}`);

          await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${session}`
            }
          });
        } catch (deleteErr) {
          console.error("Error deleting image:", deleteErr);
          // Continue even if deletion fails
        }
      }

      // Upload new images
      const finalImagesList = [...images]; // Start with existing images

      console.log(`Found ${Object.keys(tempImages).length} temporary images to upload`);

      // Process each temporary image
      for (const [index, tempImage] of Object.entries(tempImages)) {
        if (tempImage) {
          try {
            console.log(`Preparing to upload image at index ${index}`);

            // Create the form data for this image
            const formData = new FormData();

            // Ensure we have the proper image object format
            const imageToUpload = {
              uri: tempImage.uri,
              type: tempImage.type || 'image/jpeg',
              name: tempImage.name || `upload_${Date.now()}.jpg`
            };

            console.log(`Image object: URI=${imageToUpload.uri.substring(0, 30)}..., Type=${imageToUpload.type}, Name=${imageToUpload.name}`);

            formData.append('image', imageToUpload);
            formData.append('organizationId', targetOrgId);
            formData.append('profileId', profileId);

            const URI = Constants.expoConfig.hostUri.split(':').shift();
            const uploadUrl = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/upload/profile`;

            console.log(`Sending upload request to: ${uploadUrl}`);

            // Upload the image
            const response = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${session}`
              },
              body: formData
            });

            console.log(`Upload response status: ${response.status}`);

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Upload error: ${errorText}`);
              throw new Error(`Failed to upload image: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Upload successful, received ID: ${data.id}`);

            // If this was replacing an existing image, update it in the finalImagesList
            if (index < images.length) {
              finalImagesList[index] = data.id;
            } else {
              // Otherwise add it as a new image
              const values = data.id.split('/');
              finalImagesList.push(values[values.length - 1]);
            }
          } catch (uploadErr) {
            console.error("Error uploading image:", uploadErr);
            Alert.alert("Upload Error", `Failed to upload image: ${uploadErr.message}`);
            setIsLoading(false);
            return; // Exit the function on upload error
          }
        }
      }

      // Remove any images that were marked for deletion from finalImagesList
      const filteredImages = finalImagesList.filter(img => !deletedImages.includes(img));
      console.log(`Final image list contains ${filteredImages.length} images`);

      // Update profile with the final list of images
      const payload = {
        interests: interests,
        major: major,
        description: description,
        profileName: profileName,
        images: filteredImages,
        profilePicture: filteredImages.length > 0 ? filteredImages[0] : null,
        numberOfLittles: 0
      };

      console.log("Updating profile with payload:", JSON.stringify(payload, null, 2));

      const URI = Constants.expoConfig.hostUri.split(':').shift();
      const URL = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/profiles/${profileId}`;

      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }

      // Clear temporary images and deletedImages after successful save
      setTempImages({});
      setDeletedImages([]);
      toggleIsEditing(false);
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
      getProfile(); // Refresh the profile data

    } catch (error) {
      console.error("Error saving profile:", error);
      setIsLoading(false);
      Alert.alert('Error', `Failed to save profile: ${error.message}`);
    }
  };

  const handleScroll = (event) => {
    if (scrollViewRef.current === undefined) return;
    if (scrollFix.current) {
      scrollFix.current = false;
    }
    else if (Keyboard.isVisible()) {
      const height = event.nativeEvent.contentOffset.y;
      scrollFix.current = true;
      scrollViewRef.current.scrollTo({
        x: 0,
        y: height + 50,
        animated: true
      });
    }
  };

  const handlePressInterest = (index) => {
    if (!isEditing) return;

    if (index == 0) {
      addInterest();
    }
    else {
      removeInterest(index);
    }
  };

  const addInterest = () => {
    if (!isEditing) return;

    Alert.prompt(
      'Enter an interest',
      null,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Add',
          onPress: (interest) => setInterests((interests) => [...interests, interest])
        }
      ]
    );
  };

  const removeInterest = (index) => {
    if (!isEditing) return;

    interests.splice(index, 1)

    setInterests([...interests]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={[styles.horizontalContainer]}>
          {isEditing ? (
            <StyledTextInput
              field="Name"
              value={profileName}
              setText={setProfileName}
              placeholder="Your name"
              autocorrect={false}
              editable={true}
              required
            />
          ) : (
            <Text style={profileName ? styles.profileText : styles.emptyContainer}>{profileName || "No name set"}</Text>
          )}

        </View>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              style={styles.scrollContainer}
              ref={scrollViewRef}
              onMomentumScrollEnd={handleScroll}>
              <View onStartShouldSetResponder={() => true} style={styles.form}>
                {/* Images Section */}
                <Text style={styles.sectionTitle}>Photos</Text>

                {imagesLoading ? (
                  <View style={styles.loadingImagesContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text>Loading images...</Text>
                  </View>
                ) : imageUrls.length === 0 && !isEditing ? (
                  <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No photos uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    {imageUrls.map((imageUrl, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        {isEditing ? (
                          <>
                            <TouchableWithoutFeedback onPress={() => pickImage(index)}>
                              <Image source={{ uri: imageUrl }} style={styles.image} />
                            </TouchableWithoutFeedback>
                            <Pressable
                              style={styles.deleteButton}
                              onPress={() => handleDeleteImage(index)}
                            >
                              <FontAwesome name="trash" size={18} color="white" />
                            </Pressable>
                          </>
                        ) : (
                          <>
                            <Image source={{ uri: imageUrl }} style={styles.image} />
                          </>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Add new image button */}
                {isEditing && imageUrls.length < 3 ? (
                  <View style={styles.buttonContainer}>
                    <StyledButton text="Add Photo" onClick={addNewImage} />
                  </View>
                ) : null}

                {/* Interests Section */}
                <Text style={styles.sectionTitle}>Interests</Text>
                <View>
                  {interests && (
                    <View style={styles.horizontalContainer}>
                      {interests.map((item, index) => (
                        <Pressable key={index} onPress={() => handlePressInterest(index)}>
                          <Text style={styles.interest}>{item}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Major Section */}
                <Text style={styles.sectionTitle}>Major</Text>
                {isEditing ? (
                  <StyledTextInput
                    field="Major"
                    value={major}
                    setText={setMajor}
                    placeholder="Your major"
                    autocorrect={false}
                    editable={isEditing}
                    required
                  />
                ) : (
                  <Text style={major ? styles.filledContainer : styles.emptyContainer}>
                    {major || "No major set"}
                  </Text>
                )}

                {/* Description Section */}
                <Text style={styles.sectionTitle}>Description</Text>
                {isEditing ? (
                  <StyledTextInput
                    field="Description"
                    value={description}
                    setText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholder="Tell us about yourself"
                    autocorrect={false}
                    editable={isEditing}
                    required
                  />
                ) : (
                  <Text style={description ? styles.filledContainer : styles.emptyContainer}>
                    {description || "No description set"}
                  </Text>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View style={styles.fixedButtonContainer}>
          <StyledButton
            text={isEditing ? "Save" : "Edit Profile"}
            onClick={() => { isEditing ? saveProfile() : toggleIsEditing(true) }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImagesContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
  },
  noImagesText: {
    fontFamily: 'Inter',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginTop: 15,
    marginBottom: 5,
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    display: 'flex',
    flexDirection: 'column'
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    gap: 10
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    fontFamily: 'Inter',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  scrollContainer: {
    height: '100%',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    borderRadius: 4,
    padding: 20,
    gap: 30
  },
  interest: {
    borderRadius: 4,
    backgroundColor: 'lightgrey',
    overflow: 'hidden',
    fontFamily: 'Inter',
    fontSize: 20,
    paddingHorizontal: 5
  },
  form: {
    gap: 15,
    paddingBottom: 80
  },
  profileText: {
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: 'bold',
  },
  emptyContainer: {
    borderWidth: 2,
    borderColor: "red",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    flexDirection: "row",
    textAlign: "center",
    fontFamily: 'Inter',
  },
  filledContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    flexDirection: "row",
    textAlign: "left",
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  }
});