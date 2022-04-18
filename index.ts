import type { App } from 'vue';
import JsonLayout from './components';
import pkg from './package.json';


export const install = function (app: App) {
  app.component(JsonLayout.name, JsonLayout);
  return app;
};

export const version = pkg.version;

export default {
  version,
  install,
};
