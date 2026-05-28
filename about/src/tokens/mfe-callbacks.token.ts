import { InjectionToken } from "@angular/core";

import type { MfeCallbacks } from "@mfe/shared/types/mfe";

export const MFE_CALLBACKS = new InjectionToken<MfeCallbacks>("MfeCallbacks");
