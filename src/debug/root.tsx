import React, { useEffect } from "react";
import './index.css';
import { RootModel } from "@/models/root";
import { View } from ".";
import { Link } from "./common";
import { useModel } from "./use-model";
import { DemoView } from "./demo";

export function RootView(props: {
    model: RootModel
}) {
    const { child } = useModel(props.model);
    
    useEffect(() => {
        // props.model.start();
    }, [])

    return <View 
        model={props.model}
        state={
            <>
                <Link model={props.model} action="startGame" />
                <Link model={props.model} action="quitGame" />
                <Link model={props.model} action="save" />
            </>
        }
        child={
            <DemoView model={child?.demo} />
        }
    />
}
