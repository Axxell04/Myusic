import { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from "react-native";
import { ModalYTContext } from "../providers/ProviderModals";
import WebView from "react-native-webview";
import { YTURLContext, YTURLIsValidContext } from "../providers/ProviderYT";
import Icon from "react-native-vector-icons/AntDesign";
import { mainTheme } from "../components/Palete";

export function ModalYT() {
  const { modalYTIsVisible } = useContext(ModalYTContext);
  const { setYTURL } = useContext(YTURLContext);
  const { setYTURLIsValid } = useContext(YTURLIsValidContext);
  const [webViewURI, setWebViewURI] = useState("https://www.youtube.com");
  const [webViewState, setWebViewState] = useState({});

  // const webViewReff = useRef(new WebView()).current;
  // webViewReff.state
  const webViewRef = useRef(null);

  function updateYTURL(e) {
    setWebViewState(e)
    const url = e.url;
    setWebViewURI(url);
    //console.log(e);
    if (url.includes("/watch?") || url.includes("/playlist?")) {
      //console.log("URL Válido");
      if (modalYTIsVisible) {
        setYTURL(url);
        setYTURLIsValid(true);
      }
    } else {
      setYTURLIsValid(false);
    }
  }

  function reload() {
    //console.log(webViewRef.current.state);
    webViewRef.current.reload();
  }

  function goBack() {
    if (webViewState?.canGoBack) {
      webViewRef.current.goBack();
    }
  }

  function goForward() {
    if (webViewState?.canGoForward) {
      webViewRef.current.goForward();
    }
  }

  useEffect(() => {
    if (!modalYTIsVisible) {
      webViewRef.current.reload();
      //console.log("Cerrando ModalYT")
    }
  }, [modalYTIsVisible]);

  const styles = StyleSheet.create({
    container: {
      display: modalYTIsVisible ? "flex" : "none",
      width: "100%",
      height: "100dvh",

      flex: 1,
    },
    webView: {
      flex: 1,
      display: modalYTIsVisible ? "flex" : "none",
    },
    navBar: {
      flexDirection: "row",
      gap: 5,
      padding: 7,
      maxWidth: "100%",
    },
    btnsNavBar: {
      padding: 7,
      borderWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",

    },
    urlInput: {
      textAlign: "center",
      color: mainTheme.FONT_COLOR2,
      borderWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      borderRadius: 20,
      padding: 5,
      overflow: "scroll",
      maxWidth: "100%",
    },
    iconGoBack: {
      color: webViewState?.canGoBack ? mainTheme.FONT_COLOR : mainTheme.FONT_COLOR2
    },
    iconGoForward: {
      color: webViewState?.canGoForward ? mainTheme.FONT_COLOR : mainTheme.FONT_COLOR2
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <View style={{flex: 2, borderRadius: 20, alignItems: "center", justifyContent: "center", overflow: "scroll" }}>
          <TextInput style={styles.urlInput} value={webViewURI} />
        </View>

        <View style={{gap: 3, flexDirection: "row", flex: 1}}>
          <TouchableOpacity style={styles.btnsNavBar} onPress={reload}>
            <Icon name="reload1" size={25} color={mainTheme.FONT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnsNavBar, styles.btnGoBack]} onPress={goBack}>
            <Icon style={styles.iconGoBack} name="arrowleft" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnsNavBar, styles.btnGoForward]} onPress={goForward}>
            <Icon style={styles.iconGoForward} name="arrowright" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{ uri: webViewURI }}
        onNavigationStateChange={(e) => updateYTURL(e)}
        injectedJavaScriptObject={{}}
      />
    </View>
  );
}
