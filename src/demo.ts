import { Decor, Event, Loader, Model, StateUtil } from "set-piece";
import { EmotionType, GenderType } from "./types";
import { DeepReadonly } from "utility-types";
import { IngSocModel } from "./ing-soc";
import { StaffModel } from "./staff";

export namespace DemoProps {
    export type E = { 
        onPlay: Event 
        onHello: Event<{ target: DemoModel }>,
        onCount: Event<{ value: number }>,
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

export class DemoDecor extends Decor<DemoProps.S> {
    public disable() {
        this.detail.isAlive = false;
    }
}

@StateUtil.use(DemoDecor)
export class DemoModel extends Model<
    DemoProps.E,
    DemoProps.S,
    DemoProps.C,
    DemoProps.R,
    DemoProps.P
> {

    constructor(loader?: Loader<DemoModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: props.state?.name ?? '',
                    price: props.state?.price ?? 0,
                    emotion: props.state?.emotion ?? EmotionType.NEUTRAL,
                    gender: props.state?.gender ?? GenderType.UNKNOWN,
                    isAlive: props.state?.isAlive ?? true,
                    tags: props.state?.tags ?? [],
                    location: props.state?.location ?? { x: 0, y: 0 },
                    ...props.state,
                },
                child: { 
                    foo: props.child?.foo ?? new DemoModel(),
                    bar: props.child?.bar ?? new DemoModel(),
                    baz: props.child?.baz ?? [],
                    ...props.child,
                },
                refer: {
                    baz: props.refer?.baz ?? [],
                    bar: props.refer?.bar,
                    ...props.refer,
                },
                route: {
                    ingSoc: IngSocModel.prototype,
                    staff: StaffModel.prototype,
                }
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
        this.draft.state.price += 100;
        // this.draft.state.tags.push('test');
        this.draft.state.tags = ['test'];
        this.draft.state.location = { x: 100, y: 100 }
        this.draft.state.emotion = EmotionType.HAPPY;
        this.draft.state.gender = GenderType.MALE;
        this.draft.state.isAlive = false;
        this.draft.state.location = { x: 100, y: 100 }
        
        const foo: DemoModel = this.draft.child.foo;
        const bar: DemoModel | undefined = this.draft.child.bar;
        const baz: DemoModel[] = this.draft.child.baz;

        this.draft.child.foo = new DemoModel();
        this.draft.child.bar = new DemoModel();
        this.draft.child.baz = [new DemoModel()];
        this.draft.child.baz.push(new DemoModel());
        

        const foo_2: DemoModel | undefined = this.draft.refer.foo;
        // const foo_3: PetModel = this.draft.refer.foo;
        const bar_2: DemoModel | undefined = this.draft.refer.bar;
        const baz_2: DemoModel[] | undefined = this.draft.refer.baz;

        this.draft.refer.foo = new DemoModel();
        this.draft.refer.bar = new DemoModel();
        this.draft.refer.baz = [new DemoModel()];
        this.draft.refer.baz.push(new DemoModel());

        this.event.onHello(new Event({ target: this }));
        this.event.onHello(new Event({ target: new DemoModel() }));
        this.event.onCount(new Event({ value: 100 }));
        this.event.onPlay(new Event({}));
    }

    @StateUtil.on(model => model.proxy.decor)
    onCheck(model: DemoModel, state: DemoDecor) {
        state.disable()
    }

}