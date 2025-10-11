import { TemplUtil, StateUtil } from "set-piece";
import { IncidentModel } from ".";
import { IngSocDecor, IngSocModel } from "../ing-soc";
import { StaffDecor, StaffModel } from "../staff";
import { DeepReadonly } from "utility-types";

export namespace CorruptionProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type P = {};
    export type R = {};
}

@TemplUtil.is('corruption')
export class CorruptionModel extends IncidentModel<
    CorruptionProps.E,
    CorruptionProps.S,
    CorruptionProps.C,
    CorruptionProps.P
> {
    constructor(props?: CorruptionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: {},
            refer: {},
        })
    }


    // salary
    @StateUtil.on(self => self.onSalaryCompute)
    public loadSalary() { return this.route.ingsoc?.proxy.child.miniplenty.decor }

    @StateUtil.on(self => self.onSalaryCompute)
    public loadSalary2() { return this.route.ingsoc?.proxy.child.minitrue.decor }

    @StateUtil.on(self => self.onSalaryCompute)
    public loadSalary3() { return this.route.ingsoc?.proxy.child.miniluv.decor }

    @StateUtil.on(self => self.onSalaryCompute)
    public loadSalary4() { return this.route.ingsoc?.proxy.child.minipax.decor }
    
    private onSalaryCompute(model: StaffModel, state: StaffDecor) {
        state.origin.salary += 100;
        state.origin.asset += 10000;
    }

    // asset
    @StateUtil.on(self => self.onAssetCompute)
    public loadAsset() {
        return this.route.ingsoc?.proxy.decor
    }

    private onAssetCompute(model: IngSocModel, state: IngSocDecor) {
        state.origin.asset -= 40000;
    }
}
