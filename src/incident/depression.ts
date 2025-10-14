import { DebugUtil, Decor, StateUtil } from "set-piece";
import { StaffDecor, StaffModel } from "../staff";
import { IncidentModel } from ".";
import { DeepReadonly } from "utility-types";

export namespace DepressionModel {
    export type E = {};
    export type S = { readonly level: number};
    export type C = {};
    export type R = {};
}

export class DepressionModel extends IncidentModel<
    DepressionModel.E,
    DepressionModel.S,
    DepressionModel.C,
    DepressionModel.R
> {
    constructor(props?: DepressionModel['props']) {
        super({
            uuid: props?.uuid,
            state: { level: props?.state?.level ?? 1 },
            child: {},
            refer: {},  
        })
    }

    @StateUtil.on(self => self.modifySalary)
    private listenSalary() {
        return this.route.ingsoc?.proxy.any(StaffModel).decor
    }
    
    private modifySalary(model: StaffModel, state: StaffDecor) {
        state.origin.salary -= 10;
    }
}
