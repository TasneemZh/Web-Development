The site is published at https://tasneemzh-newspaper.herokuapp.com/

HTML + CSS + Bootstrap + JavaScript + Node.js + Express + API

-----------------

You can open the site through your local server on 3000 port by typing:

- the URL: http://localhost:3000/

**and**

- `nodemon (app.js)` on your HyperTerminal

NOTE: Specifying *app.js* after *nodemon* is optional since it is determined to be the main file in *package.JSON*

-----------------

You have to replace the *API key* and *Audience key* if you want to get into the database details, but first, you should have an account on Mailchimp (For more details, see app.js comments)

Your changes take effect on your local server but not the site unless you:

1) deploy your project on Heroku after making an account on it

2) push your project to Heroku each time you make changes on it

NOTE: It takes some time for heroku to take effect after deploying and git-pushing

-----------------

Make sure to:

1- create a site on Heroku to deploy your project on it by typing: `heroku create [your-site-name]`

2- leave your .env file visible since adding it to .gitignore will prohibit Heroku from reaching it out.

2- update your local repository on Git (type on HyperTerminal: `git add .` THEN `git commit -m "[your message]"`)

3- push your local repository to the remote repository of your Heroku (type on HyperTerminal: `git push heroku [master]`)

NOTE: The branch could be any other name than *master*, type your local branch name if that is the case

-----------------

For more details, see:

[Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

**and**

[Mailchimp: Quick start](https://mailchimp.com/developer/marketing/guides/quick-start/)

-----------------

I also heard there are awesome and useful notes at [.gitignore](https://github.com/TasneemZh/Newspaper-SignUp/blob/main/.gitignore), so what are you waiting for? Go and take a quick look
