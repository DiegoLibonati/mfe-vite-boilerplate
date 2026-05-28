import type { ActionProps } from "@mfe/shared/types/props";

import Action from "@mfe/shared/components/Action/Action";

import { createComponentMount } from "@mfe/shared/helpers/createComponentMount";

const { mount, unmount } = createComponentMount<ActionProps>(Action);

export { mount, unmount };
