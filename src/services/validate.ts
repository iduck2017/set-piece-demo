export class ValidateService {

    private static _validators: Map<Function, Record<string, ((...args: any[]) => any)[]>> = new Map();
    
    static validate<M extends Record<string, any>>(
        target: M,
        key: string,
        ...args: any[]
    ) {
        const conditionList: ((...args: any[]) => any)[] = [];
        let constructor: any = target.constructor;
        while (constructor.__proto__ !== null) {
            const curConditionList = ValidateService._validators.get(constructor)?.[key] || [];
            conditionList.push(...curConditionList);
            constructor = constructor.__proto__;
        }
        for (const condition of conditionList) {
            if (!condition(target, ...args)) return false;
        }
        return true;
    }

    private static _setValidator(
        condition: (...args: any[]) => any,
        target: Record<string, any>,
        key: string
    ) {
        const constructor = target.constructor;
        const conditionList = ValidateService._validators.get(constructor) || {};
        conditionList[key] = conditionList[key] || [];
        conditionList[key].push(condition);
        ValidateService._validators.set(constructor, conditionList);
    }

    static useValidator< 
        N extends Record<string, any>, 
        P extends any[] = any[],
        T = any
    >(
        validator: (target: N, ...args: P) => any,
        error?: string | Error,
    ) {
        return function (
            target: N,
            key: string,
            descriptor: TypedPropertyDescriptor<(...args: P) => T | undefined>
        ): TypedPropertyDescriptor<(...args: P) => T | undefined> {
            ValidateService._setValidator(validator, target, key);
            let handler = descriptor.value;
            descriptor.value = function(this: N, ...args: P) {
                const result = validator(this, ...args);
                if (result && handler) return handler.apply(this, args);
                if (error instanceof Error) throw error;
                if (error) console.warn(error);
                return
            }
            return descriptor;
        };
    }

    private constructor() {}
}