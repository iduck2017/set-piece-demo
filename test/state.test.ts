import { IngSocModel } from "../src/ing-soc"

describe('state', () => {
    const ingsoc = new IngSocModel();
    const winston = ingsoc.child.minitrue.child.subordinates[0];
    const julia = ingsoc.child.minitrue.child.subordinates[1];
    if (!winston || !julia) throw new Error();

    test('income', () => {
        winston.income(100);
        expect(winston.state.asset).toBe(200);
        expect(winston.draft.state.asset).toBe(200);
    })

    test('outcome', () => {
        const result = julia.income(-200);
        expect(result).toBe(-100);
        expect(julia.state.asset).toBe(0);
        expect(julia.draft.state.asset).toBe(0);
    })
})
