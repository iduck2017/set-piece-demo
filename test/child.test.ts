import { BunnyModel, GenderType } from "./bunny";

test.skip('child', () => {
    
    const judy = new BunnyModel({});
    const jane = new BunnyModel({
        state: { name: 'Jane' }
    });
    const john = new BunnyModel({
        state: { name: 'John', gender: GenderType.MALE }
    });

    expect(judy.child.length).toBe(0);
    expect(judy.child[0]).toBeUndefined();
    
    spawn: {
        judy.spawn(jane);
        expect(judy.child.length).toBe(1);
        expect(judy.child[0]).toBe(jane);
    }

    spawn: {
        const result = jane.spawn(john);
        expect(result).toBe(john);
        expect(jane.child.length).toBe(1);
        expect(jane.child[0]).toBe(john);
    }

    clone: {
        const result = judy.spawn(jane);
        expect(result).not.toBe(jane);
        expect(result.uuid).not.toBe(jane.uuid);
        expect(judy.child[0]).toBe(jane);
        expect(judy.child[1]).toBe(result);
    
        
        const bunnyJohn2 = jane.child[0];
        const bunnyJohn3 = result.child[0];
        expect(bunnyJohn2).toBe(john);
        expect(bunnyJohn3).not.toBe(john);
    }

    despawn: {
        const result = jane.despawn();
        expect(result).toBe(john);
        expect(jane.child.length).toBe(0);
        expect(jane.child[0]).toBeUndefined();
    }

    
})
