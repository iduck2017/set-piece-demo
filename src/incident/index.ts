import { IngSocModel } from "../ing-soc";
import { Method, Model, Props } from "set-piece";


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

    constructor(loader: Method<IncidentModel['props'] & {
        state: S,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }
}