import { DebugUtil, LogLevel } from "set-piece"

export function boot() {
    DebugUtil.level = LogLevel.ERROR;
}