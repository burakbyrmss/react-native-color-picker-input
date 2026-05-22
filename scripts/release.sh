#!/usr/bin/env bash
#
# Bump version, tag, and publish to npm (and GitHub release when configured).
#
# Usage:
#   ./scripts/release.sh patch              # 0.1.0 -> 0.1.1
#   ./scripts/release.sh minor              # 0.1.0 -> 0.2.0
#   ./scripts/release.sh major              # 0.1.0 -> 1.0.0
#   ./scripts/release.sh 1.2.3              # set exact version
#   ./scripts/release.sh --dry-run patch    # preview without publishing
#   ./scripts/release.sh --skip-checks patch
#   ./scripts/release.sh --interactive patch   # confirm each release-it step
#
# Requires: clean git working tree, npm login, and GitHub CLI for github.release.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DRY_RUN=false
SKIP_CHECKS=false
INTERACTIVE=false
BUMP=""

usage() {
  sed -n '4,12p' "$0" | sed 's/^# \?//'
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h | --help)
      usage 0
      ;;
    -n | --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-checks)
      SKIP_CHECKS=true
      shift
      ;;
    --interactive)
      INTERACTIVE=true
      shift
      ;;
    patch | minor | major)
      BUMP="$1"
      shift
      ;;
    *)
      if [[ -z "$BUMP" ]]; then
        BUMP="$1"
        shift
      else
        echo "Unknown argument: $1" >&2
        usage 1
      fi
      ;;
  esac
done

if [[ -z "$BUMP" ]]; then
  BUMP="patch"
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn is required but was not found in PATH." >&2
  exit 1
fi

if [[ "$DRY_RUN" == false ]]; then
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    echo "Working tree is not clean. Commit or stash changes before releasing." >&2
    git status --short
    exit 1
  fi
fi

CURRENT_VERSION="$(node -p "require('./package.json').version")"
echo "Current version: $CURRENT_VERSION"
echo "Release target:  $BUMP"
echo ""

if [[ "$SKIP_CHECKS" == false ]]; then
  echo "Running pre-release checks..."
  yarn typecheck
  yarn lint
  yarn test
  echo ""
fi

echo "Building library (react-native-builder-bob)..."
yarn prepare
echo ""

RELEASE_ARGS=()
if [[ "$INTERACTIVE" == false ]]; then
  RELEASE_ARGS+=(--ci)
fi
if [[ "$DRY_RUN" == true ]]; then
  RELEASE_ARGS+=(--dry-run --no-git.requireCleanWorkingDir)
  echo "Dry run — no version bump, tag, or publish will be applied."
  echo ""
fi

case "$BUMP" in
  patch | minor | major)
    yarn release-it "$BUMP" "${RELEASE_ARGS[@]}"
    ;;
  *)
    if [[ ! "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]]; then
      echo "Invalid version or bump type: $BUMP" >&2
      echo "Use patch, minor, major, or an exact semver (e.g. 1.2.3)." >&2
      exit 1
    fi
    yarn release-it "$BUMP" --no-increment "${RELEASE_ARGS[@]}"
    ;;
esac

echo ""
if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run finished."
else
  NEW_VERSION="$(node -p "require('./package.json').version")"
  echo "Released react-native-color-picker-input@${NEW_VERSION}"
fi
