import { Model, StateAgent, EventAgent, StoreService, DebugService } from "set-piece";
import { StaffModel } from "./staff";

export namespace RootDefine {
    export type E = { onPing: string }
    export type S1 = { count: number };
    export type S2 = { name: string };
    export type P = never;
    export type C1 = { boss: StaffModel };
    export type C2 = never;
    export type R1 = { duty: StaffModel };
    export type R2 = { backup: StaffModel[] };
}

@StoreService.is('root')
export class RootModel extends Model<
    RootDefine.E,
    RootDefine.S1,
    RootDefine.S2,
    RootDefine.P,
    RootDefine.C1,
    RootDefine.C2,
    RootDefine.R1,
    RootDefine.R2
> {
    constructor(props: Model.Props<RootModel>) {
        super({
            ...props,
            state: { count: 0, name: 'Ing Soc', ...props.state },
            child: { boss: new StaffModel({}), ...props.child },
        })
    }

    @StateAgent.use(model => model.proxy.decor.count)
    handleState(target: RootModel, value: number) {
        return value + 1;
    }

    @DebugService.log()
    public ping() {
        console.log('ping');
        this.event.onPing('hello')
    }

    public get state() {
        return {
            ...super.state,
            version: '0.1.0'
        }
    }

    @DebugService.log()
    countup() {
        console.log('version:', this.state.version);
        console.log('count:', this.state.count, this.draft.state.count);
        this.draft.state.count++;
        console.log('count:', this.state.count, this.draft.state.count);
        this.event.onPing('hello')
    }
    




}