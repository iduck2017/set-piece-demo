import { Event, EventOnStateCompute, EventOnChildUpdate, EventOnStateUpdate } from "../types/event";
import { Value } from "../types/base"
import { LifecycleService } from "@/services/lifecycle";
import { StorageService } from "@/services/storage";

export enum ModelStatus {
    UNINITED = 'uninited',
    INITING = 'initing',
    INITED = 'inited',
    UNINITING = 'uniniting',
}

export class Model<
    S extends Record<string, Value> = {},
    E extends Record<string, Event> = {},
    C extends Record<string, Model> | Model[] = any,
> {
    constructor(props: Readonly<{
        uuid?: string,
        state: Readonly<S & { _never?: never }>,
        child: Readonly<C & { _never?: never }>
    }>) {

        // assign unique id 
        this.uuid = props.uuid || StorageService.uuid;

        // delegate state, observe update
        this.stateProxy = new Proxy(props.state, {
            set: (target, key, value) => {
                Reflect.set(target, key, value);
                this.resetState();
                return true;
            },
            deleteProperty: (target, key) => {
                Reflect.deleteProperty(target, key);
                this.resetState();
                return true;
            }
        })

        // init state cache
        this._stateCache = { ...this.stateProxy }

        // precheck child
        const childOrigin: any = props.child instanceof Array ? [] : {};
        for (const key of Object.keys(props.child)) {
            const value = Reflect.get(props.child, key);
            if (value instanceof Model) {
                const model = value.status === ModelStatus.UNINITED ? value : value.copy();
                Reflect.set(childOrigin, key, model);
            }
        }

        // delegate child, observe update
        this.childProxy = new Proxy(childOrigin, {
            get: (origin, key: string) => {
                const value = Reflect.get(origin, key);
                // delegate all array methods with side effects
                switch (key) {
                    case 'fill': 
                        // delegate fill method
                        return this._fillChild.bind(this)
                    case 'pop': 
                    case 'sort': 
                    case 'push': 
                    case 'shift': 
                    case 'splice':  
                    case 'unshift': 
                    case 'reverse':
                        return (...args: any[]) => {
                            const argsNew = this.precheckChild(args);
                            this._childLock = true;
                            const result = value.bind(origin, ...argsNew);
                            this._childLock = false;
                            this.resetChild();
                            return result;
                        }
                }
                return value;
            },
            set: (origin, key, value) => {
                const args = [value];
                value = this.precheckChild(args)[0];
                Reflect.set(origin, key, value);
                this.resetChild();
                return true;
            },
            deleteProperty: (target, key) => {
                Reflect.deleteProperty(target, key);
                this.resetChild();
                return true;
            }
        })
        
        this._childCache = this._copyChild(this.childProxy);
    }

    
    /**
     * Output debug info
     * @feature debug
     * @param options
     * @param options.state - debug state
     * @param options.child - debug child
     * @param options.stateProxy - debug stateProxy
     * @param options.childProxy - debug childProxy
     */
    debug(options?: {
        state?: boolean,
        child?: boolean,
        stateProxy?: boolean,
        childProxy?: boolean,
    }) {
        console.log('☕', 'Model name:', this.name);
        if (options?.state) console.log('☕', this.state);
        if (options?.child) console.log('☕', this.child);
        if (options?.stateProxy) console.log('☕', this.stateProxy);
        if (options?.childProxy) console.log('☕', this.childProxy);
    }

    /**
     * Observe state and child update
     * @feature debug
     * @param setter 
     * @returns 
     */
    useModel(setter: (event: { target: Model }) => void) {
        this.bindEvent(this.event.onChildUpdate, setter);
        this.bindEvent(this.event.onStateUpdate, setter);
        return () => {
            this.unbindEvent(this.event.onChildUpdate, setter);
            this.unbindEvent(this.event.onStateUpdate, setter);
        }
    }
    
    /**
     * Get props, also used as constructor parameters
     * @feature factory
     * @returns props
     * @returns props.uuid - unique id
     * @returns props.state - state
     * @returns props.child - child
     */
    get props(): Readonly<{
        uuid?: string,
        state?: Readonly<Partial<S & { _never?: never }>>,
        child?: Readonly<Partial<C & { _never?: never }>>
    }> {
        return {
            uuid: this.uuid,
            child: this.child,
            state: { ...this.stateProxy },
        }
    }

    /**
     * Create a duplication of current model
     * @feature factory
     * @param uuid - unique id, auto generate if not provided
     * @returns cloned model
     */
    copy(uuid?: string): this {
        const constructor: any = this.constructor;
        const props = this.props;
        return new constructor({
            ...props,
            uuid: uuid || StorageService.uuid,
        })
    }

    /**
     * Declare model as root, it will be initialized immediately
     * @decorator
     * @feature factory
     */
    protected static isRoot<T extends new (...args: any[]) => Model>() {
        return function (Type: T): T {
            return class extends Type {
                constructor(...args: any[]) {
                    super(...args);
                    this._init();
                }
            }
        };
    }


    /**
     * Delegate event
     * @proxy
     * @feature event
     */
    readonly event: E & {
        onChildUpdate: EventOnChildUpdate<S, C>
        onStateUpdate: EventOnStateUpdate<S>
        onStateCompute: EventOnStateCompute<S>
    } = new Proxy({} as any, {
        deleteProperty: () => false,
        set: () => false,
        get: (target, key: string) => {
            if (!Reflect.has(target, key)) {
                const event = new Event(this);
                Reflect.set(target, key, event);
                this._eventProducers.set(event, key);
            }
            return Reflect.get(target, key)
        }
    })
    private readonly _eventHandlers = new Map<Event, (event: any) => unknown>()
    private readonly _eventProducers = new Map<Event, string>()
    private readonly _eventConsumers = new Map<(event: any) => unknown, Event>()
    private readonly _eventChannels = new Map<Event, Event[]>()

    /**
     * Emit event
     * @feature event
     * @param producer - event producer
     * @param event - event
     */
    @LifecycleService.isInited()
    protected emitEvent<E>(producer: Event<E>, event: E) {
        if (this !== producer.target) {
            console.warn('Event producer from other model is not emittable');
            return;
        }
        console.log('🔔', 'Event emit:', this._eventProducers.get(producer), event);
        const consumers = this._eventChannels.get(producer) || [];
        for (const consumer of consumers) {
            const { target } = consumer;
            const handler = target._eventHandlers.get(consumer);
            if (handler) handler(event);
            else console.warn('Event handler not found');
        }
    }
    
    @LifecycleService.isNotUninited()
    protected bindEvent<E>(
        producer: Event<E>, 
        handler: (event: E) => unknown
    ) {
        const { target } = producer;
        console.log('🔔', 'Event bind', target.name, target._eventProducers.get(producer));

        const consumer = this._eventConsumers.get(handler) ?? new Event(this);
        this._eventConsumers.set(handler, consumer);
        this._eventHandlers.set(consumer, handler);

        const consumers = target._eventChannels.get(producer) || [];
        consumers.push(consumer);
        target._eventChannels.set(producer, consumers);

        const producers = this._eventChannels.get(consumer) || [];
        producers.push(producer);
        this._eventChannels.set(consumer, producers);

        if (producer.target.event.onStateCompute === producer) {
            target.resetState();
        }
    }

    @LifecycleService.isNotUninited()
    protected unbindEvent<E>(
        producer: Event<E> | undefined,
        handler: (event: E) => unknown
    ) {
        const consumer = this._eventConsumers.get(handler);
        if (!consumer) return;

        const producers = this._eventChannels.get(consumer) || [];
        for (const curProducer of [...producers]) {
            if (producer && curProducer !== producer) continue;
            
            const { target } = curProducer;
            console.log('🔔', 'Event unbind', target.name, target._eventProducers.get(curProducer));
            
            let consumers = target._eventChannels.get(curProducer) || [];
            consumers = consumers.filter(target => target !== consumer);
            target._eventChannels.set(curProducer, consumers);

            if (curProducer.target.event.onStateCompute === curProducer) {
                target.resetState();
            }
            const index = producers.indexOf(curProducer);
            if (index !== -1) producers.splice(index, 1);
        }

        this._eventChannels.set(consumer, producers);
    }


    /** @feature state */
    get state(): Readonly<S> {
        return { ...this._stateCache }
    }
    private _stateCache: Readonly<S>
    protected readonly stateProxy: S

    resetState() {
        const statePrev = { ...this._stateCache };
        const stateNext = { ...this.stateProxy }
        
        this.emitEvent(this.event.onStateCompute, { 
            target: this, 
            stateNext 
        });
        this._stateCache = { ...stateNext};
        this.emitEvent(this.event.onStateUpdate, { 
            target: this, 
            statePrev,
            stateNext
        });
    }

    /**
     * Parent node, specified in initialization
     * For root node, there is no parent
     * @feature parent
     */
    private _parent?: Model
    public get parent() { return this._parent; }

    /**
     * Assert ancestor node and its related nodes
     * @feature parent
     */
    get parentRefer() { return {} } 

    protected queryParent<T extends Model>(
        type: new (...args: any[]) => T,
        options?: {
            validator?: (target: Model) => any,
            terminator?: (target: Model) => any
        }
    ): T | undefined {
        const { validator, terminator } = options || {};
        let target: Model | undefined = this.parent;
        while (target) {
            if (terminator?.(target)) return undefined;
            if (target instanceof type) {
                if (!validator) return target;
                if (validator?.(target)) return target;
            }
            target = target.parent;
        }
        return undefined;
    }



    /**
     * child is initializing in transaction
     * @feature lifecycle
     */
    private _childLock = false;

    protected readonly childProxy: C
    private _childCache: Readonly<C>
    private readonly _childRefer: Record<string, Model> = {}

    /**
     * Child accesser
     * @feature child
     */
    get child(): Readonly<C> { 
        return this._copyChild(this._childCache) 
    }

    private _copyChild(origin: C): C {
        const child: any = origin instanceof Array ? [] : {};
        for (const key of Object.keys(origin)) {
            const value = Reflect.get(origin, key);
            if (value instanceof Model) {
                Reflect.set(child, key, value);
            }
        }
        return child;
    }

    private _listChild(child: C): Model[] {
        const list: Model[] = [];
        for (const key of Object.keys(child)) {
            const value = Reflect.get(child, key);
            if (value instanceof Model) list.push(value);
        }
        return list;
    }

    @Model.useChildLock()
    protected removeChild(model?: Model): Model | undefined {
        if (!model) return;
        if (this.childProxy instanceof Array) {
            const index = this.childProxy.indexOf(model);
            if (index === -1) return;
            this.childProxy.splice(index, 1);
            return model;
        } else {
            for (const key of Object.keys(this.childProxy)) {
                const value = Reflect.get(this.childProxy, key);
                if (value !== model) continue;
                Reflect.deleteProperty(this.childProxy, key);
                return model;
            }
        }
    }

    @Model.useChildLock()
    private _fillChild(child: Model) {
        console.warn('Fill is not recommended, copied model will be filled in array instead');
        for (const key of Object.keys(this.childProxy)) {
            const value = child.copy();
            Reflect.set(this.childProxy, key, value);
        }
        return this.childProxy
    }

    /**
     * Operate child in transaction, reset child at the end
     * @decorator
     * @feature lifecycle, child
     */
    protected static useChildLock() {
        return function(
            target: Model,
            key: string,
            descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
        ) {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            descriptor.value = function(this: Model, ...args: any[]) {
                if (this._childLock) return handler.apply(this, args);
                this._childLock = true;
                const result = handler.apply(this, args);
                this._childLock = false;
                this.resetChild();
                return result;
            }
            return descriptor;
        }
    }

    /**
     * Reset child
     * @feature lifecycle
     */
    resetChild() {
        if (this._childLock) return;
        this._diffChild();
        const childPrev = this.child
        this._childCache = this._copyChild(this.childProxy);
        const childNext = this.child;
        this.emitEvent(this.event.onChildUpdate, { 
            target: this, 
            childPrev,
            childNext
        })
    }

    /**
     * Check argument
     * If value is a uninited model, replace with it's copy
     * If same model in argument, make copies for rest of them
     * @feature child
     * @param value 
     * @returns 
     */
    protected precheckChild<T extends any[]>(value: T): T {
        const result: any = [];
        for (const item of value) {
            if (this._childLock) result.push(item);
            else if (!(item instanceof Model)) result.push(item);
            else if (result.includes(item)) {
                console.warn('Duplicate model in argument', new Error().stack);
                result.push(item);
            }
            else if (item.status === ModelStatus.UNINITED) result.push(item);
            else {
                console.warn('Argument should be an uninited model', new Error().stack);
                result.push(item.copy());
            }
        }
        return result;
    }

    @LifecycleService.isNotUninited()
    private _diffChild() {
        const childNext = this._listChild(this.childProxy);
        const childPrev = this._listChild(this.child);
        const childInit = childNext.filter(child => !childPrev.includes(child));
        const childUninit = childPrev.filter(child => !childNext.includes(child));
        console.log('👶', 'Child will be inited:', childInit);
        console.log('👶', 'Child will be uninited:', childUninit);

        for (const child of childInit) child._init(this);
        for (const child of childUninit) child._uninit();
    }

    private _status: ModelStatus = ModelStatus.UNINITED
    get status() { return this._status; }

    @LifecycleService.isUninited()
    private _init(parent?: Model) {
        this._status = ModelStatus.INITING;

        console.log('⏰', 'Model init:', this.name)

        // Initialize child first
        for (const child of this._listChild(this.childProxy)) {
            child._init(this);
        }

        // Trigger child init hooks of all ancestor nodes
        if (parent) {
            this._parent = parent;
            this._parent._childRefer[this.uuid] = this;
            let ancestor: Model | undefined = this._parent;
            while (ancestor) {
                let constructor: any = ancestor.constructor;
                while (constructor.__proto__ !== null) {
                    const keys = LifecycleService.childInitHooks.get(constructor) || [];
                    for (const key of keys) {
                        const initer = Reflect.get(ancestor, key);
                        if (typeof initer === 'function') initer.call(ancestor);
                    }
                    constructor = constructor.__proto__;
                }
                ancestor = ancestor.parent;
            }
        }

        // Trigger init hooks
        let constructor: any = this.constructor;
        while (constructor.__proto__ !== null) {
            const keys = LifecycleService.initHooks.get(constructor) || [];
            for (const key of keys) {
                const initer = Reflect.get(this, key);
                if (typeof initer === 'function') initer.call(this);
            }
            constructor = constructor.__proto__;
        }
        
        this._status = ModelStatus.INITED;
    }


    /**
     * Uninitialize model, it will uninitialize all child nodes and clear all event bindings
     * @feature lifecycle
     */
    @LifecycleService.isInited()
    private _uninit() {
        this._status = ModelStatus.UNINITING;

        console.log('⏰', 'Model uninit:', this.name)

        // Uninitialize child first
        for (const child of this._listChild(this.childProxy)) {
            child._uninit();
        }

        // Unbind all event
        for (const channel of this._eventChannels) {
            const entity = channel[0];

            // Unbind all event consumer
            const handler = this._eventHandlers.get(entity);
            if (handler) this.unbindEvent(undefined, handler)
                
            // Unbind all event producer
            else if (this._eventProducers.has(entity)) {
                const [ producer, consumers ] = channel;
                consumers.forEach(consumer => {
                    const handler = consumer.target._eventHandlers.get(consumer);
                    if (!handler) return;
                    consumer.target.unbindEvent(producer, handler)
                });
            }
        }

         // Trigger child uninit hooks of all ancestor nodes
         const parent = this._parent;
         if (parent) {
            this._parent = undefined;
            parent._childRefer[this.uuid] = this;
            let ancestor: Model | undefined = parent;
            while (ancestor) {
                let constructor: any = ancestor.constructor;
                while (constructor.__proto__ !== null) {
                    const keys = LifecycleService.childInitHooks.get(constructor) || [];
                    for (const key of keys) {
                        const initer = Reflect.get(ancestor, key);
                        if (typeof initer === 'function') initer.call(ancestor);
                    }
                    constructor = constructor.__proto__;
                }
                ancestor = ancestor.parent;
            }
        }

        // Trigger uninit hooks
        let constructor: any = this.constructor;
        while (constructor.__proto__ !== null) {
            const keys = LifecycleService.uninitHooks.get(constructor) || [];
            for (const key of keys) {
                const uniniter = Reflect.get(this, key);
                if (typeof uniniter === 'function') uniniter.call(this);
            }
            constructor = constructor.__proto__;
        }

        this._status = ModelStatus.UNINITED;
    }

    /**
     * Get constructor name
     * Sometimes, the constructor is anonymous, access the name from the prototype chain
     * @feature factory
     */
    get name() {
        let constructor: any = this.constructor;
        while (constructor.__proto__ !== null) {
            if (constructor.name) return constructor.name;
            constructor = constructor.__proto__;
        }
        return constructor.name;
    }


    /**
     * Unique id of model
     * @feature uuid
     */
    readonly uuid: string;

    /**
     * Accessor the path from the root node to the current model
     * If the model is not initialized, it will only return it's uuid
     * @feature uuid
     * @returns path
     */
    get path(): string[] {
        if (this._status !== ModelStatus.INITED) {
            console.warn('Path is not available until model is initialized');
        }
        return this.parent?.path.concat(this.uuid) || [this.uuid]
    }

    /**
     * Query child by path
     * @feature uuid
     * @param path - path
     * @returns child
     */
    queryChild(path: string[] | string): Model | undefined {
        if (typeof path === 'string') return this._childRefer[path];
        for (const uuid of path) {
            const target = this._childRefer[uuid];
            if (!target) continue;
            const index = path.indexOf(uuid) + 1;
            return target.queryChild(path.slice(index));
        }
        return undefined;
    }
}


