import { GenderType } from "./types";
import { Model, Event, StoreUtil, DebugUtil, EventUtil, StateUtil, TranxUtil, LogLevel, Loader, Decor } from "set-piece";
import { FeatureModel } from "./feature";
import { PromotionModel } from "./feature/promotion";
import { IngSocModel } from "./ing-soc";

export namespace StaffProps {
    export type E = { 
        onWork: Event, 
        onEarn: Event 
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
    export type P = {
        ingSoc: IngSocModel
    };
    export type R = { 
        spouse?: StaffModel 
        friends: StaffModel[]
    };
}

export class StaffDecor extends Decor<
    StaffProps.S
> {
    public draft: Pick<StaffProps.S, 'salary' | 'asset'>;
    constructor(model: StaffModel) {
        super(model);
        this.draft = this.detail;
    }
}

@StateUtil.use(StaffDecor)
@StoreUtil.is('staff')
export class StaffModel extends Model<
    StaffProps.E,
    StaffProps.S,
    StaffProps.C,
    StaffProps.R,
    StaffProps.P
> {
    declare public draft;

    constructor(loader?: Loader<StaffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    name: props.state?.name ?? 'John Doe', 
                    gender: props.state?.gender ?? GenderType.MALE, 
                    salary: props.state?.salary ?? 10, 
                    asset: props.state?.asset ?? 0, 
                    value: props.state?.value ?? 0,
                    location: props.state?.location ?? { x: 0, y: 0 },
                    tags: props.state?.tags ?? [],
                },
                child: { 
                    features: props.child?.features ?? [],
                    subordinates: props.child?.subordinates ?? [],
                },
                refer: {
                    friends: props.refer?.friends ?? [],
                },
                route: {
                    ingSoc: IngSocModel.prototype,
                }
            }
        })
    }

    public get name() {
        return this.state.name;
    }

    @DebugUtil.log()
    public work() {
        this.event.onWork(new Event({}));
    }

    @DebugUtil.log()
    public income(value: number): number {
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
        return value;
    }


    @DebugUtil.log()
    public promote() {
        const promotion = new PromotionModel();
        this.draft.child.features.push(promotion);
    }

    
    @DebugUtil.log()
    public demote() {
        const features = this.draft.child.features;
        const index = features.findIndex((feature) => feature instanceof PromotionModel);
        if (index === -1) return;
        features.splice(index, 1);
    }

    @DebugUtil.log()
    @TranxUtil.span()
    public hello(staff: StaffModel) {
        this.draft.refer.friends?.push(staff);
        return [...this.draft.refer.friends ?? []]
    }

    @DebugUtil.log()
    public remove(staff: StaffModel) {
        const index = this.child.subordinates.indexOf(staff);
        if (index === -1) return undefined;
        this.draft.child.subordinates.splice(index, 1);
        return staff;
    }

    private _pace: number = 0;
    public get pace() {
        return this._pace;
    }

}