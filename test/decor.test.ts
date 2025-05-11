import { ModelCycle } from "set-piece";
import { RootModel } from "./ping-pong";

test.only('decor', () => {
    const root = new RootModel({});
    expect(root.state.count).toBe(0);

    boot: {
        ModelCycle.boot(root);
        expect(root.state.count).toBe(2);
    }
    
    spawn: {
        root.spawn();
        root.spawn();
        expect(root.state.count).toBe(4);
    }
})