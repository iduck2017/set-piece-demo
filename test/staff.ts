import { GenderType } from "@/common";
import { EventAgent, Model, StateAgent, TranxService } from "set-piece";
import { IngSocModel } from "./ing-soc";

export namespace StaffDefine {
    export type E = { onWork: StaffModel, onEarn: StaffModel };
    export type S1 = { salary: number; asset: number, _salary: number };
    export type S2 = { name: string; gender: GenderType; }
    export type P = IngSocModel | StaffModel;
    export type C1 = {};
    export type C2 = StaffModel;
    export type R1 = { spouse: StaffModel };
    export type R2 = { friends: StaffModel[], offspring: StaffModel[] };
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
            state: { 
                name: 'John Doe', 
                gender: GenderType.MALE, 
                salary: 3000, 
                asset: 0, 
                ...props?.state, 
                _salary: 0, 
            },
            child: { ...props?.child },
        })
    }

    @TranxService.span()
    public _decreaseAsset(value: number) {
        this.draft.state.asset -= value;
        if (this.draft.state.asset < 0) {
            value = this.draft.state.asset;
            this.draft.state.asset = 0;
        }
        return value;
    }

    @TranxService.span()
    public _increaseAsset(value: number) {
        this.draft.state.asset += value;
    }

    public work() {
        this.event.onWork(this);
    }

    @EventAgent.use((model) => model.proxy.child[0].event.onWork)
    private _handleWork(target: StaffModel, event: StaffModel) {
        this.event.onWork(event);
    }
    
    @StateAgent.use((model) => model.proxy.decor.salary)
    @StateAgent.use((model) => model.proxy.child[0].decor._salary)
    private _checkSalary(target: StaffModel, state: number) {
        return state + this.state._salary;
    }


    public replace(next: StaffModel, prev: StaffModel) {
        for (let index = 0; index < this.draft.child.length; index++) {
            if (this.draft.child[index] === prev) {
                this.draft.child[index] = next;
                return next;
            }
        }
        return undefined;
    }
}