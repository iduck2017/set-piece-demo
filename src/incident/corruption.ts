import { Model, Props, StateAgent } from "set-piece";
import { IncidentModel } from ".";
import { IngSocModel } from "../ing-soc";
import { StaffModel } from "@/staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class CorruptionModel extends IncidentModel<
    IngSocModel,
    CorruptionModel.Event,
    CorruptionModel.State,
    CorruptionModel.Child,
    CorruptionModel.Refer
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
    private checkSalary(target: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            salary: state.salary + 100,
        }
    }

    @StateAgent.use((model) => model.route.parent?.proxy.decor)
    private checkAsset(target: IngSocModel, state: IngSocModel.State) {
        return {
            ...state,
            asset: state.asset - 20000,
        }
    }

}
