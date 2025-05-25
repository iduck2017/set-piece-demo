import { AppService } from ".";
import { IngSocModel } from "./ing-soc";

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare global {
    interface Window {
        app: AppService | undefined;
        root: IngSocModel | undefined;
    }
}