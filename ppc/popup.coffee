###
	Popup
	https://github.com/vinsproduction/popup
###


if !window.console
	window.console = {}

if !window.console.log
	window.console.log = ->

if !window.console.warn
	window.console.warn = window.console.log

class Popup

	logs: true

	popups: {}

	active: false

	options:
		top: 'auto'
		left: 'auto'
		right: 'auto'
		bottom: 'auto'
		close: true
		fade: 300
		buttonClick: false
		title: ""
		body: ""
		button: "Закрыть"


	selectors:

		popups: '#popups'
		popup: '[data-popup-name]'
		close: '[data-popup-close]'
		button: '[data-popup-button]'

		custom:
			title: 	'[data-popup-title]'
			body: 	'[data-popup-body]'
			button: '[data-popup-button-name]'

	classes:
		inner: 'inner'
		closeDisabled: 'popup-close-disabled'
		popupOpen: 'popup-open'
		mobile: 'popup-mobile'

	mobileBrowser: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

	constructor: ->

		self = @

		$ ->

			self.$popups 			= $(self.selectors.popups)
			self.$popup 			= self.$popups.find(self.selectors.popup)
			self.$close 			= self.$popups.find(self.selectors.close)

			if self.mobileBrowser
				self.$popups.addClass self.classes.mobile

			self.$popup.each  ->

				el = $(@)

				name 	= el.attr('data-popup-name')

				if !el.find('.' + self.classes.inner).size()
					$(@).wrapInner("<div class='#{self.classes.inner}'></div>")

				self.popups[name] =
					name: name
					el: el
					inner: el.find('.' + self.classes.inner)

				el.find(self.selectors.button).click ->
					if self.active
						if self.popups[self.active].opt.buttonClick
							self.popups[self.active].opt.buttonClick()
						else
							self.close() if self.popups[self.active].opt.close
					return false

				return

			self.$popups.find(self.selectors.close).click ->
				if self.active and self.popups[self.active].opt.close
					self.close(self.active)
				return false

			self.$popups.click (event) ->
				if self.active and self.popups[self.active].opt.close
					if !$(event.target).closest(self.popups[self.active].inner).length and !$(event.target).is(self.popups[self.active].inner)
						self.close(self.active)
				return

			# $(window).scroll ->
			# 	self.position(self.popups[self.active]) if self.active

			$(window).resize ->
				self.position(self.popups[self.active]) if self.active
		
			console.log('[Popup] init', self.popups) if self.logs

			return

		return

	position:  (popup) ->

		self = @

		name 	= popup.name
		el 		= popup.el
		opt 	= popup.opt
		inner = popup.inner

		windowWidth 	= if window.innerWidth? then innerWidth else $(window).width()
		windowHeight 	= if window.innerHeight? then innerHeight else $(window).height()
		popupHeight 	= inner.outerHeight()
		popupWidth 		= inner.outerWidth()
		windowScroll 	= $(window).scrollTop()

		top = windowHeight / 2 - popupHeight / 2 + windowScroll
		top = 0 if top < 0
		left = windowWidth / 2 - popupWidth / 2
		left = 0 if left < 0

		css = {}

		if opt.bottom isnt 'auto'
			css.bottom = opt.bottom	
		else
			if opt.top isnt 'auto'
				css.top = opt.top
			else
				css.top = top

		if opt.right isnt 'auto'
			css.right = opt.right
		else
			if opt.left isnt 'auto'
				css.left = opt.left
			else
				css.left = left

		if popupWidth > windowWidth
			css.width = windowWidth

		inner.css(css)

		el.css
			height: if popupHeight > windowHeight then popupHeight else windowHeight
			width: windowWidth

		return

	open: (name,opt={}) ->

		self = @

		$ ->

			return false if !name or !self.popups[name]

			self.close() if self.active

			self.popups[name].opt = $.extend(true,{},self.options,opt)

			setTimeout(->

				self.active = name

				self.popups[name].el.find(self.selectors.custom.title).html(self.popups[name].opt.title)
				self.popups[name].el.find(self.selectors.custom.body).html(self.popups[name].opt.body)
				self.popups[name].el.find(self.selectors.custom.button).html(self.popups[name].opt.button)

				self.popups[name].el.show()
				self.$popups.stop().fadeIn(self.popups[name].opt.fade)

				self.popups[name].el.addClass(self.classes.popupOpen)
				self.popups[name].el.addClass(self.classes.closeDisabled) if !self.popups[name].opt.close
				$('body').addClass(self.classes.popupOpen)

				self.position(self.popups[name])

				console.log('[Popup] open', self.popups[name]) if self.logs

				self.$popup.eq(0).trigger('open',[self.popups[name]])

				return

			,0)

		return

	close: ->

		self = @

		$ ->

			if self.active

				name = self.active

				self.$popups.stop().hide()
				self.popups[name].el.hide()

				self.popups[name].el.removeClass(self.classes.popupOpen)
				self.popups[name].el.removeClass(self.classes.closeDisabled)
				$('body').removeClass(self.classes.popupOpen)

				console.log('[Popup] close', self.popups[name]) if self.logs

				self.$popup.eq(0).trigger('close',[self.popups[name]])

			else

				
				self.$popup.hide()
				self.$popups.hide()
				self.$popup.removeClass(self.classes.closeDisabled)
				self.$popup.removeClass(self.classes.popupOpen)
				self.$popups.removeClass(self.classes.popupOpen)
				$('body').removeClass(self.classes.popupOpen)


			self.active = false

			return

		return


popup = new Popup