# gulp-frontend-boilerplate - WORK IN PROGRESS
An up-tp-date gulp boilerplate for static front-end websites.

It uses npm as a package manager for both sass and js.
In sass the packages are required with --- and in js browserify handles dependencies.

The  gulpfile.js contains the main configuration object, and all other tasks are in the `tasks` folder which contains:

- [Browserify](http://browserify.org/) & [Watchify](https://github.com/substack/watchify) and Babelilfy for ES6 and sourcemapping
- [SASS](http://sass-lang.com/) with [autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)), compiled with LIBSASS, SMACSS file architecture and sourcemapping
- [BrowserSync](http://browsersync.io)
- ESLINT
- Gzip compression
- Auto Modernizr
- Image and SVG minification, WebP
- Cache control



#### TODO
- make sourcemaps external
- require in css
- es6 in browserify
- browserify multiple bundles
- gulp4 branch
- gulp append version
- add tests?
- rsync or git or nothing? in deploy task
- https://github.com/imagemin/imagemin-webp
- better console logging
- File size reporting? https://github.com/vigetlabs/gulp-starter


##Installation
```
npm install
```

###Tasks
- gulp or gulp dev
- gulp build (production, like compress images, gzip modernizr)

You can also run `npm start` to execute gulp from the local `node_modules` forler if you haven't installed it on your local machine

BrowserSync automoatically starts a server on localhost3000, additional BrowserSync tools available on 3001