import { Event } from "@/types/event";
import { Model } from ".";
import { FlyModel, BreedModel, SwimModel } from "./features";
import { Value } from "@/types/base";
import { ValidateService } from "@/services/validate";
import { StorageService } from "@/services/storage";

export class AnimalModel<
    T extends AnimalModel = any,
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> = {},
> extends Model<
    S & { 
        isAlive: boolean 
        ageLimit: number
        age: number
    },
    E & {
        onBorn: Event<{ target: AnimalModel }>
        onDie: Event<{ target: AnimalModel }>
        onGrow: Event<{ target: AnimalModel, agePrev: number }>
    },
    C & {
        fly: FlyModel,
        swim: SwimModel,
        breed: BreedModel<T>
    }
> {
    static superProps<M extends AnimalModel>(
        props: M['props']
    ) {
        return {
            ...props,
            state: {
                isAlive: props.state?.isAlive ?? true,
                age: props.state?.age ?? 0,
            },
            child: {
                swim: props.child?.swim ?? new SwimModel({}),
                fly: props.child?.fly ?? new FlyModel({}),
                breed: props.child?.breed ?? new BreedModel({}),
            }
        }
    }

    protected static isAlive() {
        return ValidateService.useValidator<AnimalModel>(
            (target) => target.state.isAlive
        )
    }


    @AnimalModel.isAlive()
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
        price: number
    },
    E & {
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
            },
        }
    }
}

@StorageService.useProduct('duck')
export class DuckModel extends PetModel<
    DuckModel,
    {
        eggs: number
    }
> {
    constructor(props: DuckModel['props']) {
        const superProps = DuckModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                price: props.state?.price ?? 1000,
                ageLimit: props.state?.ageLimit ?? 10,
                eggs: props.state?.eggs ?? 0,
            }
        });
    }

    @ValidateService.useValidator(model => model.state.isAlive)
    quack(): number | undefined {
        console.log('quack');
        return 1;
    }

    debug() {
        const a = this.quack()
        console.log(this.quack())
    }
}

@StorageService.useProduct('dog')
export class DogModel extends PetModel {
    constructor(props: DogModel['props']) {
        const superProps = DogModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                price: props.state?.price ?? 5000,
                ageLimit: props.state?.ageLimit ?? 20,
            }
        });
    }
}
