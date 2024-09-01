import { useContext, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ModalYTContext } from "../providers/ProviderModals";
import WebView from "react-native-webview";
import { YTURLContext, YTURLIsValidContext } from "../providers/ProviderYT";

export function ModalYT() {
  const { modalYTIsVisible } = useContext(ModalYTContext);
  const {setYTURL} = useContext(YTURLContext);
  const {setYTURLIsValid} = useContext(YTURLIsValidContext);

  // const webViewReff = useRef(new WebView()).current;
  // webViewReff.setState({})
  const webViewRef = useRef(null);
  
  function updateYTURL (e) {
    const url = e.url;
    if (url.includes("/watch?") || url.includes("/playlist?")) {
      console.log("URL Válido")
      if (modalYTIsVisible) {
        setYTURL(url);
        setYTURLIsValid(true);
      }
    } else {
      setYTURLIsValid(false);
    }
  }
  
  useEffect(() => {
    if (!modalYTIsVisible) {
      console.log("Cerrando ModalYT")
      webViewRef.current.reload()
    }
  }, [modalYTIsVisible])

  const styles = StyleSheet.create({
      container: {
          display: modalYTIsVisible ? "flex" : "none",
          width: "100%",
          height: "100dvh",
          
          flex: 1
        },
        webView: {
          flex: 1,
          display: modalYTIsVisible ? "flex" : "none",
      }
  })

  return (
    <View style={styles.container}>
      <WebView ref={webViewRef} style={styles.webView} source={{uri: "https://www.youtube.com"}} onNavigationStateChange={(e)=> updateYTURL(e)} injectedJavaScriptObject={{}} />
    </View>
  )
}

