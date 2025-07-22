import { IngSocModel } from "@/ing-soc";
import { Model } from "set-piece";


export abstract class IncidentModel<
    P extends Model.Route = {},
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<P, E, S, C, R> {}