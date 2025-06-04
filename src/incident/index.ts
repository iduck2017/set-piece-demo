import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";
import { Model } from "set-piece";


export abstract class IncidentModel<
    P extends IngSocModel = IngSocModel,
    E extends Model.E = {},
    S extends Model.S = {},
    C extends Model.C= {},
    R extends Model.R = {}
> extends Model<P, E, S, C, R> {}