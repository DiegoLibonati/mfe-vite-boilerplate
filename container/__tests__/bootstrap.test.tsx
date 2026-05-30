const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

jest.mock("react-dom/client", () => ({
  __esModule: true,
  default: {
    createRoot: mockCreateRoot,
  },
}));

jest.mock("@container/constants/envs", () => {
  const mockData = jest.requireActual("@tests/__mocks__/envs.mock");
  const { mockEnvs } = mockData;
  return {
    __esModule: true,
    default: mockEnvs,
  };
});

describe("bootstrap", () => {
  it("should create a React root on the #root element and render the app", async () => {
    document.body.innerHTML = '<div id="root"></div>';
    mockCreateRoot.mockReturnValue({ render: mockRender });

    await import("@container/bootstrap");

    expect(mockCreateRoot).toHaveBeenCalledWith(document.querySelector<HTMLDivElement>("#root"));
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
