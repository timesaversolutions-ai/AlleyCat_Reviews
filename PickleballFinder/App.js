import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import MapsScreen from './screens/MapsScreen';
import CourtDetailsScreen from './screens/CourtDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import { auth, onAuthStateChanged } from './firebase'; // Import Firebase auth

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define a stack navigator for HomeScreen and CourtDetailsScreen
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourtDetails" component={CourtDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Login',
          headerLeft: () => (
            <Icon
              name="arrow-back-outline"
              size={25}
              color="black"
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
              style={{ marginLeft: 10 }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function MapsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapsScreen" component={MapsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourtDetails" component={CourtDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Define the Tab Navigator
function TabNavigator() {
  const [user, setUser] = useState(null); // Track user state

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser); // User is logged in
      } else {
        setUser(null); // No user is logged in
      }
    });
    return unsubscribe; // Clean up the listener
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = 'search-outline';
          } else if (route.name === 'Map') {
            iconName = 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Explore" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={MapsStack} options={{ headerShown: false }} />
      {user && (
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
