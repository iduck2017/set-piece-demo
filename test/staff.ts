import { GenderType } from "@/common";
import { Model } from "set-piece";
import { IngSocModel } from "./ing-soc";

export namespace StaffDefine {
    export type E = { onWork: void };
    export type S1 = { salary: number; money: number };
    export type S2 = { name: string; gender: GenderType; }
    export type P = IngSocModel | StaffModel;
    export type C1 = {};
    export type C2 = StaffModel;
    export type R1 = { spouse: StaffModel };
    export type R2 = { friends: StaffModel[], family: StaffModel[] };
}

export class StaffModel extends Model<
    StaffDefine.E,
    StaffDefine.S1,
    StaffDefine.S2,
    StaffDefine.P,
    StaffDefine.C1,
    StaffDefine.C2,
    StaffDefine.R1,
    StaffDefine.R2
> {
    constructor(props?: Model.Props<StaffModel>) {
        super({
            ...props,
            state: { name: 'John Doe', gender: GenderType.MALE, salary: 3000, money: 0, ...props?.state },
            child: { ...props?.child },
        })
    }

    public _alterMoney(value: number) {
        this.draft.state.money += value;
        if (this.draft.state.money < 0) {
            value = -this.draft.state.money;
            this.draft.state.money = 0;
        }
        return value;
    }
    
    public work() {
        this.event.onWork();
    }
}