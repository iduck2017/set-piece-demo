import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";
import { Define, Model } from "set-piece";

export namespace IncidentGroupDefine {
    export type P = IngSocModel;
    export type E = {};
    export type S1 = {};
    export type S2 = {};
    export type C1 = {};
    export type C2 = IncidentModel;
    export type R1 = {};
    export type R2 = {};
}

export class IncidentGroupModel extends Model<
    IncidentGroupDefine.P,
    IncidentGroupDefine.E,
    IncidentGroupDefine.S1,
    IncidentGroupDefine.S2,
    IncidentGroupDefine.C1,
    IncidentGroupDefine.C2,
    IncidentGroupDefine.R1,
    IncidentGroupDefine.R2
> {
    constructor(props?: Model.Props<IncidentGroupModel>) {
        super({
            ...props,
            state: { ...props?.state },
            child: { ...props?.child }
        })
    }


    append(incident: IncidentModel) {
        this.draft.child.push(incident);
    }

    remove(incident: IncidentModel) {
        const index = this.draft.child.indexOf(incident);
        if (index === -1) return;
        this.draft.child.splice(index, 1);
    }

    

}


export namespace IncidentDefine {
    export type P = IncidentGroupModel;
}

export class IncidentModel<
    P extends IncidentDefine.P = IncidentDefine.P,
    E extends Define.E = {},
    S1 extends Define.S1 = {},
    S2 extends Define.S2 = {},
    C1 extends Define.C1 = {},
    C2 extends Define.C2 = Define.C2,
    R1 extends Define.R1 = {},
    R2 extends Define.R2 = {}
> extends Model<IncidentDefine.P, E, S1, S2, C1, C2, R1, R2> {
    
    public get root(): IngSocModel | undefined {
        return this.parent?.parent;
    }
}
