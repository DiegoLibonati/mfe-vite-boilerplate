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
export class SharedMfeComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) module!: SharedComponentModule;
  @Input({ required: true }) componentProps!: Record<string, unknown>;

  @ViewChild("container", { static: true }) containerRef!: ElementRef<HTMLElement>;

  private callbacks = inject(MFE_CALLBACKS);

  ngAfterViewInit(): void {
    this.module.mount(this.containerRef.nativeElement, this.componentProps, {
      callbacks: this.callbacks,
    });
  }

  ngOnDestroy(): void {
    this.module.unmount(this.containerRef.nativeElement);
  }
}
