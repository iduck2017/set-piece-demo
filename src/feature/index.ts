import { DemoModel } from "../demo";
import { StaffModel, StaffProps } from "../staff";
import { Format, Method, Model, Props } from "set-piece";

export namespace FeatureProps {
    export type E = {};
    export type S = { isActive: boolean; };
    export type C = {};
    export type R = {};
    export type P = { staff: StaffModel };
}

export abstract class FeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
    P extends Partial<FeatureProps.P> & Props.P = {},
> extends Model<
    E & FeatureProps.E, 
    S & FeatureProps.S, 
    C & FeatureProps.C,
    R & FeatureProps.R, 
    P & FeatureProps.P
> {
    constructor(loader: Method<FeatureModel['props'] & {
        uuid: string | undefined,
        state: S,
        child: C,
        refer: R,
        route: P
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { 
                    isActive: true,
                    ...props.state 
                },
                child: { 
                    ...props.child,
                },
                refer: { ...props.refer },
                route: {
                    staff: StaffModel.prototype,
                    ...props.route,
                }
            }
        })
    }
}

