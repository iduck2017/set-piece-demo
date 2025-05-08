import { Model } from "set-piece";
import { RootModel } from "./root";

export enum Gender {
    Male,
    Female,
    Unknown
}

export namespace StaffDefine {
    export type E = { onHello: number }
    export type S1 = { name: string, level: number }
    export type S2 = { age: number, gender: Gender }
    export type P = StaffModel | RootModel
    export type C1 = { vice?: StaffModel }
    export type C2 = StaffModel
    export type R1 = { spouse: StaffModel }
    export type R2 = { friends: StaffModel[], family: StaffModel[] }
}

export class StaffModel extends Model<
    StaffDefine.E,
    StaffDefine.S1,
    StaffDefine.S2,
    StaffDefine.P,
    StaffDefine.C1,
    StaffDefine.C2,
    StaffDefine.R1,
    StaffDefine.R2
> {
    constructor(props: Model.Props<StaffModel>) {
        super({
            ...props,
            state: { 
                name: "john doe", 
                level: 1, 
                age: 18,
                gender: Gender.Male,
                ...props.state
            },
            child: {
                ...props.child,
            },
            refer: {
                friends: [],
                family: [],
                ...props.refer,
            }
        })
    }
}