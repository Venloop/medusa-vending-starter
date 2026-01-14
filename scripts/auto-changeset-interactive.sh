#!/bin/bash

# Interactive auto-changeset based on branch name
# Automatically detects version type from branch prefix

BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Determine version type from branch prefix
if [[ $BRANCH_NAME == feat/* ]] || [[ $BRANCH_NAME == feature/* ]]; then
  VERSION_TYPE="minor"
  VERSION_EMOJI="✨"
  VERSION_NAME="Feature (minor)"
elif [[ $BRANCH_NAME == fix/* ]] || [[ $BRANCH_NAME == bugfix/* ]]; then
  VERSION_TYPE="patch"
  VERSION_EMOJI="🐛"
  VERSION_NAME="Bugfix (patch)"
elif [[ $BRANCH_NAME == breaking/* ]] || [[ $BRANCH_NAME == major/* ]]; then
  VERSION_TYPE="major"
  VERSION_EMOJI="💥"
  VERSION_NAME="Breaking Change (major)"
elif [[ $BRANCH_NAME == refactor/* ]] || [[ $BRANCH_NAME == improve/* ]]; then
  VERSION_TYPE="patch"
  VERSION_EMOJI="♻️"
  VERSION_NAME="Refactor/Improvement (patch)"
else
  echo "⚠️  Branch name doesn't match convention"
  echo ""
  echo "Expected patterns:"
  echo "  feat/*     → minor version (1.0.0 → 1.1.0)"
  echo "  fix/*      → patch version (1.0.0 → 1.0.1)"
  echo "  breaking/* → major version (1.0.0 → 2.0.0)"
  echo ""
  echo "Current branch: ${BRANCH_NAME}"
  echo ""
  echo "Use standard changeset instead:"
  echo "  npm run changeset"
  exit 1
fi

# Display detected type
echo ""
echo "🌿 Branch: ${BRANCH_NAME}"
echo "${VERSION_EMOJI}  Detected: ${VERSION_NAME}"
echo ""

# Prompt for description
read -p "📝 Enter change description: " DESCRIPTION

if [[ -z "$DESCRIPTION" ]]; then
  echo "❌ Description is required"
  exit 1
fi

# Generate random changeset ID
CHANGESET_ID=$(openssl rand -hex 4)

# Create changeset file
cat > .changeset/${CHANGESET_ID}.md << EOF
---
"medusa-next": ${VERSION_TYPE}
---

${DESCRIPTION}
EOF

echo ""
echo "✅ Created changeset: .changeset/${CHANGESET_ID}.md"
echo "📦 Type: ${VERSION_TYPE}"
echo "📝 Description: ${DESCRIPTION}"
echo ""
echo "Next steps:"
echo "  git add .changeset/"
echo "  git commit -m 'chore: add changeset'"
echo "  git push"
