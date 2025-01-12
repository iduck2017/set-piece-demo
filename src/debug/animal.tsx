import React from "react";
import { AnimalModel, DogModel } from "@/models/animal";
import { View, Link, useModel } from "set-piece";
import { BreedModel } from "@/models/features";

export function AnimalView(props: {
    model?: AnimalModel
}) {
    const { state, child } = useModel(props.model);
    
    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} action="growup" />
                {props.model instanceof DogModel && <DogState model={props.model} />}
            </>
        }
        child={
            <>
                <BreedView model={child?.breed} />
                <View model={child?.fly} isFold />
                <View model={child?.swim} isFold />
            </>
        }
    />
}

export function DogState(props: {
    model?: DogModel
}) {
    return <>
        <Link model={props.model} action="playGame" />
    </>
}


export function BreedView(props: {
    model?: BreedModel
}) {
    const { child } = useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} action="spawnChild" />
                <Link model={props.model} action="cloneChild" />
                <Link model={props.model} action="destroyChild" />
            </>
        }
        child={
            child?.map(animal => (
                <AnimalView 
                    model={animal} 
                    key={animal.uuid} 
                />  
            ))
        }
    />
}
