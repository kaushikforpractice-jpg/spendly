# Git Workflow

The steps for one feature, from start to finish. Each line says where the code moves.

Names used here:
- **local master / local branch**: on your computer
- **git master / git branch**: on GitHub

## 1. Start a new feature

```bash
git checkout master                     # local: switch to local master
git pull origin master                  # git master -> local master
git checkout -b feature/my-feature      # local master -> new local branch
```

## 2. Work (repeat as needed)

```bash
# edit files in the editor
git status                              # look: which branch, what changed
git add file1.py file2.py               # folder -> staging area (local)
git commit -m "message"                 # staging -> saved in local branch
```

## 3. Send it to GitHub

```bash
git push origin feature/my-feature      # local branch -> git branch
                                        # (first push creates the git branch)
```

## 4. Merge on GitHub (browser)

- Open a pull request: git branch -> git master
- Get approval if the team requires it, then click Merge
- Click Delete branch once it is merged

## 5. Bring master back to your computer

```bash
git checkout master                     # local: switch to local master
git pull origin master                  # git master -> local master
git branch -d feature/my-feature        # local: delete the finished local branch
```

Then repeat from step 1 for the next feature.

## Habits

- Run `git status` before you commit, to confirm the branch.
- Never start a new branch without pulling master first.
- If a push is rejected, run `git pull origin <your-branch>` and push again.
