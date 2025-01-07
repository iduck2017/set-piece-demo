import { Model, ModelStatus } from "@/models";
import { ValidateService } from "./validate";

export class LifecycleService {

    private static readonly _initHooks = new Map<Function, string[]>()
    private static readonly _uninitHooks = new Map<Function, string[]>()
    private static readonly _childInitHooks = new Map<Function, string[]>()
    private static readonly _childUninitHooks = new Map<Function, string[]>()

    public static get initHooks() { return new Map(LifecycleService._initHooks) }
    public static get uninitHooks() { return new Map(LifecycleService._uninitHooks) }
    public static get childInitHooks() { return new Map(LifecycleService._childInitHooks) }
    public static get childUninitHooks() { return new Map(LifecycleService._childUninitHooks) }

    /**
     * Trigger when the model is initialized
     * @decorator
     * @feature lifecycle
     */
    static onInit() {
        return function(
            target: Model,
            key: string,
            descriptor: TypedPropertyDescriptor<() => unknown>
        ): TypedPropertyDescriptor<() => unknown> {
            const keys = LifecycleService._initHooks.get(target.constructor) || [];
            keys.push(key);
            LifecycleService._initHooks.set(target.constructor, keys);
            return descriptor;
        };
    }

    /**
     * Trigger when the model is uninitialized
     * @decorator
     * @feature lifecycle
     */
    static onUninit() {
        return function(
            target: Model,
            key: string,
            descriptor: TypedPropertyDescriptor<() => unknown>
        ): TypedPropertyDescriptor<() => unknown> {
            const keys = LifecycleService._uninitHooks.get(target.constructor) || [];
            keys.push(key);
            LifecycleService._uninitHooks.set(target.constructor, keys);
            return descriptor;
        };
    }

    /**
     * Trigger when the model's descendant node is initialized
     * @decorator
     * @feature lifecycle
     */
    static onChildInit() {
        return function(
            target: Model,
            key: string,
            descriptor: TypedPropertyDescriptor<(child: Model) => unknown>
        ): TypedPropertyDescriptor<(child: Model) => unknown> {
            const keys = LifecycleService._childInitHooks.get(target.constructor) || [];
            keys.push(key);
            LifecycleService._childInitHooks.set(target.constructor, keys);
            return descriptor;
        };
    }

    /**
     * Trigger when the model's descendant node is uninitialized
     * @decorator
     * @feature lifecycle
     */
    static onChildUninit() {
        return function(
            target: Model,
            key: string,
            descriptor: TypedPropertyDescriptor<(child: Model) => unknown>
        ): TypedPropertyDescriptor<(child: Model) => unknown> {
            const keys = LifecycleService._childUninitHooks.get(target.constructor) || [];
            keys.push(key);
            LifecycleService._childUninitHooks.set(target.constructor, keys);
            return descriptor;
        };
    }


    /**
     * Check if model is inited
     * @decorator
     * @feature lifecycle
     * @param fallback - fallback value when condition not satisfied
     */
    static isInited() {
        return ValidateService.useValidator<Model>(
            (model) => model.status === ModelStatus.INITED,
        );
    }

    /**
     * Check if model is not uninited
     * @decorator
     * @feature lifecycle
     * @param fallback - fallback value when condition not satisfied
     */
    static isNotUninited() {
        return ValidateService.useValidator<Model>(
            (model) => model.status !== ModelStatus.UNINITED,
        );
    }

    /**
     * Check if model is uninited
     * @decorator
     * @feature lifecycle
     * @param fallback - fallback value when condition not satisfied
     */
    static isUninited() {
        return ValidateService.useValidator<Model>(
            (model) => model.status === ModelStatus.UNINITED,
        );
    }
    
    private constructor() {}
}