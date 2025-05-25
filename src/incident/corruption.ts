import { StaffModel } from "../staff";
import { EventAgent, Model, OnChildChange, OnStateChange, StateAgent } from "set-piece";
import { IngSocModel } from "../ing-soc";
import { IncidentDefine, IncidentModel } from ".";

export namespace CorruptionDefine {
    export type P = IncidentDefine.P;
    export type E = {};
    export type S1 = {};
    export type S2 = {};
}

export class CorruptionModel extends IncidentModel<
    CorruptionDefine.P,
    CorruptionDefine.E,
    CorruptionDefine.S1,
    CorruptionDefine.S2
> {
    constructor(props?: Model.Props<CorruptionModel>) {
        super({
            ...props,
            state: {},
            child: {}
        })
    }

    @StateAgent.use((model) => model.parent?.proxy.child.miniplenty.decor.salary)
    @StateAgent.use((model) => model.parent?.proxy.child.minitrue.decor.salary)
    @StateAgent.use((model) => model.parent?.proxy.child.miniluv.decor.salary)
    @StateAgent.use((model) => model.parent?.proxy.child.minipax.decor.salary)
    private _checkSalary(target: StaffModel, state: number) {
        return state + 100;
    }

    @StateAgent.use((model) => model.parent?.proxy.decor.asset)
    private _checkAsset(target: IngSocModel, state: number) {
        return state -= 20_000;
    }

    @EventAgent.use((model) => model.parent?.proxy.event.onChildChange)
    private _handleChildChange(target: IngSocModel, event: OnChildChange<IngSocModel>) {
        if (event.prev.minipax !== event.next.minipax) {
            this.reload();
        }
    }


}
