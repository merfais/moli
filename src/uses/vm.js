export default async function runInNewContext(jsStr, context) {
  return new Promise((resolve, reject) => {
    try {
      const iframe = document.createElement('iframe');
      // 限制代码 iframe 代码执行能力
      iframe.sandbox = 'allow-same-origin allow-scripts';

      iframe.onload = function onload() {
        appendScript(jsStr, iframe.contentDocument);

        const result = iframe.contentWindow.get(context || {});

        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        resolve(result);
      };

      document.body.appendChild(iframe);
    } catch (e) {
      console.error('运行js出错', e);
      reject(e);
    }
  });
}

function appendScript(data, doc = document) {
  const script = doc.createElement('script');
  script.id = Math.random().toString(36).slice(2);
  script.type = 'text/javascript';
  script.appendChild(doc.createTextNode(data));
  doc.head.appendChild(script);
  return script.id;
}

