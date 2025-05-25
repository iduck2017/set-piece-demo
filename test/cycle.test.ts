// import { ModelCycle, ModelStatus } from "set-piece";
// import { BunnyModel, GenderType } from "./bunny";

// test.skip('cycle', () => {
//     const judy = new BunnyModel({});
//     const jane = new BunnyModel({
//         state: { name: 'Jane' }
//     });
//     const john = new BunnyModel({
//         state: { name: 'John', gender: GenderType.MALE }
//     });

//     expect(jane.status).toBe(ModelStatus.INIT);
//     expect(judy.status).toBe(ModelStatus.INIT);
//     expect(john.status).toBe(ModelStatus.INIT);
    
//     spawn: {
//         judy.spawn(jane);
//         expect(judy.status).toBe(ModelStatus.INIT);
//         expect(jane.status).toBe(ModelStatus.BIND);
//         expect(john.status).toBe(ModelStatus.INIT);
//     }
    
//     boot: {
//         ModelCycle.boot(judy);
//         expect(judy.status).toBe(ModelStatus.LOAD);
//         expect(jane.status).toBe(ModelStatus.LOAD);
//         expect(john.status).toBe(ModelStatus.INIT);
//     }

//     spawn: {
//         jane.spawn(john);
//         expect(judy.status).toBe(ModelStatus.LOAD);
//         expect(jane.status).toBe(ModelStatus.LOAD);
//         expect(john.status).toBe(ModelStatus.LOAD);
//     }

//     despawn: {
//         const result = judy.despawn();
//         expect(result).toBe(jane);
//         expect(judy.status).toBe(ModelStatus.LOAD);
//         expect(jane.status).toBe(ModelStatus.INIT);
//         expect(john.status).toBe(ModelStatus.BIND);
//     }

// })