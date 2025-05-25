import { DebugService, EventAgent, Model, OnChildChange, StateAgent, TranxService } from "set-piece";
import { StaffModel } from "./staff";
import { GenderType } from "@/common";
import { DepressionModel } from "./incident/depression";
import { CorruptionModel } from "./incident/corruption";
import { IncidentModel } from "./incident";

export namespace IngSocDefine {
    export type P = never;
    export type E = {};
    export type S1 = { asset: number };
    export type S2 = { name: string };
    export type C1 = {
        minipax: StaffModel;
        miniplenty: StaffModel;
        miniluv: StaffModel;
        minitrue: StaffModel;
    }
    export type C2 = {
        incidents: IncidentModel;
    }
    export type R1 = {}
    export type R2 = {}
}

export class IngSocModel extends Model<
    IngSocDefine.P,
    IngSocDefine.E,
    IngSocDefine.S1,
    IngSocDefine.S2,
    IngSocDefine.C1,
    IngSocDefine.C2,
    IngSocDefine.R1,
    IngSocDefine.R2
> {
    constructor(props?: Model.Props<IngSocModel>) {
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
                        asset: 3_000,
                        gender: GenderType.MALE,
                    },
                    child: {
                        subordinates: [
                            new StaffModel({
                                state: {
                                    name: 'Winston Smith',
                                    salary: 15,
                                    asset: 100,
                                    gender: GenderType.MALE,
                                },
                            }),
                            new StaffModel({
                                state: {
                                    name: 'Julia',
                                    salary: 10,
                                    asset: 20,
                                    gender: GenderType.FEMALE,
                                }
                            })
                        ] 
                    }
                }),
                minipax: new StaffModel({ 
                    state: { 
                        name: 'Aaronson',
                        salary: 120,
                        asset: 2_000,
                        gender: GenderType.MALE,
                    }
                }),
                miniplenty: new StaffModel({
                    state: {
                        name: 'Rutherford',
                        salary: 180,
                        asset: 5_000,
                        gender: GenderType.MALE
                    }
                }),
                miniluv: new StaffModel({
                    state: {
                        name: 'Jones',
                        salary: 100,
                        asset: 6_000,
                        gender: GenderType.MALE,
                    }
                }),
                ...props?.child 
            },
        })
    }

    @DebugService.log()
    public cost() {
        console.log(this.state.asset)
        console.log(this.draft.state.asset)
        this.draft.state.asset -= 100;
        console.log(this.state.asset)
        console.log(this.draft.state.asset)
    }

    // @StateAgent.use((model) => model.proxy.decor.asset)
    // @DebugService.log()
    // private checkAsset(target: IngSocModel, asset: number) {
    //     console.log('check asset')
    //     return asset + 100;
    // }


    @DebugService.log()
    public purge(next: StaffModel, prev: StaffModel) {
        if (this.draft.child.miniluv === prev) this.draft.child.miniluv = next;
        if (this.draft.child.minitrue === prev)  this.draft.child.minitrue = next;
        if (this.draft.child.miniplenty === prev) this.draft.child.miniplenty = next;
        if (this.draft.child.minipax === prev) {
            console.log('minipax', this.child.minipax.state.name);
            this.draft.child.minipax = next
            console.log('minipax', this.child.minipax.state.name);
        };
    }

    // @EventAgent.use((model) => model.proxy.child.minitrue.event.onWork)
    // @EventAgent.use((model) => model.proxy.child.miniplenty.event.onWork)
    // @EventAgent.use((model) => model.child.minipax?.proxy.event.onWork)
    // @EventAgent.use((model) => model.child.miniluv?.proxy.event.onWork)
    // @TranxService.span()
    // private _handleWork(target: StaffModel, event: StaffModel) {
    //     const salary = event.state.salary;
    //     const value = this._decreaseAsset(salary);
    //     event._increaseAsset(value);
    // }

    // @TranxService.span()
    // public _decreaseAsset(value: number) {
    //     this.draft.state.asset -= value;
    //     if (this.draft.state.asset < 0) {
    //         value = this.draft.state.asset;
    //         this.draft.state.asset = 0;
    //     }
    //     return value;
    // }

    // @TranxService.span()
    // public _increaseAsset(value: number) {
    //     this.draft.state.asset += value;
    // }

    @DebugService.log()
    public depress(flag: boolean) {
        console.log(this.draft.child.incidents.length)
        let index = this.draft.child.incidents.findIndex(item => item instanceof DepressionModel);
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new DepressionModel());
        } else {
            if (index === -1) return;
            this.draft.child.incidents.splice(index, 1);
        }
        console.log(this.draft.child.incidents.length)
        console.log(this.draft.state.asset)
        console.log(this.state.asset)
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
        console.log(this.draft.child.incidents.length)
        console.log(this.draft.state.asset)
        console.log(this.state.asset)
    }

    // @EventAgent.use((model) => model.proxy.event.onChildChange)
    // @DebugService.log()
    // private handleChildChange(target: IngSocModel, event: OnChildChange<IngSocModel>) {
    //     if (event.prev.minipax !== event.next.minipax) {
    //         console.log(this, this.constructor.name)
    //         this.reload();
    //     }
    // }




}