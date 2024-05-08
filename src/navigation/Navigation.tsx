// navigation.tsx
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MapScreen from "../view/Map";
import HomeScreen from "../view/Home";
import ProjectIssuesScreen from "../view/ProjectMonitoring";
//@ts-ignore
import Icon from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { registerForPushNotificationsAsync } from "../utils/functions";
import { setExpoPushToken } from "../redux/slices/RegisterSlice";
import * as Sentry from "@sentry/react-native";

export type HomeStackParamList = {
  Home: undefined;
  ProjectIssues: { projectName: string; data?: any };
};

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// Create a HomeStack for navigation within the Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProjectIssues"
        component={ProjectIssuesScreen}
        options={({ route }) => ({
          title: route?.params?.projectName,
          headerShown: false,
        })}
      />
    </HomeStack.Navigator>
  );
}

export default function AppNavigation() {
  const scheme = useColorScheme();
  const backgroundColor = scheme === "dark" ? "#222" : "#eee";

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    registerForNotifications();
    // notificationResponseListener();
  }, []);

  const registerForNotifications = async () => {
    await registerForPushNotificationsAsync()
      .then((token: string | undefined) => {
        dispatch(setExpoPushToken(token));

        Sentry.captureMessage(`Registered for EXPO Push Token: ${token}`);
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor },
          tabBarActiveTintColor: "#BB86FC",
          tabBarInactiveTintColor: "#555",
          tabBarShowLabel: false,
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" color={color} size={15} />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-outline" color={color} size={15} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
