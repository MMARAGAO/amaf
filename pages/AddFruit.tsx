import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button, Chip, Modal, Portal, TextInput } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Autocomplete from "react-native-autocomplete-input";
import MapView, { Marker } from "react-native-maps";
import { FruitsContext } from "../context/ContextBdFruit"; // Ajuste o caminho conforme necessário
import * as Location from "expo-location";

import { db } from "../ConfigFireBase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

function generateNumericId(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function AddFruit() {
  const [id, setId] = useState(generateNumericId(10));
  const [view, setView] = useState("fruit");
  const [formDataFruit, setFormDataFruit] = useState({
    name: "",
    id: id,
    family: "",
    order: "",
    genus: "",
    colheita: "",
    colheita_period: "",
    nutritions: {
      calories: "",
      fat: "",
      sugar: "",
      carbohydrates: "",
      protein: "",
    },
  });

  const addFruitToFirestore = async (fruitData = formDataFruit) => {
    try {
      const docRef = await addDoc(collection(db, "fruits"), fruitData as any);
      console.log("Documento adicionado com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  const addLocationToFirestore = async (locationData = formDataLocation) => {
    try {
      const docRef = await addDoc(
        collection(db, "location"),
        locationData as any
      );
      console.log("Documento adicionado com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  const handleAddLocation = () => {
    addLocationToFirestore(formDataLocation);
  };

  const handleSubmit = () => {
    addFruitToFirestore(formDataFruit);
  };

  useFocusEffect(
    useCallback(() => {
      // Gera um novo ID quando a página ganha foco
      setFormDataFruit((prevState) => ({
        ...prevState,
        id: generateNumericId(10),
      }));
    }, [])
  );

  const [formDataLocation, setFormDataLocation] = useState({
    id_localização: 2,
    id_fruta: 7,
    local: {
      long: -47.709602244425554,
      lat: -15.57443509540301,
    },
  });

  const customTheme = {
    colors: {
      primary: "#4ade80",
      text: "#4ade80",
      placeholder: "#d1d5db",
      underlineColor: "#4ade80",
      background: "#f3f4f6",
      surface: "#fff",
      outline: "#d1d5db",
    },
  };
  const data = [{ key: "form" }];

  const fruitNames = useContext(FruitsContext);
  const [query1, setQuery1] = useState("");
  const [filteredFruits, setFilteredFruits] = useState<string[]>([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  useEffect(() => {
    setFormDataLocation({
      ...formDataLocation,
      local: { long: location.longitude, lat: location.latitude },
    });
  }, [location]);

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.0021,
      });
    })();
  }, []);

  const handleInputChange = (text: string) => {
    setQuery1(text);
    if (text) {
      const filtered = fruitNames.filter(
        (fruit) => fruit && fruit.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFruits(filtered);
    } else {
      setFilteredFruits([]);
    }
  };

  const handleSelectItem = (item: string) => {
    setQuery1(item);
    setFilteredFruits([]);
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const [fruitId, setFruitId] = useState("");

  async function getFruit() {
    const q = query(collection(db, "fruits"), where("name", "==", `${query1}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFruitId(doc.data().id); // Supondo que o campo `id` está dentro do documento
      setFormDataLocation({ ...formDataLocation, id_fruta: doc.data().id });
    });
  }

  useEffect(() => {
    getFruit();
  }, [query1]);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    navigation.navigate("Home" as never);
  };
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          style={{ margin: 20 }}
        >
          <Text className="text-base font-semibold">Cadastro efetuado com</Text>
          <TouchableOpacity
            onPress={hideModal}
            className="bg-green-400 py-3 rounded-lg mt-4"
          >
            <Text className="text-white text-center text-base font-semibold">
              Fechar
            </Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
      <FlatList
        className="mb-24"
        data={data}
        renderItem={() => (
          <View className="flex-1 mt-10 space-y-2">
            <View className="border-b border-gray-300 h-16 justify-end py-2 px-2">
              <Text className="text-2xl font-bold">Adicionar Fruta</Text>
            </View>
            <View className="flex-row">
              <View className="w-1/2 p-2">
                <Button
                  icon="fruit-cherries"
                  mode="contained"
                  onPress={() => setView("fruit")}
                  rippleColor="#4ade80"
                  buttonColor={view === "fruit" ? "#4ade80" : "#d1d5db"}
                  textColor="white"
                >
                  <Text className="text-base font-semibold">Fruta</Text>
                </Button>
              </View>
              <View className="w-1/2 p-2">
                <Button
                  icon="map-marker"
                  mode="contained"
                  onPress={() => setView("location")}
                  rippleColor="#4ade80"
                  buttonColor={view === "location" ? "#4ade80" : "#d1d5db"}
                  textColor="white"
                >
                  <Text className="text-base font-semibold">Localização</Text>
                </Button>
              </View>
            </View>
            <View className="p-4">
              <View
                className={`border rounded-lg p-2 border-gray-300 ${
                  view === "fruit" ? "" : "hidden"
                }`}
              >
                <TextInput
                  label="Nome"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite o nome da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.name}
                  onChangeText={(text) =>
                    setFormDataFruit({ ...formDataFruit, name: text })
                  }
                />
                <TextInput
                  label="Família"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite a família da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.family}
                  onChangeText={(text) =>
                    setFormDataFruit({ ...formDataFruit, family: text })
                  }
                />
                <TextInput
                  label="Ordem"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite a ordem da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.order}
                  onChangeText={(text) =>
                    setFormDataFruit({ ...formDataFruit, order: text })
                  }
                />
                <TextInput
                  label="Gênero"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite o gênero da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.genus}
                  onChangeText={(text) =>
                    setFormDataFruit({ ...formDataFruit, genus: text })
                  }
                />
                <TextInput
                  label="Colheita"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite a colheita da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.colheita}
                  onChangeText={(text) =>
                    setFormDataFruit({ ...formDataFruit, colheita: text })
                  }
                />
                <TextInput
                  label="Período de colheita"
                  mode="outlined"
                  theme={customTheme}
                  className="w-full"
                  placeholder="Digite o período de colheita da fruta"
                  selectionColor="#4ade80"
                  cursorColor="#4ade80"
                  underlineColor="#4ade80"
                  activeUnderlineColor="#4ade80"
                  activeOutlineColor="#4ade80"
                  placeholderTextColor="#d1d5db"
                  textColor="black"
                  value={formDataFruit.colheita_period}
                  onChangeText={(text) =>
                    setFormDataFruit({
                      ...formDataFruit,
                      colheita_period: text,
                    })
                  }
                />
                <View className="flex-row flex-wrap">
                  <View className="p-1 w-1/2">
                    <TextInput
                      label="Calorias"
                      mode="outlined"
                      theme={customTheme}
                      placeholder="Digite as calorias da fruta"
                      selectionColor="#4ade80"
                      cursorColor="#4ade80"
                      underlineColor="#4ade80"
                      activeUnderlineColor="#4ade80"
                      activeOutlineColor="#4ade80"
                      placeholderTextColor="#d1d5db"
                      textColor="black"
                      value={formDataFruit.nutritions.calories}
                      onChangeText={(text) =>
                        setFormDataFruit({
                          ...formDataFruit,
                          nutritions: {
                            ...formDataFruit.nutritions,
                            calories: text,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="p-1 w-1/2">
                    <TextInput
                      label="Gordura"
                      mode="outlined"
                      theme={customTheme}
                      placeholder="Digite a gordura da fruta"
                      selectionColor="#4ade80"
                      cursorColor="#4ade80"
                      underlineColor="#4ade80"
                      activeUnderlineColor="#4ade80"
                      activeOutlineColor="#4ade80"
                      placeholderTextColor="#d1d5db"
                      textColor="black"
                      value={formDataFruit.nutritions.fat}
                      onChangeText={(text) =>
                        setFormDataFruit({
                          ...formDataFruit,
                          nutritions: {
                            ...formDataFruit.nutritions,
                            fat: text,
                          },
                        })
                      }
                    />
                  </View>

                  <View className="p-1 w-1/2">
                    <TextInput
                      label="Açúcar"
                      mode="outlined"
                      theme={customTheme}
                      placeholder="Digite o açúcar da fruta"
                      selectionColor="#4ade80"
                      cursorColor="#4ade80"
                      underlineColor="#4ade80"
                      activeUnderlineColor="#4ade80"
                      activeOutlineColor="#4ade80"
                      placeholderTextColor="#d1d5db"
                      textColor="black"
                      value={formDataFruit.nutritions.sugar}
                      onChangeText={(text) =>
                        setFormDataFruit({
                          ...formDataFruit,
                          nutritions: {
                            ...formDataFruit.nutritions,
                            sugar: text,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="p-1 w-1/2">
                    <TextInput
                      label="Carboidratos"
                      mode="outlined"
                      theme={customTheme}
                      placeholder="Digite os carboidratos da fruta"
                      selectionColor="#4ade80"
                      cursorColor="#4ade80"
                      underlineColor="#4ade80"
                      activeUnderlineColor="#4ade80"
                      activeOutlineColor="#4ade80"
                      placeholderTextColor="#d1d5db"
                      textColor="black"
                      value={formDataFruit.nutritions.carbohydrates}
                      onChangeText={(text) =>
                        setFormDataFruit({
                          ...formDataFruit,
                          nutritions: {
                            ...formDataFruit.nutritions,
                            carbohydrates: text,
                          },
                        })
                      }
                    />
                  </View>
                  <View className="p-1 w-1/2">
                    <TextInput
                      label="Proteínas"
                      mode="outlined"
                      theme={customTheme}
                      placeholder="Digite as proteínas da fruta"
                      selectionColor="#4ade80"
                      cursorColor="#4ade80"
                      underlineColor="#4ade80"
                      activeUnderlineColor="#4ade80"
                      activeOutlineColor="#4ade80"
                      placeholderTextColor="#d1d5db"
                      textColor="black"
                      value={formDataFruit.nutritions.protein}
                      onChangeText={(text) =>
                        setFormDataFruit({
                          ...formDataFruit,
                          nutritions: {
                            ...formDataFruit.nutritions,
                            protein: text,
                          },
                        })
                      }
                    />
                  </View>
                </View>
                {/* botao de cadastrar */}
                <TouchableOpacity
                  disabled={!formDataFruit.name}
                  className="bg-green-400 py-3 rounded-lg mt-4"
                  onPress={() => {
                    handleSubmit();
                    showModal();
                  }}
                >
                  <Text className="text-white text-center text-base font-semibold">
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                className={`border rounded-lg p-2 border-gray-300 ${
                  view === "location" ? "" : "hidden"
                }`}
              >
                <View className="">
                  <TextInput
                    label="Digite o nome da fruta"
                    value={query1}
                    onChangeText={handleInputChange}
                    mode="outlined"
                    theme={customTheme}
                    className="w-full"
                    selectionColor="#4ade80"
                    cursorColor="#4ade80"
                    underlineColor="#4ade80"
                    activeUnderlineColor="#4ade80"
                    activeOutlineColor="#4ade80"
                    placeholderTextColor="#d1d5db"
                    textColor="black"
                  />
                  <FlatList
                    data={filteredFruits}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="border-b border-gray-300 py-4 px-2 bg-white"
                        onPress={() => handleSelectItem(item)}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <MapView
                    className="my-4 h-96 w-full"
                    showsUserLocation={true}
                    region={region}
                    onPress={handleMapPress}
                  >
                    {/* se tiver algo na query */}
                    {query1 && (
                      <Marker
                        coordinate={location}
                        image={{
                          uri: `https://raw.githubusercontent.com/MMARAGAO/amaf/main/assets/markers/${query1}.png`,
                        }}
                      />
                    )}
                  </MapView>
                  <TouchableOpacity
                    onPress={() => {
                      handleAddLocation();
                      showModal();
                    }}
                    disabled={!query1}
                    className={`py-3 my-2  rounded-md ${
                      !query1 ? "bg-gray-300" : "bg-green-400"
                    }`}
                  >
                    <Text className="text-white text-center font-semibold text-base">
                      Salvar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}
