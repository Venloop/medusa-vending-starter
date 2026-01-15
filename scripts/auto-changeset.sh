#!/bin/bash

# Auto-generate changeset based on branch name
# Usage: ./scripts/auto-changeset.sh "Your change description"

BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
DESCRIPTION="${1:-Automated changeset}"

# Determine version type from branch prefix
if [[ $BRANCH_NAME == feat/* ]] || [[ $BRANCH_NAME == feature/* ]]; then
  VERSION_TYPE="minor"
elif [[ $BRANCH_NAME == fix/* ]] || [[ $BRANCH_NAME == bugfix/* ]]; then
  VERSION_TYPE="patch"
elif [[ $BRANCH_NAME == breaking/* ]] || [[ $BRANCH_NAME == major/* ]]; then
  VERSION_TYPE="major"
else
  echo "⚠️  Branch name doesn't match convention (feat/, fix/, breaking/)"
  echo "Please use: yarn changeset"
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

echo "✅ Created ${VERSION_TYPE} changeset: .changeset/${CHANGESET_ID}.md"
echo "📝 Description: ${DESCRIPTION}"
echo ""
echo "Next steps:"
echo "  git add .changeset/"
echo "  git commit -m 'chore: add changeset'"
