import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { View, TextInput, TouchableOpacity, Text, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapViewCluster from "react-native-map-clustering";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DataContext } from "../context/ContextBD";
import {
  ActivityIndicator,
  Button,
  MD2Colors,
  Modal,
  Portal,
} from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";
interface CombinedData {
  id_localização: number;
  id_fruta: number;
  local: {
    lat: number;
    long: number;
  };
  name: string;
  id: number;
  family: string;
  order: string;
  genus: string;
  colheita: string;
  nutritions: {
    calories: number;
    fat: number;
    sugar: number;
    carbohydrates: number;
    protein: number;
  };
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<CombinedData | null>(null);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const showModal = (data: CombinedData) => {
    setSelectedData(data);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedData(null);
  };

  const dataContext = useContext(DataContext);
  const { fruitData, locationData } = dataContext || {};

  const [data, setData] = useState<CombinedData[]>([]);

  useEffect(() => {
    if (fruitData && locationData) {
      // armazenar as duas listas em uma só lista pelo id e id_fruta
      const combinedData = locationData.map((location) => {
        const fruit = fruitData.find((fruit) => fruit.id === location.id_fruta);
        if (fruit) {
          return { ...location, ...fruit };
        } else {
          console.warn(
            `No fruit found for location id_fruta: ${location.id_fruta}`
          );
          return location;
        }
      });
      setData(combinedData as CombinedData[]);
    }
  }, [fruitData, locationData]);

  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef<MapView>(null); // Cria uma referência para o MapView

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    };

    requestLocationPermission();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchQuery,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLoading(false);

        setRegion((prevRegion) => {
          const newRegion = {
            ...prevRegion,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            longitudeDelta: 0.01,
            latitudeDelta: 0.01,
          };
          return newRegion;
        });
      } else {
      }
    } catch (error) {
      setLoading(false);
    }
  }, [searchQuery]);

  const goToUserLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01, // Zoom para uma visão mais próxima
          longitudeDelta: 0.01,
        },
        1000 // Duração da animação em milissegundos
      );
    }
  }, [userLocation]);

  const [markerSelected, setMarkerSelected] = useState<CombinedData | null>(
    null
  );

  const goToFruitLocation = useCallback(() => {
    if (markerSelected) {
      const { lat, long } = markerSelected.local;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
      Linking.openURL(googleMapsUrl);
    }
  }, [markerSelected]);

  if (!userLocation) {
    return <ActivityIndicator animating={true} color={MD2Colors.green500} />;
  }

  return (
    <View className="flex-1">
      {loading && (
        <View className="flex-1 w-full absolute bg-white/50 z-50 top-0 bottom-0 justify-center items-center">
          <ActivityIndicator animating={true} color={MD2Colors.green500} />
        </View>
      )}

      <View className="flex-row absolute top-10 z-20 bg-white left-5 right-5 rounded-full py-2 px-4 opacity-80 ">
        <TextInput
          className="w-[90%]"
          placeholder="Pesquisar"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="w-10 bg-gray-100 rounded-full h-10 justify-center items-center shadow"
        >
          <AntDesign name="search1" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="absolute z-20 bottom-28 right-5 space-y-4">
        {markerSelected && (
          <TouchableOpacity
            onPress={() => showModal(markerSelected)}
            className="  bg-[#34D399] rounded-full p-3 "
          >
            <Entypo name="info" size={24} color="white" />
          </TouchableOpacity>
        )}
        {markerSelected && (
          <TouchableOpacity
            onPress={goToFruitLocation}
            className="  bg-[#34D399] rounded-full p-3 "
          >
            <MaterialIcons name="route" size={24} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={goToUserLocation}
          className=" bg-[#34D399] rounded-full p-3"
        >
          <FontAwesome5 name="location-arrow" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <MapViewCluster
        onPanDrag={() => setMarkerSelected(null)}
        ref={mapRef} // Atribui a referência ao MapView
        className="w-[110%] h-[110%]"
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        radius={50}
        showsCompass={false}
        showsMyLocationButton={false}
        region={region}
      >
        {data.map((data) => (
          <Marker
            key={data.id_fruta}
            coordinate={{
              latitude: data.local.lat,
              longitude: data.local.long,
            }}
            image={{
              uri: `https://raw.githubusercontent.com/MMARAGAO/amaf/main/assets/markers/${data.name}.png`,
            }}
            onPress={() => {
              setMarkerSelected(data as CombinedData);
            }}
            anchor={{ x: 0.5, y: 0.7 }}
          />
        ))}
      </MapViewCluster>
      <View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{ padding: 20 }}
          >
            <View className="bg-white p-4 rounded-lg">
              {selectedData && (
                <View className="space-y-1">
                  <View className="w-full h-72 bg-gray-100 my-2 justify-center items-center">
                    <Text className="text-white font-semibold">
                      {selectedData.id_localização}
                    </Text>
                  </View>

                  <Text className="text-base">
                    Nome:
                    <Text className="font-semibold text-base">
                      {selectedData.name}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Família:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.family}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Ordem:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.order}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Gênero:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.genus}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Calorias:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.nutritions.calories}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Gordura:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.nutritions.fat}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Açúcar:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.nutritions.sugar}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Carboidratos:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.nutritions.carbohydrates}
                    </Text>
                  </Text>
                  <Text className="text-base">
                    Proteína:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.nutritions.protein}
                    </Text>
                  </Text>
                  <Text className="text-base mb-2">
                    Colheita:{" "}
                    <Text className="font-semibold text-base">
                      {selectedData.colheita}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={hideModal}
                    className="bg-[#34D399] p-2 rounded-lg "
                  >
                    <Text className="text-white text-center text-white font-semibold">
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>
        </Portal>
      </View>
    </View>
  );
}
