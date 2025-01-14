import { Model, FactoryService, ValidateService, Event } from "set-piece";
import { DogModel } from "./animal";
import { GenderType } from "@/utils/types";

@Model.asRoot()
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

    countup() {
        this.stateProxy.count++;
        return undefined;
    }

    @ValidateService.useCheck(model => !model.child.dog)
    startGame() {
        const chunk = localStorage.getItem('demo');
        let dog: DogModel | undefined = undefined;
        if (chunk) {
            try { 
                const chunkJSON = JSON.parse(chunk);
                dog = FactoryService.deserialize(chunkJSON); 
            } catch (error) {}
        }
        if (!dog) dog = new DogModel({
            state: {
                gender: GenderType.FEMALE
            },
        });
        this.childProxy.dog = dog
        this.emitEvent(this.event.onStart, { target: this });
        return undefined;
    }

    @ValidateService.useCheck(model => model.child.dog)
    quitGame() {
        delete this.childProxy.dog;
        this.emitEvent(this.event.onQuit, { target: this });
        return undefined;
    }

    @ValidateService.useCheck(model => model.child.dog)
    save() {
        if (!this.child.dog) return;
        const chunk = FactoryService.serialize(this.child.dog);
        if (!chunk) return;
        localStorage.setItem('demo', JSON.stringify(chunk));
        return chunk;
    }



}