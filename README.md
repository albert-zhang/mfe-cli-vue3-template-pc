
ESLint with type script has bugs (ref [https://github.com/eslint/typescript-eslint-parser/issues/438](https://github.com/eslint/typescript-eslint-parser/issues/438)), so use tslint now.

If later on switch to eslint, remeber to recover the following configs:


**package.json**

```
"@vue/cli-plugin-eslint": "^3.0.1",
"@vue/eslint-config-standard": "^3.0.1",
"@vue/eslint-config-typescript": "^3.0.1",
```
