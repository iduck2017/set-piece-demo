import { IngSocModel } from "@/ing-soc";
import { Model, Props, StateAgent } from "set-piece";
import { StaffModel } from "@/staff";
import { IncidentModel } from ".";
import { DeepReadonly } from "utility-types";

export namespace DepressionModel {
    export type P = IngSocModel;
    export type E = {};
    export type S = { readonly level: number};
}

export class DepressionModel extends IncidentModel<
    DepressionModel.P,
    DepressionModel.E,
    DepressionModel.S
> {
    constructor(props?: Props<DepressionModel.S, {}, {}>) {
        super({
            ...props,
            state: { level: 1, ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer }
        })
    }
    
    @StateAgent.use((model) => model.route.parent?.proxy.child.miniplenty.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minitrue.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.minipax.decor)
    @StateAgent.use((model) => model.route.parent?.proxy.child.miniluv.decor)
    private checkSalary(target: StaffModel, state: DeepReadonly<StaffModel.S>) {
        return {
            ...state,
            _salary: state._salary - 10,
        }
    }

}
