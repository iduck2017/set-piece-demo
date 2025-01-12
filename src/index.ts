import React from "react";
(window as any).React2 = React;
console.log('react check:', (window as any).React2 === (window as any).React1);

import { AppService } from "./services/app";

console.log("Hello World");
AppService.init();