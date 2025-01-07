import { Model } from "@/models";
import Joi from "joi";

export class StorageService {
    
    /**
     * Map from product code to model constructor
     */
    private static _products: Map<string, any> = new Map();
    /**
     * Map from model constructor to product code
     */
    private static _identifiers: Map<Function, string> = new Map();
    
    /**
     * Register model as product
     * @decorator
     * @param code 
     * @returns 
     */
    static useProduct<T extends string>(code: T) {
        return function (constructor: new (...args: any[]) => Model) {
            StorageService._products.set(code, constructor);
            StorageService._identifiers.set(constructor, code);
        };
    }

    private static _ticket = Date.now() % (36 ** 2);
    private static _timestamp = Date.now(); 
    
    static get uuid(): string {
        let now = Date.now();
        const ticket = StorageService._ticket;
        StorageService._ticket += 1;
        if (StorageService._ticket > 36 ** 3 - 1) {
            StorageService._ticket = 36 ** 2;
            while (now === StorageService._timestamp) now = Date.now();
        }
        this._timestamp = now;
        return now.toString(36) + ticket.toString(36);
    }
  

    /**
     * Serialize model to json data (chunk)
     * @param model - model 
     * @returns chunk
     */
    static serialize(model: Model) {
        const code = StorageService._identifiers.get(model.constructor);
        if (!code) return undefined;
        const props = model.props;
        const child = props.child instanceof Array ? [] : {};
        if (!props.child) return undefined;
        Object.keys(props.child).forEach(key => {
            const value = props.child?.[key];
            if (!(value instanceof Model)) return undefined;
            const chunk = StorageService.serialize(value);
            if (!chunk) return undefined;
            Reflect.set(child, key, chunk);
        });
        return {
            code,
            uuid: props.uuid,
            state: props.state,
            child,
        }
    }


    /**
     * Deserialize json data to model
     * @param chunk - json data
     * @returns model
     */
    static deserialize(chunk: {
        code: string,
        uuid: string,
        state: Record<string, any>,
        child: Record<string, any>
    }) {
        if (!chunk) return undefined;
        
        // Validate chunk schema
        const schema = Joi.object({
            uuid: Joi.string().optional(),
            code: Joi.string().required(),
            state: Joi.object().required(),
            child: Joi.alternatives().try(
                Joi.object(),
                Joi.array()
            ).required()
        });
        const { error } = schema.validate(chunk);
        if (error) return undefined;

        // Get model type
        const Type = StorageService._products.get(chunk.code);
        if (!Type) return undefined;

        // Check child
        // const child = chunk.child instanceof Array ? [] : {};
        // Object.keys(chunk.child).forEach(key => {
        //     const value = chunk.child[key];
        //     const model = StorageService.deserialize(value);
        //     if (!model) return undefined;
        //     Reflect.set(child, key, model);
        // });
        let child: any;
        if (chunk.child instanceof Array) {
            child = [];
            for (const value of chunk.child) {
                const model = StorageService.deserialize(value);
                if (!model) return undefined;
                child.push(model);
            }
        } else {
            child = {};
            for (const key of Object.keys(chunk.child)) {
                const value = chunk.child[key];
                const model = StorageService.deserialize(value);
                if (!model) return undefined;
                Reflect.set(child, key, model);
            }
        }

        // Create model
        return new Type({
            code: chunk.code,
            uuid: chunk.uuid,
            state: chunk.state,
            child,
        });
    }

    private constructor() {}
}