(function( $ ){

	var plugin_name = "autotext";   // Name of the plugin

	var animations = {
		char: function(data, content) {
			if (!content.current_item) {
				content.current_item = 0;
			}
			if (data.running && content.current_item < content.text.length) {
				setTimeout(function()
					{
						content.placeholder.html(content.placeholder.html() + content.text.charAt(content.current_item));
						content.current_item++;
						animations.char(data, content);
					}, content.delay);
			}
		},
		line: function(data, content) {
			if (!content.current_item) {
				content.current_item = 0;
			}
			var lines = content.text.match(/^.*((\r\n|\n|\r)|$)/gm);
			if (data.running && content.current_item < lines.length) {
				setTimeout(function()
					{
						content.placeholder.append(lines[content.current_item]);
						content.current_item++;
						animations.line(data, content);
					}, content.delay);
			}
		},
		one_shot: function(data, content) {
			if (!content.current_item) {
				content.current_item = 0;
			}
			if (content.current_item = 0 && data.running) {
				setTimeout(function()
					{
						content.placeholder.append(content.text);
						content.current_item++
					}, content.delay);
			}
		},
		replace: function(data, content) {
			if (content.placeholder == data.target) {
				content.placeholder = target.append('<span>');
			}

			// convertir el texto en un objeto iterable para todas las animaciones
			// TODO chequear si el placeholder == taget porque en
			// ese caso no tiene su propio placeholder.
			// El de reemplazo tiene que tener su propio porque pisa todo el contenido.
		}
	}

	function render_placeholder(content, target) {
		if (!content.placeholder) {
			content.placeholder = target;
		} else if (typeof content.placeholder == "string") {
			content.placeholder = $(content.placeholder);
			target.append(content.placeholder);
		}
	}

	var methods = {
		init : function( config ) {
			return this.each(function() {
				var $this = $(this), data = $this.data(plugin_name);

				if ( ! data ) {
					$(this).data(plugin_name, {
						target: $this,
						lines: config.lines,
						loop: config.loop,
						content: config.content,
						current_content: 0,
						running: false
					});
				}
			});
		},
		play : function( ) {
			return this.each(function() {
				var $this = $(this), data = $this.data(plugin_name);

				data.running = true;

				while (data.running && data.current_content < data.content.length) {
					content = data.content[data.current_content];
					data.current_content++;
					render_placeholder(content, data.target);
					animations[content.animation](data, content);
				}
			});
		},
		pause : function( ) {
			return this.each(function() {
				var $this = $(this), data = $this.data(plugin_name);

				data.running = false;
			});
		},
		reset : function( ) {
			return this.each(function() {
				var $this = $(this), data = $this.data(plugin_name);

				data.running = false;
				data.current_content = 0;
				$.each(data.content, function(i, val) {
					val.current_item = 0;
				});
			});
		},
		configure : function( config ) {
			var $this = $(this), data = $this.data(plugin_name);
				$(this).data(plugin_name, {
					lines: config.lines,
					loop: config.loop,
					content: config.content,
					current_content: 0,
					running: false
				});
		}
	};

	$.fn[plugin_name] = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.' + plugin_name);
		}

	};

})( jQuery );
