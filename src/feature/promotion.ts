import { DebugUtil, Decor, Method, Model, StateUtil, TemplUtil } from "set-piece";
import { StaffDecor, StaffModel } from "../staff";
import { DeepReadonly } from "utility-types";
import { FeatureModel } from ".";

@TemplUtil.is('promotion')
export class PromotionModel extends FeatureModel {
    constructor(props?: PromotionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: {},
            refer: {},
        })
    }

    @StateUtil.on(self => self.modifySalary)
    private listenSalary() {
        return this.route.staff?.proxy.decor
    }

    private modifySalary(model: StaffModel, decor: StaffDecor) {
        console.log('promotion onCompute', decor.origin.salary)
        decor.origin.salary += 10;
        console.log(decor.origin.salary);
    }
}
