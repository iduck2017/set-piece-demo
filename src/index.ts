import { AppService } from "./services/app";
export { StorageService } from "./services/storage";
export { LifecycleService } from "./services/lifecycle";
export { ValidateService } from "./services/validate";

export { Model } from "./models";
export { Event } from "./types/event";

export { Value, KeyOf } from "./types/base";

export { View } from "./debug";
export { Link, State } from "./debug/common";

AppService.init();