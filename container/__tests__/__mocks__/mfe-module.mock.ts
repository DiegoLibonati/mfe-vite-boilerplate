import type { MfeModule } from "shared/sdk";

export const mockMfeModule: jest.Mocked<MfeModule> = {
  mount: jest.fn(),
  unmount: jest.fn(),
};
