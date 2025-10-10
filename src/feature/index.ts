import { DemoModel } from "../demo";
import { StaffModel } from "../staff";
import { Model } from "set-piece";

export namespace FeatureModel {
    export type E = {};
    export type S = { isActive: boolean; };
    export type C = {};
    export type R = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends Model<
    E & FeatureModel.E, 
    S & FeatureModel.S, 
    C & FeatureModel.C,
    R & FeatureModel.R
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            staff: route.list.find(item => item instanceof StaffModel)
        }
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined,
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}

