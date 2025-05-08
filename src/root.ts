import { Model, StateAgent, EventAgent, StoreService } from "set-piece";
import { StaffModel } from "./staff";

export namespace RootDefine {
    export type E = { onPing: number }
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
            refer: { backup: [], ...props.refer },
        })
    }

    @StateAgent.use(proxy => proxy.decor.count)
    handleState(target: RootModel, value: number) {
        return value + 1;
    }

    @EventAgent.use(proxy => proxy.event.onPing)
    handleEvent(target: RootModel, event: number) {
        console.log
    }


}