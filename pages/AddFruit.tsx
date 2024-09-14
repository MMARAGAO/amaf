import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  DefaultTheme,
  IconButton,
  MD3Colors,
  TextInput,
} from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { db } from "../ConfigFireBase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../ConfigFireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Feather from "@expo/vector-icons/Feather";
import { DataContext } from "../context/ContextBD";
// navigation
import { useNavigation } from "@react-navigation/native";

interface DataContextType {
  fetchData: () => void;
  // outras propriedades do contexto
}
interface Fruit {
  name: string | null;
  id: number | null;
  family: string | null;
  order: string | null;
  genus: string | null;
  colheita: string | null;
  colheita_period: string | null;
  nutritions: {
    calories: number | null;
    fat: number | null;
    sugar: number | null;
    carbohydrates: number | null;
    protein: number | null;
  };
}

export default function AddFruit() {
  // navigation
  const navigation = useNavigation();

  // chamar a função fetchData do contexto
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { fetchData } = context;

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  useFocusEffect(
    useCallback(() => {
      setFruit({ ...fruit, id: generateRandomId() });
      setLocalFruit({ ...localFruit, id_localização: generateRandomId() });
    }, [])
  );

  const [fruit, setFruit] = useState<Fruit>({
    name: null,
    id: null,
    family: null,
    order: null,
    genus: null,
    colheita: null,
    colheita_period: null,
    nutritions: {
      calories: null,
      fat: null,
      sugar: null,
      carbohydrates: null,
      protein: null,
    },
  });

  const [localFruit, setLocalFruit] = useState({
    id_localização: 0,
    id_fruta: 0,
    id_img: "",
    local: {
      long: null,
      lat: null,
    },
  });
  useEffect(() => {
    const jsonData = JSON.stringify({ localFruit, fruit }, null, 2);
    console.log(jsonData);
  }, [localFruit, fruit]);

  const [view, setView] = useState("location");

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#4ade80",
      text: "#4ade80",
      placeholder: "#d1d5db",
      background: "#ffffff",
    },
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocalFruit({
      ...localFruit,
      local: {
        lat: latitude,
        long: longitude,
      },
    });
  };

  const [userLocation, setUserLocation] = useState(null as any);
  // pegar a localização do usuário
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location as any);
    };

    getLocation();
  }, []);

  const [fruits, setFruits] = useState([] as any);
  // preciso selecionar no meu banco de dados no firebase, na coleção fruits, o name de todas as frutas e armaenar

  useEffect(() => {
    const fetchFruits = async () => {
      const fruitsCollection = collection(db, "fruits");
      const fruitsSnapshot = await getDocs(fruitsCollection);
      const fruitsList = fruitsSnapshot.docs.map((doc) => ({
        id: doc.data().id,
        name: doc.data().name,
      }));
      setFruits(fruitsList);
      setLocalFruit({ ...localFruit, id_fruta: fruitsList[0].id });
    };

    fetchFruits();
  }, []);

  const [searchText, setSearchText] = useState("");

  const filteredFruits = fruits.filter((fruit = { name: "" }) =>
    fruit.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const [isListVisible, setIsListVisible] = useState(true);

  const handleSelectFruit = (item: any, id: any) => {
    setLocalFruit({ ...localFruit, id_fruta: id });
    setSearchText(item.name);
    setIsListVisible(false);
  };

  const data = [{ key: "item1" }];

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (
        cameraStatus.status !== "granted" ||
        galleryStatus.status !== "granted"
      ) {
        Alert.alert(
          "Erro",
          "Permissão para acessar a câmera e a biblioteca de mídia é necessária."
        );
      }
    })();
  }, []);

  const chooseImageFromLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });

      // Verifica se a imagem foi escolhida com sucesso
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Imagem escolhida com sucesso:", uri);
        setLocalFruit({ ...localFruit, id_img: uri });
      }
    } catch (error) {
      console.error("Erro ao escolher imagem:", error);
      Alert.alert("Erro", "Não foi possível escolher a imagem.");
    }
  };

  const [loading, setLoading] = useState(false);

  const uploadDataLocation = async () => {
    setLoading(true);
    try {
      // Verificar se há uma imagem capturada
      if (!localFruit.id_img) {
        Alert.alert(
          "Erro",
          "Por favor, capture uma imagem antes de cadastrar."
        );
        setLoading(false);
        return;
      }

      // Criar uma referência no Firebase Storage para a imagem
      const imageRef = ref(storage, `images/${localFruit.id_localização}.jpg`);

      // Upload da imagem para o Firebase Storage
      const img = await fetch(localFruit.id_img);
      const bytes = await img.blob();
      await uploadBytes(imageRef, bytes);

      // Obter a URL pública da imagem
      const imageUrl = await getDownloadURL(imageRef);

      // Atualizar o campo id_img com a URL da imagem
      setLocalFruit({ ...localFruit, id_img: imageUrl });

      // Adicionar a localização no Firestore
      await addDoc(collection(db, "locations"), {
        ...localFruit,
        id_img: imageUrl, // URL da imagem
      });

      Alert.alert("Sucesso", "Localização cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar localização:", error);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar a localização.");
    } finally {
      setLoading(false);
      fetchData();
      // limpar os campos
      setLocalFruit({
        id_localização: generateRandomId(),
        id_fruta: 0,
        id_img: "",
        local: {
          long: null,
          lat: null,
        },
      });
      setSearchText("");
      // ir para home
      navigation.navigate("Home" as never);
    }
  };

  const uploadDataFruit = async () => {
    setLoading(true);
    try {
      // Verificar se todos os campos necessários estão preenchidos
      if (!fruit.name || !fruit.id) {
        Alert.alert(
          "Erro",
          "Por favor, preencha todos os campos antes de cadastrar."
        );
        setLoading(false);
        return;
      }

      // Adicionar a fruta no Firestore
      await addDoc(collection(db, "fruits"), {
        name: fruit.name,
        id: fruit.id,
        family: fruit.family,
        order: fruit.order,
        genus: fruit.genus,
        colheita: fruit.colheita,
        nutritions: {
          calories: fruit.nutritions.calories,
          fat: fruit.nutritions.fat,
          sugar: fruit.nutritions.sugar,
          carbohydrates: fruit.nutritions.carbohydrates,
          protein: fruit.nutritions.protein,
        },
      });

      Alert.alert("Sucesso", "Fruta cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar fruta:", error);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar a fruta.");
    } finally {
      setLoading(false);
      fetchData();
      // limpar os campos
      setFruit({
        name: null,
        id: null,
        family: null,
        order: null,
        genus: null,
        colheita: null,
        colheita_period: null,
        nutritions: {
          calories: null,
          fat: null,
          sugar: null,
          carbohydrates: null,
          protein: null,
        },
      });
      // ir para home
      navigation.navigate("Home" as never);
    }
  };

  // fazer o loading
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color="#4ade80" />
      </View>
    );
  }

  return (
    <View className="flex-1  py-10 pb-20">
      <View className="border-b border-gray-300 px-4 py-2">
        <Text className="font-semibold text-base">Adicionar frutas</Text>
      </View>
      <View className="flex-row w-full px-4 py-2">
        <View className="w-1/2 p-2">
          <Button
            // icone de localização
            icon={() => (
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={view === "location" ? "white" : "white"}
              />
            )}
            className={`w-full py-1 ${
              view === "location" ? "bg-green-400" : "bg-gray-300"
            }`}
            theme={customTheme}
            onPress={() => setView("location")}
          >
            <Text className="font-semibold text-white">Localização</Text>
          </Button>
        </View>
        <View className="w-1/2 p-2">
          <Button
            // icone de fruta
            icon={() => (
              <MaterialCommunityIcons
                name="fruit-cherries"
                size={24}
                color={view === "fruit" ? "white" : "white"}
              />
            )}
            className={`w-full py-1 ${
              view === "fruit" ? "bg-green-400" : "bg-gray-300"
            }`}
            theme={customTheme}
            onPress={() => setView("fruit")}
          >
            <Text className="font-semibold text-white">Fruta</Text>
          </Button>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={data}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={() => (
            <View className="px-4">
              <View
                className={`p-4 rounded-lg space-y-2 bg-white ${
                  view === "location" ? "flex" : "hidden"
                }`}
              >
                <View className="w-full justify-center items-center">
                  <View className="w-32 h-32">
                    <IconButton
                      icon="camera"
                      iconColor={MD3Colors.tertiary100}
                      size={20}
                      onPress={chooseImageFromLibrary}
                      className="absolute bottom-0 right-0 z-20 bg-green-400"
                    />
                    {/* se tiver imagem mostra se nao mostra um fundo cinza */}
                    {localFruit.id_img ? (
                      <Image
                        source={{ uri: localFruit.id_img }}
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <View className="w-full h-full bg-gray-200 rounded-lg"></View>
                    )}
                  </View>
                </View>

                <View className="relative">
                  <TextInput
                    theme={customTheme}
                    textColor="black"
                    className="bg-white"
                    placeholder="Ex: Abacaxi"
                    label={`Nome da fruta`}
                    mode="outlined"
                    value={searchText}
                    onChangeText={setSearchText}
                    onFocus={() => setIsListVisible(true)}
                  />
                  <Image
                    source={{
                      uri: `https://firebasestorage.googleapis.com/v0/b/amaf-27051.appspot.com/o/markers%2F${searchText}.png?alt=media`,
                    }}
                    className="absolute w-16 h-16 top-0 right-0 z-20"
                  />
                </View>

                {searchText.length > 0 &&
                  searchText !== fruit.name &&
                  filteredFruits.length > 0 &&
                  isListVisible && (
                    <FlatList
                      data={filteredFruits}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className="border-b border-gray-300 py-4 px-2 bg-white"
                          onPress={() => handleSelectFruit(item, item.id)}
                        >
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                <View className="h-72 rounded-xl overflow-hidden">
                  {userLocation ? (
                    <MapView
                      className="h-[150%] w-full"
                      onPress={handleMapPress}
                      showsUserLocation
                      initialRegion={{
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                    >
                      {localFruit.local.lat && localFruit.local.long && (
                        <Marker
                          image={{
                            uri: `https://firebasestorage.googleapis.com/v0/b/amaf-27051.appspot.com/o/markers%2F${searchText}.png?alt=media`,
                          }}
                          anchor={{ x: 0.5, y: 0.7 }}
                          coordinate={{
                            latitude: localFruit.local.lat,
                            longitude: localFruit.local.long,
                          }}
                        />
                      )}
                    </MapView>
                  ) : (
                    <ActivityIndicator color="#4ade80" />
                  )}
                </View>
                <Button
                  className="bg-green-400 py-2 rounded-lg"
                  theme={customTheme}
                  onPress={uploadDataLocation}
                >
                  <Text className="text-white font-semibold text-base">
                    Cadastrar Fruta
                  </Text>
                </Button>
              </View>
              <View
                className={`px-4 space-y-2 pb-28 ${
                  view === "fruit" ? "flex" : "hidden"
                }`}
              >
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: Abacaxi"
                    label={`Nome da fruta`}
                    mode="outlined"
                    value={fruit.name as string}
                    onChangeText={(text) => setFruit({ ...fruit, name: text })}
                  />
                </View>
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: Bromeliaceae"
                    label={`Família`}
                    mode="outlined"
                    value={fruit.family as string}
                    onChangeText={(text) =>
                      setFruit({ ...fruit, family: text })
                    }
                  />
                </View>
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: Poales"
                    label={`Ordem`}
                    mode="outlined"
                    value={fruit.order as string}
                    onChangeText={(text) => setFruit({ ...fruit, order: text })}
                  />
                </View>
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: Ananas"
                    label={`Gênero`}
                    mode="outlined"
                    value={fruit.genus as string}
                    onChangeText={(text) => setFruit({ ...fruit, genus: text })}
                  />
                </View>
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: 3"
                    label={`Colheita`}
                    mode="outlined"
                    value={fruit.colheita as string}
                    onChangeText={(text) =>
                      setFruit({ ...fruit, colheita: text })
                    }
                  />
                </View>
                <View>
                  <TextInput
                    theme={customTheme}
                    className="bg-white"
                    placeholder="Ex: 3"
                    label={`Período de colheita`}
                    mode="outlined"
                    value={fruit.colheita_period as string}
                    onChangeText={(text) =>
                      setFruit({ ...fruit, colheita_period: text })
                    }
                  />
                </View>
                <View className="w-full flex-row flex-wrap">
                  <View className="w-1/2 p-1">
                    <TextInput
                      theme={customTheme}
                      className="bg-white"
                      placeholder="Ex: 3"
                      label={`Calorias`}
                      mode="outlined"
                      value={
                        fruit.nutritions.calories !== null
                          ? fruit.nutritions.calories.toString()
                          : ""
                      }
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFruit({
                          ...fruit,
                          nutritions: {
                            ...fruit.nutritions,
                            calories: text ? parseInt(text) : null,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="w-1/2 p-1">
                    <TextInput
                      theme={customTheme}
                      className="bg-white"
                      placeholder="Ex: 3"
                      label={`Gorduras`}
                      mode="outlined"
                      value={
                        fruit.nutritions.fat !== null
                          ? fruit.nutritions.fat.toString()
                          : ""
                      }
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFruit({
                          ...fruit,
                          nutritions: {
                            ...fruit.nutritions,
                            fat: text ? parseInt(text) : null,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="w-1/2 p-1">
                    <TextInput
                      theme={customTheme}
                      className="bg-white"
                      placeholder="Ex: 3"
                      label={`Açúcares`}
                      mode="outlined"
                      value={
                        fruit.nutritions.sugar !== null
                          ? fruit.nutritions.sugar.toString()
                          : ""
                      }
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFruit({
                          ...fruit,
                          nutritions: {
                            ...fruit.nutritions,
                            sugar: text ? parseInt(text) : null,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="w-1/2 p-1">
                    <TextInput
                      theme={customTheme}
                      className="bg-white"
                      placeholder="Ex: 3"
                      label={`Carboidratos`}
                      mode="outlined"
                      value={
                        fruit.nutritions.carbohydrates !== null
                          ? fruit.nutritions.carbohydrates.toString()
                          : ""
                      }
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFruit({
                          ...fruit,
                          nutritions: {
                            ...fruit.nutritions,
                            carbohydrates: text ? parseInt(text) : null,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="w-1/2 p-1">
                    <TextInput
                      theme={customTheme}
                      className="bg-white"
                      placeholder="Ex: 3"
                      label={`Proteínas`}
                      mode="outlined"
                      value={
                        fruit.nutritions.protein !== null
                          ? fruit.nutritions.protein.toString()
                          : ""
                      }
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFruit({
                          ...fruit,
                          nutritions: {
                            ...fruit.nutritions,
                            protein: text ? parseInt(text) : null,
                          },
                        })
                      }
                    />
                  </View>
                </View>
                <Button
                  className="bg-green-400 py-2 rounded-lg"
                  theme={customTheme}
                  onPress={uploadDataFruit}
                >
                  <Text className="text-white font-semibold text-base">
                    Cadastrar Fruta
                  </Text>
                </Button>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
