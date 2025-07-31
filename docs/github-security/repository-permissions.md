# Repository Permissions and Access Control Guide

This guide explains how to manage permissions and access control for the Code Craft Studio repository.

## Permission Levels Overview

GitHub provides five permission levels for repositories:

| Permission | Capabilities | Use Case |
|------------|-------------|----------|
| **Read** | • Clone and pull<br>• Create issues<br>• Comment on issues/PRs | External contributors, users |
| **Triage** | • Everything from Read<br>• Manage issues and PRs<br>• Apply/dismiss labels<br>• Request reviews | Community moderators |
| **Write** | • Everything from Triage<br>• Push to branches<br>• Create/delete branches<br>• Manage releases | Active contributors |
| **Maintain** | • Everything from Write<br>• Manage settings<br>• Manage webhooks<br>• Manage deploy keys | Core maintainers |
| **Admin** | • Everything from Maintain<br>• Manage security<br>• Delete repository<br>• Transfer ownership | Repository owner only |

## Setting Up Permissions

### 1. Individual Collaborators

**Adding a collaborator**:
1. Go to Settings > Manage access
2. Click "Invite a collaborator"
3. Enter username or email
4. Select permission level
5. Send invitation

**Best practices**:
- Start with minimum permissions
- Increase as needed
- Review quarterly
- Document why each person has access

### 2. Team-Based Access

**Creating teams** (for organizations):
1. Organization settings > Teams
2. Create new team
3. Add members
4. Assign repository permissions

**Recommended team structure**:
```
- Core Team (Admin/Maintain)
  └── You + trusted co-maintainers
  
- Contributors (Write)
  └── Regular contributors
  
- Triagers (Triage)
  └── Community helpers
  
- Reviewers (Read + CODEOWNERS)
  └── Code reviewers
```

### 3. Outside Collaborators

For contributors not in your organization:
- Use fork-and-pull model
- Grant "Read" access initially
- Upgrade to "Write" after proven contributions
- Never grant "Maintain" or "Admin"

## CODEOWNERS Implementation

### Purpose
CODEOWNERS automatically requests reviews from designated people/teams when PRs modify specific files.

### Setting Up CODEOWNERS

**Location**: Create file at one of:
- `.github/CODEOWNERS`
- `CODEOWNERS` (root)
- `docs/CODEOWNERS`

**Example CODEOWNERS file**:
```
# This is a CODEOWNERS file
# Each line is a file pattern followed by one or more owners

# Global owners (review everything)
* @your-github-username

# Documentation
/docs/ @your-github-username @documentation-team
*.md @your-github-username

# Source code
/src/ @your-github-username @core-team
/src/components/ @your-github-username @frontend-team
/src/web.ts @your-github-username
/src/definitions.ts @your-github-username

# Native implementations require specialized review
/android/ @your-github-username @android-expert
/ios/ @your-github-username @ios-expert

# CI/CD and build files
/.github/ @your-github-username
/rollup.config.js @your-github-username
/package.json @your-github-username
/tsconfig.json @your-github-username

# Security-sensitive files
/SECURITY.md @your-github-username
/.env.example @your-github-username
/.gitignore @your-github-username
```

### CODEOWNERS Syntax

**Patterns**:
- `*` - Everything
- `*.js` - All JavaScript files
- `/docs/` - Everything in docs directory
- `/docs/*.md` - Only markdown files in docs
- `!/docs/temp/` - Exclude temp directory

**Owners**:
- `@username` - GitHub username
- `@org/team-name` - GitHub team
- `user@email.com` - Email address

## Access Control Best Practices

### 1. Principle of Least Privilege

**Implementation**:
```
New contributor → Read
Active contributor (3+ PRs) → Triage
Regular contributor (10+ PRs) → Write
Core team member → Maintain
Owner/Admin → Admin (minimal)
```

### 2. Regular Audits

**Monthly audit checklist**:
- [ ] Review all collaborators
- [ ] Check last activity date
- [ ] Remove inactive users (>6 months)
- [ ] Verify permission levels
- [ ] Update CODEOWNERS

### 3. Secure Workflows

**For sensitive operations**:
1. Require two-person review
2. Use protected branches
3. Require signed commits
4. Enable audit logging

### 4. External Contributions

**Fork-and-pull workflow**:
1. External users fork repository
2. Make changes in their fork
3. Submit pull request
4. Maintainers review and merge
5. No direct repository access needed

## Managing Deploy Keys

### What are Deploy Keys?
SSH keys that grant read-only or read-write access to a single repository.

### Setting Up Deploy Keys

1. **Generate SSH key**:
   ```bash
   ssh-keygen -t ed25519 -C "deploy-key-code-craft-studio"
   ```

2. **Add to repository**:
   - Settings > Deploy keys
   - Add deploy key
   - Paste public key
   - Select read/write access if needed

3. **Best practices**:
   - Use separate keys per service
   - Rotate keys annually
   - Document what each key is for
   - Prefer read-only when possible

## Webhooks and Integrations

### Security Considerations

1. **Webhook secrets**:
   - Always use webhook secrets
   - Verify signatures in your code
   - Use HTTPS endpoints only

2. **OAuth Apps**:
   - Review permissions requested
   - Revoke unused apps
   - Audit quarterly

3. **GitHub Apps**:
   - Prefer over OAuth apps
   - Grant minimal permissions
   - Review installation settings

## Emergency Access Procedures

### Lockout Prevention

1. **Multiple admins**: Always have 2+ admins
2. **Recovery codes**: Store GitHub 2FA recovery codes securely
3. **Contact GitHub Support**: For ownership disputes

### Access Revocation

**Immediate revocation steps**:
1. Settings > Manage access
2. Find user/team
3. Click "Remove"
4. Check for:
   - Deploy keys they added
   - OAuth apps they authorized
   - Webhooks they created

## Monitoring Access

### GitHub Audit Log

**What to monitor**:
- Repository access changes
- Permission level changes
- Failed authentication
- Sensitive actions (deletions, transfers)

### Notifications

**Set up alerts for**:
- New collaborator additions
- Permission changes
- Deploy key additions
- Webhook modifications

## Permission Matrix

| Action | Read | Triage | Write | Maintain | Admin |
|--------|------|--------|-------|----------|--------|
| View code | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create issues | ✅ | ✅ | ✅ | ✅ | ✅ |
| Close issues | ❌ | ✅ | ✅ | ✅ | ✅ |
| Push to branches | ❌ | ❌ | ✅ | ✅ | ✅ |
| Merge PRs | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete branches | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage releases | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage settings | ❌ | ❌ | ❌ | ✅ | ✅ |
| Add collaborators | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delete repository | ❌ | ❌ | ❌ | ❌ | ✅ |