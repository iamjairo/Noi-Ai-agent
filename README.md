# Noi-Ai-agent

> **Fork of [Noi](https://github.com/lencx/Noi)** with enhanced documentation, improved dependency management, and streamlined CI/CD automation.

A desktop application and web platform for interaction-first AI workflows — less chaos, more flow.

---

## 🧩 Using this fork with the Noi desktop app

This repository is a **content pack** (configs, extensions, prompts, locales, resources) that drops into the upstream [Noi Electron app](https://github.com/lencx/Noi). It does **not** ship the desktop binary itself.

### 1. Install Noi
Download and install the Noi desktop app from the official site: **<https://noib.app>**. Launch it once so it creates its user-data directory.

### 2. Grab the latest release bundle
From the [Releases page](https://github.com/iamjairo/Noi-Ai-agent/releases/latest), download one of:

- `noi-extensions-<tag>.zip` (Windows / cross-platform)
- `noi-extensions-<tag>.tar.gz` (macOS / Linux)

Each bundle includes the content directories plus a `MANIFEST.json` and the two installer scripts described below.

### 3. Apply the pack
The bundle ships with helper scripts that copy the content into Noi's user-data directory (with a timestamped backup of anything they replace):

| OS              | Command (run from the extracted bundle)         | Default target                              |
|-----------------|-------------------------------------------------|----------------------------------------------|
| macOS           | `./install-extensions.sh`                       | `~/Library/Application Support/Noi`         |
| Linux           | `./install-extensions.sh`                       | `${XDG_CONFIG_HOME:-~/.config}/Noi`         |
| Windows (PS)    | `./install-extensions.ps1`                      | `%APPDATA%\Noi`                              |

Useful flags:
- `--dry-run` / `-DryRun` — print actions without writing anything
- `--target DIR` / `-Target 'C:\path'` — install to a non-default location
- `--no-backup` / `-NoBackup` — overwrite without keeping a `.bak-<timestamp>` copy

Restart Noi after installing. To roll back, delete the new directories and rename the `.bak-<timestamp>` ones back.

> **Note on the desktop binary.** The Noi Electron app is built and distributed privately by its author from <https://noib.app>; the upstream public repo does not include its source or a license, so this fork cannot legally rebuild or redistribute the app itself. We only ship content you apply on top of an existing Noi install.

---

## 🚀 Developer Quick Start

### Prerequisites
- Node.js ≥ 20.0
- Yarn ≥ 1.22
- (Optional) Rust toolchain for building native components

### Setup

```bash
# Clone the repository
git clone https://github.com/iamjairo/Noi-Ai-agent.git
cd Noi-Ai-agent

# Install dependencies (root + website)
yarn install
cd website && yarn install && cd ..

# Run tests
npm test

# Start documentation site locally
cd website && yarn start
```

---

## 📦 What's Included

### Core Projects

1. **Website** (`/website`)
   - Docusaurus-based documentation site
   - Built and deployed to GitHub Pages on every push to `main`
   - Release artifact: `docs-vX.Y.Z.zip` (created on release tag)

2. **Tests** (`/tests`)
   - Jest test suite (root `package.json`)
   - Run with `npm test`

3. **Configuration**
   - `/configs` — Application configuration templates
   - `/extensions` — CLI extensions and plugins
   - `/locales` — Internationalization (i18n) files
   - `/prompts` — Pre-configured prompt templates

4. **Resources** (`/resources`)
   - UI assets, icons, and static files

---

## 🔨 Development Workflow

### Branching Strategy
- **main** — production branch (stable, deployed)
- **feature branches** — for new work (branch from `main`)

### Commit Conventions
This repo uses [conventional commits](https://www.conventionalcommits.org/) to auto-generate changelogs and version bumps:

```
feat: add new feature          → minor version bump
fix: resolve bug               → patch version bump
feat!: breaking change         → major version bump
chore: maintenance             → no version bump
docs: documentation updates    → no version bump
```

### Making Changes

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and test: `npm test`
3. Commit with conventional messages: `git commit -m "feat: description"`
4. Push to your fork: `git push origin feat/your-feature`
5. Open a pull request against `main`

### Releases

Releases are automated via [release-please](https://github.com/googleapis/release-please):

1. **Conventional commits** pushed to `main` trigger a Release PR
2. **Merge the Release PR** → creates a GitHub Release tag (e.g., `v1.2.0`)
3. **Release artifacts** are automatically generated:
   - Website documentation (`docs-vX.Y.Z.zip`)
   - CHANGELOG.md auto-generated
   - GitHub Release created with artifacts

To manually trigger a release, merge the auto-generated Release PR.

---

## 🔒 Security & Maintenance

### Dependabot Automation
- **npm/pip/cargo/github-actions** — weekly updates
- **docker** — monthly updates
- Automated PRs with security fixes and dependency upgrades
- Labels: `dependencies`, `javascript`, `python`, `rust`, `github-actions`, `docker`

### Security Alerts
GitHub monitors security advisories. Review and merge Dependabot PRs to keep dependencies current:

```bash
# Check vulnerabilities locally
cd website && yarn audit      # For website dependencies
npm audit                     # For root dependencies
```

### Version Requirements
- Node.js ≥ 20.0 (website requires modern ES modules)
- TypeScript ≥ 5.6

---

## 📚 Project Structure

```
.
├── website/                      # Docusaurus documentation site
│   ├── package.json
│   ├── yarn.lock
│   ├── docs/                     # Documentation markdown files
│   ├── src/                      # Custom React components
│   └── static/                   # Static assets
├── configs/                      # App configuration templates
├── extensions/                   # CLI extensions
├── locales/                      # i18n translation files
├── prompts/                      # Pre-configured prompts
├── resources/                    # UI assets and resources
├── tests/                        # Jest test suite
├── package.json                  # Root dependencies (tests, CLI)
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml           # Build & deploy docs to Pages
│   │   └── release-please.yml   # Automated releases
│   └── dependabot.yml           # Dependency automation
├── release-please-config.json    # Release automation config
└── README.md                     # This file
```

---

## 🤝 Contributing

This is a maintained fork of the [original Noi project](https://github.com/lencx/Noi). Contributions are welcome!

### Before You Start
1. Fork the repository
2. Create a feature branch from `main`
3. Ensure `npm test` passes locally
4. Follow conventional commit format
5. Open a PR with a clear description

### Code Style
- Use existing patterns and conventions in the codebase
- Minimal, focused comments only where logic isn't obvious
- Run tests before pushing: `npm test`

---

## 📖 Docs

- **Local Development**: `cd website && yarn start` → http://localhost:3000
- **Building Docs**: `cd website && yarn build`
- **Deployment**: Automatic on push to `main` (GitHub Pages)

---

## 🐛 Issues & Support

- **Report bugs** → [GitHub Issues](https://github.com/iamjairo/Noi-Ai-agent/issues)
- **Security vulnerabilities** → Use GitHub Security Advisory feature (private)
- **Feature requests** → Open an issue with `[feature]` prefix

---

## 📜 License

See the [original Noi repository](https://github.com/lencx/Noi) for licensing information.

---

## 🔗 Links

- **Upstream**: https://github.com/lencx/Noi
- **Docs**: https://iamjairo.github.io/Noi-Ai-agent/
- **Releases**: https://github.com/iamjairo/Noi-Ai-agent/releases
- **Security Alerts**: https://github.com/iamjairo/Noi-Ai-agent/security

---

**Last Updated**: 2026-05-24
**Maintainer**: @iamjairo
