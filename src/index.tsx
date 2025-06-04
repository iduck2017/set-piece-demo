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
        const ingsoc = new IngSocModel();
        AppService._rootModel = RouteAgent.init(ingsoc);
        window.root = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugService.log()
    static test() {
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
    }
}

window.app = AppService;
AppService.boot();
AppService.test();