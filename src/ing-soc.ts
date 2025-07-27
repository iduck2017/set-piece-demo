import { DebugUtil, EventUtil, Model, StoreUtil, TranxUtil } from "set-piece";
import { StaffModel } from "./staff";   
import { GenderType } from "./common";
import { DepressionModel } from "./incident/depression";
import { CorruptionModel } from "./incident/corruption";
import { IncidentModel } from "./incident";

export namespace IngSocModel {
    export type Event = {};
    export type State = { 
        asset: number;
        name: string;
    };
    export type Child = {
        minipax: StaffModel;
        miniplenty: StaffModel;
        miniluv: StaffModel;
        minitrue: StaffModel;
        incidents: IncidentModel[];
    }
    export type Refer = {}
}


@StoreUtil.is('ing-soc')
export class IngSocModel extends Model<
    IngSocModel.Event,
    IngSocModel.State,
    IngSocModel.Child,
    IngSocModel.Refer
> {
    constructor(props?: IngSocModel['props']) {
        const winston = new StaffModel({
            state: {
                name: 'Winston Smith',
                salary: 10,
                asset: 100,
                value: 100,
                gender: GenderType.MALE,
            },
        });
        super({
            uuid: props?.uuid,
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
                            winston,
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
                    },
                    refer: {
                        friends: [winston]
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
            refer: { ...props?.refer },
        })
    }

    @DebugUtil.log()
    public income(value: number): number {
        console.log('prev', this.state.asset)
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
        console.log('next', this.state.asset)
        return value;
    }


    @DebugUtil.log()
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

    @EventUtil.on((model) => model.proxy.child.miniluv.event.onApply)
    @EventUtil.on((model) => model.proxy.child.minipax.event.onApply)
    @EventUtil.on((model) => model.proxy.child.minitrue.event.onApply)
    @EventUtil.on((model) => model.proxy.child.miniplenty.event.onApply)
    @TranxUtil.span()
    @DebugUtil.log()
    private handleApply(model: unknown, event: StaffModel) {
        const value = event.state.value - event.state.salary;
        const result = this.income(value);
        if (result > value) event.income(-result);
        else event.income(event.state.salary);
    }

    @DebugUtil.log()
    public depress(flag: boolean) {
        let index = this.draft.child.incidents.findIndex(item => item instanceof DepressionModel);
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new DepressionModel());
        } else {
            if (index === -1) return;
            this.draft.child.incidents.splice(index, 1);
        }
    }

    @DebugUtil.log()
    public corrupt(flag: boolean) {
        let index = this.draft.child.incidents.findIndex(item => item instanceof CorruptionModel);
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new CorruptionModel());
        } else {
            if (index === -1) return;
            this.draft.child.incidents.splice(index, 1);
        }
    }

}