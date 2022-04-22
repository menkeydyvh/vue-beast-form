import type { App } from 'vue';
import jlFactory from './core';

const jlf = jlFactory();

jlf.install = (app: App) => {
  app.component(jlf.name, jlf);
  return app;
};

export default jlf
