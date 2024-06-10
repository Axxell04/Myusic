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
    //     localURI: sfsdf/sdfsdf/sdfsdf
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

    const check = async (localURI) => {
        const infoFile = await FileSystem.getInfoAsync(localURI);

        if (infoFile.exists) {
            return true;
        } else {
            return false;
        }
    }

    const download = async (remoteURI, localURI) => {
        const dirName = localURI.split("/").reverse()[1]
        const infoDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "musics/" + dirName)

        if (!infoDir.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "musics/" + dirName)
        }

        if (await check(localURI) === false) {
            const response = await FileSystem.downloadAsync(remoteURI, localURI);
            console.log("Descargado");
        }

    };

    const remove = async (localURI) => {
        const response = await FileSystem.deleteAsync(localURI);
        console.log("Eliminado");
    };


    //Método para añadir un nuevo archivo
    useEffect(() => {
        if (fileToAdd) {
            const remoteURI = `http://${ipServer}:8000/download/${fileToAdd.id}`;

            download(remoteURI, fileToAdd.localURI);
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