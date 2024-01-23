import {
  Button,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';

// Define the type for the props expected by SignInScreen component
interface SignInScreenProps {
  promptAsync: (
    options?: AuthRequestPromptOptions
  ) => Promise<AuthSessionResult>;
}

export default function SigninWithGoogle({ promptAsync }: SignInScreenProps) {
  return (
    <View
      style={{
        flex: 1
      }}>
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="logo-firebase" size={100} color="#FFA611" />
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
          Sign In with <Text style={{ color: '#4285F4' }}>G</Text>
          <Text style={{ color: '#EA4336' }}>o</Text>
          <Text style={{ color: '#FBBC04' }}>o</Text>
          <Text style={{ color: '#4285F4' }}>g</Text>
          <Text style={{ color: '#34A853' }}>l</Text>
          <Text style={{ color: '#EA4336' }}>e</Text>
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#4285F4',
            width: '90%',
            padding: 10,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 15,
            marginTop: 20,
            marginBottom: 20
          }}
          onPress={() => promptAsync()}>
          <AntDesign name="google" size={30} color="white" />
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}>
            Sign In with Google
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
