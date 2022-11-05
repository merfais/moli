let param;

export default function useLoginParams() {
  if (param) {
    return param;
  }
  // 尝试读取url上的__login
  const searchParams = new URLSearchParams(window.location.search);
  const loginParam = searchParams.get('__login');
  if (loginParam) {
    param = { __login: loginParam };
    return param;
  }
  return {};
}
