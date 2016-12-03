#!/bin/bash
git branch -D gh-pages
git checkout gh-pages
polymer build
cp -r build/bundled .
git commit -am 'update gh-pages'
git push origin gh-pages
git checkout master
