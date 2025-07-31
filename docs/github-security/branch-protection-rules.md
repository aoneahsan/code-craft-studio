# Branch Protection Rules Guide

This guide explains how to set up branch protection rules for the Code Craft Studio repository to ensure security and code quality.

## Overview

Branch protection rules help prevent:
- Force pushes that can rewrite history
- Accidental branch deletion
- Direct pushes without review
- Merging code that doesn't pass required checks

## Setting Up Branch Protection

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/code-craft-studio`
2. Click on **Settings** tab
3. In the left sidebar, click **Branches** under "Code and automation"
4. Click **Add rule** or **Add branch protection rule**

### Step 2: Configure Protection for Main Branch

#### Basic Settings

1. **Branch name pattern**: Enter `main` (or `master` if that's your default branch)

2. **Protect matching branches**: Check the following options:

   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: Set to **1** (or more for stricter control)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require review from CODEOWNERS
     - ✅ Restrict who can dismiss pull request reviews (select yourself)
   
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - Add required status checks: `build`, `lint`, `test` (if you have CI/CD)
   
   - ✅ **Require conversation resolution before merging**
   
   - ✅ **Require signed commits** (optional but recommended)
   
   - ✅ **Require linear history** (prevents merge commits)
   
   - ✅ **Include administrators** (even admins must follow the rules)
   
   - ✅ **Restrict who can push to matching branches**
     - Add yourself and trusted collaborators only
   
   - ✅ **Allow force pushes** - **DO NOT CHECK** (leave unchecked)
     - ✅ Specify who can force push: Nobody
   
   - ✅ **Allow deletions** - **DO NOT CHECK** (leave unchecked)

3. Click **Create** or **Save changes**

### Step 3: Additional Branches Protection

Consider protecting other important branches:

1. **develop** branch (if using Git Flow)
   - Similar rules but potentially less strict
   - May allow more contributors to push

2. **release/** branches
   - Protect from deletion
   - Require status checks
   - Limit who can create/push

## Verification

After setting up protection rules:

1. Try to push directly to main branch - it should be rejected
2. Create a pull request - it should require review
3. Try to delete the main branch - it should be prevented
4. Try to force push - it should be rejected

## Emergency Procedures

If you need to temporarily disable protection:

1. Go to Settings > Branches
2. Edit the rule
3. Uncheck "Include administrators" temporarily
4. Make necessary changes
5. **IMMEDIATELY re-enable protection**

## Best Practices

1. **Never disable protections permanently**
2. **Use pull requests for all changes**
3. **Set up CODEOWNERS file** (see repository-permissions.md)
4. **Enable required status checks** with CI/CD
5. **Review protection rules quarterly**
6. **Document any exceptions** in this file

## Troubleshooting

### "Push rejected" errors
- Ensure you're working on a feature branch
- Create a pull request instead of pushing directly

### "Required status checks failing"
- Check your CI/CD pipeline
- Ensure all tests pass locally first
- Verify branch is up to date with main

### "Cannot merge - review required"
- Request review from authorized reviewers
- Ensure all conversations are resolved
- Check that all status checks have passed