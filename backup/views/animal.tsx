import React from "react";
import { AnimalModel, DogModel } from "@/models/animal";
import { View, Link, useModel, State } from "set-piece";
import { SwimView, BreedView, FlyView, DiseaseView } from "./feature";

export function DogView(props: {
    model?: DogModel
}) {
    return <>
        <Link model={props.model} method={props.model?.playGame} args={[]} />
    </>
}

export function AnimalView(props: {
    model?: AnimalModel
}) {
    const { child } = useModel(props.model);
    return <View 
        model={props.model} 
        state={
            <>
                {props.model instanceof DogModel && <DogView model={props.model} />}
                <Link model={props.model} method={props.model?.growup} args={[]} />
                <Link model={props.model} method={props.model?.sick} args={[]} />
                <State model={props.model} />
            </>
        }
        child={
            <>
                <FlyView model={child?.fly} />
                <SwimView model={child?.swim} />
                <BreedView model={child?.breed} />
                <DiseaseView model={child?.disease} />
            </>
        }
    />
}

export function DogState(props: {
    model?: DogModel
}) {
    return <>
        <Link model={props.model} method={props.model?.playGame} args={[]} />
    </>
}
