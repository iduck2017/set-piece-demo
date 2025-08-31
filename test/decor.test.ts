import { GenderType } from "../src/types";
import { IngSocModel } from "../src/ing-soc";
import { StaffModel, StaffProps } from "../src/staff";
import { RouteUtil } from "set-piece";
import { boot } from "./boot";

describe('decor', () => {
    boot();
    const ingsoc = new IngSocModel({});
    const obrien = ingsoc.child.minitrue;
    const goldstein = new StaffModel({
        state: {
            name: 'Emmanuel Goldstein',
            salary: 100,
            asset: 1000,
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
        expect(obrien.draft.state.salary).toBe(100);
        expect(obrien.state.salary).toBe(90);

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
        expect(obrien.state.asset).toBe(11000);
        expect(obrien.draft.state.salary).toBe(100);
        expect(goldstein.state.salary).toBe(100);
        expect(winston.state.salary).toBe(20);

        expect(ingsoc.state.asset).toBe(60000);
    })

    test('purge', () => {
        expect(goldstein.state.salary).toBe(100);
        expect(goldstein.state.asset).toBe(1000);
        expect(goldstein.draft.state.salary).toBe(100);

        ingsoc.purge(goldstein, obrien);

        expect(goldstein.state.salary).toBe(190);
        expect(goldstein.state.asset).toBe(11000);
        expect(goldstein.draft.state.salary).toBe(100);
        
        expect(obrien.state.salary).toBe(100);
        expect(obrien.state.asset).toBe(1000);
        expect(obrien.draft.state.salary).toBe(100);

        expect(winston.state.salary).toBe(10);
        expect(winston.draft.state.salary).toBe(10);
    })

    test('purge', () => {
        ingsoc.purge(obrien, goldstein);

        expect(goldstein.state.salary).toBe(100);
        expect(goldstein.state.asset).toBe(1000);
        expect(goldstein.draft.state.salary).toBe(100);
        
        expect(obrien.state.salary).toBe(190);
        expect(obrien.state.asset).toBe(11000);
        expect(obrien.draft.state.salary).toBe(100);

        expect(winston.state.salary).toBe(20);
        expect(winston.draft.state.salary).toBe(10);
    })

})