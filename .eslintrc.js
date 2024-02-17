module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "linebreak-style": "off",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-warning-comments": "warn",
    "eol-last": ["error", "always"],
    "space-before-function-paren": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "vue/html-indent": ["warn", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": []
    }]
  },
  "overrides": [{
    "files": ["*.html"],
    "rules": {
      "vue/comment-directive": "off"
    }
  }]
};
