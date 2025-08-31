import { IngSocModel } from "../ing-soc";
import { Model, Props } from "set-piece";


export abstract class IncidentModel<
    E extends Props.E = {},
    S extends Props.S = {},
    C extends Props.C = {},
    R extends Props.R = {}
> extends Model<E, S, C, R> {
    public get route() {
        const ingsoc = super.route.parent;
        return {
            ...super.route,
            ingsoc: ingsoc instanceof IngSocModel ? ingsoc : undefined,
        }
    }

    constructor(props: IncidentModel['props'] & {
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