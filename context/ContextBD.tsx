import { createContext, useEffect, useState, ReactNode } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../ConfigFireBase";

interface DataProviderProps {
  children: ReactNode;
}

interface Fruit {
  name: String;
  id: Number;
  family: String;
  order: String;
  genus: String;
  colheita: String;
  nutritions: {
    calories: Number;
    fat: Number;
    sugar: Number;
    carbohydrates: Number;
    protein: Number;
  };
}

interface Location {
  id_localização: Number;
  id_fruta: Number;
  id_img: Number;
  local: {
    long: Number;
    lat: Number;
  };
}

interface DataContextType {
  fruitData: Fruit[];
  locationData: Location[];
  fetchData: () => void; // Adicionar fetchData ao contexto
}

const DataContext = createContext<DataContextType | null>(null);

const DataProvider = ({ children }: DataProviderProps) => {
  const [fruitData, setFruitData] = useState<Fruit[]>([]);
  const [locationData, setLocationData] = useState<Location[]>([]);

  const fetchData = async () => {
    const fruitSnapshot = await getDocs(collection(db, "fruits"));
    const locationSnapshot = await getDocs(collection(db, "locations"));

    const fruitList = fruitSnapshot.docs.map((doc) => doc.data() as Fruit);
    const locationList = locationSnapshot.docs.map(
      (doc) => doc.data() as Location
    );

    setFruitData(fruitList);
    setLocationData(locationList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ fruitData, locationData, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
