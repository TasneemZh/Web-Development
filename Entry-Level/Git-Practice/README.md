### 1 - Create an empty repository on GitHub

### 2 - Create a local repository with some files

### 3 - On the HyperTerminal, type:

> cd Git-Practice

*move to the working directory*

> git init

*initialize Git*

> git status

*show the changes that haven't get staged yet*

> git add .

*add the changes to the staging area*

> git commit -m "Add two files"

*add what is in the staging area to the local repository*

> git branch

*show the available branches in the local repository*

> git branch -M main

*change the default branch to "main"*

> git remote add origin https://github.com/TasneemZh/Git-Practice.git

*establish a connection between the current local repository and the determined remote repository*

**Note:** *this command is followed by `git fetch` if it is not empty, and `git rebase origin/main` if the local repository is not empty*

> git push origin main

*upload the work in the "main" branch to the remote repository named (by default) "origin"*

> git checkout -b temp

*create a local branch named "temp" and select it*

> touch README.md

*create README.md file*

> git status

> git add .

> git commit -m "Create README.md"

> git checkout main

*select the branch named "main"*

> git rebase temp

*copy the work in "temp" and paste it in "main"*

**Note:** *it would neglect the "temp" **original** work and make it points to where the selected branch (main) points*

> git push

*upload the local repository to the remote repository*

> git checkout temp

### 4 - Change one of the files extensions [from txt to md]

### 5 - On the HyperTerminal, type:

> git status

> git add .

> git commit -m "Change the extension of git-command-local"

### 6 - Change the other file extension [from txt to md]

### 7 - On the HyperTerminal, type:

> git status

> git add .

> git commit -m "Change the extension of the second file"

> cat >README.md

*add some content through the terminal to the empty file README.md*

> *1 - Create an empty repository on GitHub*

*the content that has been added* 

> start README.md

*open the file README.md through the default editor on the user's computer*

**Note:** *another command that can be used is specifying the editor to open the file with: `atom README.md`*

> *[write more steps on README.md through the Atom application]*

> git rebase -i temp~3

*copy the latest three commits that are pointed by the selected branch*

> git status

> git branch -f main temp

*move by force the branch "main" to where the branch "temp" resides*

> git push origin main

> git checkout main

> git branch -d temp

*delete the "temp" branch as it is not needed and has been backed up*

> git branch

### 8 - Format the two git-commands files on the remote repository

### 9 - On the HyperTerminal, type:

> git checkout -b new 

> cat >>README.md

*append some content through the terminal to the file README.md*

> *[write more steps on README.md through the HyperTerminal]*

> cat README.md

*show the content inside the file README.md*

> git status

> git add .

> git commit -m "Write some content on README.md"

> git push origin new

> git checkout main

> git pull

*Download the changes in the remote repository that are not in the local repository of the default branch (main)*

> git merge new

*merge the work of the branch "new" to the work of the selected branch*

> git push

> git push origin :new

*delete the **remote** branch "new" in the local and remote repository*

> git branch -d new

*delete the **local** branch "new" in the local repository*

> ls -a

*show the files and folder including the hidden ones*

### 10 - Format the README.md on the remote repository

### 11 - On the HyperTerminal, type:

> git fetch

> cat git-commands-local.md

**Note:** *not updated yet*

> cat status

**Note:** *the local main branch is behind the remote main branch by several commits*

> git merge origin/main

> cat git-commands-local.md

**Note:** *now it is up-to-date*

### 12 - Add the rest of the steps on README.md on the remote repository

