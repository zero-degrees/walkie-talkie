/**
 * Walkie Talkie
 * https://github.com/zero-degrees/walkie-talkie
 *
 * @copyright 2017 Craig Russell
 * @license MIT
 */

//NOTE: IE is not fully supported due its buggy flexbox implementation.

(function ($) {
	'use strict';

	/**
	 * Start the walkthrough.
	 *
	 * @param  {object[]} steps - The walkthrough's step definitions
	 *
	 * @return void
	 */
	$.fn.walkieTalkie = function (steps) {
		var self = this;

		/**
		 * Bootstrap the walkthrough.
		 *
		 * @return void
		 */
		function init() {
			self.steps = steps;
			self.stepId = -1;

			$('#walkthrough').remove();
			$('body').append('<div id="walkthrough"></div>');
			$('body').append('<div id="walkthrough-shade"></div>');
			$('#walkthrough-shade').append('<div id="walkthrough-shade-left"></div>');
			$('#walkthrough-shade').append('<div id="walkthrough-shade-center"></div>');
			$('#walkthrough-shade').append('<div id="walkthrough-shade-right"></div>');
			$('#walkthrough-shade-center').append('<div id="walkthrough-shade-top"></div>');
			$('#walkthrough-shade-center').append('<div id="walkthrough-focus"></div>');
			$('#walkthrough-shade-center').append('<div id="walkthrough-shade-bottom"></div>');
			$('#walkthrough').append('<div id="walkthrough-message"></div>');

			$('#walkthrough-message-container').click(function (event) {
				event.stopPropagation();
			});

			if(typeof window.walkieTalkieInitialized == 'undefined') {
				$(window).resize(function () {
					self.redrawStep();
				});

				window.walkieTalkieInitialized = true;
			}
		}

		/**
		 * Gets styles from element as a string.
		 * Workaround for Firefox and maybe IE.
		 *
		 * @param  {object} element
		 *
		 * @return {string}
		 */
		function cssText(element) {
			var styles = window.getComputedStyle(element),
				styleArray = [],
				key, i;

			for(i = 0; i < styles.length; ++i) {
				key = styles[i];
				styleArray.push(key + ':' + styles[key]);
			}

			return styleArray.join(';');
		}

		/**
		 * Close the walkthrough.
		 *
		 * @return void
		 */
		this.close = function () {
			$('#walkthrough, #walkthrough-shade').fadeOut(100, function () {
				$('#walkthrough, #walkthrough-shade').remove();
			});
		};

		/**
		 * Skip the walkthrough.
		 *
		 * @param {object} event - The triggering event
		 *
		 * @return void
		 */
		this.skip = function (event) {
			if(confirm('Are you sure that you want to skip the walkthrough?')) {
				event.stopPropagation();
				this.close();
			}
		};

		/**
		 * Proceed to the previous step.
		 *
		 * @return void
		 */
		this.prev = function () {
			var step = this.steps[this.stepId];

			if(
				typeof step != 'undefined' &&
				typeof step.callbacks != 'undefined' &&
				typeof step.callbacks.prev != 'undefined'
			) {
				step.callbacks.prev(this);
			}

			--this.stepId;

			this.redrawStep();
		};

		/**
		 * Proceed to the next step. Close the walkthrough if this is the last one.
		 *
		 * @return void
		 */
		this.next = function () {
			var step = this.steps[this.stepId];

			if(
				typeof step != 'undefined' &&
				typeof step.callbacks != 'undefined' &&
				typeof step.callbacks.next != 'undefined'
			) {
				this.steps[this.stepId].callbacks.next(this);
			}

			++this.stepId;
			if(typeof this.steps[this.stepId] == 'undefined') {
				this.close();

				return;
			}

			this.redrawStep();
		};

		/**
		 * Redraw the current step if the walkthrough is visible.
		 *
		 * @return void
		 */
		this.redrawStep = function () {
			var padding = 6,		//TODO: this should not be hard-coded
				walkthroughFocus = $('#walkthrough-focus'),
				step = this.steps[this.stepId],
				focus, focusOffset, focusComputedStyles, focusTop, focusLeft, scrollX, scrollY, isFixed,
				shadeWidth, shadeHeight, shadeFocusLeft, shadeFocusRight, shadeFocusTop, shadeFocusBottom,
				needToScroll;

			if($('#walkthrough:visible').length === 0) {
				return;
			}

			this.showMessage();

			if(typeof step.focus == 'undefined' || !step.focus) {
				walkthroughFocus.removeClass('walkthrough-focused');
				walkthroughFocus.height(0).width(0);
				$('#walkthrough-shade-left').width(0);
				$('#walkthrough-shade-top').height(0);
			}
			else {
				focus = $(step.focus);
				if(focus.length === 0) {
					console.error('Invalid focus element selector on step ' + this.stepId);
				}
				else {
					walkthroughFocus.addClass('walkthrough-focused');
					needToScroll = focus.css('position') != 'fixed';
					if(needToScroll) {
						this.scrollToElement(focus);
					}

					focusComputedStyles = cssText(focus[0]);
					focusOffset = focus.offset();
					focusTop = focusOffset.top - window.scrollY;
					focusLeft = focusOffset.left - window.scrollX;

					shadeWidth = $('#walkthrough-shade').width();
					shadeHeight = $('#walkthrough-shade').height();
					shadeFocusLeft = focusLeft - padding;
					shadeFocusLeft = shadeFocusLeft > 0 ? shadeFocusLeft : 0;
					shadeFocusRight = focusLeft + focus.outerWidth() + padding;
					shadeFocusRight = shadeFocusRight < shadeWidth ? shadeFocusRight : shadeWidth;
					shadeFocusTop = focusTop - padding;
					shadeFocusTop = shadeFocusTop > 0 ? shadeFocusTop : 0;
					shadeFocusBottom = focusTop + focus.outerHeight() + padding;
					shadeFocusBottom = shadeFocusBottom < shadeHeight ? shadeFocusBottom : shadeHeight;
					walkthroughFocus.height(shadeFocusBottom - shadeFocusTop);
					walkthroughFocus.width(shadeFocusRight - shadeFocusLeft);
					$('#walkthrough-shade-left').width(focusLeft - padding);
					$('#walkthrough-shade-top').height(focusTop - padding);
				}
			}
		};

		/**
		 * Show the current step's message.
		 *
		 * @return {void}
		 */
		this.showMessage = function () {
			$('#walkthrough-message').html('<div id="walkthrough-message-container"></div>');
			$('#walkthrough-message-container').html('<div id="walkthrough-message-body"></div>');
			$('#walkthrough-message-body').html(this.steps[this.stepId].message);
			$('#walkthrough').removeClass('walkthrough-first-step');
			$('#walkthrough').removeClass('walkthrough-last-step');
			if(this.stepId === 0) {
				$('#walkthrough').addClass('walkthrough-first-step');
			}
			if(this.stepId == this.steps.length - 1) {
				$('#walkthrough').addClass('walkthrough-last-step');
			}

			$('#walkthrough-message-container').append('<a id="walkthrough-skip"></a>');
			$('#walkthrough-skip').click(function (event) {
				self.skip(event);
			});

			$('#walkthrough-message-container').append('<div id="walkthrough-controls"></div>');
			$('#walkthrough-controls').append('<div><div id="walkthrough-prev"></div></div>');
			$('#walkthrough-controls').append('<div><div id="walkthrough-step"></div></div>');
			$('#walkthrough-controls').append('<div><div id="walkthrough-next"></div></div>');
			$('#walkthrough-step').text((this.stepId + 1) + ' / ' + this.steps.length);

			$('#walkthrough-prev').click(function (event) {
				self.prev();
			});
			$('#walkthrough-next').click(function (event) {
				self.next();
			});
		};

		/**
		 * Scroll to an element.
		 *
		 * @param {object} $elem - The jQuery element you want to bring into view
		 *
		 * @return {void}
		 */
		this.scrollToElement = function ($elem) {
			var offset = $elem.offset(),
				scrollX = offset.left - window.innerWidth * 0.1,
				scrollY = offset.top - window.innerHeight * 0.1;

			window.scrollTo(scrollX, scrollY);

			//prevent chrome from forgetting the new scroll position
			window.setTimeout(function () {
				window.scrollTo(scrollX, scrollY);
			}, 10);
		};

		init();
		self.next();
	};
}(jQuery));