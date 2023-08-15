import { ref } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'
import { createVNode } from './vnode.js'
export const Button = {
    name: 'Button',
    setup() {
       const txt = ref('组件库 Button 组件') 
       return {
        txt
       }
    },
    render() {
        return createVNode('div', {}, 'Button param txt is：' + this.txt)
    }
}
