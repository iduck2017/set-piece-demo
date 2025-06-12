import { IngSocModel } from "../src/ing-soc"

console.log = () => undefined
console.group = () => undefined
console.groupEnd = () => undefined

describe('state', () => {
    const ingsoc = new IngSocModel();
    const winston = ingsoc.child.minitrue.child.subordinates[0];
    const julia = ingsoc.child.minitrue.child.subordinates[1];
    
    test('precheck', () => {
        expect(winston).toBeDefined();
        expect(julia).toBeDefined();
    })

    if (!winston) return;
    if (!julia) return;

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
