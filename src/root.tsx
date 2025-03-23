import { DebugService, Model } from "set-piece";
import { LeafModel } from "./leaf";

export namespace RootDefine {
    export type I = 'root';
    export type E = { onPing: number }
    export type S1 = { count: number };
    export type S2 = { name: string };
    export type P = undefined;
    export type C1 = {};
    export type C2 = LeafModel
}

export class RootModel extends Model<
    RootDefine.I,
    RootDefine.E,
    RootDefine.S1,
    RootDefine.S2,
    RootDefine.P,
    RootDefine.C1,
    RootDefine.C2
> {
    constructor(props: Model.Props<RootModel>) {
        super({
            ...props,
            state: { count: 0, name: 'bar', ...props.state },
            child: {},
            refer: {},
        })
    }

    @DebugService.useStack()
    add() {
        console.log(this.state.count);
        console.log(this.stateDelegator.count)
        this.stateDelegator.count += 1;
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
    }
    
    multiAdd() {
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
        this.stateDelegator.count += 1;
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
        this.stateDelegator.count += 1;
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
    }

    @DebugService.useStack()
    @Model.useFiber()
    batchAdd() {
        console.log(this.stateDelegator.count);
        this.setStateBatch(prev => ({
            count: prev.count + 1
        }))
        console.log(this.stateDelegator.count);
        this.setStateBatch(prev => ({
            count: prev.count + 1
        }))
        console.log(this.stateDelegator.count);
        setTimeout(() => {
            console.log(this.stateDelegator.count);
        })
    }

    @Model.useFiber()
    vainAdd() {
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
        this.stateDelegator.count += 1;
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
        this.stateDelegator.count += 1;
        console.log(this.state.count);
        console.log(this.stateDelegator.count);
        setTimeout(() => {
            console.log(this.state.count);
            console.log(this.stateDelegator.count);
        }, 100)
    }

    @DebugService.useStack()
    ping() {
        console.log('ping');
        this.stateDelegator.count += 1;
        this.eventEmitters.onPing(this.state.count)
        return this.state.count;
    }

    @DebugService.useStack()
    spawn() {
        console.group('step-1')
        console.log(this.state.count)
        console.log(this.child);
        console.log(this.childDelegator)
        console.groupEnd()
        this.childDelegator.push({ code: 'leaf' })
        console.group('step-2')
        console.log(this.child);
        console.log(this.childDelegator);
        console.log(this.state.count);
        console.groupEnd()
        this.childDelegator.push({ code: 'leaf' })
        console.group('step-3')
        console.log(this.child);
        console.log(this.childDelegator);
        console.log(this.state.count);
        console.groupEnd()
    }

    @Model.useDecor(model => model.decor.count)
    @DebugService.useStack({ useResult: true, useArgs: true })
    private handleCountCheck(target: RootModel, state: number) {
        return state + 1;
    }

    @Model.useEvent(model => model.event.onPing)
    @DebugService.useStack()
    private handlePing(target: RootModel, event: number) {
        console.log('handle ping', target, event);
    }


}