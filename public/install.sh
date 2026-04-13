#!/bin/sh
set -e

REPO="modhisathvik7733/creor-app"
INSTALL_DIR="/usr/local/bin"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info() { printf "${CYAN}${BOLD}==>${NC} %s\n" "$1"; }
success() { printf "${GREEN}${BOLD}==>${NC} %s\n" "$1"; }
error() { printf "${RED}${BOLD}Error:${NC} %s\n" "$1"; exit 1; }

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    case "$ARCH" in
      arm64) PLATFORM="darwin-arm64" ;;
      x86_64) PLATFORM="darwin-x64" ;;
      *) error "Unsupported macOS architecture: $ARCH" ;;
    esac
    EXT="zip"
    ;;
  Linux)
    case "$ARCH" in
      x86_64) PLATFORM="linux-x64" ;;
      aarch64) PLATFORM="linux-arm64" ;;
      *) error "Unsupported Linux architecture: $ARCH" ;;
    esac
    EXT="tar.gz"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    PLATFORM="win32-x64"
    EXT="zip"
    ;;
  *)
    error "Unsupported operating system: $OS"
    ;;
esac

FILENAME="Creor-${PLATFORM}.${EXT}"
URL="https://github.com/${REPO}/releases/latest/download/${FILENAME}"

info "Detected platform: ${PLATFORM}"
info "Downloading Creor..."

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

if command -v curl >/dev/null 2>&1; then
  curl -fSL --progress-bar "$URL" -o "${TMPDIR}/${FILENAME}"
elif command -v wget >/dev/null 2>&1; then
  wget -q --show-progress "$URL" -O "${TMPDIR}/${FILENAME}"
else
  error "curl or wget is required to download Creor"
fi

info "Extracting..."

case "$EXT" in
  zip)
    if command -v unzip >/dev/null 2>&1; then
      unzip -q "${TMPDIR}/${FILENAME}" -d "${TMPDIR}/creor"
    else
      error "unzip is required to extract the archive"
    fi
    ;;
  tar.gz)
    tar -xzf "${TMPDIR}/${FILENAME}" -C "${TMPDIR}"
    mv "${TMPDIR}/Creor-${PLATFORM}" "${TMPDIR}/creor" 2>/dev/null || true
    ;;
esac

info "Installing..."

case "$OS" in
  Darwin)
    # macOS: move .app to /Applications
    APP_PATH="${TMPDIR}/creor/Creor.app"
    if [ -d "$APP_PATH" ]; then
      cp -R "$APP_PATH" /Applications/
      success "Creor installed to /Applications/Creor.app"
      success "Open it from your Applications folder or run: open /Applications/Creor.app"
    else
      # Fallback: binary install
      cp "${TMPDIR}/creor/creor" "${INSTALL_DIR}/creor" 2>/dev/null || sudo cp "${TMPDIR}/creor/creor" "${INSTALL_DIR}/creor"
      chmod +x "${INSTALL_DIR}/creor"
      success "Creor installed to ${INSTALL_DIR}/creor"
    fi
    ;;
  Linux)
    cp "${TMPDIR}/creor/creor" "${INSTALL_DIR}/creor" 2>/dev/null || sudo cp "${TMPDIR}/creor/creor" "${INSTALL_DIR}/creor"
    chmod +x "${INSTALL_DIR}/creor"
    success "Creor installed to ${INSTALL_DIR}/creor"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    WINDIR="${HOME}/AppData/Local/Creor"
    mkdir -p "$WINDIR"
    cp -r "${TMPDIR}/creor/"* "$WINDIR/"
    success "Creor installed to ${WINDIR}"
    success "Add ${WINDIR} to your PATH, then run: creor"
    ;;
esac

printf "\n"
success "Installation complete! Run 'creor' to get started."
printf "\n"
