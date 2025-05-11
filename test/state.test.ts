import { Model, ModelCycle, ModelStatus } from "set-piece"
import { BunnyModel } from "./bunny";

test.skip('state', () => {
    const bunny = new BunnyModel({
        state: { speed: 10 }
    });
    
    init: {
        expect(bunny.state.isAlive).toBe(true);
        expect(bunny.state.name).toBe('Judy');
        expect(bunny.state.speed).toBe(10);
    }

    alter: {
        bunny.alter();
        expect(bunny.state.isAlive).toBe(false);
        expect(bunny.state.name).toBe('Judy');
        expect(bunny.state.speed).toBe(0);
    }
})

