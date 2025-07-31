# GitHub Repository Security Best Practices

This guide covers comprehensive security measures for the Code Craft Studio repository.

## Repository Visibility and Access

### Public Repository Considerations

When making a repository public:

1. **Audit all files** before going public
   - No API keys, tokens, or secrets
   - No internal URLs or sensitive data
   - No proprietary code or algorithms
   - Review `.gitignore` thoroughly

2. **Use environment variables** for sensitive data
   - Never commit `.env` files
   - Document required environment variables in `.env.example`
   - Use GitHub Secrets for Actions

### Access Control

1. **Principle of Least Privilege**
   - Give minimum necessary permissions
   - Regularly audit collaborator access
   - Remove inactive collaborators

2. **Permission Levels**
   - **Read**: Can view and clone
   - **Triage**: Can manage issues/PRs
   - **Write**: Can push to non-protected branches
   - **Maintain**: Can manage repository settings
   - **Admin**: Full control (use sparingly)

## Security Features to Enable

### 1. Dependency Security

**Enable Dependabot**:
1. Settings > Security & analysis
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Dependabot version updates

**Configure Dependabot** (`.github/dependabot.yml`):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 2. Code Scanning

**Enable CodeQL**:
1. Settings > Security & analysis
2. Set up code scanning
3. Use recommended CodeQL analysis

### 3. Secret Scanning

**Enable Secret Scanning**:
1. Settings > Security & analysis
2. Enable secret scanning
3. Enable push protection (blocks commits with secrets)

### 4. Security Policy

Create `SECURITY.md`:
```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities to: security@your-email.com

Do NOT create public issues for security vulnerabilities.
```

## Git Security Best Practices

### 1. Commit Signing

**Enable commit signing**:
```bash
# Generate GPG key
gpg --full-generate-key

# List keys
gpg --list-secret-keys --keyid-format=long

# Configure Git
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

### 2. Git Hooks

**Pre-commit hooks** (`.git/hooks/pre-commit`):
- Scan for secrets
- Run linters
- Check for large files

### 3. Git History

**Protect history**:
- Never force push to main
- Use `git revert` instead of history rewriting
- Audit history before making repo public

## GitHub Actions Security

### 1. Workflow Permissions

**Restrict permissions** in workflows:
```yaml
permissions:
  contents: read
  pull-requests: write
```

### 2. Third-party Actions

**Pin actions to specific versions**:
```yaml
- uses: actions/checkout@v4.1.1  # Use specific version
```

### 3. Secrets Management

**Use GitHub Secrets**:
- Never hardcode secrets
- Use environment contexts
- Limit secret access to specific environments

## Monitoring and Alerts

### 1. Security Alerts

**Configure notifications**:
1. Settings > Notifications
2. Enable security alerts via:
   - Email
   - Web notifications
   - Mobile (GitHub app)

### 2. Audit Log

**Regular reviews**:
- Check Settings > Audit log
- Monitor for unusual activity
- Review failed authentication attempts

### 3. Security Dashboard

**Use GitHub Security tab**:
- Review vulnerability alerts
- Track remediation progress
- Monitor code scanning results

## Incident Response Plan

### If a Security Breach Occurs:

1. **Immediate Actions**
   - Revoke compromised credentials
   - Enable 2FA for all accounts
   - Audit recent commits and access logs

2. **Investigation**
   - Determine scope of breach
   - Identify compromised data
   - Check for backdoors or malicious code

3. **Remediation**
   - Remove malicious code
   - Rotate all secrets
   - Update dependencies
   - Notify affected users

4. **Prevention**
   - Conduct security review
   - Update security policies
   - Implement additional controls

## Regular Security Tasks

### Weekly
- Review Dependabot alerts
- Check for new collaborator requests
- Monitor failed authentication attempts

### Monthly
- Audit repository permissions
- Review and update branch protection rules
- Check for unused deploy keys

### Quarterly
- Comprehensive security audit
- Update security documentation
- Review and rotate API keys
- Test incident response procedures

## Security Checklist for Public Release

Before making repository public:

- [ ] No secrets in commit history
- [ ] `.gitignore` properly configured
- [ ] No sensitive data in issues/PRs
- [ ] Dependencies are up to date
- [ ] Security policy documented
- [ ] Branch protection enabled
- [ ] CODEOWNERS configured
- [ ] License file added
- [ ] README doesn't expose internal info
- [ ] CI/CD doesn't expose secrets
- [ ] No hardcoded URLs to internal services
- [ ] No proprietary algorithms exposed
- [ ] Legal review completed (if needed)
- [ ] Security scanning enabled
- [ ] Vulnerability disclosure process documented