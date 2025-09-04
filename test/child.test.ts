import { GenderType } from "../src/types";
import { IngSocModel } from "../src/ing-soc";
import { StaffModel, StaffProps } from "../src/staff";
import { boot } from "./boot";

describe('child', () => {
    boot();
    const ingsoc = new IngSocModel();

    const obrien = ingsoc.child.minitrue;
    const aaronson = ingsoc.child.minipax

    const winston = obrien.child.subordinates[0];
    const julia = obrien.child.subordinates[1];
    const syme = new StaffModel(() => ({
        state: {
            name: 'Syme',
            salary: 10,
            asset: 100,
            value: 0,
            gender: GenderType.MALE,
        }
    }))


    if (!winston || !julia) throw new Error();

    
    test('push', () => {
        expect(aaronson.child.subordinates.length).toBe(0);
        aaronson.draft.child.subordinates.push(syme);
        expect(aaronson.child.subordinates.length).toBe(1);
        expect(aaronson.child.subordinates[0]).toBe(syme);
    })

    test('reset', () => {
        aaronson.draft.child.subordinates[0] = syme;
        expect(aaronson.child.subordinates[0]).toBe(syme);
    })

    
    test('pop', () => {
        const result = obrien.draft.child.subordinates.pop();
        expect(result).toBe(julia);
        expect(obrien.child.subordinates.length).toBe(1);
    })


    test('set', () => {
        aaronson.draft.child.subordinates[0] = julia;
        expect(aaronson.child.subordinates.length).toBe(1);
        expect(aaronson.child.subordinates[0]).toBe(julia);
    })

    test('copy', () => {
        aaronson.draft.child.subordinates.push(syme, syme);
        expect(aaronson.child.subordinates.length).toBe(3);
        expect(aaronson.child.subordinates[1]).toBe(syme);
        expect(aaronson.child.subordinates[2]).not.toBe(syme);
        expect(aaronson.child.subordinates[0]?.uuid).not.toBe(syme.uuid);
    })

    test('shift', () => {
        const result = obrien.draft.child.subordinates.shift();
        expect(result).toBe(winston);
        expect(obrien.child.subordinates.length).toBe(0);
    })

    test('unshift', () => {
        aaronson.draft.child.subordinates.unshift(winston);
        expect(aaronson.child.subordinates.length).toBe(4);
        expect(aaronson.child.subordinates[0]).toBe(winston);
    })
    

    test('fill', () => {
        aaronson.draft.child.subordinates.fill(syme);
        expect(aaronson.child.subordinates.length).toBe(4);
        expect(aaronson.child.subordinates[0]).not.toBe(syme);
        expect(aaronson.child.subordinates[1]).not.toBe(syme);
        expect(aaronson.child.subordinates[2]).not.toBe(syme);
        expect(aaronson.child.subordinates[3]).not.toBe(syme);
    })

    test('splice', () => {
        aaronson.draft.child.subordinates.splice(2, 2, winston, julia);
        expect(aaronson.child.subordinates[2]).toBe(winston);
        expect(aaronson.child.subordinates[3]).toBe(julia);
    })
    
})
