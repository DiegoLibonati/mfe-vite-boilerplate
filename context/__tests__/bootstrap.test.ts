const mockRender = jest.fn();
const mockCreateRoot = jest.fn();

jest.mock("react-dom/client", () => ({
  createRoot: (...args: unknown[]): { render: jest.Mock; unmount: jest.Mock } => {
    mockCreateRoot(...args);
    return { render: mockRender, unmount: jest.fn() };
  },
}));

describe("bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("should create a root on the #root element", async () => {
    await jest.isolateModulesAsync(async () => {
      await import("@context/bootstrap");
    });

    expect(mockCreateRoot).toHaveBeenCalledWith(document.querySelector<HTMLDivElement>("#root"));
  });

  it("should render the App inside the root", async () => {
    await jest.isolateModulesAsync(async () => {
      await import("@context/bootstrap");
    });

    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
