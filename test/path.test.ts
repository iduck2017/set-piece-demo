import { ModelCycle } from "set-piece";
import { RootModel } from "./ping-pong";
import { BunnyModel } from "./bunny";
import { GenderType } from "@/common";

test.skip('path', () => {
    const bunny = new BunnyModel({})
    const bunnyTino = new BunnyModel({
        state: { name: 'Tino', gender: GenderType.MALE }
    })
    const bunnyJane = new BunnyModel({
        state: { name: 'Jane'}
    })
    const bunnyJohn = new BunnyModel({
        state: { name: 'John', gender: GenderType.MALE }
    })

    path: {
        bunny.mate(bunnyTino);
        expect(bunny.path).toBeUndefined();
        
        bunny.spawn(bunnyJane);
        bunny.spawn(bunnyJane);
        bunny.spawn(bunnyJane);
        expect(bunny.child[0].path).toBe('0');
        expect(bunny.child[1].path).toBe('0');
        expect(bunny.child[2].path).toBe('0');

        bunnyJane.spawn(bunnyJohn);
        expect(bunny.child[0].child[0].path).toBe('0');

        ModelCycle.boot(bunny);
        expect(bunny.path).toBe('root');
    }


    proxy: {
        expect(bunny.proxy.path).toBeUndefined()
        expect(bunny.proxy.child[0].path).toBe('0');
        expect(bunny.proxy.child.mate?.path).toBe('mate');
        expect(bunny.proxy.child[0].child[0].path).toBe('0/0');
        expect(bunny.proxy.child[0].child.mate?.path).toBe('0/mate');
    }

    event: {
        expect(bunny.proxy.event.onRun.path).toBe('onRun');
        expect(bunny.proxy.child[0].child[0].event.onRun.path).toBe('0/0/onRun');
        expect(bunny.child[0].proxy.child[0].event.onRun.path).toBe('0/onRun');
        expect(bunny.child[0].child[0].proxy.event.onRun.path).toBe('onRun');
    }

    decor: {
        expect(bunny.proxy.decor.speed.path).toBe('speed');
        expect(bunny.proxy.child[0].child[0].decor.speed.path).toBe('0/0/speed');
        expect(bunny.child[0].proxy.child[0].decor.speed.path).toBe('0/speed');
        expect(bunny.child[0].child[0].proxy.decor.speed.path).toBe('speed');
    }
})