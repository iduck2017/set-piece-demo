import { Model, Props, StateAgent } from "set-piece";
import { IncidentModel } from ".";
import { IngSocModel } from "../ing-soc";
import { StaffModel } from "@/staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionModel {
    export type P = IngSocModel;
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export class CorruptionModel extends IncidentModel<
    CorruptionModel.P,
    CorruptionModel.E,
    CorruptionModel.S,
    CorruptionModel.C,
    CorruptionModel.R
> {
    constructor(props?: Props) {
        super({
            ...props,
            state: {},
            child: { ...props?.child },
            refer: { ...props?.refer }
        })
    }

    @StateAgent.use((model) => model.route.parent?.proxy.child.miniplenty.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minitrue.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.miniluv.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minipax.decor)
    private checkSalary(target: StaffModel, state: DeepReadonly<StaffModel.S>) {
        return {
            ...state,
            salary: state.salary + 100,
        }
    }

    @StateAgent.use((model) => model.route.parent?.proxy.decor)
    private checkAsset(target: IngSocModel, state: IngSocModel.S) {
        return {
            ...state,
            asset: state.asset - 20000,
        }
    }

}
