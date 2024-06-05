import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { mainTheme } from "./Palete";
import { useContext } from "react";
import { IpServerContext, WsConnectContext } from "../providers/ProviderConnection";
import { ModalConnectContext } from "../providers/ProviderModals";


export function SectionConnection() {
    const wsConnected = useContext(WsConnectContext);
    const {ipServer} = useContext(IpServerContext);
    const {setModalConnectIsVisible} = useContext(ModalConnectContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: mainTheme.SECONDARY_COLOR,
            borderWidth: 1,
            borderColor: !wsConnected ? mainTheme.FONT_COLOR2 : "lime", 
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
        },
        status: {
            color: mainTheme.FONT_COLOR,
            fontWeight: "300"
        }
    })
    return (
        <TouchableOpacity style={styles.container} onPress={() => setModalConnectIsVisible(true)}>
            <Text style={styles.status}>{wsConnected ? `Conectado al servidor: ${ipServer}`: "Sin conexión establecida"}</Text>
        </TouchableOpacity>
    )
}
