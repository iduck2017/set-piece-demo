import { StaffModel } from "./staff";
import { Model, OnStateChange, StateAgent } from "set-piece";
import { IngSocModel } from "./ing-soc";

export namespace DepressionDefine {
    export type E = {};
    export type S1 = {};
    export type S2 = { readonly level: number};
    export type P = IngSocModel;
}

export class DepressionModel extends Model<
    DepressionDefine.E,
    DepressionDefine.S1,
    DepressionDefine.S2,
    DepressionDefine.P
> {
    constructor(props?: Model.Props<DepressionModel>) {
        super({
            ...props,
            state: { level: 1 },
            child: {}
        })
    }
    
    @StateAgent.use((model) => model.parent?.proxy.child.miniplenty.decor._salary)
    private _checkSalary(target: StaffModel, state: number) {
        return state - this.state.level;
    }
}


export namespace CorruptionDefine {
    export type E = {};
    export type S1 = {};
    export type S2 = {};
    export type P = IngSocModel;
}

export class CorruptionModel extends Model<
    CorruptionDefine.E,
    CorruptionDefine.S1,
    CorruptionDefine.S2,
    CorruptionDefine.P
> {
    constructor(props?: Model.Props<CorruptionModel>) {
        super({
            ...props,
            state: {},
            child: {}
        })
    }


    private _corruptionMap: Record<string, number> = {
        miniplenty: 100,
        miniluv: 50,
        minipax: 50,
        minitrue: 50,
    }

    @StateAgent.use((model) => model.parent?.proxy.child.miniplenty.decor.asset)
    @StateAgent.use((model) => model.parent?.proxy.child.miniluv.decor.asset)
    @StateAgent.use((model) => model.parent?.proxy.child.minipax.decor.asset)
    @StateAgent.use((model) => {
        const result = model.parent?.proxy.child.minitrue.decor.asset;
        console.warn(result);
        return result;
    })
    private _checkStaffAsset(target: StaffModel, state: number) {
        console.warn('checkSalary', target, state);
        for (const key of Object.keys(this._corruptionMap)) {
            const value = this._corruptionMap[key];
            if (target === Reflect.get(this.parent?.child ?? {}, key)) {
                return state + value;
            }
        }
        return state;
    }

    @StateAgent.use((model) => model.parent?.proxy.decor.asset)
    private _checkPartyAsset(target: IngSocModel, state: number) {
        let offset = 0;
        for (const value of Object.values(this._corruptionMap)) {
            offset += value;
        }
        return state - offset;
    }

}


export namespace PropagandaDefine {

}
