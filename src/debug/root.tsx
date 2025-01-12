import React, { useEffect } from "react";
import { RootModel } from "@/models/root";
import { View, Link, useModel } from "set-piece";
import { AnimalView } from "./animal";

export function RootView(props: {
    model: RootModel
}) {
    const { child } = useModel(props.model);
    
    useEffect(() => {
        props.model.spawnDog();
    }, [])

    return <View 
        model={props.model}
        state={
            <>
                <Link model={props.model} action="spawnDog" />
                <Link model={props.model} action="removeDog" />
                <Link model={props.model} action="saveDog" />
                <Link model={props.model} action="countup" />
            </>
        }
        child={
            <AnimalView model={child?.dog} />
        }
    />
}
