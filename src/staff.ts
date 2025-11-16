import { GenderType } from "./types";
import { FeatureModel } from "./feature";
import { PromotionModel } from "./feature/promotion";
import { IngSocModel } from "./ing-soc";
import { DebugUtil, Decor, Model, TemplUtil, TranxUtil } from "set-piece";

export namespace StaffModel {
    export type E = { 
        onWork: {}, 
        onEarn: {} 
    };
    export type S = { 
        salary: number; 
        asset: number;  
        name: string; 
        value: number;
        gender: GenderType; 
        location: { x: number, y: number }
        tags: string[]
    };
    export type C = { 
        subordinates: StaffModel[]
        features: FeatureModel[]
    };
    export type R = { 
        spouse?: StaffModel 
        friends: StaffModel[]
    };
}

export class StaffDecor extends Decor<
    StaffModel.S,
    Pick<StaffModel.S, 'salary' | 'asset'>
> {
    constructor(model: StaffModel) {
        super(model);
    }
}

@TemplUtil.is('staff')
export class StaffModel extends Model<
    StaffModel.E,
    StaffModel.S,
    StaffModel.C,
    StaffModel.R
> {
    declare public origin;

    public get decor(): StaffDecor { return new StaffDecor(this) }

    constructor(props?: StaffModel['props']) {
        super({
            uuid: props?.uuid,
            state: { 
                name: props?.state?.name ?? 'John Doe', 
                gender: props?.state?.gender ?? GenderType.MALE, 
                salary: props?.state?.salary ?? 10, 
                asset: props?.state?.asset ?? 0, 
                value: props?.state?.value ?? 0,
                location: props?.state?.location ?? { x: 0, y: 0 },
                tags: props?.state?.tags ?? [],
            },
            child: { 
                features: props?.child?.features ?? [],
                subordinates: props?.child?.subordinates ?? [],
            },
            refer: {
                friends: props?.refer?.friends ?? [],
            },
        })
    }

    public get name() {
        return this.state.name;
    }

    @DebugUtil.span()
    public work() {
        this.event.onWork({});
    }

    @DebugUtil.span()
    public income(value: number): number {
        if (this.origin.state.asset + value < 0) {
            value = -this.origin.state.asset;
        }
        console.log('income', value)
        this.origin.state.asset += value;
        return value;
    }


    @DebugUtil.span()
    public promote() {
        const promotion = new PromotionModel({});
        this.origin.child.features.push(promotion);
    }

    
    @DebugUtil.span()
    public demote() {
        const features = this.origin.child.features;
        const index = features.findIndex((item) => item instanceof PromotionModel);
        if (index === -1) return;
        features.splice(index, 1);
    }

    @DebugUtil.span()
    @TranxUtil.span()
    public hello(staff: StaffModel) {
        this.origin.refer.friends?.push(staff);
        return [...this.origin.refer.friends ?? []]
    }

    @DebugUtil.span()
    public remove(staff: StaffModel) {
        const index = this.child.subordinates.indexOf(staff);
        if (index === -1) return undefined;
        this.origin.child.subordinates.splice(index, 1);
        return staff;
    }

    private _pace: number = 0;
    public get pace() {
        return this._pace;
    }

}