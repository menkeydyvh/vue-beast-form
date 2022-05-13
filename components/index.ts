import type { App } from 'vue';
import type { FactoryOptionType } from './types';
import factory from './core';
import pkg from '../package.json';

export const JsonLayout = factory();

const useComponent = {
  version: pkg.version,
  setOption: (option: FactoryOptionType) => {
    JsonLayout.setOption(option)
  },
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
    return app;
  }
}

export default useComponent