import { Model } from ".";
import { ValidateService } from "@/services/validate";
import { Event } from "../types/event";
import { DogModel, DuckModel } from "./animal";
import { BreedModel, GenderType } from "./features";
import { RootModel } from "./root";
import { StorageService } from "@/services/storage";

@StorageService.useProduct('demo')
export class DemoModel extends Model<
    { 
        flag: boolean
        count: number
    },
    {
        onTic: Event<{ target: DemoModel }>
    },
    {
        duck: DuckModel,
        dog: DogModel,
    }
> {
    constructor(props: DemoModel['props']) {
        super({
            ...props,
            state: {
                flag: props.state?.flag ?? false,
                count: props.state?.count ?? 0,
            },
            child: {
                duck: props.child?.duck ?? new DuckModel({
                    child: {
                        breed: new BreedModel({
                            state: { gender: GenderType.FEMALE }
                        })
                    }
                }),
                dog: props.child?.dog ?? new DogModel({
                    child: {
                        breed: new BreedModel({
                            state: { gender: GenderType.FEMALE }
                        })
                    }
                }),
            }
        });
    }

    count() {
        this.stateProxy.count++;
    }

    @ValidateService.useValidator(model => model.state.flag, undefined)
    tic() {
        this.emitEvent(this.event.onTic, { target: this });
        return undefined;
    }
}