import { DebugUtil, Decor, Loader, LogLevel, Model, StateUtil, StoreUtil } from "set-piece";
import { IncidentModel } from ".";
import { IngSocDecor, IngSocModel, IngSocProps } from "../ing-soc";
import { StaffDecor, StaffModel, StaffProps } from "../staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type P = {};
    export type R = {};
}

@StoreUtil.is('corruption')
export class CorruptionModel extends IncidentModel<
    CorruptionProps.E,
    CorruptionProps.S,
    CorruptionProps.C,
    CorruptionProps.P,
    CorruptionProps.R
> {
    constructor(loader?: Loader<CorruptionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {},
                child: {},
                refer: {},
                route: {}
            }
        })
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniplenty.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minitrue.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.miniluv.decor)
    @StateUtil.on((model) => model.route.ingsoc?.proxy.child.minipax.decor)
    private onSalaryCheck(model: StaffModel, state: StaffDecor) {
        state.draft.salary += 100;
        state.draft.asset += 10000;
    }

    @StateUtil.on((model) => model.route.ingsoc?.proxy.decor)
    private onAssetCheck(model: IngSocModel, state: IngSocDecor) {
        state.draft.asset -= 40000;
    }
}
