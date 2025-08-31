import { GenderType } from "../src/types";
import { IngSocModel } from "../src/ing-soc";
import { StaffModel, StaffProps } from "../src/staff";
import { RouteUtil } from "set-piece";
import { boot } from "./boot";

describe('refer', () => {
        
    boot();
    const ingsoc = new IngSocModel({});

    const obrien = ingsoc.child.minitrue;
    const aaronson = ingsoc.child.minipax

    const winston = obrien.child.subordinates[0];
    const julia = obrien.child.subordinates[1];
    const syme = new StaffModel({
        state: {
            name: 'Syme',
            salary: 10,
            asset: 100,
            value: 0,
            gender: GenderType.MALE,
        }
    })

    test('precheck', () => {
        expect(obrien.refer.friends).toContain(winston)
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston || !julia) return;

    test('refer', () => {
        expect(winston.refer.friends?.length).toBe(0);
        winston.hello(julia);
        winston.hello(syme)
        expect(winston.refer.friends?.length).toBe(1);
        expect(winston.refer.friends?.[0]).toBe(julia);
    })

    test('tranx', () => {
        const result = winston.hello(syme);
        expect(result?.length).toBe(2);
        expect(result?.[0]).toBe(julia);
        expect(result?.[1]).toBe(syme);
        expect(winston.refer.friends?.length).toBe(1);
    })


    test('bind', () => {
        aaronson.draft.child.subordinates.push(syme);
        expect(aaronson.child.subordinates.length).toBe(1);
        winston.hello(syme);
        expect(winston.refer.friends?.length).toBe(2);
    })

    test('unbind', () => {
        console.log('remove')
        obrien.remove(julia);
        expect(obrien.child.subordinates.length).toBe(1);
        expect(winston.refer.friends?.length).toBe(1);
        expect(winston.refer.friends?.[0]).toBe(syme)
        aaronson.remove(syme);
        expect(winston.refer.friends?.length).toBe(0);
    })


})