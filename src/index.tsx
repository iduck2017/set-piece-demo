import React from "react";
import { createRoot } from "react-dom/client";
import { RootModel } from "./root";
import { DebugService, StoreService } from "set-piece";

export class AppService {
    private static rootView?: HTMLElement;
    private static rootModel?: RootModel;

    private constructor() {}

    private static isInited: boolean = false;

    static async init() {
        if (AppService.isInited) return;

        // Model initialize
        AppService.rootModel = new RootModel({
            code: 'root',
            uuid: StoreService.uuid,
            path: 'root',
            parent: undefined,
        });
        // View initialize
        // AppService._rootView = document.getElementById("root") ?? undefined;
        // if (!AppService._rootView) return;
        // createRoot(AppService._rootView).render(<RootView model={this._rootModel} />);
        AppService.isInited = true;
    }

    @DebugService.useStack()
    static test() {
        if (!AppService.rootModel) return;
        const root = AppService.rootModel;
        console.log(root.state.count)
        root.spawn();
        // AppService.rootModel.ping()
        // AppService.rootModel.add();
        // root.debug();
        // console.log(root.queryChild(root.pathAbsolute));
        // console.log(root.event.onPing.pathAbsolute)
        // console.log(root.decor.count.pathAbsolute);
    }
}


AppService.init();
AppService.test();