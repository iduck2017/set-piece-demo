import React, { useEffect } from "react";
import { RootModel } from "@/models/root";
import { View, Link, useModel, State } from "set-piece";
import { AnimalView } from "./animal";

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
                <Link model={props.model} method={props.model?.start} args={[]} />
                <Link model={props.model} method={props.model?.quit} args={[]} />
                <Link model={props.model} method={props.model?.save} args={[]} />
                <Link model={props.model} method={props.model?.countup} args={[]} />
                <State model={props.model} />
            </>
        }
        child={
            <AnimalView model={child?.dog} />
        }
    />
}
