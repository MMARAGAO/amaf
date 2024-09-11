import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { DefaultTheme, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import HelloWord from "../components/HelloWord";
import { useAppContext } from "../context/AppContext";
import { StatusBar } from "expo-status-bar";
import { useUserContext } from "../context/UserContext";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "454016935398-8dibai1966dg4c843rj28j0o5dej9ge0.apps.googleusercontent.com",
});

export default function Login() {
  const { user, setUser } = useUserContext();
  const { isFirstVisit } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo && userInfo.data) {
        const { data } = userInfo;
        setUser({
          name: data.user?.name ?? "",
          email: data.user?.email ?? "",
          photo: data.user?.photo ?? "",
        });
      } else {
        console.log("User info or data is null");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const typedError = error as Error & { code?: string };
        if (typedError.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("User cancelled the login process");
        } else if (typedError.code === statusCodes.IN_PROGRESS) {
          console.log("Sign in is in progress");
        } else if (
          typedError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          console.log("Play services not available");
        } else {
          console.log("Some other error happened", error);
        }
      }
    }
  };

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#e5e7eb",
      placeholder: "#e5e7eb",
      background: "white",
      surface: "#e5e7eb",
      outline: "#e5e7eb",
    },
  };

  if (isFirstVisit) {
    return <HelloWord />;
  } else {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="min-h-screen bg-white">
            <StatusBar style="light" />
            <View className="h-[32%] w-full bg-gray-800 relative justify-end">
              <View className="w-96 h-96 bg-gray-100/30 rounded-full -top-12 -left-20 absolute opacity-10"></View>
              <View className="w-80 h-80 bg-gray-100/30 rounded-full -top-12 -left-20 absolute opacity-20"></View>
              <View className="px-6 py-16">
                <Text className="text-white text-4xl font-bold">
                  Seja bem-vindo!
                </Text>
                <Text className="text-white text-lg">
                  Faça login para continuar
                </Text>
              </View>
            </View>
            <View className="justify-between items-center px-6 h-[68%] py-10">
              <View className="w-full space-y-2">
                <TextInput
                  label="Email"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite seu email"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  // cor do placeholder
                  placeholderTextColor="#d1d5db"
                />
                <TextInput
                  className="w-full"
                  label="Senha"
                  mode="outlined"
                  theme={customTheme}
                  secureTextEntry={!showPassword}
                  placeholder="Digite sua senha"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                      color="gray"
                    />
                  }
                />
                <TouchableOpacity className="w-full">
                  <Text className="text-green-400 text-right text-md">
                    Esqueceu a senha?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="bg-green-400 py-4 rounded-lg w-full">
                <Text className="text-white text-center text-lg font-semibold">
                  Entrar
                </Text>
              </TouchableOpacity>
              <View className="flex-row w-full justify-center items-center space-x-2 px-10">
                <View className="bg-gray-200 h-[1px] w-1/2"></View>
                <Text className="text-center text-gray-600 text-md">Ou</Text>
                <View className="bg-gray-200 h-[1px] w-1/2"></View>
              </View>
              <TouchableOpacity
                className="rounded-xl border border-gray-300 rounded-lg items-center flex-row space-x-2 px-20 py-2"
                onPress={signIn}
              >
                <Image
                  source={require("../assets/google.png")}
                  className="w-8 h-8"
                />
                <Text className="text-center font-semibold text-lg">
                  Google
                </Text>
              </TouchableOpacity>
              <View className="flex-row w-full justify-center items-center mt-4">
                <Text className="text-gray-600">Não tem uma conta?</Text>
                <TouchableOpacity>
                  <Text className="text-green-400"> Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
