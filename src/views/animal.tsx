import React from "react";
import { AnimalModel, DogModel } from "@/models/animal";
import { View, Link, useModel, State } from "set-piece";
import { SwimView, BreedView } from "./feature";

export function AnimalView(props: {
    model?: AnimalModel
}) {
    const { child } = useModel(props.model);
    
    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.growup} />
                <State model={props.model} />
            </>
        }
        child={
            <>
                <SwimView model={child?.swim} />
                <BreedView model={child?.breed} />
                <View model={child?.fly} isFold />
            </>
        }
    />
}

export function DogState(props: {
    model?: DogModel
}) {
    return <>
        <Link model={props.model} method={props.model?.playGame} />
    </>
}
