# Setup Git Repository and Connect to GitHub

## Step 1: Initialize Git Repository

```bash
# Initialize git in the current directory
git init
```

## Step 2: Create a .gitignore file (if it doesn't exist)

Create a `.gitignore` file to exclude unnecessary files:

```
# Dependencies
node_modules/

# Build outputs
dist/

# Test coverage
coverage/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# TypeScript cache
*.tsbuildinfo
tsconfig.tsbuildinfo
```

## Step 3: Add Your GitHub Repository as Remote

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# Or if you're using SSH:
# git remote add origin git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
```

## Step 4: Stage and Commit All Files

```bash
# Stage all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Aspire Tray CDK Connector with Token Based Authentication

- Complete Aspire API connector with 160+ operations
- Token Based authentication with environment selection (demo, sandbox, production)
- Dynamic base URL configuration based on environment
- Automatic token refresh with fallback to re-authentication
- Comprehensive error handling and logging"
```

## Step 5: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## If the Repository Already Exists on GitHub

If you already created a repository on GitHub and it has a README or other files:

```bash
# Pull first to merge any existing files
git pull origin main --allow-unrelated-histories

# Then push your changes
git push -u origin main
```

## Full Command Sequence

Here's the complete sequence to run:

```bash
# 1. Initialize git
git init

# 2. Add remote (replace with your details)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# 3. Stage all files
git add .

# 4. Commit
git commit -m "Initial commit: Aspire Tray CDK Connector with Token Based Authentication"

# 5. Rename branch to main
git branch -M main

# 6. Push to GitHub
git push -u origin main
```

## What's Your GitHub Repository URL?

To help you with the exact commands, I need:
1. Your GitHub username
2. Your repository name (or the full repository URL)

Example:
- Username: `jaredwest`
- Repo name: `aspire-tray-connector`
- URL would be: `https://github.com/jaredwest/aspire-tray-connector.git`

