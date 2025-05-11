import { DebugService, EventAgent, Model, StateAgent } from "set-piece";

export namespace PingDefine {
    export type E = { onPing: number };
    export type S1 = { value: number };
    export type S2 = {};
    export type P = RootModel;
    export type C1 = {};
    export type C2 = never;
    export type R1 = {};
    export type R2 = { pongs: PongModel[] }
}

export namespace PongDefine {
    export type E = { onPong: void };
    export type S1 = { value: number };
    export type S2 = {};
    export type P = RootModel;
    export type C1 = {};
    export type C2 = never;
    export type R1 = { ping: PingModel };
}

export namespace RootDefine {
    export type E = {}
    export type S1 = { count: number};
    export type S2 = {};
    export type P = Model;
    export type C1 = { ping: PingModel};
    export type C2 = PongModel
}



export class PingModel extends Model<
    PingDefine.E,
    PingDefine.S1,
    PingDefine.S2,
    PingDefine.P,
    PingDefine.C1,
    PingDefine.C2,
    PingDefine.R1,
    PingDefine.R2
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

    @EventAgent.use(model => model.parent?.proxy.child[0].event.onPong)
    @DebugService.log()
    private handlePong(target: PongModel, value: void) {
        console.log('handle pong', this.draft.state.value);
        this.draft.state.value += 1;
    }
}


export class PongModel extends Model<
    PongDefine.E,
    PongDefine.S1,
    PongDefine.S2,
    PongDefine.P,
    PongDefine.C1,
    PongDefine.C2,
    PongDefine.R1
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

    @StateAgent.use(model => model.parent?.proxy.decor.count)
    private checkCount(target: RootModel, value: number) {
        return value + 1;
    }

    @EventAgent.use(model => model.parent?.child.ping.proxy.event.onPing)
    @DebugService.log()
    private handlePing(target: PingModel, value: number) {
        this.draft.state.value += value;
    }
}

export class RootModel extends Model<
    RootDefine.E,
    RootDefine.S1,
    RootDefine.S2,
    RootDefine.P,
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
        this.draft.child.ping = new PingModel({}); 
    }

    test() {
        const ping: PingModel = this.child.ping;
        const pong: PongModel | undefined =  this.child[0]
    }
}

