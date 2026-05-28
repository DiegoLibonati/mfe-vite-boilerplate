import type { MfeModule } from "@mfe/shared/types";

export const mockMfeModule: jest.Mocked<MfeModule> = {
  mount: jest.fn(),
  unmount: jest.fn(),
};
