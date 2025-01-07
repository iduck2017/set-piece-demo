import { ValidateService } from "@/services/validate";
import { Model } from ".";
import { DemoModel } from "./demo";
import { StorageService } from "@/services/storage";
import { Event } from "@/types/event";

@Model.isRoot()
export class RootModel extends Model<{}, {
    onStart: Event<{ target: RootModel }>
    onQuit: Event<{ target: RootModel }>
}, {
    demo?: DemoModel
}> {
    private static _singleton: Map<Function, any | undefined> = new Map();
    static isSingleton<T extends new (...args: any[]) => Model>() {
        return function (constructor: T) {
            RootModel._singleton.set(constructor, undefined);
            return class extends constructor {
                constructor(...args: any[]) {
                    super(...args);
                    if (RootModel._singleton.has(constructor)) {
                        console.warn('Singleton already exists: ', this.name);
                        return RootModel._singleton.get(constructor);
                    }
                    RootModel._singleton.set(constructor, this);
                }
            };
        };
    }

    constructor(props: RootModel['props']) {
        super({
            ...props,
            child: {},
            state: {},
        });
    }

    @ValidateService.useValidator(model => !model.child.demo)
    startGame() {
        const chunk = localStorage.getItem('demo');
        let demo: DemoModel | undefined = undefined;
        if (chunk) {
            try { 
                const chunkJSON = JSON.parse(chunk);
                console.log('💾', 'Load chunk data:', chunkJSON);
                demo = StorageService.deserialize(chunkJSON); 
                console.log('💾', 'Load model:', demo?.name, demo);
            } catch (error) {
                console.warn('💾', 'Load chunk error:', error);
            }
        }
        if (!demo) demo = new DemoModel({});
        this.childProxy.demo = demo
        this.emitEvent(this.event.onStart, { target: this });
        return undefined;
    }

    @ValidateService.useValidator(model => model.child.demo)
    quitGame() {
        const demo = this.child.demo;
        delete this.childProxy.demo;
        this.emitEvent(this.event.onQuit, { target: this });
        return demo;
    }

    @ValidateService.useValidator(model => model.child.demo)
    save() {
        if (!this.child.demo) return;
        const chunk = StorageService.serialize(this.child.demo);
        if (!chunk) return;
        console.log('💾', 'Save chunk:', chunk);
        localStorage.setItem('demo', JSON.stringify(chunk));
        return chunk;
    }
}