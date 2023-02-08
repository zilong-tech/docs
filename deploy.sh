#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd src/.vuepress/dist


git init
git add .
git commit -m '发布'

git push -f https://github.com/zilong-tech/docs.git  gh-pages

