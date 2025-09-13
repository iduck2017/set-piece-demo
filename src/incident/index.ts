import { IngSocModel } from "../ing-soc";
import { Method, Model, Props } from "set-piece";

export namespace IncidentProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type P = {
        ingsoc: IngSocModel;
    };
    export type R = {};
}

export abstract class IncidentModel<
    E extends Partial<IncidentProps.E> & Props.E = {},
    S extends Partial<IncidentProps.S> & Props.S = {},
    C extends Partial<IncidentProps.C> & Props.C = {},
    R extends Partial<IncidentProps.R> & Props.R = {},
    P extends Partial<IncidentProps.P> & Props.P = {}
> extends Model<
    E,
    S & IncidentProps.S,
    C,
    R,
    P & IncidentProps.P
> {
    constructor(loader: Method<IncidentModel['props'] & {
        state: S,
        child: C,
        refer: R,
        route: P,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    ingsoc: IngSocModel.prototype,
                    ...props.route,
                }
            }
        })
    }
}