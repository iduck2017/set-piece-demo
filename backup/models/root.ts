import { Model, FactoryService, Event } from "set-piece";
import { DogModel } from "./animal";
import { GenderType } from "@/utils/types";

@Model.useRoot()
export class RootModel extends Model<{
    count: number
}, {
    onStart: Event<{ target: RootModel }>
    onQuit: Event<{ target: RootModel }>
}, {
    dog?: DogModel,
}> {
    constructor(props: RootModel['props']) {
        super({
            ...props,
            child: {},
            state: {
                count: props.state?.count ?? 0,
            },
        });
    }

    @Model.useAutomic()
    @Model.useLogger()
    countup() {
        this.setState(prev => ({ count: prev.count + 1 }));
        this.setState(prev => ({ count: prev.count + 1 }));
    }

    @Model.if(model => !model.child.dog)
    start() {
        const chunk = localStorage.getItem('demo');
        let dog: DogModel | undefined = undefined;
        if (chunk) {
            try { 
                const chunkJSON = JSON.parse(chunk);
                dog = FactoryService.deserialize(chunkJSON); 
            } catch (error) {}
        }
        if (!dog) dog = new DogModel({
            state: { gender: GenderType.FEMALE },
        });
        this.childProxy.dog = dog
        this.emitEvent(this.event.onStart, { target: this });
    }

    @Model.if(model => model.child.dog)
    quit() {
        delete this.childProxy.dog;
        this.emitEvent(this.event.onQuit, { target: this });
        return undefined;
    }

    @Model.if(model => model.child.dog)
    save() {
        if (!this.child.dog) return;
        const chunk = FactoryService.serialize(this.child.dog);
        if (!chunk) return;
        localStorage.setItem('demo', JSON.stringify(chunk));
        return chunk;
    }



}