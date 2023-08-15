import { createVNode } from './vnode.js';
import { effect, proxyRefs } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';
// 设置当前的组件实例
export let currentInstance = null;
// 当前运行的渲染组件实例
export let currentRenderingInstance = null;
function createElement(type) {
  return document.createElement(type);
}
function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null);
}
function setElementText(el, text) {
  el.textContent = text;
}

function createRenderer({
  createElement: hostCreateElement,
  insert: hostInsert,
  setElementText: hostSetElementText
}) {
  // 创建应用实例的上下文对象
  const context = createAppContext();
  // 插件注册池
  const installedPlugins = new Set();
  // 当前组件上下文对象，其中包含 config，app，components 等，而 components 则是我们这期重点要了解的
  function createAppContext() {
    return {
      app: null,
      config: {},
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null)
    };
  }
  function mountElement(vnode, container, parentInstance) {
    // 使用 vnode.type 作为标签名称创建 DOM 元素
    const el = (vnode.el = hostCreateElement(vnode.type));
    // 获取 children 内容
    const { children } = vnode;
    if (typeof children === 'string') {
      hostSetElementText(el, children);
    } else if (Array.isArray(children)) {
      children.forEach((e) => {
        if (typeof e === 'string') {
          patch(null, createVNode(vnode.type, null, e), el, parentInstance);
        } else if (typeof e === 'object') {
          patch(null, e, el, parentInstance);
        }
      });
    }
    // 将元素插入到挂载点下
    hostInsert(el, container);
  }
  // 初始化一个组件的上下文对象
  const emptyAppContext = createAppContext();
  function mountComponent(vnode, container, parentInstance) {
    const appContext =
      (parentInstance ? parentInstance.appContext : vnode.appContext) || emptyAppContext;
    // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息
    const instance = {
      vnode,
      type: vnode.type,
      isMounted: false,
      setupState: null,
      appContext,
      subTree: null,
      render: null,
      update: null,
      proxy: null // 组件代理对象
    };
    const { setup, render } = vnode.type;
    currentInstance = instance;
    const setupResult = setup();
    currentInstance = null;
    if (typeof setupResult === 'object') {
      instance.setupState = proxyRefs(setupResult);
    }

    instance.proxy = new Proxy(
      { _: instance },
      {
        get({ _: instance }, key) {
          if (key in instance.setupState) {
            return instance.setupState[key];
          }
          // 其他可以是 props, slots 等
        }
      }
    );
    // 把组件对象上的 render 函数赋值给组件实例的 render 属性
    instance.render = render;
    // 将渲染任务包装到一个 effect 中，这样组件自身状态发生变化时，组件便能进行自动触发更新；另外 effect 函数会返回一个 runner 函数，把返回的 runner 函数设置到组件实例对象上 update 属性上，后续更新则可以直接调用组件实例上的 update 方法了
    instance.update = effect(() => {
      instance.isMounted = false;
      const subTree = (instance.subTree = renderComponentRoot(instance));
      patch(null, subTree, container, instance);
      // 把生成的真实DOM 设置到虚拟DOM 的真实DOM 属性 el 上，后续如果没有变化，则不需要再次生成
      instance.vnode.el = subTree.el;
      instance.isMounted = true;
    });
  }
  function renderComponentRoot(instance) {
    let result;
    const prev = setCurrentRenderingInstance(instance);
    result = instance.render.call(instance.proxy);
    setCurrentRenderingInstance(prev);
    return result;
  }
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    return prev;
  }
  function render(vnode, container) {
    patch(null, vnode, container);
  }
  // n1老虚拟dom
  //n2新虚拟dom
  function patch(n1, n2, container, parentInstance) {
    if (typeof n2.type === 'string') {
      if (!n1) {
        // 创建节点
        mountElement(n2, container, parentInstance);
      } else {
        // ...更新节点
      }
    } else {
      if (!n1) {
        // 挂载组件
        mountComponent(n2, container, parentInstance);
      } else {
        // ...更新组件
      }
    }
  }

  function createApp(rootComponent) {
    const app = (context.app = {
      mount(rootContainer) {
        const rootVNode = createVNode(rootComponent);
        // 把应用实例的上下文对象设置到根组件的虚拟DOM 的 appContext 属性上
        rootVNode.appContext = context;
        render(rootVNode, rootContainer);
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) {
          // 已经注册过的插件不运行再进行注册
          console.warn(`Plugin has already been applied to target app.`);
        } else if (plugin && typeof plugin.install === 'function') {
          // 如果插件对象的 install 属性是一个函数，那么就通过调用插件对象的 install 方法进行插件注册
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (typeof plugin === 'function') {
          // 如果插件对象本身是一个函数，那么就直接执行插件本身进行插件注册
          installedPlugins.add(plugin);
          plugin(app, ...options);
        }
        return app;
      }
    });
    return app;
  }
  return {
    createApp
  };
}
// 创建渲染器
const renderer = createRenderer({
  createElement,
  insert,
  setElementText
});
export function createApp(...args) {
  return renderer.createApp(...args);
}
