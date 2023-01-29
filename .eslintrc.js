/* eslint-env node */
const config = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'airbnb-base',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // 修改的规则
    'max-len': [2, { code: 100 }],
    'no-multi-spaces': [2, { ignoreEOLComments: true }],

    // 关闭vue的规则
    'vue/multi-word-component-names': 0,
    'vue/no-v-text-v-html-on-component': 0,

    // 关闭import规则
    'import/extensions': 0,
    'import/no-dynamic-require': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,

    // 关闭airbnb规则
    'arrow-parens': 0,
    'arrow-body-style': 0,
    'consistent-return': 0,
    'class-methods-use-this': 0,
    'default-param-last': 0,
    'global-require': 0,
    'object-curly-newline': 0,
    'newline-per-chained-call': 0,
    'no-bitwise': 0,
    'no-control-regex': 0,
    'no-empty-function': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-use-before-define': 0,
    'no-multiple-empty-lines': 0,
    'no-shadow': 0,

    // 关闭其他规则
    'prettier/prettier': 0,
    camelcase: 0,

    // 增加的规则
    'no-console': [2, { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 2,
  },
  ignorePatterns: [
    'coverage/**',
    'public/**',
    'node_modules/**',
    'old/**',
  ],
};

// 开发测试阶段降低规则要求
if (process.env.NODE_ENV !== 'production') {
  Object.assign(config.rules, {
    'vue/no-unused-vars': 1,
    'vue/valid-template-root': 1,
    'vue/return-in-computed-property': 1,
    'vue/valid-v-for': 1,

    'import/newline-after-import': 1,

    'array-bracket-spacing': 1,
    'brace-style': 1,
    'block-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    indent: [1, 2, { SwitchCase: 1 }],
    'key-spacing': 1,
    'keyword-spacing': 1,
    'object-curly-spacing': 1,
    'operator-linebreak': 1,
    'prefer-const': 1,
    'padded-blocks': 1,
    'quote-props': 1,
    semi: 1,
    'spaced-comment': 1,
    'space-before-blocks': 1,
    'space-before-function-paren': 1,
    'space-infix-ops': 1,
    'space-in-parens': 1,
    'max-len': [1, { code: 100 }],
    'no-console': [1, { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 1,
    'no-empty': 1,
    'no-unused-vars': 1,
    'no-multi-spaces': [1, { ignoreEOLComments: true }],
    'no-unreachable': 1,
  });
}

module.exports = config;
