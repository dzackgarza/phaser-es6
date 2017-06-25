# Phaser ES6 Boilerplate

✔ [Browserify](https://github.com/substack/node-browserify) + [Babelify](https://github.com/babel/babelify) (Yes, it uses [Babel](https://babeljs.io/)).

✔ [Browsersync](http://www.browsersync.io/) = Livereload + Mobile debugging with [Weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/).

✔ Production ([UglifyJS](https://github.com/mishoo/UglifyJS2)) and Development ([Sourcemaps](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)) builds.

✔ Did I say ES6? Well.. some ES7 too! ([See Experimental features](https://babeljs.io/docs/usage/experimental/)).

Install dependencies

`npm install`

Run a development build...

`npm start`

...or a production build.

`npm run production`

Development builds will copy `phaser.min.js` together with `phaser.map` and `phaser.js`
Your ES6 code will be transpiled into ES5 and concatenated into a single file.
A sourcemap for your code will also be included (by default `game.map.js`).

Production builds will only copy `phaser.min.js`. Your ES6 code will be transpiled and
minified using UglifyJS.

Any modification to the files inside the `./src` and `./static` folder will trigger a full page reload.

If you modify the contents of other files, please manually restart the server.

### Modifying `gulpfile.js`

See [gulpfile.md](https://github.com/belohlavek/phaser-es6-boilerplate/blob/master/gulpfile.md)

## Changelog (1.0.2)

* Faster builds (no need to copy static files every time).
* Live reload now works with static files too!

## Contributing

Please report any bugs or add requests on [Github Issues](https://github.com/belohlavek/phaser-es6-boilerplate/issues).

## About me

My name is Daniel Belohlavek: I'm from Buenos Aires, Argentina and I love to derp around and code
silly snippets. You can follow me on Twitter [@dbhvk](http://twitter.com/dbhvk)

## License

This project is released under the MIT License.
