module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',

    // 🚀 Ignore missing prop types (React)
    'react/prop-types': 'off',

    // 🚀 Ignore TS-specific errors if you just want to build
    '@typescript-eslint/ban-ts-comment': 'off',

    // 🚀 Optional: ignore explicit return type warnings
    '@typescript-eslint/explicit-function-return-type': 'off',

    
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  
 
  },
}
