import React from "react";
import { BreedModel, DiseaseModel, FlyModel, SwimModel } from "@/models/features";
import { View, Link, useModel, State } from "set-piece";
import { AnimalView } from "./animal";
import { func } from "joi";

export function BreedView(props: {
    model?: BreedModel
}) {
    const { child } = useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.spawnChild} args={[]} />
                <Link model={props.model} method={props.model?.cloneChild} args={[]} />
                <Link model={props.model} method={props.model?.disposeChild} args={[]} />
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
                <Link model={props.model} method={props.model?.swim} args={[]} />
                <Link model={props.model} method={props.model?.land} args={[]} />
                <Link model={props.model} method={props.model?.accelerate} args={[]} />
                <State model={props.model} />
            </>
        }    
    />
}

export function FlyView(props: {
    model?: FlyModel
}) {
    useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.ascend} args={[]} />
                <Link model={props.model} method={props.model?.land} args={[]} />
                <Link model={props.model} method={props.model?.fly} args={[]} />
                <Link model={props.model} method={props.model?.accelerate} args={[]} />
                <Link model={props.model} method={props.model?.enable} args={[]} />
                <Link model={props.model} method={props.model?.disable} args={[]} />
                <State model={props.model} />
            </>
        }
    />
}

export function DiseaseView(props: {
    model?: DiseaseModel
}) {
    useModel(props.model);

    return <View 
        model={props.model} 
        state={
            <>
                <Link model={props.model} method={props.model?.deteriorate} args={[]} />
                <State model={props.model} />
            </>
        }
    />
}