# Auto Changeset Scripts

## 🚀 Quick Start

Instead of running `yarn changeset` and manually selecting version type, you can use:

```bash
yarn changeset:auto
```

This script **automatically detects** the version type based on your branch name!

## 📋 Branch Name Conventions

The script recognizes these patterns:

| Branch Pattern | Version Type | Example |
|----------------|--------------|---------|
| `feat/*` or `feature/*` | **minor** (1.0.0 → 1.1.0) | `feat/payment-integration` |
| `fix/*` or `bugfix/*` | **patch** (1.0.0 → 1.0.1) | `fix/login-error` |
| `breaking/*` or `major/*` | **major** (1.0.0 → 2.0.0) | `breaking/api-rewrite` |
| `refactor/*` or `improve/*` | **patch** (1.0.0 → 1.0.1) | `refactor/auth-module` |

## 💡 Usage Examples

### Example 1: Adding a new feature

```bash
# Create feature branch
git checkout -b feat/dark-mode

# Make your changes...
git add .
git commit -m "feat: add dark mode support"

# Auto-generate changeset (detects 'minor' from branch name)
yarn changeset:auto
# Prompts: "Enter change description:"
# You type: "Added dark mode theme support"

# Commit and push
git add .changeset/
git commit -m "chore: add changeset"
git push origin feat/dark-mode
```

### Example 2: Fixing a bug

```bash
# Create fix branch
git checkout -b fix/validation-error

# Fix the bug...
git commit -m "fix: resolve validation error"

# Auto-generate changeset (detects 'patch' from branch name)
yarn changeset:auto
# You type: "Fixed validation error in login form"

git add .changeset/
git commit -m "chore: add changeset"
git push
```

### Example 3: Breaking change

```bash
# Create breaking change branch
git checkout -b breaking/remove-old-api

# Make breaking changes...
git commit -m "feat!: remove deprecated API endpoints"

# Auto-generate changeset (detects 'major' from branch name)
yarn changeset:auto
# You type: "BREAKING: Removed deprecated v1 API endpoints"

git add .changeset/
git commit -m "chore: add changeset"
git push
```

## 🔄 Comparison

### Manual way (standard):
```bash
yarn changeset
# → Select package (medusa-next)
# → Select version type (major/minor/patch)
# → Enter description
```

### Automatic way (smart):
```bash
yarn changeset:auto
# → Detects version from branch name ✨
# → Only asks for description
```

## ⚠️ What if branch doesn't match?

If your branch name doesn't follow the convention (e.g., `develop`, `main`, `random-name`), the script will show an error:

```
⚠️  Branch name doesn't match convention

Expected patterns:
  feat/*     → minor version
  fix/*      → patch version
  breaking/* → major version

Use standard changeset instead:
  yarn changeset
```

In this case, just use the standard `yarn changeset` command.

## 🎯 Best Practices

1. **Always use conventional branch names** for automatic detection
2. **Be descriptive** in your changeset description
3. **One changeset per PR** is usually enough
4. If unsure, use manual `yarn changeset` for more control

## 🛠️ Technical Details

The script:
- Reads current branch name with `git rev-parse --abbrev-ref HEAD`
- Matches against patterns: `feat/*`, `fix/*`, `breaking/*`, etc.
- Generates changeset file in `.changeset/` directory
- Uses random hex ID for unique filename

Location: `scripts/auto-changeset-interactive.sh`

## 📚 See Also

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- Main README: `.changeset/README.md`
