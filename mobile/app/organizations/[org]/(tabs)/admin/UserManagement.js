import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Member' },
  { id: '3', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'Member' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);

  const handleAction = (userId, action) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        if (action === 'assign') {
          return { ...user, role: 'Admin' };
        } else if (action === 'revoke') {
          return { ...user, role: 'Member' };
        }
      }
      return user;
    });

    if (action === 'delete') {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this profile?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setUsers(users.filter((user) => user.id !== userId));
            },
          },
        ]
      );
    } else {
      setUsers(updatedUsers);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
            <View style={styles.actionButtons}>
              {item.role === 'Member' ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAction(item.id, 'assign')}
                >
                  <Text style={styles.buttonText}>Assign Admin</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.revokeButton]}
                  onPress={() => handleAction(item.id, 'revoke')}
                >
                  <Text style={styles.buttonText}>Revoke Admin</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleAction(item.id, 'delete')}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userRole: {
    fontSize: 14,
    color: '#4CAF50',
  },
  actionButtons: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  revokeButton: {
    backgroundColor: '#fbc02d',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default UserManagement;
