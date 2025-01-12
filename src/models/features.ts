import { Model, Event, FactoryService, ValidateService, Value } from "set-piece";
import { AnimalModel, DieEvent } from "./animal";
import { RootModel } from "./root";

export class FeatureModel<
    S extends Record<string, Value> = Record<string, Value>,
    E extends Record<string, Event> = Record<string, Event>,
    C extends Record<string, Model> | Model[] = any,
> extends Model<S, E, C> {
    get refer(): {
        root?: RootModel,
        animal?: AnimalModel,
    } {
        return {
            root: this.queryParent(RootModel),
            animal: this.queryParent(AnimalModel)
        }
    }

    debug(): void {
        super.debug();
    }
}

@FactoryService.useProduct('fly')
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
        this.stateDraft.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }

}

@FactoryService.useProduct('swim')
export class SwimModel extends FeatureModel<
    { 
        isEnable: boolean,
        isSwimming: boolean,
        speedLimit: number,
        speed: number
    },
    {
        onDie: DieEvent
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
        this.stateDraft.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }
}

type SpawnEvent = Event<{ target: BreedModel, child: AnimalModel }>
type CloneEvent = Event<{ target: BreedModel, child: AnimalModel }>

@FactoryService.useProduct('reproduce')
export class BreedModel<
    T extends AnimalModel = AnimalModel
> extends FeatureModel<
    {
        isEnable: boolean
    },
    {
        onSpawn: SpawnEvent
        onClone: CloneEvent
    },
    T[]
> {
    constructor(props: BreedModel<T>['props']) {
        super({
            ...props,
            state: {
                isEnable: props.state?.isEnable ?? false,
            },
            child: props.child ?? [],
        });
    }

    @ValidateService.useCheck(model => model.refer.animal?.isAlive())
    @ValidateService.useCheck(model => model.refer.animal?.isFemale())
    spawnChild(props?: T['props']): T | undefined {

        const animal = this.refer.animal;
        if (!animal) return undefined;

        const constructor: any = animal.constructor;
        const child = new constructor(props ?? {});

        this.childDraft.push(child);
        this.emitEvent(this.event.onSpawn, {
            target: this,
            child
        });

        return child;
    }

    @ValidateService.useCheck(model => model.child.length)
    @ValidateService.useCheck(model => model.refer.animal?.isAlive())
    cloneChild(index?: number): T | undefined {
        const child = this.child[index ?? 0];

        this.childDraft.push(child);
        this.emitEvent(this.event.onClone, {
            target: this,
            child
        });

        return child;
    }

    @ValidateService.useCheck(model => model.child.length)
    @ValidateService.useCheck(model => model.refer.animal?.isAlive())
    destroyChild(index?: number) {
        const child = this.child[index ?? 0];
        if (!child) return;
        const result = this.removeChild(child);
        console.log('Destroyed child', result);
        result?.debug();
        return result;
    }

    @Model.onChildInit()
    private _useChildDie(child: Model) {
        if (!(child instanceof AnimalModel)) return;
        if (child.parent !== this) return;
        this.bindEvent(
            child.event.onDie,
            this._disposeChild
        )
    }

    @Model.useAutomic()
    private _disposeChild(event: DieEvent) {
        this.removeChild(event.target);
        event.target.debug();
    }

}
