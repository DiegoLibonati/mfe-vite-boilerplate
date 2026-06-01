import { Component, ViewEncapsulation } from "@angular/core";

import "@shared/components/DefaultLoading/DefaultLoading.css";

@Component({
  selector: "app-default-loading",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./default-loading.component.html",
})
class DefaultLoadingComponent {}

export default DefaultLoadingComponent;
