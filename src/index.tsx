import React from "react";
import { createRoot } from "react-dom/client";
import { DebugService, Model, ModelCycle } from "set-piece";
import { RootModel } from "./root";

export class AppService {
    private static _rootView?: HTMLElement;
    
    private static _rootModel?: RootModel;
    public static get rootModel() {
        return AppService._rootModel;
    }

    private constructor() {}

    static async boot() {
        AppService._rootModel = ModelCycle.boot(new RootModel({}));
        window.app = AppService._rootModel;
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugService.log()
    static test() {
        if (!AppService._rootModel) return;
        const root = AppService._rootModel;
        console.log(root.proxy.event.onPing);
        console.log(root.proxy.decor.count);
        console.log(root.proxy.child.boss.event.onHello);
        console.log(root.proxy.child.boss.decor.level);
        console.log(root.proxy.child.boss.child.vice?.event.onHello)
        console.log(root.proxy.child.boss.child[0].decor.name);

        console.log('count:', root.state.count)
        console.log('name:', root.state.name)
        console.log('child:', root.child.boss.uuid);

        root.child.boss.recruit();
        root.child.boss.recruit();
        root.ping();

        root.child.boss.connect();

        root.child.boss.dismiss();
        console.log('refer:', root.child.boss.refer)

        root.ping();
    }
}

window.app = AppService;
AppService.boot();
AppService.test();