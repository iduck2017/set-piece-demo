import { EventAgent, Model, Props } from "set-piece";
import { EmotionType, GenderType } from "./common";
import { StaffModel } from "./staff";

export namespace AnimalDefine {
    export type P = Model;
    export type E = { onEat: void }
    export type S1 = { emotion: EmotionType }
    export type S2 = { gender: GenderType, isAlive: boolean }
    export type C1 = { }
    export type C2 = {}
    export type R1 = {}
    export type R2 = { spouse: AnimalModel, offspring: AnimalModel }
}

export abstract class AnimalModel<
    P extends AnimalDefine.P = AnimalDefine.P,
    E extends Record<string, any> & Partial<AnimalDefine.E> = {},
    S1 extends Record<string, any> & Partial<AnimalDefine.S1> = {},
    S2 extends Record<string, any> & Partial<AnimalDefine.S2> = {},
    C1 extends Record<string, Model> & Partial<AnimalDefine.C1> = {},
    C2 extends Record<string, Model> & Partial<AnimalDefine.C2> = {},
    R1 extends Record<string, Model> & Partial<AnimalDefine.R1> = {},
    R2 extends Record<string, Model> & Partial<AnimalDefine.R2> = {},
> extends Model<P, 
    E & AnimalDefine.E, 
    S1 & AnimalDefine.S1, 
    S2 & AnimalDefine.S2, 
    C1 & AnimalDefine.C1, 
    C2 & AnimalDefine.C2, 
    R1 & AnimalDefine.R1, 
    R2 & AnimalDefine.R2
> {
    
    private _test() {
        const gender: GenderType = this.state.gender;
        const emotion: EmotionType = this.state.emotion;
        this.refer.spouse
        const c: AnimalModel | undefined = this.refer.spouse?.[0]
        const e: AnimalModel[] | Model | undefined = this.refer.offspring
        const d: AnimalModel | undefined = this.refer.offspring?.[0]
        this.event.onEat(undefined)
    }

}


