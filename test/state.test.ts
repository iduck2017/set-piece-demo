import { GenderType } from "@/common"
import { StaffModel } from "./staff"
import { IngSocModel } from "./ing-soc"
import { ModelCycle } from "set-piece";

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined

describe('state', () => {
    const ingsoc = new IngSocModel();
    const jones = ingsoc.child.miniluv;
    const rutherford = ingsoc.child.miniplenty;
    const goldstein = new StaffModel({
        state: {
            name: 'Emmanuel Goldstein',
            salary: 200,
            asset: 8_000,
            gender: GenderType.MALE,
        }
    })

    let jonesSalary = jones.state.salary;
    let rutherfordSalary = rutherford.state.salary;
    let goldsteinSalary = goldstein.state.salary;

    let goldsteinAsset = goldstein.state.asset;
    let partyAsset = ingsoc.state.asset;

    test('alter_state', () => {
        const gift = 100;
        goldstein._increaseAsset(gift);
        goldsteinAsset += gift;
        expect(goldstein.state.asset).toBe(goldsteinAsset);

        goldstein._decreaseAsset(gift);
        goldsteinAsset -= gift;
        expect(goldstein.state.asset).toBe(goldsteinAsset);
    })


    test('decor_not_load', () => {
        ingsoc.corrupt();
    })

    test('decor_load', () => {
        ModelCycle.boot(ingsoc);
        expect(ingsoc.state.asset).toBe(partyAsset - 250);
    })

})

