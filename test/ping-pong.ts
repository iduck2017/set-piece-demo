import { DebugService, EventAgent, Model, StateAgent } from "set-piece";

export namespace PingDefine {
    export type E = { onPing: number };
    export type S1 = { value: number };
    export type S2 = {};
    export type P = RootModel;
    export type C1 = {};
    export type C2 = never;
}

export class PingModel extends Model<
    PingDefine.P,
    PingDefine.E,
    PingDefine.S1,
    PingDefine.S2,
    PingDefine.C1,
    PingDefine.C2
> {
    constructor(props: Model.Props<PingModel>) {
        super({
            ...props,
            state: { value: 0, ...props.state },
            child: { ...props.child },
        });
    }

    ping(value: number) {
        this.event.onPing(value);
    }

    @StateAgent.use(model => model.parent?.proxy.decor.count)
    private checkCount(target: RootModel, value: number) {
        return value + 1;
    }

    @EventAgent.use(model => model.parent?.proxy.child[0].event.onPong)
    @DebugService.log()
    private handlePong(target: PongModel, value: void) {
        console.log('handle pong', this.draft.state.value);
        this.draft.state.value += 1;
    }

    @EventAgent.use(model => model.parent?.child[0]?.proxy.event.onPong)
    @DebugService.log()
    private handlePongPlus(target: PongModel, value: void) {
        console.log('handle pong plus', this.draft.state.value);
        this.draft.state.value += 9;
    }

}



export namespace PongDefine {
    export type E = { onPong: void };
    export type S1 = { value: number };
    export type S2 = {};
    export type P = RootModel;
    export type C1 = {};
    export type C2 = never;
    export type R1 = { friend: PongModel };
    export type R2 = { friends: PongModel };
}

export class PongModel extends Model<
    PongDefine.P,
    PongDefine.E,
    PongDefine.S1,
    PongDefine.S2,
    PongDefine.C1,
    PongDefine.C2,
    PongDefine.R1,
    PongDefine.R2
> {
    constructor(props: Model.Props<PongModel>) {
        super({
            ...props,
            state: { value: 0, ...props.state },
            child: { ...props.child },
        });
    }

    pong() {
        this.event.onPong();
    }

    link(pong: PongModel) {
        this.draft.refer.friend = pong;
        this.draft.refer.friends = [ ...this.draft.refer.friends ?? [], pong ];
    }

    unlink(pong: PongModel) {
        if (this.draft.refer.friend === pong) {
            delete this.draft.refer.friend;
        }
        const next = this.draft.refer.friends?.filter(item => item !== pong);
        this.draft.refer.friends = next;
    }

    @StateAgent.use(model => model.parent?.proxy.decor.count)
    private checkCount(target: RootModel, value: number) {
        return value + 1;
    }

    @EventAgent.use(model => model.parent?.proxy.child.ping.event.onPing)
    @DebugService.log()
    private handlePing(target: PingModel, value: number) {
        this.draft.state.value += value;
    }
}

export namespace RootDefine {
    export type E = {}
    export type S1 = { count: number };
    export type S2 = {};
    export type P = Model;
    export type C1 = { ping: PingModel};
    export type C2 = PongModel
}


export class RootModel extends Model<
    RootDefine.P,
    RootDefine.E,
    RootDefine.S1,
    RootDefine.S2,
    RootDefine.C1,
    RootDefine.C2
> {
    constructor(props: Model.Props<RootModel>) {
        super({
            ...props,
            state: { count: 0, ...props.state },
            child: { 
                ping: new PingModel({}),
                [0]: new PongModel({}),
                [1]: new PongModel({}),
                ...props.child 
            },
        });
    }

    spawn() { 
        this.draft.child.push(new PongModel({})); 
    }

    change() { 
        this.draft.child[0] = new PongModel({}); 
    }

    despawn() {
        this.draft.child.pop();
    }

    test() {
        const ping: PingModel = this.child.ping;
        const pong: PongModel | undefined = this.child[0]
    }
}

