import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView
} from 'react-native';
import { Announcement, Role, User } from '../../models';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config';
import { Ionicons } from '@expo/vector-icons';

// TODO refactor, basically rewrite, extract components, fix styling
import { useUserContext } from '../../contexts/UserContext';

async function addAnnouncement(announcement: string) {
  const docRef = doc(db, 'messages', Date.now().toString());
  const payload = { message: announcement };
  setDoc(docRef, payload);
}

const announcementsList: Announcement[] = [
  {
    id: '1',
    sender: 'User 1',
    createdAt: new Date(),
    content:
      'Shower is not working, please DO NOT USE IT! t will be fixed tomorrow.'
  },
  {
    id: '2',
    sender: 'User 2',
    createdAt: new Date(),
    content: 'Greetings from Iceland!',
    photoUri:
      'https://www.happiness.com/en/uploads/monthly_2019_07/iceland-happy-people.jpg.49f396d9196668eddb06cf311d0732d9.jpg'
  }
];

const usersList: User[] = [
  {
    id: '1',
    displayName: 'User 1',
    role: Role.PARENT,
    totalPoints: 100,
    currentPoints: 50,
    photoURL:
      'https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png'
  },
  {
    id: '2',
    displayName: 'User 2',
    role: Role.CHILD,
    totalPoints: 80,
    currentPoints: 60,
    photoURL:
      'https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png'
  }
];

const Dashboard: React.FC = () => {
  const [announcement, setAnnouncement] = React.useState('');
  const renderAnnouncement = ({ item }: { item: Announcement }) => {
    return (
      <View
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: Colors.lightGreen,
          borderRadius: Style.radius
        }}>
        <View style={styles.announcementContainer}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
        {item.photoUri ? (
          <Image
            source={{ uri: item.photoUri }}
            style={styles.annoucementPhoto}
          />
        ) : null}
      </View>
    );
  };

  const renderUserAvatar = ({ item }: { item: User }) => {
    return (
      <Link
        href={`/users/${item.id}`}
        style={{
          borderRadius: 10,
          marginLeft: 5,
          backgroundColor:
            item.role == Role.CHILD ? Colors.pink : Colors.lightGreen
        }}
        asChild>
        <TouchableOpacity
          style={[
            styles.userAvatar,
            {
              backgroundColor:
                item.role == Role.CHILD ? Colors.pink : Colors.lightGreen
            }
          ]}
          onPress={() =>
            console.log(`User avatar pressed ${item.displayName}`)
          }>
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        </TouchableOpacity>
      </Link>
    );
  };

  const { state, dispatch } = useUserContext();

  React.useEffect(() => {
    console.log('Current UserContext State:', state);
  }, [state]); // Log the state when it changes
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.title}>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.avatarContainer}>
          <FlatList
            horizontal
            data={usersList}
            renderItem={renderUserAvatar}
            keyExtractor={(item) => item.id}
            style={styles.userList}
          />
          <TouchableOpacity style={styles.addButton}>
            <Link href="/invite">
              <Ionicons name="add-circle-outline" size={40} color="white" />
            </Link>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>Announcements</Text>
      <View style={styles.line} />
      <View style={styles.messagesSection}>
        <FlatList
          style={styles.userList}
          data={announcementsList}
          renderItem={renderAnnouncement}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            onChangeText={(newText) => setAnnouncement(newText)}
            defaultValue={announcement}
          />
          <TouchableOpacity
            onPress={async () => {
              console.log('Send button pressed');
              await addAnnouncement(announcement)
                .then(() => {
                  setAnnouncement('');
                })
                .catch((error) => {
                  console.log(error);
                });
            }}>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacers.xLarge
  },
  subtitle: {
    color: Colors.darkGreen,

    marginLeft: 10,
    marginTop: 30
  },
  messagesSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E8E8E8'
  },
  line: {
    width: '40%',
    height: 0.6,
    backgroundColor: Colors.darkGreen,
    marginTop: 0
  },
  avatarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGreen,
    borderRadius: 50,
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 10, // Adjust padding as needed
    marginLeft: 60,
    marginRight: 60
  },
  addButton: {
    // Style for your add button, adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  announcementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  userAvatar: {
    borderRadius: 100,
    padding: 5,
    margin: 5,
    height: 40,
    marginTop: -3
  },

  annoucementPhoto: {
    height: 220,
    width: 220,
    marginLeft: 10,
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    height: 35
  },
  sendButton: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.small,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  messageText: {
    marginLeft: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    margin: 0
  },
  userList: {
    padding: 10
  },
  announcementsList: {
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 80,
    marginTop: 10,
    marginBottom: 10
  }
});

export default Dashboard;
