import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";
import { Model } from "set-piece";

export namespace FeatureModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
    export type Route = {
        staff: StaffModel;
        ingsoc: IngSocModel;
    }
}

export abstract class FeatureModel<
    P extends Partial<FeatureModel.Route> & Model.Route = {},
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<
    P & FeatureModel.Route, 
    E, 
    S, 
    C, 
    R
> {}