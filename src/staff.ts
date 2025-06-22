import { GenderType } from "@/common";
import { DebugService, EventAgent, Model, Event, StateAgent, StoreService, TranxService } from "set-piece";
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

@StoreService.is('staff')
export class StaffModel extends Model<
    IngSocModel | StaffModel,
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
            }
        })
    }

    public get name() {
        return this.state.name;
    }

    @DebugService.log()
    public apply() {
        this.event.onApply(this);
    }

    @EventAgent.use((model) => model.proxy.child.subordinates.event.onApply)
    private handleApply(model: StaffModel, event: StaffModel) {
        this.event.onApply(event);
    }


    @DebugService.log()
    public income(value: number): number {
        console.log('prev', this.state.asset)
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
        console.log('next', this.state.asset)
        return value;
    }


    @DebugService.log()
    public promote() {
        console.log(this.draft.state.salary, this.state.salary)
        const promotion = new PromotionModel();
        this.draft.child.features.push(promotion);
        console.log(this.draft.state.salary, this.state.salary)
        console.log([...this.child.features])
    }

    
    @DebugService.log()
    public demote() {
        const features = this.draft.child.features;
        const index = features.findIndex((feature) => feature instanceof PromotionModel);
        if (index === -1) return;
        features.splice(index, 1);
    }

    @StateAgent.use((model) => model.proxy.decor)
    private checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            salary: state.salary + this.state._salary,
        }
    }

    @StateAgent.use((model) => model.proxy.child.subordinates.decor)
    private _checkSalary(model: StaffModel, state: DeepReadonly<StaffModel.State>) {
        return {
            ...state,
            _salary: this.state._salary,
        }
    }

    @EventAgent.use((model) => model.proxy.event.onStateChange)
    private handleStateChange(model: StaffModel, event: Event.OnStateChange<StaffModel>) {
        const prev = event.prev._salary;
        const next = event.next._salary;
        if (prev !== next) {
            this.reload();
        }
    }

    @DebugService.log((model) => model.name)
    @TranxService.use()
    public hello(staff: StaffModel) {
        this.draft.refer.friends?.push(staff);
        console.log('friends', this.refer.friends?.map(item => item.name))
        return [...this.draft.refer.friends ?? []]
    }

    @DebugService.log()
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