import { ModelCycle } from "set-piece";
import { RootModel } from "./ping-pong";

test.skip('decor', () => {
    const root = new RootModel({});
    expect(root.state.count).toBe(0);

    boot: {
        ModelCycle.boot(root);
        expect(root.state.count).toBe(3);
    }
    
    spawn: {
        root.spawn();
        root.spawn();
        expect(root.state.count).toBe(5);
    }

    despawn: {
        root.despawn();
        expect(root.state.count).toBe(4);
    }

})