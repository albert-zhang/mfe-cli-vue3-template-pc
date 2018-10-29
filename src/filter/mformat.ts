import moment from 'moment';

export default function(value: any, format: string) {
  if (!value) {
    return '';
  }
  const i = parseInt(value, 10);
  if (!isNaN(i)) {
    value = new Date(value);
  }
  return moment(value).format(format);
}
