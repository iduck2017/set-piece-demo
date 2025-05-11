import { BunnyModel, GenderType } from "./bunny";

test.skip('child', () => {
    
    const bunny = new BunnyModel({});
    const bunnyJane = new BunnyModel({
        state: { name: 'Jane' }
    });
    const bunnyJohn = new BunnyModel({
        state: { name: 'John', gender: GenderType.MALE }
    });

    expect(bunny.child.length).toBe(0);
    expect(bunny.child[0]).toBeUndefined();
    
    spawn: {
        bunny.spawn(bunnyJane);
        expect(bunny.child.length).toBe(1);
        expect(bunny.child[0]).toBe(bunnyJane);
    }

    spawn: {
        const result = bunnyJane.spawn(bunnyJohn);
        expect(result).toBe(bunnyJohn);
        expect(bunnyJane.child.length).toBe(1);
        expect(bunnyJane.child[0]).toBe(bunnyJohn);
    }

    clone: {
        const result = bunny.spawn(bunnyJane);
        expect(result).not.toBe(bunnyJane);
        expect(result.uuid).not.toBe(bunnyJane.uuid);
        expect(bunny.child[0]).toBe(bunnyJane);
        expect(bunny.child[1]).toBe(result);
    
        
        const bunnyJohn2 = bunnyJane.child[0];
        const bunnyJohn3 = result.child[0];
        expect(bunnyJohn2).toBe(bunnyJohn);
        expect(bunnyJohn3).not.toBe(bunnyJohn);
    }

    despawn: {
        const result = bunnyJane.despawn();
        expect(result).toBe(bunnyJohn);
        expect(bunnyJane.child.length).toBe(0);
        expect(bunnyJane.child[0]).toBeUndefined();
    }

    
})
