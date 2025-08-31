import { Decor, Model, StateUtil } from "set-piece";
import { IncidentModel } from ".";
import { IngSocModel, IngSocProps } from "../ing-soc";
import { StaffModel, StaffProps } from "../staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export class CorruptionModel extends IncidentModel<
    CorruptionProps.E,
    CorruptionProps.S,
    CorruptionProps.C,
    CorruptionProps.R
> {
    constructor(props?: CorruptionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: {},
            refer: {},
        })
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniplenty.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minitrue.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniluv.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minipax.decor)
    private checkSalary(model: StaffModel, state: Decor<StaffProps.S>) {
        state.current.salary += 100;
        state.current.asset += 10000;
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.decor)
    private checkAsset(model: IngSocModel, state: Decor<IngSocProps.S>) {
        state.current.asset -= 40000;
    }
}
