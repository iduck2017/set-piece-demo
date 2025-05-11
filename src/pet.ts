import { Define, Model, StateAgent, StrictProps } from "set-piece";
import { AnimalDefine, AnimalModel } from "./animal";
import { StaffModel } from "./staff";
import { FeatureModel } from "./feature";
import { EmotionType, GenderType } from "./common";

export namespace PetDefine {
    export type E = { onPlay: void };
    export type S1 = { price: number };
    export type S2 = { name: string, isRare: boolean };
    export type P = AnimalModel;
    export type C1 = {
        tame: FeatureModel
    }
    export type C2 = PetModel
    export type R1 = { owner: StaffModel }
    export type R2 = { friends: PetModel[] }
}

export abstract class PetModel<
    E extends Define.E &  Partial<PetDefine.E> = {},
    S1 extends Define.S1 & Partial<PetDefine.S1> = {},
    S2 extends Define.S2 & Partial<PetDefine.S2> = {},
    P extends PetDefine.P = PetDefine.P,
    C1 extends Define.C1 & Partial<PetDefine.C1> = {},
    C2 extends PetDefine.C2 = PetDefine.C2,
    R1 extends Define.R1 & Partial<PetDefine.R1> = {},
    R2 extends Define.R2 & Partial<PetDefine.R2> = {}
> extends AnimalModel<
    E & PetDefine.E,
    S1 & PetDefine.S1,
    S2 & PetDefine.S2,
    P,
    C1 & PetDefine.C1,
    C2,
    R1 & PetDefine.R1,
    R2 & PetDefine.R2
> {
    test() {
        const price: number = this.state.price;
        const name: string = this.state.name;
        const tame: FeatureModel = this.child.tame;
        const owner: StaffModel | undefined = this.refer.owner;
        const friends: PetModel[] | undefined = this.refer.friends;
        const parent: AnimalModel | undefined = this.parent;
        const emotion: EmotionType = this.state.emotion;
        const child: PetModel = this.child[0];
        const gender: GenderType = this.state.gender;
        const swim: FeatureModel | undefined = this.child.swim;
    }

    @StateAgent.use(model => model.proxy.decor.price)
    checkPrice(target: PetModel, price: number) {
        if (this.state.isRare) return price + 100;
        return price
    }

    constructor(props: 
        StrictProps<S1, S2, C1, C2, R1, R2> & 
        Model.Props<PetModel>
    ) {
        super({
            ...props,
            state: {
                name: '',
                isRare: false,
                price: 0,
                ...props.state,
            },
            child: {
                tame: new FeatureModel({}),               
                ...props.child,
            }
        })
    }

}