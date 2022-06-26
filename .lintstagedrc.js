const config = {
  '*.{vue,js,jsx,cjs,mjs}': [
    './scripts/pre-commit.sh',
    'git add',
  ]
}
module.exports = config;
