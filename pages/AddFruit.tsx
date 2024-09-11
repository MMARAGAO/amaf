import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button, Chip, TextInput } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import CadastroFrutas from "../components/CadatroFrutas";

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
    id_localização: generateNumericId(10),
    id_fruit: "",
    location: {
      latitude: "",
      longitude: "",
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <FlatList
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
                  onPress={() => console.log(formDataFruit)}
                  className="bg-green-400 py-2 rounded-lg mt-4"
                >
                  <Text className="text-white text-center">Cadastrar</Text>
                </TouchableOpacity>
              </View>
              <View
                className={`border rounded-lg p-2 border-gray-300 ${
                  view === "location" ? "" : "hidden"
                }`}
              >
                <CadastroFrutas />
              </View>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}
