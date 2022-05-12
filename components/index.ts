import type { App } from 'vue';
import factory from './core';

export const JsonLayout = factory();

export default {
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
    return app;
  }
}