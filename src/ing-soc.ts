import { DebugUtil, Event, EventUtil, Model, StoreUtil, TranxUtil } from "set-piece";
import { StaffModel, StaffProps } from "./staff";   
import { GenderType } from "./types";
import { DepressionModel, DepressionProps } from "./incident/depression";
import { CorruptionModel, CorruptionProps } from "./incident/corruption";
import { IncidentModel } from "./incident";

export namespace IngSocProps {
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


@StoreUtil.is('ing-soc')
export class IngSocModel extends Model<
    IngSocProps.E,
    IngSocProps.S,
    IngSocProps.C,
    IngSocProps.R
> {
    constructor(props: IngSocModel['props']) {
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
            uuid: props.uuid,
            state: { 
                name: props.state?.name ?? 'Ing Soc', 
                asset: props.state?.asset ?? 100_000, 
            },
            child: { 
                incidents: props.child?.incidents ?? [],
                minitrue: props.child?.minitrue ??new StaffModel({ 
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
                minipax: props.child?.minipax ?? new StaffModel({ 
                    state: { 
                        name: 'Aaronson',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    }
                }),
                miniplenty: props.child?.miniplenty ?? new StaffModel({
                    state: {
                        name: 'Rutherford',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE
                    }
                }),
                miniluv: props.child?.miniluv ?? new StaffModel({
                    state: {
                        name: 'Jones',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    }
                }),
            },
            refer: {},
        })
    }

    @DebugUtil.log()
    public income(value: number): number {
        if (this.draft.state.asset + value < 0) {
            value = -this.draft.state.asset;
        }
        this.draft.state.asset += value;
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

    @EventUtil.on((self) => self.proxy.all<StaffModel>(StaffModel).event.onWork)
    @DebugUtil.log()
    private onWork(that: StaffModel, event: Event) {
        const value = that.state.value - that.state.salary;
        const result = this.income(value);
        if (result > value) that.income(-result);
        else that.income(that.state.salary);
    }

    @DebugUtil.log()
    public depress(flag: boolean) {
        let index = this.draft.child.incidents.findIndex(item => item instanceof DepressionModel);
        if (flag) {
            if (index !== -1) return;
            this.draft.child.incidents.push(new DepressionModel({}));
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