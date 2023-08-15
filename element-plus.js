import { Button } from './Button.js';
import { Icon } from './Icon.js';
Button.install = (app) => app.component('Button', Button);
Icon.install = (app) => app.component('Icon', Icon);
const components = [Button, Icon];
export const ElementPlus = {
  install(app) {
    // 是否已安装标识
    const INSTALLED_KEY = Symbol('INSTALLED_KEY');
    if (app[INSTALLED_KEY]) return;
    app[INSTALLED_KEY] = true;
    components.forEach((e) => app.use(e));
  }
};
