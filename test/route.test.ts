import { GenderType } from "@/common";
import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined

describe('route', () => {
    
    const ingsoc = new IngSocModel();

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
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston || !julia) return;


    test('parent', () => {
        expect(ingsoc.route.parent).toBe(undefined);
        expect(obrien.route.parent).toBe(ingsoc);
        expect(winston.route.parent).toBe(obrien);
        expect(julia.route.parent).toBe(obrien);
    })


    test('remove', () => {
        obrien.draft.child.subordinates.shift();
        expect(obrien.child.subordinates.length).toBe(1);
        expect(winston.route.parent).toBe(undefined);
        expect(julia.route.parent).toBe(obrien);
    })


    test('replace', () => {
        obrien.draft.child.subordinates[0] = syme;
        expect(syme.route.parent).toBe(obrien);
        expect(winston.route.parent).toBe(undefined);
        expect(julia.route.parent).toBe(undefined);
    })


    test('spawn', () => {
        aaronson.draft.child.subordinates.push(winston);
        expect(winston.route.parent).toBe(aaronson);
    })

    test('boot', () => {
        expect(winston.route.root).toBe(ingsoc);
        expect(obrien.route.root).toBe(ingsoc);
        expect(ingsoc.route.root).toBe(ingsoc);
    })
})