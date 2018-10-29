/**
 * 错误码是否需要全局显示错误信息
 *
 * @isUnhandledRejection 是否已经处理
 */
function isErrorCodeNeedReportGlobally(code: number, isUnhandledRejection: boolean = false) {
  if (code === 100401 || // TOKEN无效，会由LoginUtil发起跳转
      code === 100402) { // TOKEN超时，刷新即可，无需提示
    return false;
  }
  if (code === 100412) { // 验证错误，由业务提示，不需要显示。但如果业务未处理，会是unhandledRejection，则应该显示
    return isUnhandledRejection;
  }
  // 其它所有错误都需要全局显示
  return true;
}

export {
  isErrorCodeNeedReportGlobally,
};
