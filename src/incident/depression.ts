import { DebugUtil, Decor, Loader, StateUtil } from "set-piece";
import { StaffModel, StaffProps } from "../staff";
import { IncidentModel } from ".";
import { DeepReadonly } from "utility-types";

export namespace DepressionProps {
    export type E = {};
    export type S = { readonly level: number};
    export type C = {};
    export type P = {};
    export type R = {};
}

export class DepressionModel extends IncidentModel<
    DepressionProps.E,
    DepressionProps.S,
    DepressionProps.C,
    DepressionProps.P,
    DepressionProps.R
> {
    constructor(loader?: Loader<DepressionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { level: props.state?.level ?? 1 },
                child: {},
                refer: {},
                route: {}
            }
        })
    }
    
    @StateUtil.on((model) => model.route.ingsoc?.proxy.all(StaffModel).decor)
    private onSalaryCheck(model: StaffModel, state: Decor<StaffProps.S>) {
        state.draft.salary -= 10;
    }
}
