import { ElForm } from 'element-ui/types/form';
import { MxjResponseError } from '@mydreamplus/aglarond/lib/http';
import { Message } from 'element-ui';
import { htmlEntities } from './html';

/**
 * 根据forms中的el-form-item，收集其中的prop到label的对应关系
 * @param forms ElForm
 */
function collectFormItemPropAndLabels(...forms: any[]) {
  const toReturn: any = {};
  forms.filter((form: any) => {
    return !!form && form.fields;
  }).forEach((form: any) => {
    form.fields.forEach((field: any) => {
      toReturn[field.prop] = field.label;
    });
  });
  return toReturn;
}

function displayFormValidationError(error: MxjResponseError, ...forms: any[]) {
  if (error instanceof MxjResponseError) {
    if (error.code === 100412) {
      if (forms && forms.length > 0) {
        const propLabelMap = collectFormItemPropAndLabels(...forms);
        const specialSeparator = '______';
        const msg = error.validateErrorMessageWithPropReplaced(propLabelMap, '{LABEL}{MESSAGE}', specialSeparator);
        const escaped = msg.split(specialSeparator).map((s: string) => htmlEntities(s)).join('<br/>');
        const htmlMsg = `<div style="line-height: 1.5em;">${escaped}</div>`;
        Message({
          message: htmlMsg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      } else {
        Message.error(error.message);
      }
    }
  } else {
    console.warn('[displayFormValidationError] not a MxjResponseError: ' + error);
  }
}

export {
  collectFormItemPropAndLabels,
  displayFormValidationError,
};
