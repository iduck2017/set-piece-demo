import React from "react";
import './index.css';
import { RootModel } from "@/models/root";
import { View } from ".";
import { Link } from "./common";
import { useModel } from "./use-model";
import { DemoModel } from "@/models/demo";
import { AnimalView } from "./animal";

export function DemoView(props: {
    model?: DemoModel
}) {
    const { child } = useModel(props.model);

    return <View 
        model={props.model}
        state={
            <Link model={props.model} action="count" />
        }
        child={
            <>
                <AnimalView model={child?.dog} />
                <AnimalView model={child?.duck} />
            </>
        }
    />
}
