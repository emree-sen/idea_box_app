import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Platform } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import theme
import { lightTheme } from './src/theme/AppTheme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList">
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: lightTheme.colors.onBackground,
        tabBarStyle: {
          backgroundColor: lightTheme.colors.surface,
          borderTopColor: lightTheme.colors.outline,
          borderTopWidth: 0.5,
          elevation: 8,
          shadowOpacity: 0.1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Projelerim' }} />
      <Tab.Screen name="Create" component={ChatStack} options={{ title: 'Yeni Proje' }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ title: 'Ayarlar' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <View style={{ flex: 1, backgroundColor: lightTheme.colors.primary }}>
          <StatusBar style="light" />
          <SafeAreaView
            style={{ flex: 1 }}
            edges={['left', 'right']}
          >
            <View style={{ flex: 1, backgroundColor: lightTheme.colors.background }}>
              <NavigationContainer>
                <MainTabs />
              </NavigationContainer>
            </View>
          </SafeAreaView>

          <SafeAreaView
            style={{ backgroundColor: lightTheme.colors.surface }}
            edges={['bottom']}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
