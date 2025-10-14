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
    @StateUtil.on(self => self.modifySalary)
    public listenSalary() { return this.route.ingsoc?.proxy.child.miniplenty.decor }
    @StateUtil.on(self => self.modifySalary)
    public listenSalary2() { return this.route.ingsoc?.proxy.child.minitrue.decor }
    @StateUtil.on(self => self.modifySalary)
    public listenSalary3() { return this.route.ingsoc?.proxy.child.miniluv.decor }
    @StateUtil.on(self => self.modifySalary)
    public listenSalary4() { return this.route.ingsoc?.proxy.child.minipax.decor }

    private modifySalary(model: StaffModel, state: StaffDecor) {
        state.origin.salary += 100;
        state.origin.asset += 10000;
    }

    // asset
    @StateUtil.on(self => self.modifyAsset)
    public listenAsset() {
        return this.route.ingsoc?.proxy.decor
    }
    private modifyAsset(model: IngSocModel, state: IngSocDecor) {
        state.origin.asset -= 40000;
    }
}
