import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
    },
    {
      rules: {
        'style/no-trailing-spaces': ['error', { ignoreComments: true }],
        'style/max-statements-per-line': ['error', { max: 2 }],
      },
    },
    {
      files: ['**/*.md'],
      rules: {
        'style/no-trailing-spaces': 'off',
        'brace-style': 'off',
        'arrow-parens': 'off',
        'if-newline': 'off',
      },
    },
  ),
)
