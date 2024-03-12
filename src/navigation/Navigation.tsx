// navigation.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MapScreen from "../view/Map";
import HomeScreen from "../view/Home";
import ProjectIssuesScreen from "../view/ProjectIssues";
//@ts-ignore
import Icon from "react-native-vector-icons/Ionicons";

export type HomeStackParamList = {
  Home: undefined;
  ProjectIssues: { projectId: string | any; projectName: string };
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
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#222" },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#555",
          tabBarShowLabel: false,
          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
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
