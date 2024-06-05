import * as FileSystem from "expo-file-system"
import { useContext, useEffect } from "react";
import { FileToAddContext, FileToRemoveContext } from "../providers/ProviderFiles";
import { IpServerContext } from "../providers/ProviderConnection";

export function ManagerFiles() {
    const {ipServer} = useContext(IpServerContext);
    const {fileToAdd, setFileToAdd} = useContext(FileToAddContext);
    const {fileToRemove, setFileToRemove} = useContext(FileToRemoveContext);

    // const fileToAddd = {
    //     id: 1,
    //     dir: "badbunny",
    //     name: "un coco.mp3"
    // }

    const initManager = async () => {
        const infoDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "musics/");
        if (!infoDir.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "musics/");
        }
    }

    useEffect(() => {
        initManager();
    }, [])

    const download = async (remoteURI, localURI, dirName) => {
        const infoDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "musics/" + dirName)

        if (!infoDir.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "musics/" + dirName)
        }

        const response = await FileSystem.downloadAsync(remoteURI, localURI);
        console.log("Descargado");
    };

    const remove = async (localURI) => {
        const response = await FileSystem.deleteAsync(localURI);
        console.log("Eliminado");
    };

    //Método para añadir un nuevo archivo
    useEffect(() => {
        if (fileToAdd) {
            const remoteURI = `http://${ipServer}:8000/download/${fileToAdd.id}`;
            const localURI = `${FileSystem.documentDirectory}musics/${fileToAdd.dir}/${fileToAdd.name}`;

            download(remoteURI, localURI, fileToAdd.dir);
        };
    }, [fileToAdd]);

    //Método para remover un archive
    useEffect(() => {
        if (fileToRemove) {
            const localURI = `${FileSystem.documentDirectory}musics/${fileToRemove.dir}/${fileToRemove.name}`;

            remove(localURI);

        }
    }, [fileToRemove]);


    return <></>;
}