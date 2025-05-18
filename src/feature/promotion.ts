import { Model, StateAgent } from "set-piece";
import { FeatureDefine, FeatureModel } from ".";
import { StaffModel } from "@/staff";

export class PromotionModel extends FeatureModel {
    constructor(props?: Model.Props<PromotionModel>) {
        super({
            ...props,
            state: { ...props?.state },
            child: { ...props?.child }
        })
    }

    @StateAgent.use(model => model.self?.proxy.decor.salary)
    private _checkSalary(target: StaffModel, state: number) {
        return state + 1;
    }

}
