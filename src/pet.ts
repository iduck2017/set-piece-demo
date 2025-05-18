import { Define, Model, StateAgent, StrictProps } from "set-piece";
import { AnimalDefine, AnimalModel } from "./animal";
import { StaffModel } from "./staff";
import { EmotionType, GenderType } from "./common";

export namespace PetDefine {
    export type P = StaffModel;
    export type E = { onPlay: void };
    export type S1 = { price: number };
    export type S2 = { name: string, isRare: boolean };
    export type C1 = {}
    export type C2 = PetModel
    export type R1 = { }
    export type R2 = { friends: PetModel, spouse: PetModel, offspring: PetModel }
}

export class PetModel extends AnimalModel<
    PetDefine.P,
    PetDefine.E,
    PetDefine.S1,
    PetDefine.S2,
    PetDefine.C1,
    PetDefine.C2,
    PetDefine.R1,
    PetDefine.R2
> {
    test() {
        const price: number = this.state.price;
        const name: string = this.state.name;
        const friends: readonly PetModel[] | undefined = this.refer.friends;
        const parent: StaffModel | undefined = this.parent;
        const emotion: EmotionType = this.state.emotion;
        const child: PetModel | undefined = this.child[0];
        const gender: GenderType = this.state.gender;
        this.refer.spouse
    }

    @StateAgent.use(model => model.proxy.decor.price)
    checkPrice(target: PetModel, price: number) {
        if (this.state.isRare) return price + 100;
        return price
    }

    constructor(props: Model.Props<PetModel>) {
        super({
            ...props,
            state: {
                name: '',
                isRare: false,
                price: 0,
                ...props.state,
            },
            child: { ...props.child }
        })
    }

}