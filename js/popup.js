
/*
	Popup
	https://github.com/vinsproduction/popup
 */
var Popup, popup;

if (!window.console) {
  window.console = {};
}

if (!window.console.log) {
  window.console.log = function() {};
}

if (!window.console.warn) {
  window.console.warn = window.console.log;
}

Popup = (function() {
  Popup.prototype.logs = true;

  Popup.prototype.popups = {};

  Popup.prototype.active = false;

  Popup.prototype.options = {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    close: true,
    fade: 300,
    buttonClick: false,
    title: "",
    body: "",
    button: "Закрыть"
  };

  Popup.prototype.selectors = {
    popups: '#popups',
    popup: '[data-popup-name]',
    close: '[data-popup-close]',
    button: '[data-popup-button]',
    custom: {
      title: '[data-popup-title]',
      body: '[data-popup-body]',
      button: '[data-popup-button-name]'
    }
  };

  Popup.prototype.classes = {
    inner: 'inner',
    closeDisabled: 'popup-close-disabled',
    popupOpen: 'popup-open',
    mobile: 'popup-mobile'
  };

  Popup.prototype.mobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  function Popup() {
    var self;
    self = this;
    $(function() {
      self.$popups = $(self.selectors.popups);
      self.$popup = self.$popups.find(self.selectors.popup);
      self.$close = self.$popups.find(self.selectors.close);
      if (self.mobileBrowser) {
        self.$popups.addClass(self.classes.mobile);
      }
      self.$popup.each(function() {
        var el, name;
        el = $(this);
        name = el.attr('data-popup-name');
        if (!el.find('.' + self.classes.inner).size()) {
          $(this).wrapInner("<div class='" + self.classes.inner + "'></div>");
        }
        self.popups[name] = {
          name: name,
          el: el,
          inner: el.find('.' + self.classes.inner)
        };
        el.find(self.selectors.button).click(function() {
          if (self.active) {
            if (self.popups[self.active].opt.buttonClick) {
              self.popups[self.active].opt.buttonClick();
            } else {
              if (self.popups[self.active].opt.close) {
                self.close();
              }
            }
          }
          return false;
        });
      });
      self.$popups.find(self.selectors.close).click(function() {
        if (self.active && self.popups[self.active].opt.close) {
          self.close(self.active);
        }
        return false;
      });
      self.$popups.click(function(event) {
        if (self.active && self.popups[self.active].opt.close) {
          if (!$(event.target).closest(self.popups[self.active].inner).length && !$(event.target).is(self.popups[self.active].inner)) {
            self.close(self.active);
          }
        }
        return false;
      });
      $(window).resize(function() {
        if (self.active) {
          return self.position(self.popups[self.active]);
        }
      });
      if (self.logs) {
        console.log('[Popup] init', self.popups);
      }
    });
    return;
  }

  Popup.prototype.position = function(popup) {
    var css, el, inner, left, name, opt, popupHeight, popupWidth, self, top, windowHeight, windowScroll, windowWidth;
    self = this;
    name = popup.name;
    el = popup.el;
    opt = popup.opt;
    inner = popup.inner;
    windowWidth = window.innerWidth != null ? innerWidth : $(window).width();
    windowHeight = window.innerHeight != null ? innerHeight : $(window).height();
    popupHeight = inner.outerHeight();
    popupWidth = inner.outerWidth();
    windowScroll = $(window).scrollTop();
    top = windowHeight / 2 - popupHeight / 2 + windowScroll;
    if (top < 0) {
      top = 0;
    }
    left = windowWidth / 2 - popupWidth / 2;
    if (left < 0) {
      left = 0;
    }
    css = {};
    if (opt.bottom !== 'auto') {
      css.bottom = opt.bottom;
    } else {
      if (opt.top !== 'auto') {
        css.top = opt.top;
      } else {
        css.top = top;
      }
    }
    if (opt.right !== 'auto') {
      css.right = opt.right;
    } else {
      if (opt.left !== 'auto') {
        css.left = opt.left;
      } else {
        css.left = left;
      }
    }
    if (popupWidth > windowWidth) {
      css.width = windowWidth;
    }
    inner.css(css);
    el.css({
      height: popupHeight > windowHeight ? popupHeight : windowHeight,
      width: windowWidth
    });
  };

  Popup.prototype.open = function(name, opt) {
    var self;
    if (opt == null) {
      opt = {};
    }
    self = this;
    $(function() {
      if (!name || !self.popups[name]) {
        return false;
      }
      if (self.active) {
        self.close();
      }
      self.popups[name].opt = $.extend(true, {}, self.options, opt);
      return setTimeout(function() {
        self.active = name;
        self.popups[name].el.find(self.selectors.custom.title).html(self.popups[name].opt.title);
        self.popups[name].el.find(self.selectors.custom.body).html(self.popups[name].opt.body);
        self.popups[name].el.find(self.selectors.custom.button).html(self.popups[name].opt.button);
        self.popups[name].el.show();
        self.$popups.stop().fadeIn(self.popups[name].opt.fade);
        self.popups[name].el.addClass(self.classes.popupOpen);
        if (!self.popups[name].opt.close) {
          self.popups[name].el.addClass(self.classes.closeDisabled);
        }
        $('body').addClass(self.classes.popupOpen);
        self.position(self.popups[name]);
        if (self.logs) {
          console.log('[Popup] open', self.popups[name]);
        }
        self.$popup.eq(0).trigger('open', [self.popups[name]]);
      }, 0);
    });
  };

  Popup.prototype.close = function() {
    var self;
    self = this;
    $(function() {
      var name;
      if (self.active) {
        name = self.active;
        self.$popups.stop().hide();
        self.popups[name].el.hide();
        self.popups[name].el.removeClass(self.classes.popupOpen);
        self.popups[name].el.removeClass(self.classes.closeDisabled);
        $('body').removeClass(self.classes.popupOpen);
        if (self.logs) {
          console.log('[Popup] close', self.popups[name]);
        }
        self.$popup.eq(0).trigger('close', [self.popups[name]]);
      } else {
        self.$popup.hide();
        self.$popups.hide();
        self.$popup.removeClass(self.classes.closeDisabled);
        self.$popup.removeClass(self.classes.popupOpen);
        self.$popups.removeClass(self.classes.popupOpen);
        $('body').removeClass(self.classes.popupOpen);
      }
      self.active = false;
    });
  };

  return Popup;

})();

popup = new Popup;
