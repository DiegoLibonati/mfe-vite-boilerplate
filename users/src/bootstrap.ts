import { createApp } from "vue";

import App from "@users/App.vue";

import "@users/index.css";

const app = createApp(App);
app.provide("mfeCallbacks", {
  onNavigate: (path: string) => {
    window.location.href = path;
  },
});
app.mount(document.getElementById("root")!);
