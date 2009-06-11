/*
 * jIdler 1.0 - jQuery idle state notifier plugin
 *
 * Copyright (c) 2009 Brad Dougherty, Juriy Zaytsev
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Based on code by Juriy Zaytsev:
 *    http://thinkweb2.com/projects/prototype/detect-idle-state-with-custom-events/
 *
 */

(function($) {
	$.idler = {
		defaults: {
			events: [
				[window, 'scroll'],
				[window, 'resize'],
				[document, 'mousemove'],
				[document, 'keydown']
			],
			time: 2000,
			onActive: function() {},
			onIdle: function() {},
		},
		_idleTime: null,
		_timer: null,
		
		onInterrupt: function() {
			$().trigger('active.state', [ new Date() - $.idler._idleTime ]);
			$.idler.setTimer();
		},
		setTimer: function() {
			clearTimeout($.idler._timer);
			$.idler._idleTime = new Date();
			$.idler._timer = setTimeout(function() {
				$().trigger('idle.state');
			}, $.idler.options.time);
		}
	};
	
	$.fn.idler = function(options) {
		$.idler.options = $.extend($.idler.defaults, options);
		
		$.each($.idler.options.events, function() {
			$(this[0]).bind(this[1], $.idler.onInterrupt);
		});
		$.idler.setTimer();
		
		return this.each(function() {
			$(this).bind('active.state', $.idler.options.onActive).bind('idle.state', $.idler.options.onIdle);
		});
	};
	
	$.fn.killIdler = function() {
		return this.each(function() {
			$(this).unbind('.state');
		});
	}
})(jQuery);