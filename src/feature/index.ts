import { StaffModel } from "@/staff";
import { Model } from "set-piece";

export namespace FeatureDefine {
    export type P = StaffModel;
}

export abstract class FeatureModel<
    P extends FeatureDefine.P = FeatureDefine.P,
    E extends Record<string, any> = {},
    S1 extends Record<string, any> = {},
    S2 extends Record<string, any> = {},
    C1 extends Record<string, Model> = {},
    C2 extends Record<string, Model> = {},
    R1 extends Record<string, Model> = {},
    R2 extends Record<string, Model> = {}
> extends Model<P, E, S1, S2, C1, C2, R1, R2> {
}