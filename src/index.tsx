import React from "react";
import { createRoot } from "react-dom/client";
import { DebugService, Model, RouteAgent } from "set-piece";
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

    static async boot() {
        AppService._rootModel = RouteAgent.init(new IngSocModel({}));
        window.root = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugService.log()
    static test() {
        const ingsoc = AppService._rootModel;
        if (!ingsoc) return;
        ingsoc.cost();
        const winston = ingsoc.child.minitrue.child.subordinates[0];
        const obrien = ingsoc.child.minitrue;
        if (!winston) return;
        winston.debug();
        obrien.debug();

        // if (!ingsoc) return;
        // const goldstein = new StaffModel({
        //     state: {
        //         name: 'Emmanuel Goldstein',
        //         salary: 200,
        //         asset: 8_000,
        //         gender: GenderType.MALE,
        //     }
        // })
        // const winston = ingsoc.child.minitrue.child.subordinates[0];
        // const julia = ingsoc.child.minitrue.child.subordinates[1];
        // const obrien = ingsoc.child.minitrue;
        // const aaronson = ingsoc.child.minipax;
        // ingsoc.depress(true);
        // console.log(winston?.state.salary);
        // console.log(julia?.state.salary);
        // console.log(obrien.state.salary);
        // console.log(aaronson.state.salary);
    }
}

window.app = AppService;
AppService.boot();
AppService.test();