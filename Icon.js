import { ref } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'
import { createVNode } from './vnode.js'
export const Icon = {
    name: 'Icon',
    setup() {
       const txt = ref('组件库 Icon 组件') 
       return {
        txt
       }
    },
    render() {
        return createVNode('div', {}, 'Icon param txt is：' + this.txt)
    }
}
