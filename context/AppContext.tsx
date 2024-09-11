import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface para o estado do contexto
interface AppContextState {
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
}

// Valor padrão do contexto
const defaultState: AppContextState = {
  isFirstVisit: true,
  setIsFirstVisit: () => {},
};

// Criação do contexto
const AppContext = createContext<AppContextState>(defaultState);

// Provedor do contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  useEffect(() => {
    // Carregar o estado do armazenamento local quando o componente for montado
    const loadIsFirstVisit = async () => {
      try {
        const value = await AsyncStorage.getItem("isFirstVisit");
        if (value !== null) {
          setIsFirstVisit(JSON.parse(value));
        }
      } catch (error) {
        console.error(
          "Erro ao carregar isFirstVisit do armazenamento local",
          error
        );
      }
    };

    loadIsFirstVisit();
  }, []);

  useEffect(() => {
    // Atualizar o armazenamento local sempre que isFirstVisit mudar
    const saveIsFirstVisit = async () => {
      try {
        await AsyncStorage.setItem(
          "isFirstVisit",
          JSON.stringify(isFirstVisit)
        );
      } catch (error) {
        console.error(
          "Erro ao salvar isFirstVisit no armazenamento local",
          error
        );
      }
    };

    saveIsFirstVisit();
  }, [isFirstVisit]);

  return (
    <AppContext.Provider value={{ isFirstVisit, setIsFirstVisit }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useAppContext = () => useContext(AppContext);
