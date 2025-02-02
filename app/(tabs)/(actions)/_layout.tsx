import { Stack } from 'expo-router';
import { StyleSheet, SafeAreaView } from 'react-native';

export const unstable_settings = {
    initialRouteName: 'actions',
};


export default function Layout() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack>
                <Stack.Screen name="actions" options={{ headerShown: false }} />
                <Stack.Screen name="kudos" options={{ headerTitle: "Kudos and Slobs", headerTitleAlign: 'center' }} />
                <Stack.Screen name="rewards" options={{ headerTitle: "Rewards", headerTitleAlign: 'center' }} />
                <Stack.Screen name="statistics" options={{ headerTitle: "Statistics", headerTitleAlign: 'center' }} />
                <Stack.Screen name="tasks" options={{ headerTitle: "Tasks", headerTitleAlign: 'center' }} />
            </Stack>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});