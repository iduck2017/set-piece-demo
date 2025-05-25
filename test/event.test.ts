// import { ModelCycle } from "set-piece";
// import { IngSocModel } from "../src/ing-soc"
// import { StaffModel } from "../src/staff";
// import { GenderType } from "@/common";

// console.log = () => undefined
// console.group = () => undefined
// console.groupEnd = () => undefined

// describe('event', () => {
//     const ingsoc = new IngSocModel();

//     const obrien = ingsoc.child.minitrue;
//     const aaronson = ingsoc.child.minipax;
//     const rutherford = ingsoc.child.miniplenty;
//     const jones = ingsoc.child.miniluv;
//     const goldstein = new StaffModel({
//         state: {
//             name: 'Emmanuel Goldstein',
//             salary: 200,
//             asset: 8_000,
//             gender: GenderType.MALE,
//         }
//     })

//     let partyAsset = ingsoc.state.asset;

//     let jonesAsset = jones.state.asset;
//     let aaronsonAsset = aaronson.state.asset;
//     let rutherfordAsset = rutherford.state.asset;
//     let obrienAsset = obrien.state.asset;
//     let goldsteinAsset = goldstein.state.asset;

//     let jonesSalary = jones.state.salary;
//     let aaronsonSalary = aaronson.state.salary;
//     let rutherfordSalary = rutherford.state.salary;
//     let obrienSalary = obrien.state.salary;
//     let goldsteinSalary = goldstein.state.salary;


//     test('event_not_load', () => {
//         jones.work();
//         jonesAsset += 0;
//         partyAsset -= 0;
//         expect(jones.state.asset).toBe(jonesAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//     })

//     test('event_load', () => {
//         ModelCycle.boot(ingsoc);
//         jones.work();
//         jonesAsset += jonesSalary;
//         partyAsset -= jonesSalary;
//         expect(jones.state.asset).toBe(jonesAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         jones.work();
//         jonesAsset += jonesSalary;
//         partyAsset -= jonesSalary;
//         expect(jones.state.asset).toBe(jonesAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//     })


//     test('event_unload', () => {
//         ingsoc.purge(goldstein, jones);
//         expect(ingsoc.child.miniluv).toBe(goldstein);
//         jones.work();
//         jonesAsset += 0;
//         partyAsset -= 0;
//         expect(jones.state.asset).toBe(jonesAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//     })

//     test('event_not_reload', () => {
//         goldstein.work();
//         goldsteinAsset += 0;
//         partyAsset -= 0;
//         expect(goldstein.state.asset).toBe(goldsteinAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         ingsoc.purge(jones, goldstein);
//         expect(ingsoc.child.miniluv).toBe(jones);
//         jones.work();
//         jonesAsset += 0;
//         partyAsset -= 0;
//         expect(jones.state.asset).toBe(jonesAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//     })


//     test('event_auto_reload', () => {
//         ingsoc.purge(goldstein, aaronson);
//         expect(ingsoc.child.minipax).toBe(goldstein);
//         goldstein.work();
//         goldsteinAsset += goldsteinSalary;
//         partyAsset -= goldsteinSalary;
//         expect(goldstein.state.asset).toBe(goldsteinAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         ingsoc.purge(aaronson, goldstein);
//         expect(ingsoc.child.minipax).toBe(aaronson);
//         aaronson.work();
//         aaronsonAsset += aaronsonSalary;
//         partyAsset -= aaronsonSalary;
//         expect(aaronson.state.asset).toBe(aaronsonAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//     })

//     test('event_bubble', () => {
//         ingsoc.purge(goldstein, rutherford);
//         expect(ingsoc.child.miniplenty).toBe(goldstein);
//         goldstein.work();
//         goldsteinAsset += goldsteinSalary;
//         partyAsset -= goldsteinSalary;
//         expect(goldstein.state.asset).toBe(goldsteinAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         ingsoc.purge(rutherford, goldstein);
//         expect(ingsoc.child.miniplenty).toBe(rutherford);
//         rutherford.work();
//         rutherfordAsset += rutherfordSalary;
//         partyAsset -= rutherfordSalary;
//         expect(rutherford.state.asset).toBe(rutherfordAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
        
//     })

    
//     const winston = obrien.child[0];
//     const julia = obrien.child[1];
//     const ampleforth = new StaffModel({
//         state: {
//             name: 'Ampleforth',
//             salary: 10,
//             asset: 80,
//         }
//     })


//     test('precheck', () => {
//         expect(winston).toBeDefined();
//         expect(julia).toBeDefined();
//         expect(ampleforth).toBeDefined();
//     })

//     if (!winston || !julia || !ampleforth) {
//         return;
//     }
//     let winstonAsset = winston.state.asset;
//     let juliaAsset = julia.state.asset;
//     let ampleforthAsset = ampleforth.state.asset;

//     let winstonSalary = winston.state.salary;
//     let juliaSalary = julia.state.salary;
//     let ampleforthSalary = ampleforth.state.salary;

//     test('event_recurse', () => {
//         obrien.work();
//         obrienAsset += obrienSalary;
//         partyAsset -= obrienSalary;
//         expect(obrien.state.asset).toBe(obrienAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);
//         expect(obrien.child[0]).toBe(winston);
//         expect(obrien.child[1]).toBe(julia);

//         winston.work();
//         winstonAsset += winstonSalary;
//         partyAsset -= winstonSalary;
//         expect(winston.state.asset).toBe(winstonAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         julia.work();
//         juliaAsset += juliaSalary;
//         partyAsset -= juliaSalary;
//         expect(julia.state.asset).toBe(juliaAsset);
//         expect(ingsoc.state.asset).toBe(partyAsset);

//         obrien.replace(ampleforth, winston);
//         expect(obrien.child[0]).toBe(ampleforth);
//         expect(obrien.child[1]).toBe(julia);
//         ampleforth.work();
//         ampleforthAsset += ampleforthSalary;
//         partyAsset -= ampleforthSalary;
//         expect(ingsoc.state.asset).toBe(partyAsset);
//         expect(ampleforth.state.asset).toBe(ampleforthAsset);
//     })



// })