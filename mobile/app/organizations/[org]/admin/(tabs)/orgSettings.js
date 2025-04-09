import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, Modal,
  Image, ActivityIndicator, TouchableWithoutFeedback
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@context/ctx'; // Adjust according to your session management
import { fetchOrganizationImage } from '@middleware/fetchImage';
import { useGlobalSearchParams } from 'expo-router';

export default function OrganizationSettings() {
  const [orgName, setOrgName] = useState(''); // Initialize orgName
  const [orgDescription, setOrgDescription] = useState('');
  const [orgID, setOrgID] = useState('');
  const [editOrgModalVisible, setEditOrgModalVisible] = useState(false);
  const [roundsModalVisible, setRoundsModalVisible] = useState(false);
  const [swipesModalVisible, setSwipesModalVisible] = useState(false);
  const [roundsInput, setRoundsInput] = useState('');
  const [swipesInput, setSwipesInput] = useState('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [roundWeighting, setRoundWeighting] = useState([]);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const { session } = useSession();
  const params = useGlobalSearchParams();

  const [logo, setLogo] = useState(null);
  const [tempLogo, setTempLogo] = useState(null);
  const [logoURI, setLogoURI] = useState(null);
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  const showPopup = (message) => {
    Alert.alert(message);
  };

  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    fetchOrganizationData();

  }, [params.org]);

  const handleMonthChange = (text) => {
    setMonth(text);
    if (text.length === 2) dayRef.current?.focus(); // Move to day input
  };

  const handleDayChange = (text) => {
    setDay(text);
    if (text.length === 2) yearRef.current?.focus(); // Move to year input
  };

  const handleDateSave = () => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    if (
      monthNum >= 1 && monthNum <= 12 &&
      dayNum >= 1 && dayNum <= 31 &&
      year.length === 4
    ) {
      Alert.alert(`Date set to: ${month}/${day}/${year}`);
      setDateModalVisible(false);
    } else {
      Alert.alert('Invalid date. Please enter a valid MM/DD/YYYY.');
    }
  };

  const handleRoundsSave = () => {
    if (!isNaN(roundsInput) && roundsInput !== '') {
      Alert.alert(`Number of Rounds set to ${roundsInput}`);
      setRoundsModalVisible(false);
    } else {
      Alert.alert('Please enter a valid number.');
    }
  };

  const handleSwipesSave = () => {
    if (!isNaN(swipesInput) && swipesInput !== '') {
      Alert.alert(`Max Swipes set to ${swipesInput}`);
      setSwipesModalVisible(false);
    } else {
      Alert.alert('Please enter a valid number.');
    }
  };

  const fetchOrganizationData = async () => {
    try {
      setIsLoading(true);
      const targetOrgID = params.org;
      const URI = Constants.expoConfig.hostUri.split(':').shift();
      const url = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations/${targetOrgID}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch organization: ${response.status}`);
      }

      const orgData = await response.json();

      setOrgName(orgData.name || '');
      setOrgDescription(orgData.description || '');
      setOrgID(orgData._id || '');
      setRoundsInput(orgData.rounds || '');
      setRoundWeighting(orgData.roundWeighting || []);
      setIsPublic(orgData.isPublic || false);

      // Load logo
      if (orgData.logo) {
        setLogoLoading(true);
        try {
          const logoUrl = await fetchOrganizationImage('organization-images', orgData.logo, targetOrgID);
          setLogo(logoUrl);
        } catch (error) {
          console.error('Error loading logo:', error);
        } finally {
          setLogoLoading(false);
        }
      }

      setRoundsInput(orgData.numberOfRounds?.toString() || '');
      setSwipesInput(orgData.maxSwipes?.toString() || '');

      if (orgData.matchingDate) {
        const date = new Date(orgData.matchingDate);
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
        setDay(date.getDate().toString().padStart(2, '0'));
        setYear(date.getFullYear().toString());
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching organization data:', error);
      Alert.alert('Error', 'Failed to fetch organization data');
      setIsLoading(false);
    }
  };

  const pickLogo = async () => {
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
        // If replacing an existing image, mark it for deletion
        if (tempLogo) {
          setLogoDeleted(true);
        }

        // Store the image temporarily with proper metadata
        const uri = result.assets[0].uri;
        const fileExtension = uri.split('.').pop() || 'jpg';
        const fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Update tempImages as an object with index keys
        setTempLogo({
          uri: uri,
          type: fileType,
          name: `logo.${fileExtension}`
        });

        // Update display image
        setLogo(uri);
        console.log('Updated logo:', uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const deleteLogo = () => {
    Alert.alert(
      'Delete Logo',
      'Are you sure you want to delete the logo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLogoDeleted(true);
            setLogo(null);
            setTempLogo(null);
          }
        }
      ]
    );
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true); // Show loading indicator

      const targetOrgId = params.org;
      let logoLink = '';
      console.log(`Starting organization save... OrgID: ${targetOrgId}`);

      // Upload new logo image
      if (tempLogo) {
        try {
          console.log('Preparing to upload logo image');

          // Create the form data for this image
          const formData = new FormData();

          // Ensure we have the proper image object format
          const imageToUpload = {
            uri: tempLogo.uri,
            type: tempLogo.type || 'image/jpeg',
            name: tempLogo.name || `upload_${Date.now()}.jpg`
          };

          console.log(`Image object: URI=${imageToUpload.uri.substring(0, 30)}..., Type=${imageToUpload.type}, Name=${imageToUpload.name}`);

          formData.append('image', imageToUpload);
          formData.append('organizationId', targetOrgId);

          const URI = Constants.expoConfig.hostUri.split(':').shift();
          const uploadUrl = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/upload/organization`;

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

          // Update the logo image ID in the organization settings
          const values = data.id.split('/');
          setLogoURI(values[values.length - 1]);
          logoLink = values[values.length - 1];
        } catch (uploadErr) {
          console.error('Error uploading image:', uploadErr);
          Alert.alert('Upload Error', `Failed to upload image: ${uploadErr.message}`);
          setIsLoading(false);
          return; // Exit the function on upload error
        }
      }

      console.log(logoURI);
      // Update organization settings
      const payload = {
        name: orgName,
        description: orgDescription,
        rounds: roundsInput,
        swipesPerRound: swipesInput,
        roundWeighting: roundWeighting,
        isPublic: isPublic,
        logo: logoLink,
      };

      console.log('Updating organization with payload:', JSON.stringify(payload, null, 2));

      const URI = Constants.expoConfig.hostUri.split(':').shift();
      const URL = `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations/${targetOrgId}`;

      const response = await fetch(URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update organization: ${response.status} ${errorText}`);
      }

      // Clear temporary images and deletedImages after successful save
      setTempLogo(null);
      toggleIsEditing(false);
      setIsLoading(false);
      Alert.alert('Success', 'Organization updated successfully');
      getOrganization(); // Refresh the organization data
    } catch (error) {
      console.error('Error saving organization:', error);
      setIsLoading(false);
      Alert.alert('Error', `Failed to save organization: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.topNavbar}>
        <TouchableOpacity style={styles.backButton} onPress={() => Alert.alert('Back button pressed')}>
          <Text style={styles.backCaret}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.topNavbarText}>Organization Settings</Text>
      </View>

      {/* Edit Logo Section */}
      <View style={styles.logoContainer}>
        {console.log(logo)}
        <Image source={{ uri: logo }} style={styles.logo}/>
        <TouchableOpacity onPress={pickLogo}>
          <Text style={styles.editLogo}>Edit Logo</Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Name</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter organization name'
          value={orgName}
          onChangeText={setOrgName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Description</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter organization description'
          value={orgDescription}
          onChangeText={setOrgDescription}
        />
      </View>

      {/* Buttons with Descriptions */}
      <View style={styles.centeredContainer}>
        <TouchableOpacity style={styles.popupButton} onPress={() => setDateModalVisible(true)}>
          <Text style={styles.buttonText}>Matching Dates</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit Matching Dates</Text>

        <TouchableOpacity style={styles.popupButton} onPress={() => setRoundsModalVisible(true)}>
          <Text style={styles.buttonText}>Number of Rounds</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit number of rounds</Text>

        <TouchableOpacity style={styles.popupButton} onPress={() => setSwipesModalVisible(true)}>
          <Text style={styles.buttonText}>Max Swipes</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit Max Swipes per round</Text>
      </View>

    {/* Edit Organization Modal */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={editOrgModalVisible}
        onRequestClose={() => setEditOrgModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Organization Details</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Organization Name" 
              value={orgName} 
              onChangeText={setOrgName} 
            />
            <TextInput 
              style={[styles.modalInput, styles.multilineInput]} 
              placeholder="Organization Description" 
              value={orgDescription} 
              onChangeText={setOrgDescription} 
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditOrgModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveModalButton]} 
                onPress={saveSettings}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Input Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Date:</Text>
            <View style={styles.modalButtonContainer}>
              <TextInput
                style={[styles.dateInput, styles.smallInput]}
                placeholder='MM'
                keyboardType='numeric'
                maxLength={2}
                value={month}
                onChangeText={(text) => handleMonthChange(text)}
              />
              <TextInput
                style={[styles.dateInput, styles.smallInput]}
                placeholder='DD'
                keyboardType='numeric'
                maxLength={2}
                value={day}
                onChangeText={(text) => handleDayChange(text)}
              />
              <TextInput
                style={[styles.yearInput, styles.largeInput]}
                placeholder='YYYY'
                keyboardType='numeric'
                maxLength={4}
                value={year}
                onChangeText={setYear}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDateModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={handleDateSave}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Number of Rounds Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={roundsModalVisible}
        onRequestClose={() => setRoundsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Number of Rounds:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder='Number'
              keyboardType='numeric'
              value={roundsInput}
              onChangeText={setRoundsInput}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setRoundsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={handleRoundsSave}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Max Swipes Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={swipesModalVisible}
        onRequestClose={() => setSwipesModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Max Swipes:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder='Number'
              keyboardType='numeric'
              value={swipesInput}
              onChangeText={setSwipesInput}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setSwipesModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={handleSwipesSave}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save Settings Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSettings}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  topNavbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    borderBottomWidth: 2,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  topNavbarText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 52,
    padding: 15,
  },
  backCaret: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30, // Ensures space below the navbar
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'lightgray',
    borderRadius: 75,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 10,
  },
  editLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  formGroup: {
    marginBottom: 20,
    alignSelf: 'center',
    width: '85%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  centeredContainer: {
    alignItems: 'center',
  },
  popupButton: {
    backgroundColor: '#d3d3d3',
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDescription: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 5,
  },
  dateInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 60,
    borderRadius: 5,
  },
  yearInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 120,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },

  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    left: -20,
    backgroundColor: '#d3d3d3', // Light gray for cancel
  },
  saveModalButton: {
    left: -20,
    backgroundColor: 'black', // Blue for save
  },
});
