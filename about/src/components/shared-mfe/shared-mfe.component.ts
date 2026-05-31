import { Component, Input, ViewChild, ViewEncapsulation, inject } from "@angular/core";

import type { ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import type { SharedComponentModule } from "shared/sdk";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

@Component({
  selector: "app-shared-mfe",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./shared-mfe.component.html",
})
class SharedMfeComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) module!: SharedComponentModule;
  @Input({ required: true }) componentProps!: Record<string, unknown>;
  @Input() wrapperClass?: string;

  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  private callbacks = inject(MFE_CALLBACKS);

  // Host div follows the `<className>-wrapper` convention: it derives its class from the
  // mounted component's `className` so consumers don't need a manual wrapper element.
  // Pass `wrapperClass` to override the inferred name.
  get resolvedWrapperClass(): string | undefined {
    if (this.wrapperClass) return this.wrapperClass;
    const className = (this.componentProps as { className?: unknown }).className;
    return typeof className === "string" && className ? `${className}-wrapper` : undefined;
  }

  ngAfterViewInit(): void {
    this.module.mount(this.containerRef.nativeElement, this.componentProps, {
      callbacks: this.callbacks,
    });
  }

  ngOnDestroy(): void {
    this.module.unmount(this.containerRef.nativeElement);
  }
}

export default SharedMfeComponent;
