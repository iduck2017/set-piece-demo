import { Model, Event, FactoryService, Value, SyncService } from "set-piece";
import { AnimalModel, DieEvent, DogModel } from "./animal";
import { RootModel } from "./root";
import { EmotionType, GenderType } from "@/utils/types";

export class FeatureModel<
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> | Model[] = any,
> extends Model<
    S & { isEnabled: boolean }, 
    E, 
    C, 
    AnimalModel
> {
    protected static superProps<T extends FeatureModel>(props: T['props']) {
        return {
            ...props,
            state: {
                isEnabled: props.state?.isEnabled ?? false,
            }
        }
    }

    get state() {
        return {
            ...super.state,
            isAlive: this.parent?.state.isAlive ?? false,
            isFemale: this.parent?.state.gender === GenderType.FEMALE,
        }
    }
}

@FactoryService.useProduct('fly')
export class FlyModel extends FeatureModel<
    { 
        isFlying: boolean,
        heightLimit: number,
        height: number,
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
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                isFlying: props.state?.isFlying ?? false,
                speedLimit: props.state?.speedLimit ?? 1,
                speed: props.state?.speed ?? 1,
                heightLimit: props.state?.heightLimit ?? 1,
                height: props.state?.height ?? 1,
            },
            child: {},
        });
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isFlying)
    ascend(height?: number) {
        if (!height) height = 1;
        this.stateProxy.height = Math.min(
            this.state.height + height, 
            this.state.heightLimit
        );
    }

    @Model.if(model => model.state.isFlying)
    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    accelerate(speed?: number) {
        if (!speed) speed = 1;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }


    @Model.if(model => !model.state.isFlying)
    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    fly() {
        this.stateProxy.isFlying = true;
        this.emitEvent(this.event.onFly, {
            target: this,
        });
    }

    @Model.if(model => model.state.isFlying)
    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    land() {
        this.stateProxy.isFlying = false;
        this.emitEvent(this.event.onLand, {
            target: this,
        });
    }
}

@FactoryService.useProduct('swim')
export class SwimModel extends FeatureModel<
    { 
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
    private static _rules: Map<Function, {
        isEnabled: boolean,
        speedLimit: number,
    }> = new Map();
    
    static useFeature(rule: {
        isEnabled: boolean,
        speedLimit: number,
    }) {
        return function (constructor: new (...args: any[]) => Model) {
            SwimModel._rules.set(constructor, rule);
        };
    }


    constructor(props: SwimModel['props']) {
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                isSwimming: props.state?.isSwimming ?? false,
                speedLimit: props.state?.speedLimit ?? 1,
                speed: props.state?.speed ?? 1,
            },
            child: {},
        });
    }

    @Model.onLoad()
    @Model.useAutomic()
    @Model.useLogger()
    private _useRule() {
        if (!this.parent) return;
        let constructor: any = this.parent.constructor;
        while (constructor) {
            const rule = SwimModel._rules.get(constructor);
            if (rule) {
                this.stateProxy.speedLimit = rule.speedLimit;
                this.stateProxy.isEnabled = rule.isEnabled;
                return;
            }
            constructor = constructor.__proto__;
        }
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isSwimming)
    accelerate(speed?: number) {
        if (!speed) speed = 1;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.state.speedLimit
        );
    }

    @Model.if(model => !model.state.isSwimming)
    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    swim() {
        this.stateProxy.isSwimming = true;
        this.emitEvent(this.event.onSwim, {
            target: this,
        });
    }

    @Model.if(model => model.state.isSwimming)
    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    land() {
        this.stateProxy.isSwimming = false;
        this.emitEvent(this.event.onDive, {
            target: this,
        });
    }
}




type SpawnEvent = Event<{ target: BreedModel, child: AnimalModel }>
type CloneEvent = Event<{ target: BreedModel, child: AnimalModel }>

@FactoryService.useProduct('reproduce')
export class BreedModel<
    T extends AnimalModel = AnimalModel
> extends FeatureModel<
    {},
    {
        onSpawn: SpawnEvent
        onClone: CloneEvent
    },
    T[]
> {
    constructor(props: BreedModel<T>['props']) {
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            child: props.child ?? [],
            state: {
                ...superProps.state,
                isEnabled: true,
            }
        });
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isFemale)
    spawnChild(props?: T['props']): T | undefined {
        const parent = this.parent;
        if (!parent) return undefined;
        
        if (!props) props = {}
        
        const isAbnormal = SyncService.random.float(0, 1) > 0;
        if (isAbnormal) {
            props = {
                ...props,
                child: {
                    ...props.child,
                    // superMale: new SuperMaleModel({}),
                }
            }
        }

        const constructor: any = parent.constructor;
        const child = new constructor(props);


        this.childProxy.push(child);
        this.emitEvent(this.event.onSpawn, {
            target: this,
            child
        });

        return child;
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.child.length)
    @Model.if(model => model.state.isAlive)
    cloneChild(index?: number): T | undefined {
        const child = this.child[index ?? 0];

        this.childProxy.push(child);
        this.emitEvent(this.event.onClone, {
            target: this,
            child
        });

        return child;
    }

    @Model.if(model => model.child.length)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isFemale)
    destroyChild(index?: number) {
        const child = this.child[index ?? 0];
        if (!child) return;
        const result = this.removeChild(child);
        result?.debug();
        return result;
    }

    @Model.onChildLoad()
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
