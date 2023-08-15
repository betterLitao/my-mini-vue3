import { ref } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';
import { createVNode } from './vnode.js';
import { Component } from './Component.js';
import { currentInstance, currentRenderingInstance } from './mini-vue3.js';
import { resolveComponent } from './resolveAssets.js';
export default {
  name: 'App',
  components: {
    Component
  },
  setup() {
    const count = ref(520);
    console.log('App', 'setup', currentInstance);
    return {
      count
    };
  },
  // 一般在 SFC 的模式组件下我们是不用写 render 选项的，render 选项是由 template 进行编译生成
  render() {
    console.log('App', 'render', currentRenderingInstance);
    // 获取局部组件
    const comp = resolveComponent('Component');
    const RouterView = resolveComponent('RouterView');
    const Button = resolveComponent('Button');
    const Icon = resolveComponent('Icon');
    return createVNode('div', {}, [
      createVNode('p', {}, [
        'Hi Vue3 Component param count is：' + this.count,
        createVNode('li', null, '45465465')
      ]),
      createVNode(comp),
      createVNode(RouterView),
      createVNode(Button),
      createVNode(Icon)
    ]);
  }
};
