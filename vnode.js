export function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children, // 虚拟DOM 的孩子元素
    el: null, //真实DOM
    component: null, //虚拟DOM的组件实例
    key: props && props.key // 虚拟DOM 的 key
  };
  return vnode
}
