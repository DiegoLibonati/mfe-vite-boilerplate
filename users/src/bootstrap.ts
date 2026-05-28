import { createApp } from "vue";

import App from "@/App.vue";

import "@/index.css";

const app = createApp(App);
app.provide("mfeCallbacks", {
  onNavigate: (path: string) => {
    window.location.href = path;
  },
});
app.mount(document.getElementById("root")!);
