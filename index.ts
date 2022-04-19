import type { App } from 'vue';
import JsonLayout from './components';
import { version } from './package.json';


export const install = function (app: App) {
  app.component(JsonLayout.name, JsonLayout);
  return app;
};

export default {
  version,
  install,
};
