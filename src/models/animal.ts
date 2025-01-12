import { Model, Event, FactoryService, ValidateService, SyncService, Value } from "set-piece";
import { FlyModel, BreedModel, SwimModel } from "./features";
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
        breed: BreedModel<T>
    }
> {
    get refer(): {
        mother?: AnimalModel,
    } {
        return {
            mother: this.queryParent(AnimalModel)
        }
    }


    static superProps<M extends AnimalModel>(
        props: M['props']
    ) {
        const gender = SyncService.random.int(GenderType.MALE, GenderType.UNKNOWN)
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
            }
        }
    }

    isAlive() { return this.state.isAlive }
    isFemale() { return this.state.gender === GenderType.FEMALE }


    @ValidateService.useCheck(model => model.isAlive())
    growup() {
        const agePrev = this.state.age;
        this.stateDraft.age++;
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

    die() {
        this.stateDraft.isAlive = false;
        this.emitEvent(this.event.onDie, { target: this });
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
 
    debug() {
        super.debug();
        const a: number = this.state.price;
        const b: string = this.state.name;
        const c: SwimModel = this.child.swim;
    }
}

type PlayEvent = Event<{ target: DogModel }>
type FeedEvent = Event<{ target: DogModel }>

@FactoryService.useProduct('dog')
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
    get refer(): {
        mother?: DogModel,
    } {
        return {
            ...super.refer,
            mother: this.queryParent(DogModel)
        }
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
        const mother = this.refer.mother;
        if (mother) {
            this.bindEvent(mother.event.onChildPlay, (event) => {
                this.stateDraft.emotion = EmotionType.HAPPY;
            })
        }
    }

    @Model.onChildInit()
    private _useChildPlay(child: Model) {
        if (!(child instanceof DogModel)) return;
        if (child.refer.mother === this) {
            this.bindEvent(child.event.onPlay, (event) => {
                this.emitEvent(this.event.onChildPlay, event);
            })
        }
    }


    @ValidateService.useCheck(model => model.isAlive())
    playGame() {
        this.stateDraft.emotion = EmotionType.HAPPY;
        this.emitEvent(this.event.onPlay, {
            target: this
        });
    }

    
}