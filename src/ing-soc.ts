import { StaffModel } from "./staff";   
import { GenderType } from "./types";
import { DepressionModel } from "./incident/depression";
import { CorruptionModel } from "./incident/corruption";
import { IncidentModel } from "./incident";
import { DebugUtil, Decor, EventUtil, Model, RouteUtil, TemplUtil, TranxUtil } from "set-piece";

export namespace IngSocModel {
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

export class IngSocDecor extends Decor<
    IngSocModel.S,
    Pick<IngSocModel.S, 'asset'>
> {
    constructor(model: IngSocModel) {
        super(model);
    }
}

@RouteUtil.root()
@TemplUtil.is('ing-soc')
@TranxUtil.span(true)
export class IngSocModel extends Model<
    IngSocModel.E,
    IngSocModel.S,
    IngSocModel.C,
    IngSocModel.R
> {
    public get decor(): IngSocDecor { return new IngSocDecor(this) }


    constructor(props?: IngSocModel['props']) {
        const winston = new StaffModel({
            state: {
                name: 'Winston Smith',
                salary: 10,
                asset: 100,
                value: 100,
                gender: GenderType.MALE,
            },
        })
        console.log("winston spawn done")
        super({
            uuid: props?.uuid,
            state: { 
                name: props?.state?.name ?? 'Ing Soc', 
                asset: props?.state?.asset ?? 100_000, 
            },
            child: { 
                incidents: props?.child?.incidents ?? [],
                minitrue: props?.child?.minitrue ?? new StaffModel({ 
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
                                },
                                refer: {
                                    friends: [winston]
                                }
                            })
                        ] 
                    },
                }),
                minipax: props?.child?.minipax ?? new StaffModel({ 
                    state: { 
                        name: 'Aaronson',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE,
                    }
                }),
                miniplenty: props?.child?.miniplenty ?? new StaffModel({
                    state: {
                        name: 'Rutherford',
                        salary: 100,
                        asset: 1000,
                        value: 0,
                        gender: GenderType.MALE
                    }
                }),
                miniluv: props?.child?.miniluv ?? new StaffModel({
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
        if (this.origin.state.asset + value < 0) {
            value = -this.origin.state.asset;
        }
        this.origin.state.asset += value;
        return value;
    }


    @DebugUtil.log()
    public purge(next: StaffModel, prev: StaffModel) {
        if (this.origin.child.miniluv === prev) this.origin.child.miniluv = next;
        if (this.origin.child.minitrue === prev)  this.origin.child.minitrue = next;
        if (this.origin.child.miniplenty === prev) this.origin.child.miniplenty = next;
        if (this.origin.child.minipax === prev) {
            console.log('minipax', this.child.minipax.state.name);
            this.origin.child.minipax = next
            console.log('minipax', this.child.minipax.state.name, this.child.minipax.state.salary);
        };
    }


    @EventUtil.on(self => self.handleWork)
    public listenWork() {
        return this.proxy.any(StaffModel).event?.onWork
    }
    @DebugUtil.log()
    private handleWork(that: StaffModel, event: {}) {
        const value = that.state.value - that.state.salary;
        const result = this.income(value);
        if (result > value) that.income(-result);
        else that.income(that.state.salary);
    }

    @DebugUtil.log()
    public depress(flag: boolean) {
        const incidents = this.origin.child.incidents;
        let index = incidents.findIndex(item => item instanceof DepressionModel);
        if (flag) {
            if (index !== -1) return;
            incidents.push(new DepressionModel());
        } else {
            if (index === -1) return;
            incidents.splice(index, 1);
        }
    }

    @DebugUtil.log()
    public corrupt(flag: boolean) {
        const incidents = this.origin.child.incidents;
        let index = incidents.findIndex(item => item instanceof CorruptionModel);
        if (flag) {
            if (index !== -1) return;
            incidents.push(new CorruptionModel());
        } else {
            if (index === -1) return;
            incidents.splice(index, 1);
        }
    }

}