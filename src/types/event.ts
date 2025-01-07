import { Model } from "../models"
import { Value } from "./base"

export class Event<E = any> {
    constructor(public readonly target: Model) {}
}

export type EventOnChildUpdate<
    S extends Record<string, Value>,
    C extends Record<string, Model> | Model[]
> = Event<{ 
    target: Model<S, {}, C>
    childPrev: Readonly<C>
    childNext: Readonly<C>
}>

export type EventOnStateUpdate<
    S extends Record<string, Value>,
> = Event<{ 
    target: Model<S>, 
    statePrev: Readonly<S>,
    stateNext: Readonly<S>
}>

export type EventOnStateCompute<
    S extends Record<string, Value>,
> = Event<{ 
    target: Model<S>, 
    stateNext: S 
}>