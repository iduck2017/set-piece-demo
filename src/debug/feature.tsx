import React from "react";
import { BreedModel, SwimModel } from "@/models/features";
import { View, Link, useModel } from "set-piece";
import { AnimalView } from "./animal";

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

export function SwimView(props: {
    model?: SwimModel
}) {
    useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} action="swim" />
                <Link model={props.model} action="land" />
                <Link model={props.model} action="accelerate" />
            </>
        }    
    />
}