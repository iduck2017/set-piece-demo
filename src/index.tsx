import React from "react";
import { createRoot } from "react-dom/client";
import { DebugUtil } from "set-piece";
import { IngSocModel } from "./ing-soc";
import { StaffModel } from "./staff";
import { GenderType } from "./types";

export class AppService {
    private static _rootView?: HTMLElement;
    
    private static _rootModel?: IngSocModel;
    public static get rootModel() {
        return AppService._rootModel;
    }

    private constructor() {}

    @DebugUtil.span()
    public static boot() {
        const ingsoc = new IngSocModel();
        const obrien = ingsoc.child.minitrue;
        const winston = obrien.child.subordinates[0];
        const julia = obrien.child.subordinates[1];

        AppService._rootModel = ingsoc;

        window.root = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugUtil.span()
    public static test() {
        const ingsoc = AppService._rootModel;
        if (!ingsoc) return;

        const obrien = ingsoc.child.minitrue;
        console.log(obrien.route.parent)
        // const aaronson = ingsoc.child.minipax;
        // const goldstein = new StaffModel(() => ({
        //     state: {
        //         name: 'Emmanuel Goldstein',
        //         salary: 100,
        //         asset: 10_000,
        //         value: 0,
        //         gender: GenderType.MALE,
        //     }
        // }));
        // const winston = obrien.child.subordinates[0];
        // const julia = obrien.child.subordinates[1];
        // if (!winston) return;
        // if (!julia) return;

        // console.log(julia.refer.friends)

        // console.log(aaronson.state.salary);
        // console.log(aaronson.state.asset);
        // aaronson.work();
        // console.log(aaronson.state.asset);
        // aaronson.promote();
        // console.log(aaronson.state.salary)
        // winston.promote();
        // console.log(winston.state.salary);
        // ingsoc.depress(true);
        // console.log(winston.state.salary);
        // console.log(aaronson.state.salary);

        // aaronson.demote();
        // console.log(aaronson.state.salary);
        // ingsoc.depress(false);
        // console.log(aaronson.state.salary);
        // console.log(winston.state.salary)

        // console.log('corrupt')
        // ingsoc.corrupt(true);
        // console.log(aaronson.state.salary)
        // console.log(ingsoc.state.asset)
    }
}

window.app = AppService;
AppService.boot();
AppService.test();