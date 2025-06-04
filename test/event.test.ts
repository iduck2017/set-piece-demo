import { RouteAgent } from "set-piece";
import { IngSocModel } from "../src/ing-soc"
import { StaffModel } from "../src/staff";
import { GenderType } from "@/common";

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined

describe('event', () => {
    const ingsoc = new IngSocModel();

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


    const winston = obrien.child.subordinates[0];
    const julia = obrien.child.subordinates[1];

    const assets = ingsoc.state.asset;

    test('precheck', () => {
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston || !julia) return;
    
    test('apply', () => {
        expect(winston.state.salary).toBe(10);
        expect(winston.state.value).toBe(100);
        expect(winston.state.asset).toBe(100);
        winston.apply()
        expect(winston.state.asset).toBe(100);
        expect(ingsoc.state.asset).toBe(assets);
    })

    test('boot', () => {
        RouteAgent.init(ingsoc);
        winston.apply();
        expect(winston.state.asset).toBe(110);
        expect(ingsoc.state.asset).toBe(assets + 90);

        julia.apply();
        expect(julia.state.asset).toBe(110);
        expect(ingsoc.state.asset).toBe(assets + 180);


        obrien.apply();
        expect(obrien.state.asset).toBe(1100);
        expect(ingsoc.state.asset).toBe(assets + 80)
        
    })

    test('promote', () => {
        winston.promote();
        expect(winston.state.salary).toBe(20);

        winston.apply();
        expect(winston.state.asset).toBe(130);
        expect(ingsoc.state.asset).toBe(assets + 160);
    })

    test('corruption', () => {
        
        ingsoc.corrupt(true);
        
        expect(ingsoc.state.asset).toBe(assets - 20000 + 160);
        obrien.apply();
        expect(obrien.state.asset).toBe(1300);
        expect(ingsoc.state.asset).toBe(assets - 20000 - 40);

        ingsoc.corrupt(false);
        expect(ingsoc.child.incidents.length).toBe(0);
        expect(ingsoc.state.asset).toBe(assets - 40);
    })


    test('purge', () => {
        ingsoc.purge(goldstein, obrien);

        expect(goldstein.state.asset).toBe(1000);
        expect(goldstein.state.salary).toBe(100);
        goldstein.apply();
        expect(goldstein.state.asset).toBe(1100);
        expect(ingsoc.state.asset).toBe(assets - 140);
        
        obrien.apply();
        expect(obrien.state.asset).toBe(1300);
        expect(ingsoc.state.asset).toBe(assets - 140);

        winston.apply();
        expect(winston.state.asset).toBe(130);
        expect(ingsoc.state.asset).toBe(assets - 140);
    })
})