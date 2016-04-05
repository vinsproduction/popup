var Popup, popup;

if (!window.console) {
  window.console = {};
}

if (!window.console.log) {
  window.console.log = function() {};
}

Popup = (function() {
  Popup.prototype.logs = true;

  Popup.prototype.popups = {};

  Popup.prototype.active = false;

  Popup.prototype.selectors = {
    popups: '#popups',
    popup: '[data-popup-name]',
    inner: '.inner',
    close: '[data-popup-close]',
    button: '[data-popup-button]',
    custom: {
      title: '[data-popup-title]',
      body: '[data-popup-body]'
    }
  };

  Popup.prototype.classes = {
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
        var name;
        name = $(this).attr('data-popup-name');
        self.popups[name] = {
          name: name,
          el: $(this),
          inner: $(this).find(self.selectors.inner),
          opt: {
            close: true,
            fade: 300,
            button: false
          }
        };
        return $(this).find(self.selectors.button).click(function() {
          if (self.active && self.popups[self.active].opt.button) {
            self.popups[self.active].opt.button();
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
    css = {
      'top': 'auto',
      'left': 'auto',
      'right': 'auto',
      'bottom': 'auto'
    };
    inner.css(css);
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
    if (opt.bottom != null) {
      css.bottom = opt.bottom;
    } else {
      if (opt.top != null) {
        css.top = opt.top;
      } else {
        css.top = top;
      }
    }
    if (opt.right != null) {
      css.right = opt.right;
    } else {
      if (opt.left != null) {
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
    self = this;
    $(function() {
      if (!name || !self.popups[name]) {
        return false;
      }
      if (self.active) {
        self.close();
      }
      $.each(opt, function(k, v) {
        self.popups[name].opt[k] = v;
      });
      return setTimeout(function() {
        self.active = name;
        if (self.popups[name].opt.title) {
          self.popups[name].el.find(self.selectors.custom.title).empty();
          self.popups[name].el.find(self.selectors.custom.title).html(self.popups[name].opt.title);
        }
        if (self.popups[name].opt.body) {
          self.popups[name].el.find(self.selectors.custom.body).empty();
          self.popups[name].el.find(self.selectors.custom.body).html(self.popups[name].opt.body);
        }
        self.popups[name].el.show();
        self.$popups.stop().fadeIn(self.popups[name].opt.fade);
        self.popups[name].el.addClass(self.classes.popupOpen);
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
        self.popups[name].el.removeClass(self.classes.popupOpen);
        self.$popups.fadeOut(self.popups[name].opt.fade, function() {
          self.popups[name].el.hide();
          return $('body').removeClass(self.classes.popupOpen);
        });
        if (self.logs) {
          console.log('[Popup] close', self.popups[name]);
        }
        self.$popup.eq(0).trigger('close', [self.popups[name]]);
      } else {
        self.$popups.removeClass(self.classes.popupOpen);
        self.$popup.hide();
        self.$popups.hide();
        $('body').removeClass(self.classes.popupOpen);
      }
      self.active = false;
    });
  };

  return Popup;

})();

popup = new Popup;
