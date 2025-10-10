import { IngSocModel } from "../ing-soc";
import { Method, Model } from "set-piece";

export namespace IncidentModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class IncidentModel<
    E extends Partial<IncidentModel.E> & Model.E = {},
    S extends Partial<IncidentModel.S> & Model.S = {},
    C extends Partial<IncidentModel.C> & Model.C = {},
    R extends Partial<IncidentModel.R> & Model.R = {},
> extends Model<
    E & IncidentModel.E,
    S & IncidentModel.S,
    C & IncidentModel.C,
    R & IncidentModel.R
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            ingsoc: route.list.find(item => item instanceof IngSocModel)
        }
    }

    constructor(props: IncidentModel['props'] & {
        uuid: string | undefined,
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}