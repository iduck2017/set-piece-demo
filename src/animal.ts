import { Define, EventAgent, Model, StrictProps } from "set-piece";
import { EmotionType, GenderType } from "./common";
import { FeatureModel } from "./feature";

export namespace AnimalDefine {
    export type E = { onEat: AnimalModel }
    export type S1 = { emotion: EmotionType }
    export type S2 = { gender: GenderType, isAlive: boolean }
    export type P = AnimalModel;
    export type C1 = { 
        swim?: FeatureModel,
        fly?: FeatureModel,
        run: FeatureModel,
        hunt?: FeatureModel,
    }
    export type C2 = AnimalModel
    export type R1 = { }
    export type R2 = { mates: AnimalModel[] }
}


export abstract class AnimalModel<
    E extends Define.E & Partial<AnimalDefine.E> = {},
    S1 extends Define.S1 & Partial<AnimalDefine.S1> = {},
    S2 extends Define.S2 & Partial<AnimalDefine.S2> = {},
    P extends AnimalDefine.P = AnimalDefine.P,
    C1 extends Define.C1 & Partial<AnimalDefine.C1> = {},
    C2 extends AnimalDefine.C2 = AnimalDefine.C2,
    R1 extends Define.R1 & Partial<AnimalDefine.R1> = {},
    R2 extends Define.R2 & Partial<AnimalDefine.R2> = {}
> extends Model<
    E & AnimalDefine.E, 
    S1 & AnimalDefine.S1, 
    S2 & AnimalDefine.S2, 
    P,
    C1 & AnimalDefine.C1, 
    C2, 
    R1 & AnimalDefine.R1, 
    R2 & AnimalDefine.R2
> {
    private _test() {
        const gender: GenderType = this.state.gender;
        const emotion: EmotionType = this.state.emotion;
        const swim: FeatureModel | undefined = this.child.swim
        const child: AnimalModel = this.child[0]
        const mates: AnimalModel[] | undefined = this.refer.mates;
        this.event.onEat(this.child[0]);
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
            child: {
                run: new FeatureModel({}),
                ...props.child,
            }
        })
    }
 
    @EventAgent.use(model => {
        const child: Model.Proxy<AnimalModel> = model.proxy.child[0]
        return child.event.onEat
    })
    private handleEat(target: AnimalModel, food: AnimalModel) {
        console.log("eat", target, food);
    }
}


