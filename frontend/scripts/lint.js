#!/usr/bin/env node

const { spawnSync } = require('child_process')

function hasEslint() {
  try {
    require.resolve('eslint')
    return true
  } catch (error) {
    return false
  }
}

if (!hasEslint()) {
  console.warn('ESLint not installed. Skipping lint (offline or restricted registry).')
  process.exit(0)
}

const result = spawnSync('npx', ['next', 'lint'], { stdio: 'inherit', shell: false })
process.exit(result.status ?? 1)
