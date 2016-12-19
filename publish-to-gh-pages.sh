#!/bin/bash
git branch -D gh-pages
git push origin :gh-pages
git checkout -b gh-pages
polymer build
sed -i -e 's%<link rel="import" href="shared-bundle.html">%%g' build/bundled/index.html
sed -i -e 's%/index.html%/school-crush/index.html%g' build/bundled/service-worker.js
cp -r build/bundled/* .
git add .
git commit -m 'update gh-pages'
git push origin gh-pages
git checkout master
