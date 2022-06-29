import type { App } from 'vue';
import factory from './factory';

export const JsonLayout = factory();

const useComponent = {
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
    return app;
  }
}

export default useComponent