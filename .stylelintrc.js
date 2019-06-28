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
        namespace: 'twt'
      }
    },
    'selector-class-pattern': null
  }
}
