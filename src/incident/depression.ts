import { IngSocModel } from "@/ing-soc";
import { Model, StateAgent } from "set-piece";
import { StaffModel } from "@/staff";
import { IncidentModel } from ".";
import { DeepReadonly } from "utility-types";

export namespace DepressionModel {
    export type Event = {};
    export type State = { readonly level: number};
    export type Child = {};
    export type Refer = {};
}

export class DepressionModel extends IncidentModel<
    IngSocModel,
    DepressionModel.Event,
    DepressionModel.State,
    DepressionModel.Child,
    DepressionModel.Refer
> {
    constructor(props?: DepressionModel['props']) {
        super({
            uuid: props?.uuid,
            state: { level: 1, ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer }
        })
    }
    
    @StateAgent.use((model) => model.route.parent?.proxy.child.miniplenty.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minitrue.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minipax.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.miniluv.decor)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            _salary: state._salary - 10,
        }
    }

}
