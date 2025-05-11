import { ModelCycle, ModelStatus } from "set-piece";
import { BunnyModel, GenderType } from "./bunny";

test.skip('cycle', () => {
    const bunny = new BunnyModel({});
    const bunnyJane = new BunnyModel({
        state: { name: 'Jane' }
    });
    const bunnyJohn = new BunnyModel({
        state: { name: 'John', gender: GenderType.MALE }
    });

    expect(bunnyJane.status).toBe(ModelStatus.INIT);
    expect(bunny.status).toBe(ModelStatus.INIT);
    expect(bunnyJohn.status).toBe(ModelStatus.INIT);
    
    spawn: {
        bunny.spawn(bunnyJane);
        expect(bunny.status).toBe(ModelStatus.INIT);
        expect(bunnyJane.status).toBe(ModelStatus.BIND);
        expect(bunnyJohn.status).toBe(ModelStatus.INIT);
    }
    
    boot: {
        ModelCycle.boot(bunny);
        expect(bunny.status).toBe(ModelStatus.LOAD);
        expect(bunnyJane.status).toBe(ModelStatus.LOAD);
        expect(bunnyJohn.status).toBe(ModelStatus.INIT);
    }

    spawn: {
        bunnyJane.spawn(bunnyJohn);
        expect(bunny.status).toBe(ModelStatus.LOAD);
        expect(bunnyJane.status).toBe(ModelStatus.LOAD);
        expect(bunnyJohn.status).toBe(ModelStatus.LOAD);
    }

    despawn: {
        const result = bunny.despawn();
        expect(result).toBe(bunnyJane);
        expect(bunny.status).toBe(ModelStatus.LOAD);
        expect(bunnyJane.status).toBe(ModelStatus.INIT);
        expect(bunnyJohn.status).toBe(ModelStatus.BIND);
    }

})