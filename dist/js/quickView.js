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
                $(this.options.selectors.quickViewModal).toggleClass(this.options.classNames.active.join(' '));
                this._animateQuickView( $currentProduct );
            }.bind(this));

        },
        _closeModal: function() {
            $(this.options.selectors.quickViewModal).removeClass(this.options.classNames.active.join(' '));
        },
        _animateQuickView: function( $currentProduct ) {
            console.log( 'test' );
        }
    } 

    $.fn.quickView = function( element, options ) {
        return this.each(function() {
            new QuickView(this, $.extend({}, QuickView.defaultOptions, options));
        });
    }; 

})( jQuery );






