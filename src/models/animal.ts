import { Model, Event, FactoryService, ValidateService, SyncService, Value } from "set-piece";
import { FlyModel, BreedModel, SwimModel, SuperMaleModel } from "./features";
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
        ageLimit: number
        age: number,
        gender: GenderType
    },
    E & {
        onBorn: BornEvent
        onDie: DieEvent
        onGrow: GrowEvent
    },
    C & {
        fly: FlyModel,
        swim: SwimModel,
        breed: BreedModel<T>,
        superMale?: SuperMaleModel,
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
                swim: props.child?.swim ?? new SwimModel({}),
                fly: props.child?.fly ?? new FlyModel({}),
                breed: props.child?.breed ?? new BreedModel({}),
                superMale: props.child?.superMale,
            }
        }
    }

    @ValidateService.useCheck(model => model.state.isAlive)
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
            this.die();
        }
    }

    @ValidateService.useCheck(model => model.state.isAlive)
    die() {
        this.stateProxy.isAlive = false;
        this.emitEvent(this.event.onDie, { target: this });
    }
}

@SwimModel.useFeature({
    isEnabled: true,
    speedLimit: 10,
})
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

@FactoryService.useProduct('dog')
@Model.useDecor({ emotion: true, gender: true })
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
    get mother(): DogModel | undefined {
        return this.queryParent(DogModel);
    }

    constructor(props: DogModel['props']) {
        const superProps = DogModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                price: props.state?.price ?? 5000,
                ageLimit: props.state?.ageLimit ?? 20,
                name: props.state?.name ?? 'Bob',
                emotion: props.state?.emotion ?? EmotionType.NEUTRAL,
            }
        });
    }

    @Model.onInit()
    private _useSiblingPlay() {
        console.log('on-init');
        if (!this.mother) return;
        this.bindEvent(this.mother.event.onChildPlay, (event) => {
            const isJoined = SyncService.random.float(0, 1) > 0.5;
            if (!isJoined) return;
            this.stateProxy.emotion = EmotionType.HAPPY;
        })
    }

    @Model.onChildInit()
    private _useChildPlay(child: Model) {
        if (!(child instanceof DogModel)) return;
        if (child.mother !== this) return;
        this.bindEvent(child.event.onPlay, (event) => {
            this.emitEvent(this.event.onChildPlay, event);
        })
    }

    @ValidateService.useCheck(model => model.state.isAlive)
    playGame() {
        this.stateProxy.emotion = EmotionType.HAPPY;
        this.emitEvent(this.event.onPlay, {
            target: this
        });
    }
    
}