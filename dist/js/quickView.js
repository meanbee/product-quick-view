'use strict';

(function( $ ) {

    // Constractor
    var QuickView = function( element, options ) {
        this.$element = $(element);
        this.element = element;
        this.options = options;
        this.$canvas = $(this.options.selectors.quickViewCanvas);
        this._init();
        this._stop();
    }

    QuickView.defaultOptions = {
        selectors: {
            quickViewModal: '.js-quick-view-modal',
            quickViewItem: '.quick-view-item',
            quickViewClose: '.js-quick-view-close',
            quickViewOverlay: '.js-quick-view-overlay',
            quickViewCanvas: '.quick-view-canvas'
        },
        classNames: {
            active: ['is-active']
        }
    };
    
    QuickView.prototype = {
        _init: function() {
            this.$element.on('click', '.js-quick-view-trigger', this._triggerHandler.bind(this));
        },
        _stop: function () {
            $(this.options.selectors.quickViewClose).on('click', this._closeHandler.bind(this));
            $(this.options.selectors.quickViewOverlay).on('click', this._overlayHandler.bind(this));
        },
        _triggerHandler: function(event) {
            this._openModal();      
        },
        _overlayHandler: function(event) {
            this._closeModal();      
        },
        _closeHandler: function(event) {
            this._closeModal();      
        },
        _openModal: function() {
            var $currentProduct = $(event.target).closest(this.options.selectors.quickViewItem),
                $productId = $currentProduct.attr('data-product-id'),
                $productUrl = 'dist/product-data/'+$productId+'.json';

            $.ajax( $productUrl ).done(function(response) {
                $('.quick-view-canvas-inner').html(response.data);
                this._resetModal();
                $(this.options.selectors.quickViewModal).toggleClass(this.options.classNames.active.join(' '));

                this._animateQuickView( $currentProduct );
            }.bind(this));

        },
        _closeModal: function() {
            $(this.options.selectors.quickViewModal).removeClass(this.options.classNames.active.join(' '));
        },
        _animateQuickView: function( $currentProduct ) {
            var position = $currentProduct.position(),
                leftStart = position.left,
                topStart = position.top,

                centerX = $( window ).width() / 2,
                centerY = $( window ).height() / 2,

                canvasWidth = this.$canvas.width() / 2,
                canvasHeight = this.$canvas.height() / 2,

                leftFinal = centerX - canvasWidth,
                topFinal = centerY - canvasHeight;

            console.log(centerX);

            function quickViewAnimation() {
                var leftTest = (leftStart + canvasWidth) < centerX,
                    topTest = (topStart + canvasHeight) < centerY;

                if(leftTest) {
                    leftStart += 1; 
                } else {
                    leftStart -= 1;
                }

                if(topTest) {
                    topStart += 1;
                } else {
                    topStart -= 1;
                }

                this.$canvas.css({
                    'position': 'absolute',
                    'left': leftStart + 'px',
                    'top': topStart + 'px'
                });

                if(leftTest) {
                    if ((leftStart < leftFinal)) {
                        window.requestAnimationFrame(quickViewAnimation.bind(this));
                    }
                }

                if(!leftTest) {
                    if ((leftStart > leftFinal)) {
                        window.requestAnimationFrame(quickViewAnimation.bind(this));
                    }
                }

                if(topTest) {
                    if ((topStart < topFinal)) {
                        window.requestAnimationFrame(quickViewAnimation.bind(this));
                    }
                }

                if(!topTest) {
                    if ((topStart > topFinal)) {
                        window.requestAnimationFrame(quickViewAnimation.bind(this));
                    }
                }
            }

            window.requestAnimationFrame(quickViewAnimation.bind(this));
        },
        _resetModal: function() {
            this.$canvas.removeAttr("style");
        }
    } 

    $.fn.quickView = function( element, options ) {
        return this.each(function() {
            new QuickView(this, $.extend({}, QuickView.defaultOptions, options));
        });
    }; 

})( jQuery );






