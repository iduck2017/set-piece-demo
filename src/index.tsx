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
        console.log('create', ingsoc);
        AppService._rootModel = RouteAgent.boot(ingsoc);
        window.model = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
        ingsoc.test();
    }
}

window.app = AppService;
AppService.boot();