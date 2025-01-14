import React, { useEffect } from "react";
import { RootModel } from "@/models/root";
import { View, Link, useModel } from "set-piece";
import { AnimalView } from "./animal";

export function RootView(props: {
    model: RootModel
}) {
    const { child } = useModel(props.model);
    
    useEffect(() => {
        props.model.startGame();
    }, [])

    return <View 
        model={props.model}
        state={
            <>
                <Link model={props.model} action="startGame" />
                <Link model={props.model} action="quitGame" />
                <Link model={props.model} action="save" />
                <Link model={props.model} action="countup" />
                <div className="link">aaa</div>
            </>
        }
        child={
            <AnimalView model={child?.dog} />
        }
    />
}
