import { EventAgent, Model, TranxService } from "set-piece";
import { StaffModel } from "./staff";
import { GenderType } from "@/common";

export namespace CorpDefine {
    export type E = { onPay: number };
    export type S1 = { money: number };
    export type S2 = { name: string };
    export type P = never;
    export type C1 = {
        minipax?: StaffModel;
        miniplenty?: StaffModel;
        miniluv?: StaffModel;
        minitrue?: StaffModel;
        innerParty?: StaffModel;
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
            state: { name: 'Ing Soc', money: 10000, ...props?.state },
            child: { 
                minitrue: new StaffModel({ 
                    state: { 
                        name: 'Winston Smith',
                        salary: 5,
                        money: 100,
                        gender: GenderType.MALE,
                    }
                }),
                minipax: new StaffModel({ 
                    state: { 
                        name: 'Julia',
                        salary: 3,
                        money: 20,
                        gender: GenderType.FEMALE,
                    }
                }),
                ...props?.child 
            },
        })
    }

    @EventAgent.use((model) => model.child.minipax?.proxy.event.onWork)
    @TranxService.span()
    private _handleWork(target: StaffModel, ...args: any[]) {
        const salary = target.state.salary;
        const value = this._alterMoney(-salary);
        target._alterMoney(-value);
    }

    public _alterMoney(value: number) {
        this.draft.state.money += value;
        if (this.draft.state.money < 0) {
            value = -this.draft.state.money;
            this.draft.state.money = 0;
        }
        return value;
    }
}