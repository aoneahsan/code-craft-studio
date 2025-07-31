# Complete GitHub Repository Security Setup Guide

This is your step-by-step guide to fully secure the Code Craft Studio repository on GitHub.

## Prerequisites

Before starting:
1. You must be the repository owner or have admin permissions
2. Replace `@your-github-username` in CODEOWNERS with your actual GitHub username
3. Have 2FA enabled on your GitHub account

## Quick Setup Checklist

Follow these steps in order:

### 1. Update CODEOWNERS File
- [ ] Edit `.github/CODEOWNERS`
- [ ] Replace all instances of `@your-github-username` with your GitHub username
- [ ] Commit and push the changes

### 2. Enable Security Features

Go to **Settings > Security & analysis** and enable:
- [ ] Dependency graph
- [ ] Dependabot alerts
- [ ] Dependabot security updates
- [ ] Secret scanning
- [ ] Secret scanning push protection

### 3. Set Up Branch Protection

Go to **Settings > Branches**:

1. Click **Add rule**
2. Branch name pattern: `main`
3. Enable these protections:
   - [ ] Require a pull request before merging
     - [ ] Required approvals: 1
     - [ ] Dismiss stale PR approvals when new commits are pushed
     - [ ] Require review from CODEOWNERS
   - [ ] Require status checks to pass before merging
   - [ ] Require conversation resolution before merging
   - [ ] Require linear history
   - [ ] Include administrators
   - [ ] Do not allow force pushes
   - [ ] Do not allow deletions
4. Click **Create**

### 4. Configure Repository Settings

Go to **Settings** and configure:

**General**:
- [ ] Default branch: `main`
- [ ] Features: Enable Issues, disable Wiki
- [ ] Pull Requests: Allow squash and rebase merging only
- [ ] Always delete head branches

**Manage access**:
- [ ] Review current collaborators
- [ ] Remove any unnecessary access
- [ ] Set appropriate permission levels

### 5. Create Security Files

Ensure these files exist:
- [ ] `.github/CODEOWNERS` (already created)
- [ ] `.github/settings.yml` (already created)
- [ ] Create `SECURITY.md` in repository root

### 6. Set Up Dependabot

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
```

### 7. Configure GitHub Actions Security

If using GitHub Actions:
- [ ] Review workflow permissions
- [ ] Use environment secrets
- [ ] Pin action versions

## Detailed Setup Instructions

### Step 1: Navigate to Your Repository

1. Go to: `https://github.com/YOUR_USERNAME/code-craft-studio`
2. Ensure you're logged in as the repository owner

### Step 2: Security Tab Configuration

1. Click on the **Security** tab
2. Review any existing security alerts
3. Set up security advisories if needed

### Step 3: Branch Protection Deep Dive

The most critical security feature is branch protection. Here's what each setting does:

**Require pull request before merging**:
- Forces all changes through PR process
- Enables code review
- Creates audit trail

**Require status checks**:
- Ensures code passes tests
- Validates build process
- Catches errors before merge

**Include administrators**:
- Even you must follow the rules
- Prevents accidental damage
- Best practice for security

**Restrict force pushes and deletions**:
- Preserves git history
- Prevents data loss
- Critical for audit trails

### Step 4: CODEOWNERS Activation

After setting up CODEOWNERS:
1. Create a test PR modifying any file
2. Verify you're automatically requested as reviewer
3. Confirm PR cannot be merged without your review

### Step 5: Access Audit

Regular maintenance tasks:

**Weekly**:
- Check Dependabot alerts
- Review open PRs
- Monitor security alerts

**Monthly**:
- Audit collaborator access
- Review webhook configurations
- Check deploy keys

**Quarterly**:
- Full security audit
- Update this documentation
- Review and rotate secrets

## Verification Steps

After setup, verify everything works:

1. **Test branch protection**:
   ```bash
   git checkout main
   echo "test" >> README.md
   git add README.md
   git commit -m "Test direct push"
   git push
   # Should be rejected
   ```

2. **Test PR requirement**:
   ```bash
   git checkout -b test-branch
   echo "test" >> README.md
   git add README.md
   git commit -m "Test PR"
   git push -u origin test-branch
   # Create PR on GitHub
   # Verify review is required
   ```

3. **Test CODEOWNERS**:
   - Create PR modifying any file
   - Verify you're auto-assigned as reviewer

## Troubleshooting

### "Permission denied" when pushing
- You're trying to push to protected branch
- Create a feature branch instead

### CODEOWNERS not working
- Ensure file is in `.github/` directory
- Check for syntax errors
- Verify branch protection has "Require review from CODEOWNERS" enabled

### Can't enable certain features
- Some features require GitHub Pro/Teams
- Organization settings may override repository settings
- Contact GitHub support if needed

## Emergency Procedures

If locked out:
1. Use GitHub Support (you're the owner)
2. Temporarily disable "Include administrators"
3. Fix issues
4. Re-enable immediately

## Next Steps

After securing your repository:

1. **Documentation**: Keep security docs updated
2. **Team Training**: Ensure all collaborators understand the process
3. **Regular Reviews**: Schedule quarterly security reviews
4. **Stay Informed**: Follow GitHub security blog

## Important Notes

- **Never** share admin access unless absolutely necessary
- **Always** use 2FA on your account
- **Document** any security exceptions
- **Review** this setup quarterly
- **Update** your GitHub username in CODEOWNERS

## Support

- GitHub Security Documentation: https://docs.github.com/en/security
- GitHub Support: https://support.github.com
- Security Best Practices: https://docs.github.com/en/security/overview