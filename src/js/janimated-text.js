(function( $ ){

	var plugin_name = "autotext";   // Name of the plugin

	function animate_by.char(content) {
		var $this = $(this), data = $this.data(plugin_name);

		// TODO check if this is escaping html
		if (!content.current_item) {
			content.current_item = 0;
		}
		while (data.running && content.current_item < content.text.length - 1) {
			content.placeholder.append(content.text.charAt(content.current_item));
			content.current_item++;
			delay(content.delay);
		}
	}

	function animate_by.line(content) {
		var $this = $(this), data = $this.data(plugin_name);

		// TODO check if this is escaping html
		if (!content.current_item) {
			content.current_item = 0;
		}
		var lines = content.text.match(/^.*((\r\n|\n|\r)|$)/gm);
		while (data.running && content.current_item < lines.length - 1) {
			content.placeholder.append(lines[content.current_item]);
			content.current_item++;
			delay(content.delay);
		}
	}

	function animate_by.none(content) {
		var $this = $(this), data = $this.data(plugin_name);

		if (!content.current_item) {
			content.current_item = 0;
		}
		if (content.current_item = 0 && data.running) {
			content.placeholder.append(content.text);
			content.current_item++
			delay(content.delay);
		}
	}

	function animate_by.replace(content) {
		// TODO chequear si el placeholder == taget porque en
		// ese caso no tiene su propio placeholder.
		// El de reemplazo tiene que tener su propio porque pisa todo el contenido.
	}

	function content(content_data) {
		this.render_next = [content_data.animation];
		this.data = content_data.text;
	}

	function render_placeholder(content, target) {
		if (!content.placeholder) {
			content.placeholder = target;
		} else if (typeof content.placeholder == "string") {
			// it creates de tag and saves the selector to the content
			content.placeholder = target.add(content.placeholder);
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

				while (data.running && data.current_content < data.content.length) {
					content = data.content[content_index];
					data.current_content++;
					render_placeholder(content, data.taget);
					animate_by.[content.animation](content);
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
				for (int i = 0; i < data.content.length; ++i) {
					data.content.current_item = 0;
				}
			});
		}
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
