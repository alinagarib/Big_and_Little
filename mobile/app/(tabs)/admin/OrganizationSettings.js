import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native";

const OrganizationSettings = () => {
  // Function to handle button clicks and show a popup
  const showPopup = (message) => {
    Alert.alert(message);
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Top Navbar */}
        <View style={styles.topNavbar}>
      <TouchableOpacity onPress={() => Alert.alert("Back button pressed")}>
        <Text style={styles.backCaret}>❮</Text>
      </TouchableOpacity>
      <Text style={styles.topNavbarText}>Organization Settings</Text>
    </View>

{/* Edit Logo Section */}
  <View style={styles.logoContainer}>
    <View style={styles.logoPlaceholder} />
    <TouchableOpacity onPress={() => Alert.alert("Edit Logo button pressed")}>
      <Text style={styles.editLogo}>Edit Logo</Text>
    </TouchableOpacity>
  </View>


      {/* Input Fields */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Name</Text>
        <TextInput style={styles.input} placeholder="Enter organization name" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Organization Description</Text>
        <TextInput style={styles.input} placeholder="Enter organization name" />
      </View>

      {/* Buttons with Descriptions */}
      <View style={styles.centeredContainer}>
        <TouchableOpacity style={styles.popupButton} onPress={() => showPopup("Matching Dates")}>
          <Text style={styles.buttonText}>Matching Dates</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit Matching Dates</Text>

        <TouchableOpacity style={styles.popupButton} onPress={() => showPopup("Number of Rounds")}>
          <Text style={styles.buttonText}>Number of Rounds</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit number of rounds</Text>

        <TouchableOpacity style={styles.popupButton} onPress={() => showPopup("Max Swipes")}>
          <Text style={styles.buttonText}>Max Swipes</Text>
        </TouchableOpacity>
        <Text style={styles.buttonDescription}>Set/Edit Max Swipes per round</Text>
      </View>

      {/* Save Settings Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navButtonText}>Admin Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles for Centered Layout & Proper Spacing
const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  topNavbarText: {
    position: "absolute",
    top: 60,  // Aligns the text to the very top of the screen
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,  // Adds spacing from the top edge
    zIndex: 20,  // Keeps it above other elements
  },  
  topNavbar: {
    position: "absolute",  // Makes navbar stay at the top
    top: 0,  // Aligns it to the very top of the screen
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    height: 120,  // Taller navbar for better spacing
    backgroundColor: "#fff",  // White background
    borderBottomWidth: 2,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,  // shadow effect for (iOS)
    zIndex: 10,  // Ensures it's above other elements
  },
  
  backButton: {
    position: "absolute",
    left: 15, // Position back button properly
  },
  backCaret: {
    position: "absolute",
    top: 0,  // Aligns caret to the very top
   left: 15,  // Keeps it on the left side
    fontSize: 25,  // Matches the size of the title
    fontWeight: "bold",
    paddingTop: 10,
  },
  navbarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "lightgray",
    borderRadius: 75,
    marginRight: 10,
  },
  editLogo: {
    fontSize: 30,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 20,
    alignSelf: "center",
    width: "85%", // Centers the inputs
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  centeredContainer: {
    alignItems: "center",
  },
  popupButton: {
    backgroundColor: "#d3d3d3",
    width: "70%", // Reduced width
    height: 50, // Increased height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDescription: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "70%", // Reduced width
    alignSelf: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Botton Navbar
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    paddingVertical: 25,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  navButton: {
    alignItems: "center",
  },
  navIcon: {
    fontSize: 25,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
};

export default OrganizationSettings;
