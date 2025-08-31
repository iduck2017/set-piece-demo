import { StaffModel, StaffProps } from "../staff";
import { Model, Props } from "set-piece";

export namespace FeatureProps {
    export type E = {};
    export type S = { isActive: boolean; };
    export type C = {};
    export type R = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {}
> extends Model<E, S, C, R> {
    public get route() {
        const staff = super.route.parent;
        return {
            ...super.route,
            staff: staff instanceof StaffModel ? staff : undefined,
        }
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined,
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}

