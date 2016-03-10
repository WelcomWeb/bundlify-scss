# bundlify-scss

A simple browserify plugin to extract all your SASS resources and add them to an importable file for your project.

Example:

**JavaScript** `public/javascripts/modules/my-module.js`

	import React from 'react';

	import './my-module.scss';

	export default class MyModule extends React.Component {
		...

**SASS file for module** `public/javascripts/modules/my-module.scss`

	[data-am-my-module] { ... }

**SASS base file** `public/stylesheets/application.scss`

	@import "./modules.scss";
	...

Create your browserify bundle and extract your SASS styling to a modules file:

	$ browserify -p [ bundlify-scss -o ./public/stylesheets/modules.scss ] ./public/javascripts/application.js > ./build/bundle.js
	$ node-sass ./public/stylesheets/application.scss ./build/bundle.css


## Options

### -o, -output
Destination file for SASS file collection, it will only contain a bunch of `@import` statements