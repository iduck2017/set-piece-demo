import { StaffModel } from "@/staff";
import { Model } from "set-piece";

export abstract class FeatureModel<
    P extends StaffModel = StaffModel,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<P, E, S, C, R> {}