# Git & Deployment Workflow

## Branch Strategy

```
main (production) ← Protected, PR-only
  ↑
develop (staging) ← Optional staging branch
  ↑
feature/* ← Your working branches
```

## Daily Workflow

### 1. Start New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name
```

### 2. Make Changes
```bash
# Edit files
git add .
git commit -m "Clear description of changes"
git push origin feature/descriptive-name
```

### 3. Test Preview
- Vercel auto-creates preview URL
- Test thoroughly before merging
- Preview URL: `https://save-it-<hash>.vercel.app`

### 4. Merge to Production
```bash
# Create PR
gh pr create --base main --head feature/descriptive-name \
  --title "Feature: ..." \
  --body "Description..."

# Merge PR (deploys to production)
gh pr merge --squash --delete-branch
```

## Quick Commands

```bash
# See all branches
git branch -a

# Check current branch
git branch --show-current

# List Vercel deployments
vercel ls

# Create PR
gh pr create --base main --head $(git branch --show-current)

# Delete old branch
git branch -d feature/old-name
git push origin --delete feature/old-name
```

## Rules

✅ DO:
- Create feature branches for all changes
- Test preview URLs before merging
- Use PRs to merge to main
- Clean up branches after merging

❌ DON'T:
- Push directly to main (it's protected)
- Merge without testing preview
- Leave old feature branches around
- Force push unless emergency rollback

## Emergency Rollback

```bash
# Find commit to rollback to
git log --oneline -10

# Reset and force push
git reset --hard <commit-hash>
git push origin main --force

# Redeploy
vercel --prod --yes
```

## URLs

- Production: https://save-it-eta.vercel.app
- Develop preview: https://save-it-develop-<hash>.vercel.app
- Feature previews: https://save-it-<hash>.vercel.app
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/charlesm-beep/expense-tracker
