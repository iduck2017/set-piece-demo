import { ModelCycle } from "set-piece";
import { RootModel } from "./ping-pong";
import { BunnyModel } from "./bunny";
import { GenderType } from "@/common";

test.skip('path', () => {
    const judy = new BunnyModel({})
    const tino = new BunnyModel({
        state: { name: 'Tino', gender: GenderType.MALE }
    })
    const jane = new BunnyModel({
        state: { name: 'Jane'}
    })
    const john = new BunnyModel({
        state: { name: 'John', gender: GenderType.MALE }
    })

    path: {
        judy.mate(tino);
        expect(judy.path).toBeUndefined();
        
        judy.spawn(jane);
        judy.spawn(jane);
        judy.spawn(jane);
        expect(judy.child[0].path).toBe('0');
        expect(judy.child[1].path).toBe('0');
        expect(judy.child[2].path).toBe('0');

        jane.spawn(john);
        expect(judy.child[0].child[0].path).toBe('0');

        ModelCycle.boot(judy);
        expect(judy.path).toBe('root');
    }


    proxy: {
        expect(judy.proxy.path).toBeUndefined()
        expect(judy.proxy.child[0].path).toBe('0');
        expect(judy.proxy.child.mate?.path).toBe('mate');
        expect(judy.proxy.child[0].child[0].path).toBe('0/0');
        expect(judy.proxy.child[0].child.mate?.path).toBe('0/mate');
    }

    event: {
        expect(judy.proxy.event.onRun.path).toBe('onRun');
        expect(judy.proxy.child[0].child[0].event.onRun.path).toBe('0/0/onRun');
        expect(judy.child[0].proxy.child[0].event.onRun.path).toBe('0/onRun');
        expect(judy.child[0].child[0].proxy.event.onRun.path).toBe('onRun');
    }

    decor: {
        expect(judy.proxy.decor.speed.path).toBe('speed');
        expect(judy.proxy.child[0].child[0].decor.speed.path).toBe('0/0/speed');
        expect(judy.child[0].proxy.child[0].decor.speed.path).toBe('0/speed');
        expect(judy.child[0].child[0].proxy.decor.speed.path).toBe('speed');
    }
})