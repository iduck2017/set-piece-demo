import { Model } from "set-piece";

export enum GenderType {
    MALE,
    FEMALE,
    UNKNOWN,
}

export namespace BunnyDefine {
    export type E = { onRun: number };
    export type S1 = { speed: number };
    export type S2 = { isAlive: boolean, readonly name: string, gender: GenderType };
    export type P = BunnyModel;
    export type C1 = { mate?: BunnyModel };
    export type C2 = BunnyModel
    export type R1 = { ancestor: BunnyModel };
    export type R2 = { relatives: BunnyModel[] };
}

export class BunnyModel extends Model<
    BunnyDefine.E,
    BunnyDefine.S1,
    BunnyDefine.S2,
    BunnyDefine.P,
    BunnyDefine.C1,
    BunnyDefine.C2,
    BunnyDefine.R1,
    BunnyDefine.R2
> {
    constructor(props: Model.Props<BunnyModel>) {
        super({
            ...props,
            state: { 
                speed: 0,
                name: 'Judy',
                isAlive: true,
                gender: GenderType.UNKNOWN,
                ...props.state, 
            },
            child: { ...props.child },
        });
    }

    public alter() {
        // this.draft.state.name = 'Judy';
        this.draft.state.speed = 0;
        this.draft.state.isAlive = false;
    }

    public spawn(child: BunnyModel) {
        const size = this.draft.child.push(child);
        return this.draft.child[size - 1];
    }

    public despawn(): BunnyModel | undefined {
        const child = this.draft.child.pop();
        return child;
    }

    public mate(mate: BunnyModel) {
        this.draft.child.mate = mate;
        return this.draft.child.mate;
    }
}
