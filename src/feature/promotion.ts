import { Model, Props, StateAgent } from "set-piece";
import { FeatureModel } from ".";
import { StaffModel } from "@/staff";
import { DeepReadonly } from "utility-types";

export class PromotionModel extends FeatureModel {
    constructor(props?: Props) {
        super({
            ...props,
            state: {},
            child: { ...props?.child },
            refer: { ...props?.refer }
        })
    }

    @StateAgent.use(model => model.route.parent?.proxy.decor)
    private checkSalary(target: StaffModel, state: DeepReadonly<StaffModel.State>) {
        console.log('promote', state.salary)
        return {
            ...state,
            salary: state.salary + 10,
        }
    }

}
