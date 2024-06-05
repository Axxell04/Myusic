import { createContext, useContext, useState } from "react";
import { ManagerWSContext } from "./ProviderConnection";

export const ModalCreatePlsContext = createContext(null);
export const ModalRemovePlsContext = createContext(null);
export const ModalAddMusicContext = createContext(null);
export const ModalAddMusicToPlsContext = createContext(null);
export const ModalRemoveMusicToPlsContext = createContext(null);
export const ModalConnectContext = createContext(null);

export function ProviderModals({ children }) {
  const [modalCreatePlsIsVisible, setModalCreatePlsIsVisible] = useState(false);
  const [modalRemovePlsIsVisible, setModalRemovePlsIsVisible] = useState(false);
  const [modalAddMusicIsVisible, setModalAddMusicIsVisible] = useState(false);
  const [modalAddMusicToPlsIsVisible, setModalAddMusicToPlsIsVisible] =
    useState(false);
  const [modalRemoveMusicToPlsIsVisible, setModalRemoveMusicToPlsIsVisible] =
    useState(false);
  const [modalConnectIsVisible, setModalConnectIsVisible] = useState(false);

  const managerWs = useContext(ManagerWSContext);
  managerWs.setSetterModalConnectIsVisible(setModalConnectIsVisible);

  return (
    <ModalCreatePlsContext.Provider
      value={{ modalCreatePlsIsVisible, setModalCreatePlsIsVisible }}
    >
      <ModalRemovePlsContext.Provider
        value={{ modalRemovePlsIsVisible, setModalRemovePlsIsVisible }}
      >
        <ModalAddMusicContext.Provider
          value={{ modalAddMusicIsVisible, setModalAddMusicIsVisible }}
        >
          <ModalAddMusicToPlsContext.Provider
            value={{
              modalAddMusicToPlsIsVisible,
              setModalAddMusicToPlsIsVisible,
            }}
          >
            <ModalRemoveMusicToPlsContext.Provider
              value={{
                modalRemoveMusicToPlsIsVisible,
                setModalRemoveMusicToPlsIsVisible,
              }}
            >
              <ModalConnectContext.Provider
                value={{ modalConnectIsVisible, setModalConnectIsVisible }}
              >
                {children}
              </ModalConnectContext.Provider>
            </ModalRemoveMusicToPlsContext.Provider>
          </ModalAddMusicToPlsContext.Provider>
        </ModalAddMusicContext.Provider>
      </ModalRemovePlsContext.Provider>
    </ModalCreatePlsContext.Provider>
  );
}
