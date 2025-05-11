import { AppService } from ".";
import { RootModel } from "./root";

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare global {
    interface Window {
        app: AppService;
        root: RootModel;
    }
}