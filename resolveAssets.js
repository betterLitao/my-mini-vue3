import { currentInstance, currentRenderingInstance } from './mini-vue3.js';

export function resolveComponent(name) {
  // 获取当前组件的实例对象
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    // 通过组件实例获取组件对象，也就是 type 属性值
    const Component = instance.type;
    // 局部注册
    const res =
      resolve(Component.components, name) || resolve(instance.appContext.components, name);
    return res;
  }
}

function resolve(registry, name) {
  return registry && registry[name];
}
