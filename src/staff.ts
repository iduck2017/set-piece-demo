import { GenderType } from "@/common";
import { DebugService, EventAgent, Model, OnStateChange, StateAgent, TranxService } from "set-piece";
import { IngSocModel } from "./ing-soc";
import { PetModel } from "./pet";
import { PromotionModel } from "./feature/promotion";
import { FeatureModel } from "./feature";

export namespace StaffDefine {
    export type P = IngSocModel | StaffModel;
    export type E = { onWork: StaffModel, onEarn: StaffModel };
    export type S1 = { salary: number; asset: number, _salary: number };
    export type S2 = { name: string; gender: GenderType; }
    export type C1 = { pet?: PetModel };
    export type C2 = { subordinates: StaffModel, features: FeatureModel };
    export type R1 = { spouse: StaffModel };
    export type R2 = { friends: StaffModel, offspring: StaffModel };
}

export class StaffModel extends Model<
    StaffDefine.P,
    StaffDefine.E,
    StaffDefine.S1,
    StaffDefine.S2,
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
            child: { 
                features: [],
                subordinates: [],
                ...props?.child 
            },
        })
    }

    @DebugService.log()
    debug() {
        console.log(this.agent.route.path);
        console.log(this.agent.route.key);
        console.log(this.agent.route.parent)
    }

    // @TranxService.span()
    // public _decreaseAsset(value: number) {
    //     this.draft.state.asset -= value;
    //     if (this.draft.state.asset < 0) {
    //         value = this.draft.state.asset;
    //         this.draft.state.asset = 0;
    //     }
    //     return value;
    // }

    // public get name() {
    //     return this.state.name;
    // }

    // @TranxService.span()
    // public _increaseAsset(value: number) {
    //     this.draft.state.asset += value;
    // }

    // public work() {
    //     this.event.onWork(this);
    // }

    // public promote() {
    //     const promotion = new PromotionModel();
    //     this.draft.child.features.push(promotion);
    // }

    // @EventAgent.use((model) => model.proxy.child.subordinates.event.onWork)
    // private _handleWork(target: StaffModel, event: StaffModel) {
    //     this.event.onWork(event);
    // }
    
    // @StateAgent.use((model) => model.proxy.decor.salary)
    // @StateAgent.use((model) => model.proxy.child.subordinates.decor._salary)
    // private _checkSalary(target: StaffModel, state: number) {
    //     return state + this.state._salary;
    // }

    // @EventAgent.use((model) => model.proxy.event.onStateChange)
    // private _checkSalaryChange(target: StaffModel, event: OnStateChange<StaffModel>) {
    //     if (event.prev._salary !== event.next._salary) {
    //         this.reload()
    //     }
    // }


    // public replace(next: StaffModel, prev: StaffModel) {
    //     for (let index = 0; index < this.draft.child.subordinates.length; index++) {
    //         if (this.draft.child.subordinates[index] === prev) {
    //             this.draft.child.subordinates[index] = next;
    //             return next;
    //         }
    //     }
    //     return undefined;
    // }

   
}