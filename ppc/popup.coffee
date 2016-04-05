
if !window.console
	window.console = {}

if !window.console.log
	window.console.log = ->


class Popup

	logs: true

	popups: {}

	active: false

	selectors:

		popups: '#popups'
		popup: '[data-popup-name]'
		inner: '.inner'
		close: '[data-popup-close]'
		button: '[data-popup-button]'

		custom:
			title: 	'[data-popup-title]'
			body: 	'[data-popup-body]'

	classes:
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

				name = $(@).attr('data-popup-name')

				self.popups[name] =
					name: name
					el: $(@)
					inner: $(@).find(self.selectors.inner)
					opt:
						close: true
						fade: 300
						button: false

				$(@).find(self.selectors.button).click ->
					if self.active and self.popups[self.active].opt.button
						self.popups[self.active].opt.button()
					return false


			self.$popups.find(self.selectors.close).click ->
				if self.active and self.popups[self.active].opt.close
					self.close(self.active)
				return false

			self.$popups.click (event) ->
				if self.active and self.popups[self.active].opt.close
					if !$(event.target).closest(self.popups[self.active].inner).length and !$(event.target).is(self.popups[self.active].inner)
						self.close(self.active)
				return false

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

		css =
			'top': 'auto'
			'left': 'auto'
			'right': 'auto'
			'bottom': 'auto'

		inner.css(css)

		windowWidth 	= if window.innerWidth? then innerWidth else $(window).width()
		windowHeight 	= if window.innerHeight? then innerHeight else $(window).height()
		popupHeight 	= inner.outerHeight()
		popupWidth 		= inner.outerWidth()
		windowScroll 	= $(window).scrollTop()

		top = windowHeight / 2 - popupHeight / 2 + windowScroll
		top = 0 if top < 0
		left = windowWidth / 2 - popupWidth / 2
		left = 0 if left < 0

		if opt.bottom?
			css.bottom = opt.bottom	
		else
			if opt.top?
				css.top = opt.top
			else
				css.top = top

		if opt.right?
			css.right = opt.right
		else
			if opt.left?
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

	open: (name,opt) ->

		self = @

		$ ->

			return false if !name or !self.popups[name]

			self.close() if self.active
			
			$.each opt, (k,v) ->
				self.popups[name].opt[k] = v
				return

			setTimeout(->

				self.active = name

				if self.popups[name].opt.title
					self.popups[name].el.find(self.selectors.custom.title).empty()
					self.popups[name].el.find(self.selectors.custom.title).html(self.popups[name].opt.title)

				if self.popups[name].opt.body
					self.popups[name].el.find(self.selectors.custom.body).empty()
					self.popups[name].el.find(self.selectors.custom.body).html(self.popups[name].opt.body)

				self.popups[name].el.show()
				self.$popups.stop().fadeIn(self.popups[name].opt.fade)

				self.popups[name].el.addClass(self.classes.popupOpen)
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

				self.popups[name].el.removeClass(self.classes.popupOpen)

				self.$popups.fadeOut self.popups[name].opt.fade, ->

					self.popups[name].el.hide()
					$('body').removeClass(self.classes.popupOpen)

				console.log('[Popup] close', self.popups[name]) if self.logs

				self.$popup.eq(0).trigger('close',[self.popups[name]])

			else

				self.$popups.removeClass(self.classes.popupOpen)
				self.$popup.hide()
				self.$popups.hide()
				$('body').removeClass(self.classes.popupOpen)

			self.active = false

			return

		return



popup = new Popup