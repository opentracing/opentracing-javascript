# Releasing New Version

1. Update CHANGELOG.md
1. Update version in package.json and package-lock.json (the latter via `npm install && npm run build`)
1. Commit as 'Preparing release vN.M.K'
1. `npm publish`
1. Create a release on GitHub
