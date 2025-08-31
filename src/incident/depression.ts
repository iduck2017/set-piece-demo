import { DebugUtil, Decor, StateUtil } from "set-piece";
import { StaffModel, StaffProps } from "../staff";
import { IncidentModel } from ".";
import { DeepReadonly } from "utility-types";

export namespace DepressionProps {
    export type E = {};
    export type S = { readonly level: number};
    export type C = {};
    export type R = {};
}

export class DepressionModel extends IncidentModel<
    DepressionProps.E,
    DepressionProps.S,
    DepressionProps.C,
    DepressionProps.R
> {
    constructor(props: DepressionModel['props']) {
        super({
            uuid: props.uuid,
            state: { level: props.state?.level ?? 1 },
            child: {},
            refer: {},
        })
    }
    
    @StateUtil.on((model) => model.route.ingsoc?.proxy.all(StaffModel).decor)
    private checkSalary(model: StaffModel, state: Decor<StaffProps.S>) {
        state.current.salary -= 10;
    }
}
