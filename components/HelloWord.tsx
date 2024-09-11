import React, { useMemo } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
// status bar
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../context/AppContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Função para gerar um array de pontos com posições aleatórias
const generateStars = (numStars = 100) => {
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    // Posições e tamanhos aleatórios
    const left = Math.random() * 100; // Sem porcentagem, apenas valor numérico
    const top = Math.random() * 100; // Sem porcentagem, apenas valor numérico
    stars.push({ left, top });
  }
  return stars;
};

export default function HelloWord() {
  const navigation = useNavigation();
  const stars = useMemo(() => generateStars(1000), []);
  const { isFirstVisit, setIsFirstVisit } = useAppContext();

  return (
    <View className="bg-white flex-1 flex justify-top">
      <StatusBar style="light" />
      <View className="h-1/2 w-full bg-[#121C30] rounded-b-[120px] relative items-center">
        <View className="absolute w-52 h-40 bottom-1 opacity-40">
          <Image
            source={require("../assets/detail.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        {stars.map((star, index) => (
          <View
            key={index}
            className="absolute bg-blue-400 w-[0.5px] h-[0.5px] rounded-full"
            style={{
              left: `${star.left}%`, // Usamos template strings para aplicar a porcentagem
              top: `${star.top}%`, // Usamos template strings para aplicar a porcentagem
            }}
          />
        ))}
        <View className="absolute bg-white w-32 h-32 rounded-full -bottom-16 shadow-xl flex justify-center items-center  p-2">
          <Image
            source={require("../assets/logo.png")}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
      </View>
      <View className="h-1/2 pt-20 pb-10 flex items-center space-y-8 justify-between ">
        <View className=" flex items-center space-y-4">
          <Text className="font-bold text-5xl text-gray-800">AMAF</Text>
          <Text className="text-gray-600 text-lg px-4 text-center">
            Aplicativo de mapeamento de árvores frutíferas
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsFirstVisit(false);
              navigation.navigate("Login" as never);
            }}
            className="bg-green-400 rounded-full px-6 py-3 flex-row items-center justify-center space-x-2"
          >
            <Text className="text-lg text-white font-semibold">
              Comece Gratuitamente
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
