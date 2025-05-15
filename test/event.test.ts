import { ModelCycle } from "set-piece";
import { RootModel } from "./ping-pong"

test.skip('event', () => {
    const root = ModelCycle.boot(new RootModel({}));
    expect(root.child.ping.state.value).toBe(0);
    expect(root.child[0].state.value).toBe(0);
    expect(root.child[1].state.value).toBe(0);

    ping: {
        root.child.ping.ping(3);
        expect(root.child[0].state.value).toBe(3);
        expect(root.child[1].state.value).toBe(3);
    }

    spawn: {
        root.spawn();
        expect(root.child[2].state.value).toBe(0);
        root.child.ping.ping(2);
        expect(root.child[0].state.value).toBe(5);
        expect(root.child[1].state.value).toBe(5);
        expect(root.child[2].state.value).toBe(2);
    }

    pong: {
        root.child[0].pong();
        expect(root.child.ping.state.value).toBe(10);
        root.child[1].pong();
        expect(root.child.ping.state.value).toBe(11);
        root.child[2].pong();
        expect(root.child.ping.state.value).toBe(12);
    }

    replace: {
        root.change();
        root.spawn();
        expect(root.child[0].state.value).toBe(0);
        root.child.ping.ping(10);
        expect(root.child[0].state.value).toBe(10);
        expect(root.child[1].state.value).toBe(15);
        expect(root.child[2].state.value).toBe(12);
        expect(root.child[3].state.value).toBe(10);
    }

    

})