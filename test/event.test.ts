import { RouteUtil } from "set-piece";
import { IngSocModel } from "../src/ing-soc"
import { StaffModel, StaffProps } from "../src/staff";
import { GenderType } from "../src/types";

describe('event', () => {
    const ingsoc = new IngSocModel();

    const obrien = ingsoc.child.minitrue;
    const goldstein = new StaffModel(() => ({
        state: {
            name: 'Emmanuel Goldstein',
            salary: 100,
            asset: 1000,
            value: 0,
            gender: GenderType.MALE,
        }
    }))


    const winston = obrien.child.subordinates[0];
    const julia = obrien.child.subordinates[1];

    let assets = ingsoc.state.asset;

    if (!winston || !julia) throw new Error();
    
    test('apply', () => {
        expect(winston.state.salary).toBe(10);
        expect(winston.state.value).toBe(100);
        expect(winston.state.asset).toBe(100);
        expect(ingsoc.state.asset).toBe(assets);
    })

    test('boot', () => {
        winston.work();
        expect(winston.state.asset).toBe(110);
        assets += 90;
        expect(ingsoc.state.asset).toBe(assets);
        julia.work();
        expect(julia.state.asset).toBe(110);
        assets += 90;
        expect(ingsoc.state.asset).toBe(assets);
        obrien.work();
        expect(obrien.state.asset).toBe(1100);
        assets -= 100;
        expect(ingsoc.state.asset).toBe(assets)
    })

    test('promote', () => {
        winston.promote();
        expect(winston.state.salary).toBe(20);

        winston.work();
        assets += 80
        expect(winston.state.asset).toBe(130);
        expect(ingsoc.state.asset).toBe(assets);
    })

    test('corruption', () => {
        
        ingsoc.corrupt(true);
        assets -= 40000;
        expect(ingsoc.state.asset).toBe(assets);

        obrien.work();
        assets -= 200;
        expect(obrien.state.asset).toBe(11300);
        expect(ingsoc.state.asset).toBe(assets);
    })


    test('purge', () => {
        console.log('purge')
        ingsoc.purge(goldstein, obrien);

        expect(goldstein.state.asset).toBe(11000);
        expect(obrien.state.asset).toBe(1300);
        expect(goldstein.state.salary).toBe(200);
        
        goldstein.work();
        assets -= 200;
        expect(goldstein.state.asset).toBe(11200);
        expect(ingsoc.state.asset).toBe(assets);
        
        obrien.work();
        expect(obrien.state.asset).toBe(1300);
        expect(ingsoc.state.asset).toBe(assets);
    })

    // test('corruption-off', () => {
    //     ingsoc.corrupt(false);
    //     assets += 40000;
    //     expect(ingsoc.state.asset).toBe(assets);
    //     expect(goldstein.state.asset).toBe(1200);

    //     goldstein.work();
    //     assets -= 100;
    //     expect(goldstein.state.asset).toBe(1300);
    //     expect(ingsoc.state.asset).toBe(assets);
    // })
})