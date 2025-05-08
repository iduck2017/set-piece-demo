import { AppService } from "../src/index";

describe('base', () => {
    test('one plus one', () => {
        expect(1 + 1).toBe(2);
    });

    test.only('app init', () => {
        const root = AppService.rootModel;
        expect(root).toBeDefined();
    });
});