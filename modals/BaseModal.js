import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { mainTheme } from "../components/Palete";
import Icon from "react-native-vector-icons/AntDesign";
import { useEffect, useState } from "react";
// import ModalDropdown from "react-native-modal-dropdown";

const ButtonModel = ({ title, onPress, primary, secondary }) => {
  buttonStyles = [
    styles.button,
    primary ? styles.buttonPrimary : null,
    secondary ? styles.buttonSecondary : null,
  ];
  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      <Text style={{ textAlign: "center" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export function BaseModal({
  title,
  textInput,
  primaryButton,
  secondaryButton,
  isVisible,
  setIsVisible,
  children
}) {
  const $isVisible = isVisible;
  const $setIsVisible = setIsVisible;

  return (
    <Modal transparent={true} visible={$isVisible} animationType="fade" onRequestClose={() => $setIsVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          {textInput ? (
            <TextInput placeholder={textInput.placeHolder} style={styles.input} value={textInput.valueTextInput} onChangeText={textInput.setValueTextInput} />
          ) : (
            <></>
          )}
          {children}
          <View style={styles.sectionButtons}>
            {primaryButton ? (
              <ButtonModel
                title={primaryButton.title}
                onPress={primaryButton.onPress}
                primary={true}
              />
            ) : (
              <></>
            )}
            {secondaryButton ? (
              <ButtonModel
                title={secondaryButton.title}
                onPress={secondaryButton.onPress}
                secondary={true}
              />
            ) : (
              <></>
            )}
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonExit]}
            onPress={() => $setIsVisible(false)}
          >
            <Icon name="close" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.6)"
  },
  modalView: {
    backgroundColor: mainTheme.FONT_COLOR,
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    gap: 10,
    elevation: 9,
    shadowColor: "white",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 15,
    shadowOpacity: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },
  buttonExit: {
    backgroundColor: "#fa2a3a",
    padding: 5,
  },
  buttonPrimary: {
    //flex: 1,
    backgroundColor: "#c7f464",
  },
  buttonSecondary: {
    //flex: 1,
    backgroundColor: "#80bca3",
  },
  sectionButtons: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 20,
    width: "100%"
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: "90%",
    textAlign: "center",
  },
});
