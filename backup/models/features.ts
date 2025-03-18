import { Model, Event, FactoryService, Value, SyncService } from "set-piece";
import { AnimalModel, DieEvent } from "./animal";
import { GenderType } from "@/utils/types";

interface FeatureConfig {
    isEnabledDefault: boolean,
}

type Constructor<M = any> = new (...args: any[]) => M

export class FeatureModel<
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> | Model[] = any,
> extends Model<
    S & { isEnabledMask?: boolean }, 
    E, 
    C, 
    AnimalModel
> {
    protected static superConfig<T>(constructor: any, rules: Map<Function, T>): Partial<T> {
        let _constructor: any = constructor;
        while (_constructor.__proto__ !== null) {
            const superRule = rules.get(_constructor);
            if (superRule) return superRule;
            _constructor = _constructor.__proto__;
        }
        return {};
    }
    
    protected static superProps<T extends FeatureModel>(props: T['props']) {
        return {
            ...props,
            state: {
                isEnabledMask: props.state?.isEnabledMask,
            }
        }
    }

    get config(): FeatureConfig {
        return { isEnabledDefault: false }
    }

    get state() {
        const superState = super.state;
        return {
            ...superState,
            isAlive: this.parent?.state.isAlive ?? false,
            isFemale: this.parent?.state.gender === GenderType.FEMALE,
            isEnabled: superState.isEnabledMask ?? this.config.isEnabledDefault,
            age: this.parent?.state.age ?? NaN
        }
    }
}

interface FlyConfig extends FeatureConfig {
    heightLimit: number,
    speedLimit: number,
}

@FactoryService.useProduct('fly')
export class FlyModel extends FeatureModel<
    { 
        isFlying: boolean,
        height: number,
        speed: number
    },
    {
        onFly: Event<{ target: FlyModel }>
        onLand: Event<{ target: FlyModel }>
        onEnable: Event<{ target: FlyModel }>
        onDisable: Event<{ target: FlyModel }>
    },
    {}
> {
    protected static _config: Map<Function, FlyConfig> = new Map();

    static useConfig(config: FlyConfig) {
        return function (constructor: Constructor<Model>) {
            FlyModel._config.set(constructor, config);
        }
    }

    get config(): FlyConfig {
        const defaultConfig: FlyConfig = {
            isEnabledDefault: false,
            heightLimit: 10,
            speedLimit: 10,
        }
        if (!this.parent) return defaultConfig;
        const config = FlyModel._config.get(this.parent.constructor);
        return config ?? defaultConfig;
    }

    constructor(props: FlyModel['props']) {
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                isFlying: props.state?.isFlying ?? false,
                speed: props.state?.speed ?? 1,
                height: props.state?.height ?? 1,
            },
            child: {},
        });
    }

    @Model.if(model => model.state.isAlive)
    @Model.if(model => !model.state.isEnabled)
    enable() {
        this.stateProxy.isEnabledMask = true;
        this.emitEvent(this.event.onEnable, {
            target: this,
        });
    }

    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isEnabled)
    disable() {
        this.stateProxy.isEnabledMask = false;
        this.emitEvent(this.event.onDisable, {
            target: this,
        });
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isFlying)
    ascend(height?: number) {
        if (!height) height = 1;
        this.stateProxy.height = Math.min(
            this.state.height + height, 
            this.config.heightLimit
        );
    }

    @Model.if(model => model.state.isFlying)
    @Model.if(model => model.state.isEnabledMask)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.speed < model.config.speedLimit)
    accelerate(speed?: number) {
        if (!speed) speed = 1;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.config.speedLimit
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
        this._land();
        this.emitEvent(this.event.onLand, {
            target: this,
        });
    }

    @Model.useAutomic()
    private _land() {
        this.stateProxy.isFlying = false;
        this.stateProxy.speed = 0;
    }

}

interface SwimConfig extends FeatureConfig {
    speedLimit: number,
}

