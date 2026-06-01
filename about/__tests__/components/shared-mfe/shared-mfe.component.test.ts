import { TestBed, type ComponentFixture } from "@angular/core/testing";

import type { SharedComponentModule } from "shared/sdk";

import SharedMfeComponent from "@about/components/shared-mfe/shared-mfe.component";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

import { resolveAngularTemplates } from "@tests/__mocks__/resolve-templates.mock";
import { mockCallbacks } from "@tests/__mocks__/callbacks.mock";

interface RenderInputs {
  module?: SharedComponentModule;
  loader?: () => Promise<SharedComponentModule>;
  componentProps?: Record<string, unknown>;
  wrapperClass?: string;
}

interface RenderResult {
  fixture: ComponentFixture<SharedMfeComponent>;
  component: SharedMfeComponent;
  module: SharedComponentModule;
}

const createMockModule = (): SharedComponentModule => ({
  mount: jest.fn(),
  unmount: jest.fn(),
});

beforeAll(async () => {
  await resolveAngularTemplates();
});

const renderComponent = async (inputs: RenderInputs = {}): Promise<RenderResult> => {
  const mockModule = inputs.module ?? createMockModule();
  const loader =
    inputs.loader ?? ((): Promise<SharedComponentModule> => Promise.resolve(mockModule));
  const componentProps = inputs.componentProps ?? { id: "test-prop" };

  await TestBed.configureTestingModule({
    imports: [SharedMfeComponent],
    providers: [{ provide: MFE_CALLBACKS, useValue: mockCallbacks }],
  }).compileComponents();

  const fixture = TestBed.createComponent(SharedMfeComponent);
  fixture.componentRef.setInput("loader", loader);
  fixture.componentRef.setInput("componentProps", componentProps);
  if (inputs.wrapperClass !== undefined) {
    fixture.componentRef.setInput("wrapperClass", inputs.wrapperClass);
  }

  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, module: mockModule };
};

const containerOf = (fixture: ComponentFixture<SharedMfeComponent>): HTMLDivElement | null =>
  (fixture.nativeElement as HTMLElement).querySelector<HTMLDivElement>("div");

describe("SharedMfeComponent", () => {
  describe("rendering", () => {
    it("should render the container element once mounted", async () => {
      const { fixture } = await renderComponent();

      expect(containerOf(fixture)).not.toBeNull();
    });

    it("should show the default loading fallback while the module is loading", async () => {
      const { fixture, module } = await renderComponent({
        loader: () =>
          new Promise<SharedComponentModule>(() => {
            // Never resolves: keeps the component in its loading state.
          }),
      });

      expect(
        (fixture.nativeElement as HTMLElement).querySelector("app-default-loading")
      ).not.toBeNull();
      expect(module.mount).not.toHaveBeenCalled();
    });
  });

  describe("lifecycle", () => {
    it("should call module.mount with the container element, component props and callbacks", async () => {
      const props = { id: "link-1", href: "/test" };

      const { fixture, module } = await renderComponent({ componentProps: props });

      expect(module.mount).toHaveBeenCalledTimes(1);
      expect(module.mount).toHaveBeenCalledWith(containerOf(fixture), props, {
        callbacks: mockCallbacks,
      });
    });

    it("should call module.unmount with the container element on destroy", async () => {
      const { fixture, module } = await renderComponent();
      const containerElement = fixture.componentInstance.containerRef.nativeElement;

      fixture.destroy();

      expect(module.unmount).toHaveBeenCalledTimes(1);
      expect(module.unmount).toHaveBeenCalledWith(containerElement);
    });
  });

  describe("wrapper class", () => {
    it("should infer a <className>-wrapper class on the host div", async () => {
      const { fixture } = await renderComponent({ componentProps: { id: "x", className: "foo" } });

      expect(containerOf(fixture)).toHaveClass("foo-wrapper");
    });

    it("should let wrapperClass override the inferred name", async () => {
      const { fixture } = await renderComponent({
        componentProps: { id: "x", className: "foo" },
        wrapperClass: "bar",
      });

      const div = containerOf(fixture);

      expect(div).toHaveClass("bar");
      expect(div).not.toHaveClass("foo-wrapper");
    });

    it("should add no class when componentProps has no className", async () => {
      const { fixture } = await renderComponent({ componentProps: { id: "x" } });

      expect(containerOf(fixture)?.className).toBe("");
    });
  });
});
