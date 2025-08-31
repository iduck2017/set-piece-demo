import { DebugUtil, Decor, LogLevel, Model, StateUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { StaffModel, StaffProps } from "../staff";
import { DeepReadonly } from "utility-types";

export class PromotionModel extends FeatureModel {
    constructor(props: PromotionModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: {},
            refer: {},
        })
    }

    @StateUtil.on(model => model.route.staff?.proxy.decor)
    @DebugUtil.log(LogLevel.WARN)
    private checkSalary(model: StaffModel, state: Decor<StaffProps.S>) {
        state.current.salary += 10;
    }

}