@FactoryService.useProduct('swim')
export class SwimModel extends FeatureModel<
    { 
        isSwimming: boolean,
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
    protected static _config: Map<Function, SwimConfig> = new Map();
    
    static useConfig(config: SwimConfig) {
        return function (constructor: Constructor<Model>) {
            SwimModel._config.set(constructor, config);
        };
    }

    get config(): SwimConfig {
        const defaultConfig: SwimConfig = {
            isEnabledDefault: false,
            speedLimit: 10,
        }
        if (!this.parent) return defaultConfig;
        const config = SwimModel._config.get(this.parent.constructor);
        return config ?? defaultConfig;
    }

    debug() {
        super.debug();
        console.log(this.config);
    }

    constructor(props: SwimModel['props']) {
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            state: {
                ...superProps.state,
                isSwimming: props.state?.isSwimming ?? false,
                speed: props.state?.speed ?? 0,
            },
            child: {},
        });
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isSwimming)
    accelerate(speed?: number) {
        if (!speed) speed = 1;
        this.stateProxy.speed = Math.min(
            this.state.speed + speed, 
            this.config.speedLimit
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
        this._land();
        this.emitEvent(this.event.onDive, {
            target: this,
        });
    }

    @Model.useAutomic()
    private _land() {
        this.stateProxy.isSwimming = false;
        this.stateProxy.speed = 0;
    }

}


interface BreedConfig extends FeatureConfig {
    childLimit: number;
    ageMaxium: number;
    ageMinium: number;
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
    protected static _config: Map<Function, BreedConfig> = new Map()

    static useConfig(config: BreedConfig) {
        return function (constructor: Constructor<Model>) {
            BreedModel._config.set(constructor, config)
        }
    }

    constructor(props: BreedModel<T>['props']) {
        const superProps = FeatureModel.superProps(props);
        super({
            ...superProps,
            child: props.child ?? [],
            state: {
                ...superProps.state,
            }
        });
    }

    get config(): BreedConfig {
        const defaultConfig: BreedConfig = {
            ageMaxium: 1,
            ageMinium: 1,
            childLimit: 3,
            isEnabledDefault: false,
        }
        if (!this.parent) return defaultConfig;
        const config = BreedModel._config.get(this.parent.constructor);
        return config ?? defaultConfig;
    }

    @Model.if(model => model.state.isEnabled)
    @Model.if(model => model.state.isAlive)
    @Model.if(model => model.state.isFemale)
    @Model.if(model => model.state.age <= model.config.ageMaxium)
    @Model.if(model => model.state.age >= model.config.ageMinium)
    @Model.if(model => model.child.length < model.config.childLimit)
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
    @Model.if(model => model.child.length < model.config.childLimit)
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
    @Model.useLogger()
    disposeChild(event?: DieEvent) {
        const child = event?.target ?? this.child[0];
        if (!child) return;
        const result = this.removeChild(child);
        return result;
    }

    @Model.onChildLoad()
    @Model.useLogger()
    private _useChildDie(child: Model) {
        if (!(child instanceof AnimalModel)) return;
        if (child.parent !== this) return;
        this.bindEvent(
            child.event.onDie,
            this.disposeChild
        )
    }
}

@FactoryService.useProduct('disease')
export class DiseaseModel extends FeatureModel<{
    ageWaste: number,
}> {
    constructor(props: DiseaseModel['props']) {
        super({
            ...props,
            state: {
                ageWaste: props.state?.ageWaste ?? 1,
            },
            child: {},
        });
    }

    @Model.if(model => model.state.isAlive)
    deteriorate() {
        this.stateProxy.ageWaste += 1;
        this.parent?.reloadState()
    }

    @Model.onLoad()
    private _useAgeUpdate() {
        const parent = this.parent;
        if (!parent) return;
        this.bindState(
            this.parent,
            (prevState) => {
                return {
                    ...prevState,
                    ageLimit: prevState.ageLimit - this.state.ageWaste,
                }
            }
        )
    }
}
