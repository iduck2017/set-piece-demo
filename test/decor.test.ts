import { GenderType } from "@/common";
import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";
import { RouteUtil } from "set-piece";

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined


describe('decor', () => {
    const ingsoc = new IngSocModel();
    const obrien = ingsoc.child.minitrue;
    const goldstein = new StaffModel({
        state: {
            name: 'Emmanuel Goldstein',
            salary: 100,
            asset: 10_000,
            value: 0,
            gender: GenderType.MALE,
        }
    })


    const winston = ingsoc.child.minitrue.child.subordinates[0];
    const julia = ingsoc.child.minitrue.child.subordinates[1];
    
    test('precheck', () => {
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston) return;
    if (!julia) return;


    test('promote', () => {
        expect(winston.draft.state.salary).toBe(10);
        expect(winston.state.salary).toBe(10);
        winston.promote();
        expect(winston.draft.state.salary).toBe(10);
        expect(winston.state.salary).toBe(10);
    })

    test('boot', () => {
        RouteUtil.boot(ingsoc);
        expect(winston.state.salary).toBe(20);
        expect(winston.draft.state.salary).toBe(10);
    })

    test('promote', () => {
        winston.promote();
        expect(winston.state.salary).toBe(30);
        expect(winston.draft.state.salary).toBe(10);
        winston.promote();
        expect(winston.state.salary).toBe(40);
        expect(winston.draft.state.salary).toBe(10);
    })


    test('depression', () => {
        expect(obrien.state.salary).toBe(100);
        ingsoc.depress(true);
        expect(obrien.state._salary).toBe(-10)
        expect(obrien.draft.state.salary).toBe(100);
        expect(obrien.state.salary).toBe(90);

        expect(winston.state._salary).toBe(-10);
        expect(winston.draft.state.salary).toBe(10);
        expect(winston.state.salary).toBe(30);
    })

    test('demote', () => {
        winston.demote();
        expect(winston.draft.state.salary).toBe(10);
        expect(winston.state.salary).toBe(20);
    })

    test('corruption', () => {
        ingsoc.corrupt(true);
        expect(obrien.state.salary).toBe(190);
        expect(obrien.draft.state.salary).toBe(100);
        expect(goldstein.state.salary).toBe(100);
        expect(winston.state.salary).toBe(20);

        expect(ingsoc.state.asset).toBe(80_000);
    })

    test('purge', () => {
        expect(goldstein.state.salary).toBe(100);
        expect(goldstein.draft.state.salary).toBe(100);

        ingsoc.purge(goldstein, obrien);

        expect(goldstein.state.salary).toBe(190);
        expect(goldstein.draft.state.salary).toBe(100);
        expect(obrien.state.salary).toBe(100);
        expect(obrien.draft.state.salary).toBe(100);

        expect(winston.state.salary).toBe(10);
        expect(winston.draft.state.salary).toBe(10);
    })

    test('purge', () => {
        ingsoc.purge(obrien, goldstein);

        expect(goldstein.state.salary).toBe(100);
        expect(goldstein.draft.state.salary).toBe(100);
        expect(obrien.state.salary).toBe(190);
        expect(obrien.draft.state.salary).toBe(100);

        expect(winston.state.salary).toBe(20);
        expect(winston.draft.state.salary).toBe(10);
    })

})