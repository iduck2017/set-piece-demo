import { Model, Event, FactoryService, SyncService, Value } from "set-piece";
import { FlyModel, BreedModel, SwimModel, DiseaseModel } from "./features";
import { EmotionType, GenderType } from "@/utils/types";    

type BornEvent = Event<{ target: AnimalModel }>
type GrowEvent = Event<{ target: AnimalModel, agePrev: number }>
export type DieEvent<T extends AnimalModel = AnimalModel> = Event<{ target: T }>

export class AnimalModel<
    T extends AnimalModel = any,
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> = {},
> extends Model<
    S & { 
        isAlive: boolean 
        age: number,
        ageLimit: number,
        gender: GenderType
    },
    E & {
        onBorn: BornEvent
        onDie: DieEvent
        onGrow: GrowEvent
    },
    C & {
        fly?: FlyModel,
        swim?: SwimModel,
        breed: BreedModel<T>,
        disease?: DiseaseModel
    }
> {
    static superProps<M extends AnimalModel>(
        props: M['props']
    ) {
        const genders = [
            GenderType.MALE,
            GenderType.FEMALE,
            GenderType.UNKNOWN,
        ]
        const gender = genders[SyncService.random.int(0, genders.length - 1)]
        return {
            ...props,
            state: {
                isAlive: props.state?.isAlive ?? true,
                age: props.state?.age ?? 0,
                gender: props.state?.gender ?? gender
            },
            child: {
                breed: props.child?.breed ?? new BreedModel({}),
                fly: props.child?.fly ?? new FlyModel({}),
                swim: props.child?.swim ?? new SwimModel({}),
                disease: props.child?.disease ?? new DiseaseModel({})
            }
        }
    }

    @Model.if(model => model.state.isAlive)
    @Model.useLogger()
    growup() {
        const agePrev = this.state.age;
        this.stateProxy.age++;
        this.emitEvent(
            this.event.onGrow,
            {
                target: this,
                agePrev
            }
        )
        if (this.state.age >= this.state.ageLimit) {
            this._die();
        }
    }

    @Model.if(model => model.state.isAlive)
    @Model.useLogger()
    private _die() {
        this.stateProxy.isAlive = false;
        this.emitEvent(this.event.onDie, { target: this });
    }

    @Model.if(model => !model.child.disease)
    @Model.if(model => model.state.isAlive)
    sick() {
        this.childProxy.disease = new DiseaseModel({});
    }
}

export class PetModel<
    T extends AnimalModel = AnimalModel,
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> = {},
> extends AnimalModel<
    T,
    S & {
        name: string,
        price: number,
        isSelled: boolean,
    },
    E & {
        onDie: DieEvent<PetModel>
        onSell: Event<{ target: PetModel }>
    },
    C
> {
    static superProps<M extends PetModel>(
        props: M['props']
    ) {
        const superProps = AnimalModel.superProps(props);
        return {
            ...superProps,
            state: {
                ...superProps.state,
                isSelled: props.state?.isSelled ?? false
            },
        }
    }
}

type PlayEvent = Event<{ target: DogModel }>
type FeedEvent = Event<{ target: DogModel }>

@SwimModel.useConfig({
    isEnabledDefault: true,
    speedLimit: 3
})
@BreedModel.useConfig({
    isEnabledDefault: true,
    ageMinium: 5,
    ageMaxium: 15,
    childLimit: 3,
})
@FactoryService.useProduct('dog')
@Model.useModifier()
export class DogModel extends PetModel<
    DogModel,
    {
        emotion: EmotionType;
    },
    {
        onDie: DieEvent<DogModel>
        onPlay: PlayEvent;
        onFeed: FeedEvent;
        onChildPlay: PlayEvent;
    }
> {
    constructor(props: DogModel['props']) {
        const superProps = DogModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                ageLimit: props.state?.ageLimit ?? 10,
                price: props.state?.price ?? 5000,
                name: props.state?.name ?? 'Bob',
                emotion: props.state?.emotion ?? EmotionType.NEUTRAL,
            },
            child: {
                ...superProps.child,
                swim: props.child?.swim ?? new SwimModel({}),
            }
        });
    }

    @Model.onLoad()
    @Model.useLogger()
    private _useSiblingPlay() {
        const bioParent = this?.parent?.parent;
        if (!(bioParent instanceof DogModel)) return;
        this.bindEvent(bioParent.event.onChildPlay, (event) => {
            this.stateProxy.emotion = EmotionType.HAPPY;
        })
    }

    @Model.onChildLoad()
    @Model.useLogger()
    private _useChildPlay(child: Model) {
        if (!(child instanceof DogModel)) return;
        if (child.parent.parent !== this) return;
        this.bindEvent(child.event.onPlay, (event) => {
            this.emitEvent(this.event.onChildPlay, event);
        })
    }

    @Model.if(model => model.state.isAlive)
    playGame() {
        this.stateProxy.emotion = EmotionType.HAPPY;
        this.emitEvent(this.event.onPlay, {
            target: this
        });
    }
    
}