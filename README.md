# webdemo






## Usage



## Developing

/(project root) 
---/helpers 
---/controllers 
---/public 
------/css 
------/img 
------/js 
------/upload 
---/server 
---/views 
------/layouts 
------/partials 
nmp init
npm install express morgan body-parser cookie-parser method-override errorhandler express-handlebars moment multer serve-favicon mongoose MD5 async --save

### Test
npm install -g mocha
npm install -g graceful-fs
# The inclusion of sinon-chai allows us to write 
# special assertions such as to.be. calledWith, which 
# would otherwise not work with Chai alone
npm install --save-dev sinon sinon-chai 
npm install --save-dev proxyquire

# By including a single file we can instruct Mocha to automatically 
# require this file for every test file that is run. The file itself 
# just includes the chai and sinon modules and defines a few global 
# variables as shortcuts for our test writing. Additionally, it 
# instructs chai to use the sinonChai module so that our syntax is 
# extended and we can write Sinon-specific Chai assertions
$ mocha -r tests/testhelper.js -R spec tests/**/*.test.js


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
