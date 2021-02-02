interface OpenPostWindowOptions {
  url: string;
  data: object;
  target?: string;
}

/**
 * 通过post方式提交一个表单(打开新窗口)
 */
export function openPostWindow({
  url,
  data,
  target = '_blank',
}: OpenPostWindowOptions) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.target = target;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      const hideInput = document.createElement('input');
      hideInput.type = 'text';
      hideInput.name = key;
      hideInput.value = value;
      form.appendChild(hideInput);
    }
  }

  document.body.appendChild(form);

  form.submit();
  document.body.removeChild(form);
}
