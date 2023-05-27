import newId from './id';

export default async function runInNewContext(jsStr, context) {
  return new Promise((resolve, reject) => {
    let iframe;
    try {
      iframe = document.createElement('iframe');
      // 限制代码 iframe 代码执行能力
      iframe.sandbox = 'allow-same-origin allow-scripts';

      iframe.onload = function onload() {
        iframe.contentWindow.onerror = function onerror(e) {
          removeIframe(iframe);
          reject(e);
        };

        try {
          appendScript(jsStr, iframe.contentDocument);

          const result = typeof iframe?.contentWindow?.get === 'function'
            ? iframe.contentWindow.get(context || {})
            : undefined;

          removeIframe(iframe);

          resolve(result);
        } catch (e) {
          removeIframe(iframe);
          reject(e);
        }
      };
      document.body.appendChild(iframe);
    } catch (e) {
      removeIframe(iframe);
      reject(e);
    }
  });
}

function removeIframe(iframe) {
  if (iframe?.parentNode) {
    iframe.parentNode?.removeChild(iframe);
  }
}

function appendScript(data, doc = document) {
  if (!data) {
    return newId();
  }
  const script = doc.createElement('script');
  script.id = newId();
  script.type = 'text/javascript';
  script.appendChild(doc.createTextNode(data));
  doc.head.appendChild(script);
  return script.id;
}

