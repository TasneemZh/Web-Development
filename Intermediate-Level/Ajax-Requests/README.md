The project shows how AJAX requests/calls work with URLs and local files. The project works on both the client and server sides. In other words, you can run it either way. However, it is has been built to run on the server-side, thus doing the same is recommended.

## Some clarification about each type:

#### Urls:

The website, which is going to be connected to the URL section in the *open* function that is invoked by the XML-HTTP-request, has to have its CORS policy allowed.

In this project, we have used a URL of another project in which we have enabled the CORS policy in the response header to be able to use it here.

#### Files:

The *open* function doesn't take files since the CORS support a set of protocols schema and files are not one of them. In order to use them, you should allow the browser to access files since they are blocked by default.

To achieve that, do the following on your terminal:

* Move to the directory in which the executable chrome file is set.

    Example: `cd C:/Program\ Files/Google/Chrome/`

* Launch Chrome browser with the *--allow-file-access-from-files* flag.

    Command: `start chrome.exe --allow-file-access-from-files`

## Steps to run the Project:

To run the project, do the following steps:

1. Install the dev/dependencies. Use `npm i` **and** `npm i -also=dev`

2. Install Browserify and Watchify globally:

    `npm i -g browserify` **and** `npm i -g watchify`

3. Now you have two ways, either you run the project through the browser:
    
    1. Bundle the js files into one js file and watch for changes:

        `watchify public/js/ajax-call.js -o public/js/bundle.js -v`

    Notes:
    
    - Don't attach the "v" flag if you don't want to see updated states.

    - Bundle them once if you don't want to change anything in the files, use:

        `browserify public/js/ajax-call.js -o public/js/bundle.js`

    2. Launch the Chrome browser via the terminal with the --allow-file-access-from-files flag.

    3. Copy the path of the home.html file and paste it on the chrome browser you have launched.

4. Or you run the project through the server (Recommended):

    1. Simply use `node app.js` to run the whole project and do the bundling besides fetching the image of the URL automatically (i.e., through the server).

    Note: Using "nodemon" here is a bad choice since it watches for changes, and thus will keep resetting the server until it fails to load the content.

## Important Notes:

- You won't see the icon image when displaying the URL content after clicking on its button since such processes don't take place on the client-side but the server-side. So, you may want to run the server at least once to download all the necessary resources before getting back to using the browser.

- If you opened the project via the browser, then keep into consideration that the moment you close the chrome, the flags will be reset. Meaning that you have to enable the file flag whenever you want to use the project. It is unsafe to use anyway, so this is for the best.

## Resources for Further Reading:

[AJAX - Asynchronous JavaScript And XMLs](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)

[The CORS Issue - Where it all started](https://www.codeproject.com/Questions/1195078/How-to-fix-cross-origin-requests-are-only-supporte)

[The CORS Fix - Where it all ended](https://chrome-allow-file-access-from-file.com/windows.html)

[Browserify and Watchify Configuration](https://scotch.io/tutorials/getting-started-with-browserify#toc-under-the-hood)