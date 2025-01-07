import { Event } from "@/types/event";
import { Model, ModelStatus } from ".";
import { AnimalModel } from "./animal";
import { Value } from "@/types/base";
import { ValidateService } from "@/services/validate";
import { RootModel } from "./root";
import { StorageService } from "@/services/storage";

export enum GenderType {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

export class FeatureModel<
    S extends Record<string, Value> = Record<string, Value>,
    E extends Record<string, Event> = Record<string, Event>,
    C extends Record<string, Model> | Model[] = any,
> extends Model<S, E, C> {
    get parentRefer(): {
        root?: RootModel,
        animal?: AnimalModel,
    } {
        const result = super.parentRefer;
        return {
            ...result,
            animal: this.queryParent(AnimalModel)
        }
    }

    debug(): void {
        super.debug();
    }
}

@StorageService.useProduct('fly')
export class FlyModel extends FeatureModel<
    { 
        isEnable: boolean,
        isFlying: boolean,
        speedLimit: number
        speed: number
    },
    {
        onFly: Event<{ target: FlyModel }>
        onLand: Event<{ target: FlyModel }>
    },
    {}
> {
    constructor(props: FlyModel['props']) {
        super({
            ...props,
            state: {
                isEnable: props.state?.isEnable ?? false,
                isFlying: props.state?.isFlying ?? false,
                speedLimit: props.state?.speedLimit ?? 1,
                speed: props.state?.speed ?? 1,
            },
            child: {},
        });
    }

    accelerate(speed?: number) {
        if (!speed) speed = 1;
        if (!this.state.isEnable) return;
        if (!this.state.isFlying) return;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }

}

@StorageService.useProduct('swim')
export class SwimModel extends FeatureModel<
    { 
        isEnable: boolean,
        isSwimming: boolean,
        speedLimit: number,
        speed: number
    },
    {
        onSwim: Event<{ target: SwimModel }>
        onLand: Event<{ target: SwimModel }>
        onDive: Event<{ target: SwimModel }>
    },
    {}
> {
    constructor(props: SwimModel['props']) {
        super({
            ...props,
            state: {
                isEnable: props.state?.isEnable ?? false,
                isSwimming: props.state?.isSwimming ?? false,
                speedLimit: props.state?.speedLimit ?? 0,
                speed: props.state?.speed ?? 0,
            },
            child: {},
        });
    }

    accelerate(speed?: number) {
        if (!speed) speed = 1;
        if (!this.state.isEnable) return;
        if (!this.state.isSwimming) return;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }
}

@StorageService.useProduct('reproduce')
export class BreedModel<
    T extends AnimalModel = AnimalModel
> extends FeatureModel<
    {
        gender: GenderType
        isEnable: boolean
    },
    {
        onReproduce: Event<{ target: BreedModel, child: T }>
    },
    T[]
> {
    constructor(props: BreedModel['props']) {
        super({
            ...props,
            state: {
                gender: props.state?.gender ?? GenderType.UNKNOWN,
                isEnable: props.state?.isEnable ?? false,
            },
            child: [],
        });
    }

    @ValidateService.useValidator(target => target.parentRefer.animal?.state.isAlive, undefined)
    @ValidateService.useValidator(target => target.state.gender === GenderType.FEMALE,  undefined)
    spawnChild(target?: T): T | undefined {

        const parent = this.parentRefer.animal;
        if (!parent) return undefined;

        const Type: any = parent.constructor;
        target = target ?? new Type({});
        if (!target) return;

        const uuid = target.uuid;
        this.childProxy.push(target);

        console.log('spawnChild', this.queryChild(uuid));

        this.emitEvent(
            this.event.onReproduce,
            {
                target: this,
                child: target
            }
        )
    }

}
