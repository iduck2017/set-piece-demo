import { StaffModel } from "../staff";
import { Model } from "set-piece";

export namespace FeatureModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class FeatureModel<
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<E, S, C, R> {
    public get route() {
        const staff = super.route.parent;
        return {
            ...super.route,
            staff: staff instanceof StaffModel ? staff : undefined,
        }
    }
}