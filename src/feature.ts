import { Model, StoreService } from "set-piece";

export namespace FeatureDefine {
    export type E = {};
    export type S1 = {};
    export type S2 = { name: string};
}

@StoreService.is('feature')
export class FeatureModel extends Model<
    FeatureDefine.E,
    FeatureDefine.S1,
    FeatureDefine.S2
> {
    constructor(props: Model.Props<FeatureModel>) {
        super({
            ...props,
            state: {
                name: '',
                ...props.state,
            },
            refer: {
                ...props.refer,
            },
            child: {
                ...props.child,
            },
        });
    }
}