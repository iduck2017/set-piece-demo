import { GenderType } from "./common";
import { Model, Event, StoreUtil, DebugUtil, EventUtil, StateUtil, TranxUtil, LogLevel } from "set-piece";
import { IngSocModel } from "./ing-soc";
import { FeatureModel } from "./feature";
import { PromotionModel } from "./feature/promotion";
import { DeepReadonly } from "utility-types";

export namespace StaffModel {
    export type Event = { 
        onApply: StaffModel, 
        onEarn: StaffModel 
    };
    export type State = { 
        salary: number; 
        readonly _salary: number;
        asset: number;  
        name: string; 
        value: number;
        gender: GenderType; 
        location: { x: number, y: number }
        tags: string[]
    };
    export type Child = { 
        subordinates: StaffModel[]
        features: FeatureModel[]
    };
    export type Refer = { 
        spouse?: StaffModel 
        friends: StaffModel[]
    };
}

@StoreUtil.is('staff')
export class StaffModel extends Model<
    StaffModel.Event,
    StaffModel.State,
    StaffModel.Child,
    StaffModel.Refer
> {
    declare public draft;

    constructor(props: StaffModel['props']) {
        super({
            uuid: props?.uuid,
            state: { 
                name: 'John Doe', 
                gender: GenderType.MALE, 
                salary: 10, 
                asset: 0, 
                value: 0,
                location: { x: 0, y: 0 },
                tags: [],
                ...props?.state, 
                _salary: 0, 
            },
            child: { 
                features: [],
                subordinates: [],
                ...props?.child
            },
            refer: {
                friends: [],
                ...props?.refer
            },
        })
    }

    public get name() {
        return this.state.name;
    }

    @DebugUtil.log()
    public apply() {
        this.event.onApply(this);
    }

    @EventUtil.on((model) => model.proxy.child.subordinates.event.onApply)
    private handleApply(model: StaffModel, event: StaffModel) {
        this.event.onApply(event);
    }


    @DebugUtil.log()
    public income(value: number): number {
        console.log('prev', this.state.asset)
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
        console.log('next', this.state.asset)
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

    @StateUtil.on((model) => model.proxy.decor)
    @DebugUtil.log(LogLevel.WARN)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        console.log(this.state.name, state.salary, this.state._salary)
        return {
            ...state,
            salary: state.salary + this.state._salary,
        }
    }

    @StateUtil.on((model) => model.proxy.child.subordinates.decor)
    private _checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            _salary: this.state._salary,
        }
    }

    @EventUtil.on((model) => model.proxy.event.onStateChange)
    private handleStateChange(model: StaffModel, event: Event.OnStateChange<StaffModel>) {
        const prev = event.prev._salary;
        const next = event.next._salary;
        if (prev !== next) {
            this.reload();
        }
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