import { TestBed, type ComponentFixture } from "@angular/core/testing";

import type { SharedComponentModule } from "shared/sdk";

import { SharedMfeComponent } from "@about/components/shared-mfe/shared-mfe.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

import { resolveAngularTemplates } from "@tests/__mocks__/resolve-templates.mock";
import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

interface SharedMfeInputs {
  module: SharedComponentModule;
  componentProps: Record<string, unknown>;
}

interface RenderResult {
  fixture: ComponentFixture<SharedMfeComponent>;
  component: SharedMfeComponent;
}

const createMockModule = (): SharedComponentModule => ({
  mount: jest.fn(),
  unmount: jest.fn(),
});

beforeAll(async () => {
  await resolveAngularTemplates();
});

const renderComponent = async (inputs: Partial<SharedMfeInputs> = {}): Promise<RenderResult> => {
  const defaultInputs: SharedMfeInputs = {
    module: createMockModule(),
    componentProps: { id: "test-prop" },
    ...inputs,
  };

  await TestBed.configureTestingModule({
    imports: [SharedMfeComponent],
    providers: [{ provide: MFE_CALLBACKS, useValue: mockCallbacks }],
  }).compileComponents();

  const fixture = TestBed.createComponent(SharedMfeComponent);
  Object.entries(defaultInputs).forEach(([key, value]) => {
    fixture.componentRef.setInput(key, value);
  });
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
};

describe("SharedMfeComponent", () => {
  describe("rendering", () => {
    it("should render the container element", async () => {
      const { fixture } = await renderComponent();

      const container = (fixture.nativeElement as HTMLElement).querySelector<HTMLDivElement>("div");

      expect(container).not.toBeNull();
    });
  });

  describe("lifecycle", () => {
    it("should call module.mount with the container element, component props and callbacks on init", async () => {
      const mockModule = createMockModule();
      const props = { id: "link-1", href: "/test" };

      const { fixture } = await renderComponent({
        module: mockModule,
        componentProps: props,
      });

      const containerDiv = (fixture.nativeElement as HTMLElement).querySelector<HTMLDivElement>(
        "div"
      );

      expect(mockModule.mount).toHaveBeenCalledTimes(1);
      expect(mockModule.mount).toHaveBeenCalledWith(containerDiv, props, {
        callbacks: mockCallbacks,
      });
    });

    it("should call module.unmount with the container element on destroy", async () => {
      const mockModule = createMockModule();
      const { fixture } = await renderComponent({ module: mockModule });
      const containerElement = fixture.componentInstance.containerRef.nativeElement;

      fixture.destroy();

      expect(mockModule.unmount).toHaveBeenCalledTimes(1);
      expect(mockModule.unmount).toHaveBeenCalledWith(containerElement);
    });
  });
});
