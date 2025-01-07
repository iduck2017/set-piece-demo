import React from "react";
import { AnimalModel } from "@/models/animal";
import { View } from ".";
import { Link } from "./common";
import { useModel } from "./use-model";
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


export function BreedView(props: {
    model?: BreedModel
}) {
    const { child } = useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} action="spawnChild" />
            </>
        }
        child={
            child?.map(animal => <AnimalView 
                model={animal} 
                key={animal.uuid} 
            />)
        }
    />
}
