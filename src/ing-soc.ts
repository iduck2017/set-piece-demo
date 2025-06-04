import { DebugService, EventAgent, Model, OnChildChange, Props, StateAgent, TranxService } from "set-piece";
import { StaffModel } from "./staff";
import { GenderType } from "@/common";
import { DepressionModel } from "./incident/depression";
import { CorruptionModel } from "./incident/corruption";
import { IncidentModel } from "./incident";

export namespace IngSocModel {
    export type P = never;
    
    export type E = {};

    export type S = { 
        asset: number;
        name: string;
    };

    export type C = {
        minipax: StaffModel;
        miniplenty: StaffModel;
        miniluv: StaffModel;
        minitrue: StaffModel;
        incidents: IncidentModel[];
    }
    
    export type R = {}
}

export class IngSocModel extends Model<
    IngSocModel.P,
    IngSocModel.E,
    IngSocModel.S,
    IngSocModel.C,
    IngSocModel.R
> {
    constructor(props?: Props<
        IngSocModel.S,
        IngSocModel.C,
        IngSocModel.R
    >) {
        super({
            ...props,
            state: { 
                name: 'Ing Soc', 
                asset: 100_000, 
                ...props?.state 
            },
            child: { 
                incidents: [],
                minitrue: new StaffModel({ 
                    state: { 
                        name: 'O\'Brien',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    },
                    child: {
                        subordinates: [
                            new StaffModel({
                                state: {
                                    name: 'Winston Smith',
                                    salary: 10,
                                    asset: 100,
                                    value: 100,
                                    gender: GenderType.MALE,
                                },
                            }),
                            new StaffModel({
                                state: {
                                    name: 'Julia',
                                    salary: 10,
                                    asset: 100,
                                    value: 100,
                                    gender: GenderType.FEMALE,
                                }
                            })
                        ] 
                    }
                }),
                minipax: new StaffModel({ 
                    state: { 
                        name: 'Aaronson',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    }
                }),
                miniplenty: new StaffModel({
                    state: {
                        name: 'Rutherford',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE
                    }
                }),
                miniluv: new StaffModel({
                    state: {
                        name: 'Jones',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    }
                }),
                ...props?.child 
            },
            refer: {}
        })
    }

    @DebugService.log()
    public income(value: number): number {
        console.log('prev', this.state.asset)
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
        console.log('next', this.state.asset)
        return value;
    }


    @DebugService.log()
    public purge(next: StaffModel, prev: StaffModel) {
        if (this.draft.child.miniluv === prev) this.draft.child.miniluv = next;
        if (this.draft.child.minitrue === prev)  this.draft.child.minitrue = next;
        if (this.draft.child.miniplenty === prev) this.draft.child.miniplenty = next;
        if (this.draft.child.minipax === prev) {
            console.log('minipax', this.child.minipax.state.name);
            this.draft.child.minipax = next
            console.log('minipax', this.child.minipax.state.name, this.child.minipax.state.salary);
        };
    }

    @EventAgent.use((model) => model.proxy.child.miniluv.event.onApply)
    @EventAgent.use((model) => model.proxy.child.minipax.event.onApply)
    @EventAgent.use((model) => model.proxy.child.minitrue.event.onApply)
    @EventAgent.use((model) => model.proxy.child.miniplenty.event.onApply)
    @TranxService.span()
    @DebugService.log()
    private handleApply(target: unknown, event: StaffModel) {
        const value = event.state.value - event.state.salary;
        const result = this.income(value);
        if (result > value) event.income(-result);
        else event.income(event.state.salary);
    }


    @DebugService.log()
    public depress(flag: boolean) {
        let index = this.draft.child.incidents.findIndex(item => item instanceof DepressionModel);
        console.log(this.child.minitrue.state.salary)
        console.log(this.child.minitrue.child.subordinates[0]?.state.salary)
        console.log(this.child.minitrue.child.subordinates[1]?.state.salary)
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new DepressionModel());
        } else {
            if (index === -1) return;
            this.draft.child.incidents.splice(index, 1);
        }
        console.log(this.child.minitrue.state.salary)
        console.log(this.child.minitrue.child.subordinates[0]?.state.salary)
        console.log(this.child.minitrue.child.subordinates[1]?.state.salary)
    }


    @DebugService.log()
    public corrupt(flag: boolean) {
        console.log(this.draft.child.incidents)
        let index = this.draft.child.incidents.findIndex(item => item instanceof CorruptionModel);
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new CorruptionModel());
        } else {
            if (index === -1) return;
            this.draft.child.incidents.splice(index, 1);
        }
        console.log(this.draft.state.asset, this.state.asset)
        console.log(this.child.minitrue.state.salary)
    }

}