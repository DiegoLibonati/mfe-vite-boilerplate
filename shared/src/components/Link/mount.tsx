import type { LinkProps } from "@mfe/shared/types/props";

import Link from "@mfe/shared/components/Link/Link";

import { createComponentMount } from "@mfe/shared/helpers/createComponentMount";

const { mount, unmount } = createComponentMount<LinkProps>(Link);

export { mount, unmount };
