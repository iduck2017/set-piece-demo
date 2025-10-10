import { Decor, Model, StateUtil } from "set-piece";
import { EmotionType, GenderType } from "./types";
import { DeepReadonly } from "utility-types";
import { IngSocModel } from "./ing-soc";
import { StaffModel } from "./staff";

export namespace DemoModel {
    export type E = { 
        onPlay: {}
        onHello: { target: DemoModel },
        onCount: { value: number },
    };
    export type S = { 
        price: number,
        readonly name: string,
        gender: GenderType
        emotion: EmotionType
        isAlive: boolean
        tags: string[]
        location: { x: number, y: number }
    };
    export type C = {
        foo: DemoModel,
        bar?: DemoModel,
        baz: DemoModel[],
    }
    export type P = {
        ingSoc: IngSocModel
        staff: StaffModel
    };
    export type R = { 
        foo?: DemoModel,
        bar?: DemoModel,
        baz: DemoModel[],
    }
}

export class DemoDecor extends Decor<DemoModel.S> {
    public disable() {
        this.origin.isAlive = false;
    }
}

export class DemoModel extends Model<
    DemoModel.E,
    DemoModel.S,
    DemoModel.C,
    DemoModel.R
> {
    public get decor(): DemoDecor { return new DemoDecor(this) }

    constructor(props?: DemoModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: props?.state?.name ?? '',
                price: props?.state?.price ?? 0,
                emotion: props?.state?.emotion ?? EmotionType.NEUTRAL,
                gender: props?.state?.gender ?? GenderType.UNKNOWN,
                isAlive: props?.state?.isAlive ?? true,
                tags: props?.state?.tags ?? [],
                location: props?.state?.location ?? { x: 0, y: 0 },
                ...props?.state,
            },
            child: { 
                foo: props?.child?.foo ?? new DemoModel(),
                bar: props?.child?.bar ?? new DemoModel(),
                baz: props?.child?.baz ?? [],
                ...props?.child,
            },
            refer: {
                baz: props?.refer?.baz ?? [],
                bar: props?.refer?.bar,
                ...props?.refer,
            }
        }) 
    }

    test() {
        const name: string = this.state.name;
        // const name_2: number = this.state.name;
        const price: number = this.state.price;
        const emotion: EmotionType = this.state.emotion;
        const gender: GenderType = this.state.gender;
        const isAlive: boolean = this.state.isAlive;
        const tags: ReadonlyArray<string> = this.state.tags;
        const location: { x: number, y: number } = this.state.location;

        // this.state.location.x += 100;
        // this.state.emotion = EmotionType.HAPPY;

        // this.draft.state.name = 'test';
        this.origin.state.price += 100;
        // this.draft.state.tags.push('test');
        this.origin.state.tags = ['test'];
        this.origin.state.location = { x: 100, y: 100 }
        this.origin.state.emotion = EmotionType.HAPPY;
        this.origin.state.gender = GenderType.MALE;
        this.origin.state.isAlive = false;
        this.origin.state.location = { x: 100, y: 100 }
        
        const foo: DemoModel = this.origin.child.foo;
        const bar: DemoModel | undefined = this.origin.child.bar;
        const baz: DemoModel[] = this.origin.child.baz;

        this.origin.child.foo = new DemoModel();
        this.origin.child.bar = new DemoModel();
        this.origin.child.baz = [new DemoModel()];
        this.origin.child.baz.push(new DemoModel());
        

        const foo_2: DemoModel | undefined = this.origin.refer.foo;
        // const foo_3: PetModel = this.draft.refer.foo;
        const bar_2: DemoModel | undefined = this.origin.refer.bar;
        const baz_2: DemoModel[] | undefined = this.origin.refer.baz;

        this.origin.refer.foo = new DemoModel();
        this.origin.refer.bar = new DemoModel();
        this.origin.refer.baz = [new DemoModel()];
        this.origin.refer.baz.push(new DemoModel());

        this.event.onHello({ target: this });
        this.event.onHello({ target: new DemoModel() });
        this.event.onCount({ value: 100 });
        this.event.onPlay({});
    }
    
    @StateUtil.on(self => self.onCompute)
    private load() {
        const self: DemoModel = this;
        return self.proxy.decor
    }

    private onCompute(model: DemoModel, state: DemoDecor) {
        state.disable()
    }

}