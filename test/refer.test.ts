import { RootModel } from "./ping-pong";

test.skip('refer', () => {
    const root = new RootModel({});
    root.spawn();
    root.spawn()
    const alpha = root.child[0]
    const beta = root.child[1]
    const gamma = root.child[2]
    const omega = root.child[3]

    link: {
        expect(alpha.refer.friend).toBeUndefined();
        expect(alpha.refer.friends).toBeUndefined()
        alpha.link(beta);
        expect(alpha.refer.friend).toBe(beta);
        expect(alpha.refer.friends?.length).toBe(1);
        expect(alpha.refer.friends?.[0]).toBe(beta)
    }

    unlink: {
        alpha.unlink(beta);
        expect(alpha.refer.friend).toBeUndefined();
        expect(alpha.refer.friends?.length).toBe(0);
    }

    relink: {
        alpha.link(omega);
        expect(alpha.refer.friend).toBe(omega);
        expect(alpha.refer.friends?.[0]).toBe(omega);

        alpha.link(gamma);
        expect(alpha.refer.friend).toBe(gamma);
        expect(alpha.refer.friends?.[0]).toBe(omega);
        expect(alpha.refer.friends?.[1]).toBe(gamma);
    }

    despawn: {
        root.despawn();
        expect(alpha.refer.friend).toBe(gamma);
        expect(alpha.refer.friends?.length).toBe(1);
        expect(alpha.refer.friends?.[1]).toBeUndefined();

        root.despawn();
        expect(alpha.refer.friend).toBeUndefined();
        expect(alpha.refer.friends?.length).toBe(0);
        expect(alpha.refer.friends?.[0]).toBeUndefined();
    }
    
})