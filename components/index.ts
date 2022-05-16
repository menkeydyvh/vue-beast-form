import type { App } from 'vue';
import type { FactoryOptionType } from './types';
import factory from './core';

export const JsonLayout = factory();

const useComponent = {
  setOption: (option: FactoryOptionType) => {
    JsonLayout.setOption(option)
  },
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
    return app;
  }
}

export default useComponent