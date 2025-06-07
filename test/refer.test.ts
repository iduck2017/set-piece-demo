import { GenderType } from "@/common";
import { IngSocModel } from "@/ing-soc";
import { StaffModel } from "@/staff";
import { RouteAgent } from "set-piece";

describe('refer', () => {
        
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

    test('refer', () => {
        expect(winston.refer.friends.length).toBe(0);
        winston.hello(julia);
        winston.hello(syme)
        expect(winston.refer.friends.length).toBe(0);
    })

    test('boot', () => {
        RouteAgent.boot(ingsoc);
        expect(winston.refer.friends.length).toBe(2);
        expect(winston.refer.friends[0]).toBe(julia);
        expect(winston.refer.friends[1]).toBe(undefined);
    })


    test('spawn')

})