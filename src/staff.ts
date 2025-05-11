import { DebugService, EventAgent, Model, StateAgent } from "set-piece";
import { RootModel } from "./root";
import { GenderType } from "./common";

export namespace StaffDefine {
    export type E = { onHello: number }
    export type S1 = { name: string, level: number }
    export type S2 = { age: number, gender: GenderType }
    export type P = StaffModel | RootModel
    export type C1 = { vice?: StaffModel }
    export type C2 = StaffModel
    export type R1 = { spouse: StaffModel }
    export type R2 = { friends: StaffModel[], family: StaffModel[] }
}

export class StaffModel extends Model<
    StaffDefine.E,
    StaffDefine.S1,
    StaffDefine.S2,
    StaffDefine.P,
    StaffDefine.C1,
    StaffDefine.C2,
    StaffDefine.R1,
    StaffDefine.R2
> {
    constructor(props: Model.Props<StaffModel>) {
        super({
            ...props,
            state: { 
                name: "john doe", 
                level: 1, 
                age: 18,
                gender: GenderType.MALE,
                ...props.state
            },
            child: {
                ...props.child,
            }
        })
    }

    public get root() {
        let parent: Model | undefined = this;
        while (!(parent instanceof RootModel)) {
            if (!parent) return;
            parent = parent.parent;
        }
        return parent;
    }
    

    @StateAgent.use(model => model.root?.proxy.decor.count)
    public checkCount(target: RootModel, state: number) {
        return state + 1;
    }

    @EventAgent.use(model => model.root?.proxy.event.onPing)
    public handlePing(target: RootModel, event: string) {
        console.log('pong', event);
    }

    @DebugService.log()
    public recruit() {
        const staff = new StaffModel({});
        this.draft.child.push(staff);
        console.log('count:', this.root?.state.count);
        console.log('size:', this.child.length);
        return staff;
    }


    @DebugService.log()
    public dismiss() {
        const staff = this.draft.child.pop();
        console.log('count:', this.root?.state.count);
        console.log('size:', this.child.length);
        return staff;
    }

    @DebugService.log()
    public connect() {
        console.log('refer:', this.refer);
        this.draft.refer.family = [ ...this.child ];
        console.log('refer:', this.refer);
    }
    
}