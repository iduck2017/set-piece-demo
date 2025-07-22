import { Model, StateUtil } from "set-piece";
import { FeatureModel } from ".";
import { StaffModel } from "@/staff";
import { DeepReadonly } from "utility-types";
import { IngSocModel } from "@/ing-soc";

export class PromotionModel extends FeatureModel {
    constructor(props?: PromotionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {},
            child: { ...props?.child },
            refer: { ...props?.refer },
            route: {
                staff: [1, StaffModel],
                ingsoc: [2, IngSocModel]
            }
        })
    }

    @StateUtil.on(model => model.route.staff?.proxy.decor)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        console.log('promote', state.salary)
        return {
            ...state,
            salary: state.salary + 10,
        }
    }

}
