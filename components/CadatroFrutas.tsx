import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { FruitsContext } from "../context/ContextBdFruit"; // Ajuste o caminho conforme necessário

export default function CadastroFrutas() {
  const fruitNames = useContext(FruitsContext);
  const [query, setQuery] = useState("");
  const [filteredFruits, setFilteredFruits] = useState<string[]>([]);

  const handleInputChange = (text: string) => {
    setQuery(text);
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
    setQuery(item);
    setFilteredFruits([]);
  };

  return (
    <View className="">
      <Text className="my-2 text-base">Cadastro de Frutas</Text>
      <Autocomplete
        className="w-full"
        data={filteredFruits}
        defaultValue={query}
        onChangeText={handleInputChange}
        flatListProps={{
          keyExtractor: (_, idx) => idx.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectItem(item)}
              className="p-2"
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </View>
  );
}
