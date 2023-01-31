#!/bin/bash

git diff --cached --diff-filter=d --name-only \
  | grep -E "\.(js|jsx|ts|tsx|vue|mjs)$" \
  | grep -vE 'public|template|assets|old|^\.' \
  | xargs eslint --ext vue,js,jsx,ts,tsx,mjs \
    --max-warnings=0 --fix --no-error-on-unmatched-pattern \
    --ignore-pattern '!.vuepress'
exit $?
