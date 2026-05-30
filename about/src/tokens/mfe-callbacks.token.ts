import { InjectionToken } from "@angular/core";

import type { MfeCallbacks } from "shared/sdk";

export const MFE_CALLBACKS = new InjectionToken<MfeCallbacks>("MfeCallbacks");
