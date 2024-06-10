import { useContext, useEffect } from "react";
import { ListLocalMusicsContext, ListLocalPlsContext, UpdateListLocalMusicsContext, UpdateListLocalPlsContext } from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import { RequestStateContext } from "../providers/ProviderModels";
import { RequestModel } from "../models/RequestModel";


export function ManagerLists () {
    //LOCAL LIST
    const {listLocalPls, setListLocalPls} = useContext(ListLocalPlsContext);
    const {listLocalMusics, setListLocalMusics} = useContext(ListLocalMusicsContext);

    //PLS SELECTED
    const {plsSelected, setPlsSelected} = useContext(PlsSelectedContext);

    //FUNCTIONS UPDATED
    const {updateListLocalPls, setUpdateListLocalPls} = useContext(UpdateListLocalPlsContext);
    const {updateListLocalMusics, setUpdateListLocalMusics} = useContext(UpdateListLocalMusicsContext);
    
    //REQUEST
    const {requestState, setRequestState} = useContext(RequestStateContext);

    useEffect(() => {
        if (updateListLocalPls) {
            setRequestState(new RequestModel("getSyncPls"));
            setUpdateListLocalPls(false);
        }
    }, [updateListLocalPls])

    useEffect(() => {
        if (updateListLocalMusics) {
            setRequestState(new RequestModel("getSyncMusicToPls"));
            setUpdateListLocalMusics(false);
        }
    }, [updateListLocalMusics])

    return <></>;
}