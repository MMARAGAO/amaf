import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Shadow } from "react-native-shadow-2";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUserContext } from "../context/UserContext";

export default function UserConfig() {
  const [selectedButton, setSelectedButton] = useState("Missões");
  const [selectedConsistency, setSelectedConsistency] = useState("Plantas");
  const [selectedOption, setSelectedOption] = useState("");
  const { user, setUser } = useUserContext();

  const openInstagram = () => {
    Linking.openURL("https://www.instagram.com/amaf_df?igsh=YW9icHdydnc3dTVk");
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null as any);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <View
        className={`w-full bg-gray-100 z-50 absolute pt-10 space-y-4  overflow-hidden ${
          selectedOption === "notifications" ? "h-full" : "h-0"
        }`}
      >
        <View className="w-full items-start px-4 border-b border-gray-300 pb-4">
          <TouchableOpacity
            className="rounded-lg border h-10 w-10 justify-center items-center border-gray-300"
            onPress={() => setSelectedOption("")}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <View className="border-gray-300 border rounded-lg flex-row space-x-4 p-5">
            <AntDesign name="hearto" size={24} color="black" />
            <View>
              <Text className="font-bold text-base">Seja bem vindo! ❤️</Text>
              <Text className="text-sm text-gray-500">11/06/2024</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        className={`w-full bg-gray-100 z-50 absolute pt-10  overflow-hidden ${
          selectedOption === "settings" ? "h-full" : "h-0"
        }`}
      >
        <View className="flex-row justify-between border-b border-gray-300 px-4 pb-4">
          <TouchableOpacity
            className="rounded-lg border h-10 w-10 justify-center items-center border-gray-300"
            onPress={() => setSelectedOption("")}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg  px-4 py-2 justify-center items-center bg-gray-200">
            <Text className="text-base">Salvar</Text>
          </TouchableOpacity>
        </View>
        <View className="items-center px-4 py-4 space-y-4">
          <View className="w-44 h-44 rounded-full justify-center items-center border-green-400 border-2 p-1">
            <Image
              source={{ uri: user?.photo || "" }}
              className="w-full h-full rounded-full"
            />
          </View>
          <Text className="w-full text-base font-bold border-b border-gray-300 py-2">
            Conta
          </Text>
          <TouchableOpacity className="w-full rounded-lg bg-green-300 py-4">
            <Text className="text-base text-center text-white font-bold">
              Assinar Premium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full rounded-lg border border-gray-300 py-4">
            <Text className="text-base text-center font-bold">
              Restaurar compras
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full rounded-lg border border-gray-300 py-4">
            <Text className="text-base text-center font-bold">
              Feedback e Suporte
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full rounded-lg border border-gray-300 py-4">
            <Text className="text-base text-center font-bold">Mais</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full rounded-lg border border-gray-300 py-4"
            onPress={signOut}
          >
            <Text className="text-base text-center font-bold">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 space-y-4  pb-28">
        <View className="w-full h-16 px-4 border-b border-gray-200 items-center justify-between mt-10  flex-row">
          <Text className="text-xl font-bold">
            {user?.name ? user.name : "Usuário"}
          </Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="bg-green-400 border-2 border-transparent  rounded-lg h-10 w-10 justify-center items-center"
              onPress={openInstagram}
            >
              <FontAwesome name="instagram" size={24} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-gray-300  rounded-lg h-10 w-10 justify-center items-center"
              onPress={() => setSelectedOption("settings")}
            >
              <Feather name="settings" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-gray-300  rounded-lg h-10 w-10 justify-center items-center"
              onPress={() => setSelectedOption("notifications")}
            >
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 flex-row space-x-2">
          <TouchableOpacity
            className={`p-4  justify-center items-center rounded-xl ${
              selectedButton === "Missões" ? "bg-green-400" : "bg-gray-200"
            }`}
            onPress={() => setSelectedButton("Missões")}
          >
            <Text
              className={` text-white text-lg ${
                selectedButton === "Missões" ? "text-white" : "text-black"
              }`}
            >
              Missões
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4  justify-center items-center rounded-xl ${
              selectedButton === "Progresso" ? "bg-green-400" : "bg-gray-200"
            }`}
            onPress={() => setSelectedButton("Progresso")}
          >
            <Text
              className={` text-white text-lg ${
                selectedButton === "Progresso" ? "text-white" : "text-black"
              }`}
            >
              Progresso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4 justify-center items-center rounded-xl ${
              selectedButton === "Meus Cards" ? "bg-green-400" : "bg-gray-200"
            }`}
            onPress={() => setSelectedButton("Meus Cards")}
          >
            <Text
              className={` text-white text-lg ${
                selectedButton === "Meus Cards" ? "text-white" : "text-black"
              }`}
            >
              Meus Cards
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className={`flex-1 px-4 space-y-4 ${
            selectedButton === "Missões" ? "flex" : "hidden"
          }`}
        >
          <ScrollView className="space-y-4">
            <TouchableOpacity
              className="w-full py-5 bg-green-400 rounded-lg flex-row space-x-2 justify-center "
              onPress={openInstagram}
            >
              <FontAwesome name="instagram" size={24} color={"white"} />
              <Text className="text-white font-bold text-base">
                Entrar na Comunidade do Instagram
              </Text>
            </TouchableOpacity>
            <View className="flex flex-col border rounded-lg border-gray-300 px-4 py-4 space-y-2 ">
              <Text className="font-bold text-base">Objetivos diários</Text>
              <Text className="bg-gray-200 py-1 px-1 w-20 text-center rounded-md font-bold text-base">
                Em breve
              </Text>
            </View>
            <View className="w-full  border border-gray-300 p-4 rounded-lg">
              <Text className="font-bold text-base sticky top-0 py-2 border-b  border-gray-300 ">
                Certificados
              </Text>
              <View className="space-y-4 mt-4">
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema1.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Floração Primaveril
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/15</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema2.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">Cultivo Urbano</Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/15</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema3.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">Ciclo de Vida</Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/19</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema4.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Jardim Sustentável
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/22</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema5.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Plantas Medicinais
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/25</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema6.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Guardião da Floresta
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/29</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema7.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Biodiversidade de Plantas
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/32</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema8.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">Polinização</Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/40</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema9.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">
                      Árvores Frutíferas
                    </Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/42</Text>
                    </View>
                  </View>
                </View>
                <View className="border border-gray-300 flex-row space-x-4 py-4 bg-white/40 rounded-xl px-4">
                  <Image
                    source={require("../assets/emblema/emblema10.png")}
                    className="w-10 h-10"
                  />
                  <View className=" w-full space-y-2">
                    <Text className="font-bold text-base">GROOOT !!!</Text>
                    <View className="flex-row w-full space-x-2">
                      <View className="border rounded-full border-gray-300 py-0.5 w-[70%]"></View>
                      <Text className="text-green-400 w-10">0/100</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          className={`flex-1 px-4 ${
            selectedButton === "Progresso" ? "flex" : "hidden"
          }`}
        >
          <ScrollView
            className="flex-1 space-y-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-green-400 h-72 rounded-lg space-y-2 py-2">
              <View className="flex-row items-center p-4 space-x-2">
                <FontAwesome5 name="fire" size={24} color={"white"} />
                <Text className="text-white font-bold text-lg">
                  0 Contribuições
                </Text>
              </View>

              <View className="relative pl-4">
                <ScrollView
                  className="space-x-2"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <View className="flex-row space-x-4">
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        7 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        15 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        30 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        40 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        60 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        80 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        100 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        110 dias
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <View className="w-24 h-24 bg-white rounded-lg justify-center items-center">
                        <Ionicons name="flash" size={76} color="orange" />
                      </View>
                      <Text className="text-white font-bold text-lg">
                        120 dias
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View className="px-4">
                <TouchableOpacity className="bg-white py-4 justify-center items-center rounded-lg">
                  <Text className="text-black  text-base font-bold">
                    Resgatar prêmios
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="border border-gray-300 rounded-lg space-y-4 py-4 px-4">
              <Text className="font-bold text-base">Minha consistência</Text>
              <View className="flex-row space-x-2 ">
                <TouchableOpacity
                  className={` px-2 py-3 justify-center items-center rounded-lg ${
                    selectedConsistency === "Plantas"
                      ? "bg-green-400"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setSelectedConsistency("Plantas")}
                >
                  <Text
                    className={`text-sm font-bold ${
                      selectedConsistency === "Plantas"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Plantas Cadastradas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={` px-2 py-3 justify-center items-center rounded-lg ${
                    selectedConsistency === "Espécies"
                      ? "bg-green-400"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setSelectedConsistency("Espécies")}
                >
                  <Text
                    className={`text-sm font-bold ${
                      selectedConsistency === "Espécies"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Espécies Cadastradas
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-full h-52 bg-gray-200 rounded-lg"></View>
            </View>
            <View className="w-full border border-gray-300 rounded-lg p-4 space-y-2">
              <Text className="font-bold">Carreira</Text>
              <TouchableOpacity className="border border-gray-300 rounded-lg py-4 px-4 flex-row space-x-2">
                <Ionicons name="flash" size={24} color="orange" />
                <Text className="font-bold text-base">4 bolts ganhos</Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-gray-300 rounded-lg py-4 px-4 flex-row space-x-2">
                <AntDesign name="clockcircle" size={24} color="#2d148b" />
                <Text className="font-bold text-base">0m Tempo dedicado</Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-gray-300 rounded-lg py-4 px-4 flex-row space-x-2">
                <AntDesign name="checkcircle" size={24} color="#5c5d61" />
                <Text className="font-bold text-base">0 Contribuições</Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-gray-300 rounded-lg py-4 px-4 flex-row space-x-2 justify-center items-center">
                <Ionicons name="arrow-redo-sharp" size={24} color="black" />
                <Text className="font-bold text-base">Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View
          className={`flex-1 px-4 py-4 ${
            selectedButton === "Meus Cards" ? "flex" : "hidden"
          }`}
        >
          <Text className="text-center font-bold text-gray-500">
            Nenhum card favoritado, que tal começar uma nova trilha e escolehr
            seus cards favoritos?
          </Text>
        </View>
      </View>
    </View>
  );
}
