(function( $ ){

	var plugin_name = "autotext";   // Name of the plugin

	function nl2br (str, is_xhtml) {   
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag);
	}

	function create_placeholder(content, target) {
		if (!content.placeholder) {
			content.placeholder = target;
		} else if (typeof content.placeholder == "string") {
			content.placeholder = $(content.placeholder);
			target.append(content.placeholder);
		}
	}

	function assign_iterator(content) {
		if (!content.current_iterator) {
			content.current_iterator = render_strategies[content.render_strategy](content.items);
		}
	}

	function line_iterator(text) {
		this.current_line = 0;
		this.lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);
	}

	line_iterator.prototype.has_next = function() {
		return this.current_line < this.lines.length;
	}

	line_iterator.prototype.next = function() {
		return this.lines[this.current_line++];
	}

	function char_iterator(text) {
		this.current_char = 0;
		this.text = text;
	}

	char_iterator.prototype.has_next = function() {
		return this.current_char < this.text.length;
	}

	char_iterator.prototype.next = function() {
		char = this.text.charAt(this.current_char++);
		if (char == '\r') {
			// ignoro el \r
			char = content.text.charAt(this.current_item++);
		}
		if (char == '\n') {
			char = '<br />';
		}
		return char;
	}

	function one_shot_iterator(text) {
		this.listed = false;
		this.text = text;
	}

	char_iterator.prototype.has_next = function() {
		return this.listed;
	}

	char_iterator.prototype.next = function() {
		this.listed = true;
		return this.text
	}

	var animations = {
		additive: function(data, content) {
			create_placeholder(content, data.target);
			assign_iterator(content);
			if (data.running && content.current_iterator.has_next()) {
				setTimeout(function() {
					content.placeholder.html(content.placeholder.html() + content.current_iterator.next());
					animations.additive(data, content);
				}, content.delay);
			}
		},
		replace: function(data, content) {
			// placeholder is necessary
			if (!content.placeholder || content.placeholder == '') content.placeholder = '<span>';
			create_placeholder(content, data.target);
			assign_iterator(content);
			if (data.running && content.current_iterator.has_next()) {
				setTimeout(function() {
					content.placeholder.html(content.current_iterator.next());
					animations.additive(data, content);
				}, content.delay);
			}
		}
	}

	var render_strategies = {
		'text-by-char': function(items) {
			 return new char_iterator(items.toString());
		},
		'text-by-line': function(items) {
			return new line_iterator(items.toString());
		},
		'text-one-shot': function(items) {
			return new one_shot_iterator(items.toString());
		},
		iterator: function(items) {
			return items.iterator();
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
					val.current_iterator = null;
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
