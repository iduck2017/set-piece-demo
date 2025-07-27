import { Model, StateUtil } from "set-piece";
import { IncidentModel } from ".";
import { IngSocModel } from "../ing-soc";
import { StaffModel } from "../staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class CorruptionModel extends IncidentModel<
    CorruptionModel.Event,
    CorruptionModel.State,
    CorruptionModel.Child,
    CorruptionModel.Refer
> {
    constructor(props?: CorruptionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniplenty.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minitrue.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniluv.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minipax.decor)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            salary: state.salary + 100,
        }
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.decor)
    private checkAsset(model: IngSocModel, state: IngSocModel.State) {
        return {
            ...state,
            asset: state.asset - 20000,
        }
    }
}
