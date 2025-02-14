import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

// Sample profiles 
const profiles = [
  {
    id: 1,
    name: 'Jane Doe',
    year: 'Sophomore',
    image: 'https://via.placeholder.com/300',
    interests: ['Hiking', 'Foodie', 'Movies'],
    description: 'Jane Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis urna, in dignissim sem. Nunc sollicitudin est et posuere ultricies. Sed fringilla nulla non condimentum fermentum. Cras nec euismod turpis, sollicitudin mollis eros. Vivamus feugiat velit lacus, nec maximus purus gravida vitae. In volutpat odio quis massa aliquam, quis dapibus risus placerat. Pellentesque et nisi euismod, ullamcorper nunc ut, ultrices neque. Sed eget volutpat lectus. Nam eu luctus erat. Nam eu ante maximus, tincidunt lorem vitae, vulputate dui. Etiam eget odio in mi volutpat cursus id faucibus ex. Sed faucibus facilisis orci, sit amet dignissim dui congue in.',
  },
  {
    id: 2,
    name: 'John Smith',
    year: 'Junior',
    image: 'https://via.placeholder.com/300',
    interests: ['Music', 'Travel', 'Cooking'],
    description: 'John Vivamus feugiat velit lacus, nec maximus purus gravida vitae Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis urna, in dignissim sem. Nunc sollicitudin est et posuere ultricies. Sed fringilla nulla non condimentum fermentum. Cras nec euismod turpis, sollicitudin mollis eros. Vivamus feugiat velit lacus, nec maximus purus gravida vitae. In volutpat odio quis massa aliquam, quis dapibus risus placerat. Pellentesque et nisi euismod, ullamcorper nunc ut, ultrices neque. Sed eget volutpat lectus. Nam eu luctus erat. Nam eu ante maximus, tincidunt lorem vitae, vulputate dui. Etiam eget odio in mi volutpat cursus id faucibus ex. Sed faucibus facilisis orci, sit amet dignissim dui congue in.',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    year: 'Senior',
    image: 'https://via.placeholder.com/300',
    interests: ['Yoga', 'Painting', 'Writing'],
    description: 'Alice Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis urna, in dignissim sem. Nunc sollicitudin est et posuere ultricies. Sed fringilla nulla non condimentum fermentum. Cras nec euismod turpis, sollicitudin mollis eros. Vivamus feugiat velit lacus, nec maximus purus gravida vitae. In volutpat odio quis massa aliquam, quis dapibus risus placerat. Pellentesque et nisi euismod, ullamcorper nunc ut, ultrices neque. Sed eget volutpat lectus. Nam eu luctus erat. Nam eu ante maximus, tincidunt lorem vitae, vulputate dui. Etiam eget odio in mi volutpat cursus id faucibus ex. Sed faucibus facilisis orci, sit amet dignissim dui congue in.',
  },
  {
    id: 4,
    name: 'Robert Brown',
    year: 'Freshman',
    image: 'https://via.placeholder.com/300',
    interests: ['Gaming', 'Technology', 'Science'],
    description: 'Robert Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis urna, in dignissim sem. Nunc sollicitudin est et posuere ultricies. Sed fringilla nulla non condimentum fermentum. Cras nec euismod turpis, sollicitudin mollis eros. Vivamus feugiat velit lacus, nec maximus purus gravida vitae. In volutpat odio quis massa aliquam, quis dapibus risus placerat. Pellentesque et nisi euismod, ullamcorper nunc ut, ultrices neque. Sed eget volutpat lectus. Nam eu luctus erat. Nam eu ante maximus, tincidunt lorem vitae, vulputate dui. Etiam eget odio in mi volutpat cursus id faucibus ex. Sed faucibus facilisis orci, sit amet dignissim dui congue in.',
  },
  {
    id: 5,
    name: 'Emily Clark',
    year: 'Sophomore',
    image: 'https://via.placeholder.com/300',
    interests: ['Dancing', 'Fashion', 'Fitness'],
    description: 'Emily Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis urna, in dignissim sem. Nunc sollicitudin est et posuere ultricies. Sed fringilla nulla non condimentum fermentum. Cras nec euismod turpis, sollicitudin mollis eros. Vivamus feugiat velit lacus, nec maximus purus gravida vitae. In volutpat odio quis massa aliquam, quis dapibus risus placerat. Pellentesque et nisi euismod, ullamcorper nunc ut, ultrices neque. Sed eget volutpat lectus. Nam eu luctus erat. Nam eu ante maximus, tincidunt lorem vitae, vulputate dui. Etiam eget odio in mi volutpat cursus id faucibus ex. Sed faucibus facilisis orci, sit amet dignissim dui congue in.',
  },
];

export default function SwipePage() {
  const { org } = useLocalSearchParams();
  console.log(org);

  const [profileIndex, setProfileIndex] = useState(0); //Current profile index
  const swipeAnim = useRef(new Animated.Value(0)).current; // Animation of horizontal swipe

  // Function to reset swipe and load next profile
  const handleNextProfile = () => {
    setProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length); 
    swipeAnim.setValue(0); 
  };

  // Swipe to the right (like) and load next profile
  const swipeRight = () => {
    Animated.timing(swipeAnim, {
      toValue: 500, // Moves off-screen to the right
      duration: 300,
      useNativeDriver: true,
    }).start(() => handleNextProfile()); // After animation load next profile
  };

  // Swipe to the left (dislike) and load next profile
  const swipeLeft = () => {
    Animated.timing(swipeAnim, {
      toValue: -500, // Moves off-screen to the left
      duration: 300,
      useNativeDriver: true,
    }).start(() => handleNextProfile()); // After animation loads next profile
  };

  // Current profile based on profileIndex
  const currentProfile = profiles[profileIndex];

  return (
    <View style={styles.container}>
      {/* Animated wrapper */}
      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX: swipeAnim }] }]}>
        <ScrollView style={styles.scrollView}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image style={styles.profilePicture} source={{ uri: currentProfile.image }} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{currentProfile.name}</Text>
              <Text style={styles.year}>{currentProfile.year}</Text>
            </View>
          </View>
          
          {/* Container with swipe buttons */}
          <View style={styles.photoContainer}>
            <Text style={styles.photoPlaceholder}>My Photos</Text>
            {/* "X" button, swipe left */}
            <TouchableOpacity style={styles.leftButton} onPress={swipeLeft}>
              <FontAwesome name="times" size={46} color="black" />
            </TouchableOpacity>
            {/* Heart button, swipe right */}
            <TouchableOpacity style={styles.rightButton} onPress={swipeRight}>
              <FontAwesome name="heart" size={40} color="black" />
            </TouchableOpacity>
          </View>

          {/* Interests  */}
          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {currentProfile.interests.map((interest, index) => (
                <Text key={index} style={styles.interestItem}>{interest}</Text>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.username}>{currentProfile.name}</Text>
              <Text style={styles.descriptionText}>{currentProfile.description}</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  animatedContainer: {
    flex: 1, //  entire profile view is animated
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingRight: 15, // right margin, scrollbar
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 16,
    color: '#888',
  },
  photoContainer: {
    height: 400,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
  photoPlaceholder: {
    fontSize: 18,
    color: '#888',
  },
  leftButton: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  rightButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  interestsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
  },
  descriptionSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  descriptionCard: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
