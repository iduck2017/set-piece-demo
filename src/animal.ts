import { Define, EventAgent, Model, StrictProps } from "set-piece";
import { EmotionType, GenderType } from "./common";
import { StaffModel } from "./staff";

export namespace AnimalDefine {
    export type P = Model;
    export type E = { onEat: void }
    export type S1 = { emotion: EmotionType }
    export type S2 = { gender: GenderType, isAlive: boolean }
    export type C1 = {}
    export type C2 = Model
    export type R1 = {}
    export type R2 = { spouse: AnimalModel, offspring: AnimalModel }
}

export abstract class AnimalModel<
    P extends AnimalDefine.P = AnimalDefine.P,
    E extends Define.E & Partial<AnimalDefine.E> = {},
    S1 extends Define.S1 & Partial<AnimalDefine.S1> = {},
    S2 extends Define.S2 & Partial<AnimalDefine.S2> = {},
    C1 extends Define.C1 & Partial<AnimalDefine.C1> = {},
    C2 extends AnimalDefine.C2 = AnimalDefine.C2,
    R1 extends Define.R1 & Partial<AnimalDefine.R1> = {},
    R2 extends Define.R2 & AnimalDefine.R2 = AnimalDefine.R2
> extends Model<
    P,
    E & AnimalDefine.E, 
    S1 & AnimalDefine.S1, 
    S2 & AnimalDefine.S2, 
    C1 & AnimalDefine.C1, 
    C2, 
    R1 & AnimalDefine.R1, 
    R2
> {
    private _test() {
        const gender: GenderType = this.state.gender;
        const emotion: EmotionType = this.state.emotion;
        this.refer.spouse
    }

    constructor(props: 
        StrictProps<S1, S2, C1, C2, R1, R2> & 
        Model.Props<AnimalModel>
    ) {
        super({
            ...props,
            state: {
                emotion: EmotionType.NEUTRAL,
                isAlive: true,
                gender: GenderType.UNKNOWN,
                ...props.state,
            },
            child: { ...props.child }
        })
    }
}


