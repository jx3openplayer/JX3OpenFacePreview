git checkout --orphan newb
git add .
git commit -m "清理历史记录，以优化存储"
git branch -D main
git branch -m main
git push -f origin main