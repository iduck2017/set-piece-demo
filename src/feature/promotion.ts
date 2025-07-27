import { DebugUtil, LogLevel, Model, StateUtil } from "set-piece";
import { FeatureModel } from ".";
import { StaffModel } from "../staff";
import { DeepReadonly } from "utility-types";

export class PromotionModel extends FeatureModel {
    constructor(props?: PromotionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    @StateUtil.on(model => model.route.staff?.proxy.decor)
    @DebugUtil.log(LogLevel.WARN)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        console.log('promote', state.salary)
        return {
            ...state,
            salary: state.salary + 10,
        }
    }

}
