import { IngSocModel } from "../ing-soc";
import { Model } from "set-piece";


export abstract class IncidentModel<
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<E, S, C, R> {
    public get route() {
        const ingsoc = super.route.parent;
        return {
            ...super.route,
            ingsoc: ingsoc instanceof IngSocModel ? ingsoc : undefined,
        }
    }
}