import {
  onBeforeUnmount,
  onMounted,
  reactive,
  unref,
} from 'vue';

export default function useResize(domStr, cb) {
  const body = reactive({});

  let ro;
  onBeforeUnmount(() => {
    const dom = getDom();
    if (ro && dom) {
      ro.unobserve(dom);
    }
    window.removeEventListener('resize', resize);
  });
  onMounted(() => {
    const dom = getDom();
    if (dom) {
      ro = new ResizeObserver((...args) => {
        if (typeof cb === 'function') {
          cb(...args);
        }
        resize();
      });
      ro.observe(dom);
    }
    window.addEventListener('resize', resize);
    resize();
  });

  function resize() {
    Object.assign(body, {
      clientHeight: document.body?.clientHeight,
    });
  }

  function getDom() {
    if (typeof domStr === 'string') {
      return document.querySelector(domStr);
    }
    return unref(domStr);
  }

  return body;
}
