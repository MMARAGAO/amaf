import { createContext, useEffect, useState, ReactNode } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../ConfigFireBase";

// Definindo o tipo do contexto
type FruitsContextType = string[];

const FruitsContext = createContext<FruitsContextType>([]);

const FruitsProvider = ({ children }: { children: ReactNode }) => {
  const [fruitNames, setFruitNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFruitNames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fruits"));
        const names: string[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          names.push(doc.data().name);
        });
        setFruitNames(names);
      } catch (error) {
        console.error("Erro ao buscar os nomes das frutas: ", error);
      }
    };

    fetchFruitNames();
  }, []);

  return (
    <FruitsContext.Provider value={fruitNames}>
      {children}
    </FruitsContext.Provider>
  );
};

export { FruitsProvider, FruitsContext };
