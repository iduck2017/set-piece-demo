import React from "react";
import { RootView } from "@/debug/root";
import { Model } from "../models";
import { ValidateService } from "./validate";
import { DemoModel } from "@/models/demo";
import { createRoot } from "react-dom/client";
import { RootModel } from "@/models/root";

export class AppService {
    private static _rootView?: HTMLElement;
    private static _rootModel?: RootModel;
    public static get rootModel() { return this._rootModel; }

    private constructor() {}

    private static _isInit: boolean = false;

    static async init() {
        if (AppService._isInit) return;

        // Model initialize
        this._rootModel = new RootModel({});

        // View initialize
        AppService._rootView = document.getElementById("root") ?? undefined;
        if (!AppService._rootView) return;
        createRoot(AppService._rootView).render(<RootView model={this._rootModel} />);

        AppService._isInit = true;
    }
    

    static quit() {
    }
}

