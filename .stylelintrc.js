module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  plugins: [
    'stylelint-declaration-use-variable',
    'stylelint-selector-bem-pattern'
  ],
  rules: {
    'declaration-block-no-shorthand-property-overrides': null,
    // 'no-descending-specificity': null,
    'order/properties-alphabetical-order': null,
    'selector-no-qualifying-type': [
      true,
      {
        ignore: [
          'svg'
        ]
      }
    ],
    'max-nesting-depth': [
      2,
      {
        ignore: [
          'blockless-at-rules',
          'pseudo-classes',
          'blockless-at-rules'
        ]
      }
    ],
    'sh-waqar/declaration-use-variable': [
      [
        '/color/',
        'fill',
        'stroke',
        {
          ignoreValues: [
            'transparent',
            'inherit'
          ]
        }
      ]
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'for',
          'each',
          'include',
          'extend',
          'return',
          'mixin'
        ]
      }
    ],
    'plugin/selector-bem-pattern': {
      preset: 'suit',
      presetOptions: {
        namespace: 'gzly'
      }
    },
    'selector-class-pattern': null,
    'scss/dollar-variable-pattern': /(?:[A-Z][a-z]+)+(-[A-Z][a-z]+)+(_[a-z]+[A-Z]?[a-z]+)*(--[a-z]+[A-Z]?[a-z]+)?/, // $CssProperty-Component_element--hasState
    'scss/at-function-pattern': /(?:[a-z][A-Z]?[a-z]+)+/,
    'scss/at-mixin-pattern': /(?:[a-z][A-Z]?[a-z]+)+/,
  }
}
