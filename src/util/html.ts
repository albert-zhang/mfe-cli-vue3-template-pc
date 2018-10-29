// ref: https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
function htmlEntities(str: string) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export {
  htmlEntities
};
