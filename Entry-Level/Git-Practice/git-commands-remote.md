**git clone**

*Gets the remote repository to your local environment*

--------------

**git checkout [localBranche]**

*Not possible to checkout remote branches locally as they are synchronized with the remote repository branches*

--------------

**git fetch**

*Fetches the updated version in the remote to the local repository*

--------------

**git push**

*Uploads your changes to the remote repository*

--------------

**git pull**

*Equals to fetch and then merge (follows this command, the push command)*

**Notes:**

- this command is used instead of simply fetching, is when there are updates on the remote and changes in the local repository

--------------

**Notes:**

- **git fetch/pull/push** without specifying the source and destination branches won't work unless the remote branch is tracked (sychronized with)

--------------

**git push -f**

*Ignores the local repository changes and apply the remote repository ones*

--------------

**git pull --rebase**

*Equals to fetch and then rebase (follows this command, the push command)*

**Notes:**

- this command is used instead of simply fetching, is when there are updates on the remote and changes in the local repository

- don't make your edits on the "main" branch locally as you will encounter an error when pushing it to the "main" remotely. Make your edits on a new branch or push them on another new branch

--------------

**git checkout -b branchName remoteBranch**

*Creates a new branch and synchronous it with the remote branch instead of the default "main"*

--------------

**git branch -u remoteBranch branchName**

*Synchronizes an existing branch with the remote branch*

--------------

**git branch -u remoteBranch**

*Synchronizes the selected branch with the remote branch*

--------------

**git push origin sourceBranch:destBranch**

*Uploads the local source branch to the remote destination branch*

--------------

**git push origin sourceBranch**

*Uploads the selected branch work to the remote branchName*

--------------

**git fetch origin branchName**

*Downloads the remote branchName to the selected local branch*

--------------

**git fetch**

*Downloads everything*

--------------

**git push origin :destinationBranch**

*Removes the branch in the remote repository*

--------------

**git fetch origin :destinationBranch**

*Creates a new branch in the local repository*

--------------

**git pull origin branchName**

*Equals to fetch and merge*

--------------

**git pull origin sourceBranch:destintionBranch**

*Equals to fetch and merge from to*
