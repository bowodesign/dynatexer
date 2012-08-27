(function( $ ){

	var plugin_name = "autotext";   // Name of the plugin

	function animate_content(data, content) {
		
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
						current_content: [0, 0], // content, item of content
						running: false
					});
				}
			});
		},
		play : function( ) {
			return this.each(function() {
				var $this = $(this), data = $this.data(plugin_name);

				var content_index = 0;
				while (data.running && content_index < data.content.length) {
					content = data.content[content_index];
					content_index++;
					// animate content
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
				data.current_content[0, 0];
			});
		}
		configure : function( config ) {
			var $this = $(this), data = $this.data(plugin_name);
				$(this).data(plugin_name, {
					lines: config.lines,
					loop: config.loop,
					content: config.content,
					current_content: [0, 0], // content, item of content
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
