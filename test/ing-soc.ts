import { DebugService, EventAgent, Model, OnChildChange, TranxService } from "set-piece";
import { StaffModel } from "./staff";
import { GenderType } from "@/common";
import { CorruptionModel, DepressionModel } from "./incident";

export namespace CorpDefine {
    export type E = {};
    export type S1 = { asset: number };
    export type S2 = { name: string };
    export type P = never;
    export type C1 = {
        minipax: StaffModel;
        miniplenty: StaffModel;
        miniluv: StaffModel;
        minitrue: StaffModel;
        depression?: DepressionModel;
        corruption?: CorruptionModel;
    }
    export type C2 = StaffModel
    export type R1 = {}
    export type R2 = {}
}

export class IngSocModel extends Model<
    CorpDefine.E,
    CorpDefine.S1,
    CorpDefine.S2,
    CorpDefine.P,
    CorpDefine.C1,
    CorpDefine.C2,
    CorpDefine.R1,
    CorpDefine.R2
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
                minitrue: new StaffModel({ 
                    state: { 
                        name: 'O\'Brien',
                        salary: 100,
                        asset: 3_000,
                        gender: GenderType.MALE,
                    },
                    child: {
                        [0]: new StaffModel({
                            state: {
                                name: 'Winston Smith',
                                salary: 15,
                                asset: 100,
                                gender: GenderType.MALE,
                            },
                        }),
                        [1]: new StaffModel({
                            state: {
                                name: 'Julia',
                                salary: 10,
                                asset: 20,
                                gender: GenderType.FEMALE,
                            }
                        })
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

    public purge(next: StaffModel, prev: StaffModel) {
        for (const key in this.draft.child) {
            if (this.draft.child[key] === prev) {
                this.draft.child[key] = next;
                return;
            }
        }
    }

    @EventAgent.use((model) => model.proxy.child.minitrue.event.onWork)
    @EventAgent.use((model) => model.proxy.child.miniplenty.event.onWork)
    @EventAgent.use((model) => model.child.minipax?.proxy.event.onWork)
    @EventAgent.use((model) => model.child.miniluv?.proxy.event.onWork)
    @TranxService.span()
    private _handleWork(target: StaffModel, event: StaffModel) {
        const salary = event.state.salary;
        const value = this._decreaseAsset(salary);
        event._increaseAsset(value);
    }

    @TranxService.span()
    public _decreaseAsset(value: number) {
        this.draft.state.asset -= value;
        if (this.draft.state.asset < 0) {
            value = this.draft.state.asset;
            this.draft.state.asset = 0;
        }
        return value;
    }

    @TranxService.span()
    public _increaseAsset(value: number) {
        this.draft.state.asset += value;
    }

    public depress() {
        const depression = new DepressionModel();
        this.draft.child.depression = depression;
    }


    public corrupt() {
        const corruption = new CorruptionModel();
        this.draft.child.corruption = corruption;
    }

    @EventAgent.use((model) => model.proxy.event.onChildChange)
    @DebugService.log()
    private _handleChildChange(target: IngSocModel, event: OnChildChange<IngSocModel>) {
        if (event.prev.minipax !== event.next.minipax) {
            console.log(this, this.constructor.name)
            this._reload();
        }
    }




}