import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable
} from 'react-native';
import Colors from '../../../constants/Colors';
import { Link } from 'expo-router';
import SignoutGoogle from '../../../components/signoutGoogle';
import { useUserContext } from '../../../contexts/UserContext';

interface ProfileProps {
  photo: string;
  name: string;
  role: string;
  score: number;
  birthday: string;
  householdName: string;
  onPressSettings: () => void;
}
const imageUrl = 'https://via.placeholder.com/150';
const Profile: React.FC = () => {
  const { state } = useUserContext();
  const { user, householdId } = state;
  const { photoUrl, displayName, role, totalPoints, birthday } = user
    ? user
    : {
        photoUrl: 'https://via.placeholder.com/150',
        displayName: 'Name',
        role: 'Role',
        totalPoints: 0,
        birthday: new Date()
      };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.blueContainer}>
          <Image source={{ uri: photoUrl }} style={styles.profileImage} />

          {/* <Image source={{ uri: photo }} style={styles.profileImage} /> */}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Score: {totalPoints}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.birthday}>
            Birthday: {birthday?.toLocaleString()}
          </Text>
          <Text style={styles.householdName}>Household: {householdId}</Text>
        </View>
      </View>
      {/* // auth buttons navigation */}
      <Link
        href={'/auth'}
        style={[styles.settingsButton, { marginTop: 10 }]}
        asChild>
        <Pressable>
          <Text style={styles.settingsText}>Auth</Text>
        </Pressable>
      </Link>
      <Link
        href={'/household'}
        style={[styles.settingsButton, { marginTop: 10 }]}
        asChild>
        <Pressable>
          <Text style={styles.settingsText}>Household Creation Screen</Text>
        </Pressable>
      </Link>
      {/* // end auth buttons navigation */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          return;
        }}>
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
      <SignoutGoogle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  profileHeader: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  blueContainer: {
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    marginTop: -40,
    paddingTop: 20,
    paddingBottom: 20,
    width: 800
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginTop: 50
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10
  },
  role: {
    fontSize: 18,
    color: 'black',
    marginTop: 10
  },
  scoreContainer: {
    marginTop: 50,
    width: 300,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    padding: 20
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },

  birthday: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
  },
  householdName: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
  },
  settingsButton: {
    backgroundColor: Colors.darkGreen,
    padding: 10,
    borderRadius: 16,
    marginTop: 10
  },
  settingsText: {
    color: 'white',
    fontWeight: 'bold'
  },
  info: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 30,
    width: 300
  }
});

export default Profile;
