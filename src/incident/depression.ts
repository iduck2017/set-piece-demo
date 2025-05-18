import { IngSocModel } from "@/ing-soc";
import { Model, StateAgent } from "set-piece";
import { StaffModel } from "@/staff";
import { IncidentDefine, IncidentModel } from ".";

export namespace DepressionDefine {
    export type P = IncidentDefine.P;
    export type E = {};
    export type S1 = {};
    export type S2 = { readonly level: number};
}

export class DepressionModel extends IncidentModel<
    DepressionDefine.P,
    DepressionDefine.E,
    DepressionDefine.S1,
    DepressionDefine.S2
> {
    constructor(props?: Model.Props<DepressionModel>) {
        super({
            ...props,
            state: { level: 1 },
            child: {}
        })
    }
    
    @StateAgent.use((model) => model.root?.proxy.child.miniplenty.decor._salary)
    @StateAgent.use((model) => model.root?.proxy.child.minitrue.decor._salary)
    @StateAgent.use((model) => model.root?.proxy.child.minipax.decor._salary)
    @StateAgent.use((model) => model.root?.proxy.child.miniluv.decor._salary)
    private _checkSalary(target: StaffModel, state: number) {
        return state - this.state.level;
    }


}
