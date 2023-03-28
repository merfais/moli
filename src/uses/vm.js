export default async function runInNewContext(jsStr, context) {
  return new Promise((resolve, reject) => {
    let iframe;
    try {
      iframe = document.createElement('iframe');
      // 限制代码 iframe 代码执行能力
      iframe.sandbox = 'allow-same-origin allow-scripts';

      iframe.onload = function onload() {
        appendScript(jsStr, iframe.contentDocument);

        const result = iframe.contentWindow.get(context || {});

        removeIframe(iframe);

        resolve(result);
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
  const script = doc.createElement('script');
  script.id = Math.random().toString(36).slice(2);
  script.type = 'text/javascript';
  script.appendChild(doc.createTextNode(data));
  doc.head.appendChild(script);
  return script.id;
}

