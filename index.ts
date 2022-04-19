import type { App } from 'vue';
import JsonLayout from './components';
import { version } from './package.json';

JsonLayout.version = version;

JsonLayout.install = function (app: App) {
  app.component(JsonLayout.name, JsonLayout);
  return app;
};


export default JsonLayout
