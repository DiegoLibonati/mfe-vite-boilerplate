import type { LinkProps } from "@shared/types/props";

import Link from "@shared/components/Link/Link";

import { createComponentMount } from "@shared/helpers/createComponentMount";

const { mount, unmount } = createComponentMount<LinkProps>(Link);

export { mount, unmount };
