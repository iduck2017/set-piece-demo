import { Model, StateAgent } from "set-piece";
import { StaffModel } from "./staff";
import { EmotionType, GenderType } from "./common";
import { DeepReadonly } from "utility-types";

export namespace DemoModel {
    export type Event = { 
        onPlay: void 
        onHello: DemoModel,
        onCount: number,
    };
    
    export type State = { 
        price: number,
        readonly name: string,
        gender: GenderType
        emotion: EmotionType
        isAlive: boolean
        tags: string[]
        location: { x: number, y: number }
    };
    
    export type Child = {
        foo: DemoModel,
        bar?: DemoModel,
        baz: DemoModel[],
    }
    
    export type Refer = { 
        foo?: DemoModel,
        bar?: DemoModel,
        baz: DemoModel[],
    }
}

export class DemoModel extends Model<
    StaffModel,
    DemoModel.Event,
    DemoModel.State,
    DemoModel.Child,
    DemoModel.Refer
> {
    testState() {
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

        this.draft.child.foo = new DemoModel({});
        this.draft.child.bar = new DemoModel({});
        this.draft.child.baz = [new DemoModel({})];
        this.draft.child.baz.push(new DemoModel({}));
        

        const foo_2: DemoModel | undefined = this.draft.refer.foo;
        // const foo_3: PetModel = this.draft.refer.foo;
        const bar_2: DemoModel | undefined = this.draft.refer.bar;
        const baz_2: DemoModel[] | undefined = this.draft.refer.baz;

        this.draft.refer.foo = new DemoModel({});
        this.draft.refer.bar = new DemoModel({});
        this.draft.refer.baz = [new DemoModel({})];
        this.draft.refer.baz.push(new DemoModel({}));

        this.event.onHello(this)
        this.event.onHello(new DemoModel({}));
        this.event.onCount(100);
        this.event.onPlay();
    }

    @StateAgent.use(model => model.proxy.decor)
    checkState(model: DemoModel, state: DeepReadonly<DemoModel.State>) {
        return {
            ...state,
            price: state.price + 100,
        }
    }

    constructor(props: DemoModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: '',
                price: 0,
                emotion: EmotionType.NEUTRAL,
                gender: GenderType.UNKNOWN,
                isAlive: true,
                tags: [],
                location: { x: 0, y: 0 },
                ...props?.state,
            },
            child: { 
                foo: new DemoModel({}),
                bar: new DemoModel({}),
                baz: [],
                ...props?.child
            },
            refer: {
                baz: [],
            }
        })
    }

}