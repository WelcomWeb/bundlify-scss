var fs = require('fs'),
	path = require('path'),
	through	= require('through');

function plugin(browserify, options) {
	options = options || {};

	var output = options.output || options.o,
		filenames = [];

	browserify.transform(function(filename) {
		if (!/\.(scss|sass)$/.exec(filename)) return through();
	
		var relativePath = path.relative(path.dirname(output), path.dirname(filename)),
			filePath = path.join(relativePath, path.basename(filename)).replace(/\\/g, '/');
		filenames.push(filePath);

		return through(
			function() {},
			function() {
				this.queue('');
				this.queue(null);
			}
		);
	});

	var bundle = browserify.bundle;

	browserify.bundle = function(opts, cb) {

		if (browserify._pending) {
			var tr = through();
			tr.scss = through();

			browserify.on('_ready', function () {
				var b = browserify.bundle(opts, cb);
				b.on('transform', tr.emit.bind(tr, 'transform'));
				if (!cb) b.on('error', tr.emit.bind(tr, 'error'));
				b.pipe(tr);
				b.scss.pipe(tr.scss);
			});
			return tr;
		}

		var stream = bundle.apply(browserify, arguments);

		stream.scss = through();
		stream.on('end', function() {
			var code = filenames.map(function(filename) {
				return '@import "' + filename + '";';
			}).join('\n');

			filenames = [];

			if (output !== undefined) {
				stream.scss.pipe(fs.createWriteStream(output));
			}

			try {
				stream.scss.queue(code);
				stream.scss.queue(null);
			} catch (err) {
				stream.emit('error', err);
				stream.scss.emit('error', err);
			}
		});

		return stream;
	}

	return browserify;
}

module.exports = plugin;