# COVID-19 Curve Crushers Qlik Sense Mashup
An [AngularJS-v1.7](https://docs.angularjs.org/guide) Qlik Sense mashup, compatible with Qlik Sense June 2018 release and up.

## Prerequisites

### Your project dependencies
1. Make sure you have [Node.js](http://nodejs.org) -- version [10.16.0](https://nodejs.org/download/release/v10.16.0/node-v10.16.0-x64.msi)
2. Install git(https://git-scm.com/download/win)
3. Install gulp cli(https://gulpjs.com/) - `npm install gulp-cli -g`
4. Run `npm install -g bower`
5. Prepare your Qlik Sense server for local mashup development, go to your QMC:
    1. Virtual Proxies section
    2. Select 'Advanced' from the right sidebar
    3. Scroll to the "Additional response headers" and add "*" or "http://localhost:3000"
    4. Whitelist your machine name

## Local Development  
### First time setup:
1. Clone project to your local machine, unzip and navigate to the folder through the command line.
2. Run `npm install`
3. Run `bower install`

### Working with the local dev server
1. Run `gulp build-dev` - This will package your code.  
2. Run `gulp watch` - This will package your code and start your local web server automatically. With every change you'll make to the files, the browser will refresh and you'll have clear visibility to the changes. (Without zipping and installing through the QMC).  
3. When you're done, hit Ctrl + 'C' and approve with 'Y' to close the process.  

## Packaging a New Update  
Once you are done updating the files and are ready to deploy, this command will prepare your code and zip it so you could install the new package through the QMC:  
1. Run `gulp build`
2. Open Qlik Management Console.
3. Select Extensions on the QMC start page or from the Start S drop-down menu to display the overview.
4. Click "+ Import" in the top right corner.
5. Select the Zip file to import.
6. Browse to your project and locate `.BUILDZIP\package.zip` and select the zipped package.
7. Click Open in the File explorer window.
8. Click Import.