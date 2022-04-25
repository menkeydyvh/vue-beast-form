import type { App } from 'vue';
import factory from './core';

const component = factory();

component.install = (app: App) => {
  app.component(component.name, component);
  return app;
};


export * from "../typings";

export default component