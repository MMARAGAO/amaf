import Home from "./pages/Home";
import Login from "./pages/Login";
import UserConfig from "./pages/UserConfig";
import AddFruit from "./pages/AddFruit";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserContext } from "./context/UserContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#34D399",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.9,
          bottom: 20,
          left: "20%",
          right: "20%",
          borderRadius: 50,
          height: 70,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "rgba(52,211,153,0.1)" : "#fff",
                borderRadius: 50,
                width: 50,
                height: 50,
              }}
            >
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={32}
                color={focused ? "#34D399" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="AddFruit"
        component={AddFruit}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "rgba(52,211,153,0.1)" : "#fff",
                borderRadius: 50,
                width: 50,
                height: 50,
              }}
            >
              <AntDesign
                name={focused ? "pluscircle" : "pluscircleo"}
                size={32}
                color={focused ? "#34D399" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="UserConfig"
        component={UserConfig}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "rgba(52,211,153,0.1)" : "#fff",
                borderRadius: 50,
                width: 50,
                height: 50,
              }}
            >
              <FontAwesome
                name={focused ? "user-circle" : "user-circle-o"}
                size={32}
                color={focused ? "#34D399" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const { user } = useUserContext();
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <StackNavigator />}
    </NavigationContainer>
  );
}
