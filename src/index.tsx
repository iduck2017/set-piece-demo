import React from "react";
import { createRoot } from "react-dom/client";
import { RootModel } from "./root";
import { StoreService } from "set-piece";

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
            path: undefined,
            parent: undefined,
        });
        // View initialize
        // AppService._rootView = document.getElementById("root") ?? undefined;
        // if (!AppService._rootView) return;
        // createRoot(AppService._rootView).render(<RootView model={this._rootModel} />);
        AppService.isInited = true;
    }

    static test() {
        if (!AppService.rootModel) return;
        console.log(AppService.rootModel.state.count)
        // AppService.rootModel.batchAdd();
        // AppService.rootModel.ping()
        AppService.rootModel.add();
    }
}


AppService.init();
AppService.test();