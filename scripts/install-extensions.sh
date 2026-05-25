#!/usr/bin/env bash
# Installs the Noi content pack (configs/extensions/prompts/locales/resources)
# into the Noi Electron app's user-data directory on macOS or Linux.
#
# Usage:
#   ./install-extensions.sh                # auto-detects OS
#   ./install-extensions.sh --dry-run      # print actions only
#   ./install-extensions.sh --target DIR   # install into a specific directory
#   ./install-extensions.sh --no-backup    # skip backing up replaced files
#
# This script DOES NOT download, modify, or redistribute the Noi application
# itself. You must install Noi separately from https://noib.app first.

set -euo pipefail

DRY_RUN=0
DO_BACKUP=1
TARGET=""

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)   DRY_RUN=1 ;;
    --no-backup) DO_BACKUP=0 ;;
    --target)    shift; TARGET="${1:-}";;
    -h|--help)   sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
  shift
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -d "${SCRIPT_DIR}/configs" ]; then
  SRC="${SCRIPT_DIR}"
elif [ -d "${SCRIPT_DIR}/../configs" ]; then
  SRC="$(cd "${SCRIPT_DIR}/.." && pwd)"
else
  echo "error: cannot find configs/ next to this script" >&2
  exit 1
fi

if [ -z "${TARGET}" ]; then
  case "$(uname -s)" in
    Darwin) TARGET="${HOME}/Library/Application Support/Noi" ;;
    Linux)  TARGET="${XDG_CONFIG_HOME:-${HOME}/.config}/Noi" ;;
    *) echo "error: unsupported OS $(uname -s) — use --target DIR" >&2; exit 1 ;;
  esac
fi

echo "Source: ${SRC}"
echo "Target: ${TARGET}"
echo

if [ ! -d "${TARGET}" ]; then
  echo "warning: target does not exist — is Noi installed and launched at least once?"
  if [ "${DRY_RUN}" -eq 0 ]; then
    read -r -p "Create ${TARGET} and continue? [y/N] " ans
    case "${ans}" in y|Y|yes|YES) mkdir -p "${TARGET}" ;; *) exit 1 ;; esac
  fi
fi

run() { echo "  $*"; if [ "${DRY_RUN}" -eq 0 ]; then "$@"; fi; }
TS="$(date -u +%Y%m%dT%H%M%SZ)"

for dir in configs extensions prompts locales resources; do
  [ -d "${SRC}/${dir}" ] || { echo "skip ${dir}: not in bundle"; continue; }
  if [ -e "${TARGET}/${dir}" ] && [ "${DO_BACKUP}" -eq 1 ]; then
    run mv "${TARGET}/${dir}" "${TARGET}/${dir}.bak-${TS}"
  fi
  run cp -R "${SRC}/${dir}" "${TARGET}/${dir}"
done

echo
echo "✅ Done. Restart Noi to pick up the changes."
if [ "${DRY_RUN}" -eq 1 ]; then echo "(dry-run only — nothing was actually modified)"; fi
exit 0
