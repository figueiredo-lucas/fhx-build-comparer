#!/usr/bin/env sh

## builds deploy from vite
npm run build
## changes to gh-pages branch
git checkout gh-pages
## remove old assets
rm -rf assets
## copy new assets to root
cp -r dist/assets assets
## replaces index information because of leading /
sed -i 's@/assets@assets@g' dist/index.html
## copies index to root
cp dist/index.html .
## removes unecessary dist folder
rm -rf dist
## adds everything that's changed on stage
git add .
## commits with default message
git commit -m 'release'
## pushes to gh-pages branch
git push origin gh-pages
## returns to main branch
git checkout main