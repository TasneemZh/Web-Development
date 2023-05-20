**git command**

*Commits some work*

--------------

**git branch [branchName]**

*Creates the branch*

--------------

**git branch -M [branchName]**

*Changes current branch name*

--------------

**git checkout [branchName]**

*Selects the branch*

--------------

**git switch [branchName]**

*A new command instead of "git checkout"*

--------------

**git checkout -b [branchName]**

*Creates and selects the branch*

--------------

**git merge [branchName]**

*Merges the branchName with the selected branch*

--------------

**git rebase [branchName]**

*Copies a set of commits under the selected branch and paste them under the branchName*

**Notes:**

- when using rebasing for a branch that resides on the same line on the tree then "fast-forwarding" what would happen

--------------

**git checkout [commitHash]**

*Detaches the HEAD*

--------------

**git checkout [branchName]^**

*Gets back one step in position*

--------------

**git checkout [branchName]~(num)**

*Gets back with a number of steps in position*

--------------

**git branch -f [branchName] [anotherBranchName]**

*Moves by force the branchName to the same position as the anotherBranchName*

--------------

**git reset [branchName]**

*Undoes the commits of the selected branch until arriving at the branchName position*

--------------

**git revert [branchName]**

*Reverses the last changes (last commit) that are pointed by the branchName*

--------------

**git cherry-pick [commitHash] [commitHash] ...etc**

*Copies the chosen commits and paste them under the selected branch*

--------------

**git rebase -i [branchName]~(num)**

*Interactive rebasing the commits from the branchName position until the chosen position*

**Notes:**

- the result would be a copy of the commits in the new order and formatting under the parent of the last chosen commit

--------------

**git commit --amend**

*Edits the selected branch's current commit*

--------------

**git tag [tagName] [commitHash]**

*Names a tag at the commit hash*

--------------

**git describe [branchName]**

*Gets a description of the nearest tag name with how many steps it is far from the branch current position, and the commit of the current position*

--------------

**git checkout [branchName]^**

*In case there are more than one parents, the HEAD gets detached and goes to the parent positioned directly above it*

**Notes:**

- the number follows the ^ would move the HEAD to the other parents


