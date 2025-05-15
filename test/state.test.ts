import { GenderType } from "@/common"
import { StaffModel } from "./staff"
import { IngSocModel } from "./ing-soc"

test('state', () => {
    const goldstein = new StaffModel({
        state: {
            name: "Emmanuel Goldstein",
            gender: GenderType.MALE,
            salary: 100,
            money: 1000,
        },
    })

    expect(goldstein.state.name).toBe('Emmanuel Goldstein');
    expect(goldstein.state.salary).toBe(100);
    expect(goldstein.state.money).toBe(1000);
    expect(goldstein.state.gender).toBe(GenderType.MALE);

    const ingsoc = new IngSocModel();
    const julia = ingsoc.child.minipax;

    expect(julia?.state.name).toBe('Julia');
    expect(julia?.state.salary).toBe(3);
    expect(julia?.state.money).toBe(20);
    expect(julia?.state.gender).toBe(GenderType.FEMALE);

    julia?._alterMoney(5);
    expect(julia?.state.money).toBe(25);

})

