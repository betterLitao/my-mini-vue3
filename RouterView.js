import { ref } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';
import { createVNode } from './vnode.js';
import { currentInstance, currentRenderingInstance } from './mini-vue3.js';
export default {
  name: 'RouterView',
  setup() {
    const txt = ref('全局组件');
    console.log('RouterView', 'setup', currentInstance);
    return {
      txt
    };
  },
  // 一般在 SFC 的模式组件下我们是不用写 render 选项的，render 选项是由 template 进行编译生成的
  render() {
    console.log('RouterView', 'render', currentRenderingInstance);
    return createVNode('div', {}, 'RouterView param txt is：' + this.txt);
  }
};
