import { StaffModel } from "@/staff";
import { Define, Model } from "set-piece";

export namespace FeatureGroupDefine {
    export type P = never;
    export type E = {};
    export type S1 = {};
    export type S2 = {};
    export type C1 = {};
    export type C2 = FeatureModel;
    export type R1 = {};
    export type R2 = {};
}

export class FeatureGroupModel extends Model<
    FeatureGroupDefine.P,
    FeatureGroupDefine.E,
    FeatureGroupDefine.S1,
    FeatureGroupDefine.S2,
    FeatureGroupDefine.C1,
    FeatureGroupDefine.C2,
    FeatureGroupDefine.R1,
    FeatureGroupDefine.R2
> {
    constructor(props?: Model.Props<FeatureGroupModel>) {
        super({
            ...props,
            state: { ...props?.state },
            child: { ...props?.child }
        })
    }

    append(feature: FeatureModel) {
        this.draft.child.push(feature);
    }

    remove(feature: FeatureModel) {
        const index = this.draft.child.indexOf(feature);
        if (index === -1) return;
        this.draft.child.splice(index, 1);
    }
}

export namespace FeatureDefine {
    export type P = FeatureGroupModel;
}

export abstract class FeatureModel<
    P extends FeatureDefine.P = FeatureDefine.P,
    E extends Define.E = {},
    S1 extends Define.S1 = {},
    S2 extends Define.S2 = {},
    C1 extends Define.C1 = {},
    C2 extends Define.C2 = Define.C2,
    R1 extends Define.R1 = {},
    R2 extends Define.R2 = {}
> extends Model<FeatureDefine.P, E, S1, S2, C1, C2, R1, R2> {

    public get self(): StaffModel | undefined {
        return this.parent?.parent;
    }
    
}