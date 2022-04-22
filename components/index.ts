import type { App } from 'vue';
import JsonLayout from './core';

JsonLayout.install = (app: App) => {
  app.component(JsonLayout.name, JsonLayout);
  return app;
};

export default JsonLayout
