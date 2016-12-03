#!/bin/bash
git branch -D gh-pages
git push origin :gh-pages
git checkout -b gh-pages
polymer build
cp -r build/bundled/* .
git add .
git commit -m 'update gh-pages'
git push origin gh-pages
git checkout master
