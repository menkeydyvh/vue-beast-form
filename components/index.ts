import type { App } from 'vue';
import factory from './core';
import testFactory from './test';

export const TestJsonLayout = testFactory();

export const JsonLayout = factory();

const useComponent = {
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
    return app;
  }
}

export default useComponent