import { DebugUtil, Decor, Method, Loader, LogLevel, Model, StateUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { StaffModel, StaffProps } from "../staff";
import { DeepReadonly } from "utility-types";

export class PromotionModel extends FeatureModel {
    constructor(loader?: Loader<PromotionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {},
                child: {},
                refer: {},
            }
        })
    }

    @StateUtil.on(model => model.route.staff?.proxy.decor)
    @DebugUtil.log(LogLevel.WARN)
    private onCheck(model: StaffModel, state: Decor<StaffProps.S>) {
        state.current.salary += 10;
    }

}
