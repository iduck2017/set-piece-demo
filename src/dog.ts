import { Model } from "set-piece";
import { AnimalModel } from "./animal";
import { FeatureModel } from "./feature";
import { PetModel } from "./pet";
import { StaffModel } from "./staff";
import { EmotionType } from "./common";

export namespace DogDefine {
    export type E = { onCatch: void };
    export type S1 = {};
    export type S2 = { id: string };
    export type P = AnimalModel
    export type C1 = {
        swim: FeatureModel;
        hunt: FeatureModel;
    };
    export type C2 = DogModel
    export type R1 = {};
    export type R2 = { family: StaffModel[] };
}

export class DogModel extends PetModel<
    DogDefine.E,
    DogDefine.S1,
    DogDefine.S2,
    DogDefine.P,
    DogDefine.C1,
    DogDefine.C2,
    DogDefine.R1,
    DogDefine.R2
> {
    test() {
        const swim: FeatureModel = this.child.swim;
        const id: string = this.state.id;
        const family: StaffModel | undefined = this.refer.family?.[0];
        const emotion: EmotionType = this.state.emotion
    }

    constructor(props: Model.Props<DogModel>) {
        super({
            ...props,
            state: {
                id: '',
                ...props.state
            },
            child: {
                swim: new FeatureModel({}),
                hunt: new FeatureModel({}),
                ...props.child,
            }
        })
    }
}