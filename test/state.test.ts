import { GenderType } from "@/common"
import { StaffModel } from "../src/staff"
import { IngSocModel } from "../src/ing-soc"
import { ModelCycle } from "set-piece";

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined

describe('state', () => {
    const ingsoc = new IngSocModel();
    const jones = ingsoc.child.miniluv;
    const rutherford = ingsoc.child.miniplenty;
    const obrien = ingsoc.child.minitrue;
    const aaronson =ingsoc.child.minipax;
    const goldstein = new StaffModel({
        state: {
            name: 'Emmanuel Goldstein',
            salary: 200,
            asset: 8_000,
            gender: GenderType.MALE,
        }
    })

    const offTheBookIncome = 100;

    const jonesSalary = jones.state.salary;
    const rutherfordSalary = rutherford.state.salary;
    const goldsteinSalary = goldstein.state.salary;
    const obrienSalary = obrien.state.salary;
    const aaronsonSalary = aaronson.state.salary;

    const partyAsset = ingsoc.state.asset;


    const winston = ingsoc.child.minitrue.child[0];
    const julia = ingsoc.child.minitrue.child[1];

    test('precheck', () => {
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston || !julia) {
        return;
    }

    const winstonSalary = winston.state.salary;
    const juliaSalary = julia.state.salary;

    let winstonAsset = winston.state.asset;
    let juliaAsset = julia.state.asset;


    test('decor_not_load', () => {
        ingsoc.corrupt(true);
        expect(jones.state.salary).toBe(jonesSalary);
        expect(rutherford.state.salary).toBe(rutherfordSalary);
        expect(obrien.state.salary).toBe(obrienSalary);
        expect(aaronson.state.salary).toBe(aaronsonSalary);
        expect(ingsoc.state.asset).toBe(partyAsset)
    })

    test('decor_load', () => {
        ModelCycle.boot(ingsoc);
        expect(jones.state.salary).toBe(jonesSalary + offTheBookIncome);
        expect(rutherford.state.salary).toBe(rutherfordSalary + offTheBookIncome);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome);
        expect(aaronson.state.salary).toBe(aaronsonSalary + offTheBookIncome);
        expect(ingsoc.state.asset).toBe(partyAsset - 20_000);
    })

    
    test('decor_unload', () => {
        ingsoc.purge(goldstein, jones);
        expect(jones.state.salary).toBe(jonesSalary);
        expect(goldstein.state.salary).toBe(goldsteinSalary);
        
        ingsoc.purge(jones, goldstein);
        expect(jones.state.salary).toBe(jonesSalary);
        expect(goldstein.state.salary).toBe(goldsteinSalary);
    })

    
    test('decor_reload', () => {
        ingsoc.purge(goldstein, aaronson);
        expect(aaronson.state.salary).toBe(aaronsonSalary);
        expect(goldstein.state.salary).toBe(goldsteinSalary + offTheBookIncome);

        ingsoc.purge(aaronson, goldstein);
        expect(aaronson.state.salary).toBe(aaronsonSalary + offTheBookIncome);
        expect(goldstein.state.salary).toBe(goldsteinSalary);
    })


    test('decor_bubble', () => {
        ingsoc.purge(goldstein, rutherford);
        expect(rutherford.state.salary).toBe(rutherfordSalary);
        expect(goldstein.state.salary).toBe(goldsteinSalary + offTheBookIncome);

        ingsoc.purge(rutherford, goldstein);
        expect(rutherford.state.salary).toBe(rutherfordSalary + offTheBookIncome);
        expect(goldstein.state.salary).toBe(goldsteinSalary);
    })
    

    test('decor_unload', () => {
        ingsoc.corrupt(false);
        expect(jones.state.salary).toBe(jonesSalary);
        expect(rutherford.state.salary).toBe(rutherfordSalary);
        expect(obrien.state.salary).toBe(obrienSalary);
        expect(aaronson.state.salary).toBe(aaronsonSalary);
        expect(ingsoc.state.asset).toBe(partyAsset)
    })
    
    test('decor_reload', () => {
        ingsoc.corrupt(true);
        expect(jones.state.salary).toBe(jonesSalary + offTheBookIncome);
        expect(rutherford.state.salary).toBe(rutherfordSalary + offTheBookIncome);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome);
        expect(aaronson.state.salary).toBe(aaronsonSalary + offTheBookIncome);
        expect(ingsoc.state.asset).toBe(partyAsset - 20_000);
        
        ingsoc.corrupt(true);
        expect(jones.state.salary).toBe(jonesSalary + offTheBookIncome);
        expect(rutherford.state.salary).toBe(rutherfordSalary + offTheBookIncome);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome);
        expect(aaronson.state.salary).toBe(aaronsonSalary + offTheBookIncome);
        expect(ingsoc.state.asset).toBe(partyAsset - 20_000);
    })

    test('alter_state', () => {
        const unexpectIncome = 100;
        winston._increaseAsset(unexpectIncome);
        winstonAsset += unexpectIncome;
        expect(winston.state.asset).toBe(winstonAsset);
    })
    

    test('decor_recurse', () => {
        expect(winston.state.salary).toBe(winstonSalary);
        expect(julia.state.salary).toBe(juliaSalary);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome);

        ingsoc.depress(true);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome - 1);
        expect(winston.state.salary).toBe(winstonSalary - 1);
        expect(julia.state.salary).toBe(juliaSalary - 1);

        ingsoc.depress(false);
        expect(obrien.state.salary).toBe(obrienSalary + offTheBookIncome);
        expect(winston.state.salary).toBe(winstonSalary);
        expect(julia.state.salary).toBe(juliaSalary);

    })


    test('state_origin', () => {
        winston.promote();
        expect(winston.state.salary).toBe(winstonSalary + 1);
        expect(winston.draft.state.salary).toBe(winstonSalary);

        winston.promote();
        expect(winston.state.salary).toBe(winstonSalary + 2);
        expect(winston.draft.state.salary).toBe(winstonSalary);

        winston.promote();
        expect(winston.state.salary).toBe(winstonSalary + 3);
        expect(winston.draft.state.salary).toBe(winstonSalary);
    })

})

