import { DebugUtil, Decor, Method, Loader, LogLevel, Model, StateUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { StaffDecor, StaffModel, StaffProps } from "../staff";
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
                route: {}
            }
        })
    }

    @StateUtil.on(model => model.route.staff?.proxy.decor)
    private onCheck(model: StaffModel, state: StaffDecor) {
        state.draft.salary += 10;
    }
}
