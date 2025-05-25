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

    @StateAgent.use((model) => model.proxy.decor.asset)
    @DebugService.log()
    private checkAsset(target: IngSocModel, asset: number) {
        console.log('check asset')
        return asset + 100;
    }

    

    // @DebugService.log()
    // public purge(next: StaffModel, prev: StaffModel) {
    //     // for (const key in this.draft.child) {
    //     //     if (this.draft.child[key] === prev) {
    //     //         this.draft.child[key] = next;
    //     //         return;
    //     //     }
    //     // }
    // }

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

    // @DebugService.log()
    // public depress(flag: boolean) {
    //     // let depression = this.draft.child.incidents.find(item => item instanceof DepressionModel);
    //     // if (flag) {
    //     //     if (depression) return;
    //     //     depression = new DepressionModel();
    //     //     this.draft.child.incidents.push(depression);
    //     // } else {
    //     //     if (!depression) return;
    //     //     const index = this.draft.child.incidents.indexOf(depression);
    //     //     if (index === -1) return;
    //     //     this.draft.child.incidents.splice(index, 1);
    //     // }
    // }


    // @DebugService.log()
    // public corrupt(flag: boolean) {
    //     // let corruption = this.draft.child.incidents.find(item => item instanceof CorruptionModel);
    //     // if (flag) {
    //     //     if (corruption) return;
    //     //     corruption = new CorruptionModel();
    //     //     this.child.incidents.append(corruption);
    //     // } else {
    //     //     if (!corruption) return;
    //     //     this.child.incidents.remove(corruption);
    //     // }
    // }

    // @EventAgent.use((model) => model.proxy.event.onChildChange)
    // @DebugService.log()
    // private _handleChildChange(target: IngSocModel, event: OnChildChange<IngSocModel>) {
    //     if (event.prev.minipax !== event.next.minipax) {
    //         console.log(this, this.constructor.name)
    //         this.reload();
    //     }
    // }




}