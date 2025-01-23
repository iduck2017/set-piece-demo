import React from "react";
import { BreedModel, SwimModel } from "@/models/features";
import { View, Link, useModel, State } from "set-piece";
import { AnimalView } from "./animal";

export function BreedView(props: {
    model?: BreedModel
}) {
    const { child } = useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.spawnChild} />
                <Link model={props.model} method={props.model?.cloneChild} />
                <Link model={props.model} method={props.model?.destroyChild} />
                <State model={props.model} />
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

export function SwimView(props: {
    model?: SwimModel
}) {
    useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.swim} />
                <Link model={props.model} method={props.model?.land} />
                <Link model={props.model} method={props.model?.accelerate} />
                <State model={props.model} />
            </>
        }    
    />
}