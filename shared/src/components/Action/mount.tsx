import type { ActionProps } from "@shared/types/props";

import Action from "@shared/components/Action/Action";

import { createComponentMount } from "@shared/helpers/createComponentMount";

const { mount, unmount } = createComponentMount<ActionProps>(Action);

export { mount, unmount };
