import { ToastAndroid } from "react-native";

export default class WS {
  constructor(setWsConnected) {
    this.ipServer = null;
    this.setWsConnected = setWsConnected;
    this.ws = null;

    this.listMusics = [];
    this.setterListMusics = null;
    this.listPls = [];
    this.setterListPls = null;
    this.idListTrack = -1;

    this.setterListTrack = null;

    this.setterDownloadInProcess = null;

    this.setterModalConnectIsVisible = null;

    this.setterState = null;
  }

  setIpServer(ip) {
    this.ipServer = ip;
  }
  setSetterModalConnectIsVisible(setter) {
    this.setterModalConnectIsVisible = setter;
  }
  setSetterDownloadInProcess(setter) {
    this.setterDownloadInProcess = setter;
  }
  updateIdListTrack(id) {
    this.idListTrack = id;
  }
  updateListMusics(list) {
    this.listMusics = list;
  }
  updateListPls(list) {
    this.listPls = list;
  }
  setSetterListTrack(setter) {
    this.setterListTrack = setter;
  }
  setSetterListMusics(setter) {
    this.setterListMusics = setter;
  }
  setSetterListPls(setter) {
    this.setterListPls = setter;
  }

  connect() {
    if (this.ipServer && this.setWsConnected) {
      try {
        this.ws = new WebSocket(`ws://${this.ipServer}:8000/`);
        this.ws.onopen = (e) => {
          this.setterModalConnectIsVisible(false);
          ToastAndroid.show("Conexión establecida", ToastAndroid.SHORT);
          console.log("Conexión establecida");
          console.log(this.ws);
          this.setWsConnected(true);
          this.initRequest();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.received(data);
        };

        this.ws.onerror = (e) => {
          ToastAndroid.show(e.type, ToastAndroid.SHORT);
          console.log("Error ocurrido: " + e.type);
          console.log(this.ws);
          this.setWsConnected(false);
        };

        this.ws.onclose = (e) => {
          ToastAndroid.show(e.reason, ToastAndroid.SHORT);
          console.log("Conexión cerrada: " + e.reason);
          console.log(this.ws);
          this.setWsConnected(false);
        };
      } catch (error) {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      }
    }
  }

  received(data) {
    const command_received = data.command_received;
    const message = data.message;
    const response = data.response;
    console.log(`${command_received} || ${message}`);
    if (command_received === "get_musics" && message === "Success") {
      if (this.setterState) {
        this.setterState(response);
        this.setterState = null;
      } else {
        this.setterListMusics(response);
      }
      // console.log(data.response);
    } else if (command_received === "get_playlists" && message === "Success") {
      this.setterListPls([this.listPls[0], ...response]);
    } else if (command_received === "download") {
      if (message === "Success") {
        this.initRequest();
        ToastAndroid.show("Descarga finalizada", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }

      this.setterDownloadInProcess(false);
    } else if (command_received === "add_musics_to_playlist") {
      if (message === "Success") {
        // this.initRequest();
        ToastAndroid.show("Playlist actualizada", ToastAndroid.SHORT);
        this.setterListMusics(response.pls_updated);
        if (response.id === this.idListTrack) {
          this.setterListTrack(response.pls_updated)
        }
      } else {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    } else if (command_received === "get_musics_of_playlist") {
      if (message === "Success") {
        this.setterListMusics(response);
      } else {
        this.setterListMusics([]);
      }
    } else if (command_received === "remove_music_of_playlist") {
      if (message === "Success") {
        // this.initRequest();
        ToastAndroid.show("Playlist actualizada", ToastAndroid.SHORT);
        // console.log(response);
        this.setterListMusics(response.pls_updated);
        if (response.id === this.idListTrack) {
          this.setterListTrack(response.pls_updated)
        }
      } else {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    } else if (command_received === "create_playlist") {
      if (message === "Success") {
        this.send("get_playlists", { all: true });
        ToastAndroid.show("Playlist creada", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    } else if (command_received === "delete_playlist") {
      if (message === "Success") {
        this.initRequest();
        ToastAndroid.show("Playlist eliminada", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    }
  }

  send(command, content, setterState = null) {
    this.setterState = setterState;
    console.log("Try Metod Send");
    console.log(this.ws);
    if (this.ws) {
      console.log("Try Success");
      this.ws.send(
        JSON.stringify({
          command: command,
          content: content,
        })
      );
    } else {
      this.setWsConnected(false);
      this.setterDownloadInProcess(false);
    }
  }

  initRequest() {
    this.send("get_playlists", { all: true });
    this.send("get_musics", { all: true });
  }
}
