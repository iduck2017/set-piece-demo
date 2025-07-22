import React from "react";
import { createRoot } from "react-dom/client";
import { DebugUtil, Model, RouteUtil, StoreUtil } from "set-piece";
import { IngSocModel } from "./ing-soc";
import { StaffModel } from "./staff";
import { GenderType } from "./common";

export class AppService {
    private static _rootView?: HTMLElement;
    
    private static _rootModel?: IngSocModel;
    public static get rootModel() {
        return AppService._rootModel;
    }

    private constructor() {}

    @DebugUtil.log()
    public static boot() {
        const ingsoc = new IngSocModel();
        console.log('create', ingsoc);
        ingsoc.debug();
        AppService._rootModel = RouteUtil.boot(ingsoc);
        window.root = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugUtil.log()
    public static test() {
        const ingsoc = AppService._rootModel;
        if (!ingsoc) return;

        const obrien = ingsoc.child.minitrue;
        const aaronson = ingsoc.child.minipax;
        const goldstein = new StaffModel({
            state: {
                name: 'Emmanuel Goldstein',
                salary: 100,
                asset: 10_000,
                value: 0,
                gender: GenderType.MALE,
            }
        });


        const winston = obrien.child.subordinates[0];
        const julia = obrien.child.subordinates[1];

        if (!winston) return;
        if (!julia) return;

        winston.hello(goldstein);
        console.log('friends', winston.refer.friends?.map(item => item.name))

        winston.hello(julia);
        console.log('friends', winston.refer.friends?.map(item => item.name))
    
        console.log('salary', winston.state.salary);
        winston.promote();
        console.log('salary', winston.state.salary)

        obrien.remove(julia);
        console.log('sub', obrien.child.subordinates.map(item => item.name));
        console.log(winston);

        winston.demote()

        winston.debug()
        ingsoc.debug()
        console.log(StoreUtil.save(ingsoc))
    }
}

window.app = AppService;
AppService.boot();
AppService.test();