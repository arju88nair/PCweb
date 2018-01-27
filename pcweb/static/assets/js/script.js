$(function () {
    'use strict';
    // --------------------------------------------------------------------
    // PreLoader
    // --------------------------------------------------------------------
    (function () {
        $('#preloader').delay(200).fadeOut('slow');
    }());
    // --------------------------------------------------------------------
    // One Page Navigation
    // --------------------------------------------------------------------
    (function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() >= 50) {
                $('nav.navbar').addClass('sticky-nav');
            }
            else {
                $('nav.navbar').removeClass('sticky-nav');
            }
        });
    }());
    // --------------------------------------------------------------------
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    // --------------------------------------------------------------------
    (function () {
        $('a.page-scroll').on('click', function (e) {
            e.preventDefault();
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
        });
    }());
    // -------------------------------------------------------------
    // mobile menu
    // -------------------------------------------------------------
    (function () {
        $('button.navbar-toggle').ucOffCanvasMenu({
            documentWrapper: '#main-wrapper'
            , contentWrapper: '.content-wrapper'
            , position: 'uc-offcanvas-left', // class name
            // opener         : 'st-menu-open',            // class name
            effect: 'slide-along', // class name
            closeButton: '#uc-mobile-menu-close-btn'
            , menuWrapper: '.uc-mobile-menu', // class name below-pusher
            documentPusher: '.uc-mobile-menu-pusher'
        });
    }());
    // -------------------------------------------------------------
    // top scrolling
    // -------------------------------------------------------------
    (function () {
        var offset = 220;
        var duration = 500;
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > offset) {
                jQuery('.crunchify-top').fadeIn(duration);
            }
            else {
                jQuery('.crunchify-top').fadeOut(duration);
            }
        });
        jQuery('.crunchify-top').click(function (event) {
            event.preventDefault();
            jQuery('html, body').animate({
                scrollTop: 0
            }, duration);
            return false;
        });
    }());
    // --------------------------------------------------------------------
    // Search
    // --------------------------------------------------------------------
    $("#search-button, #search-icon").click(function (e) {
        e.preventDefault();
        $("#search-button, #search-form").toggle();
    });
    // --------------------------------------------------------------------
    // Carousel slider for blog page
    // --------------------------------------------------------------------
    $("#feature-news-carousel").owlCarousel({
        loop: true
        , dots: false
        , items: 1
        , autoplay: true
        , singleItem: true
        // "singleItem:true" is a shortcut for:
        // items : 1,
        // itemsDesktop : false,
        // itemsDesktopSmall : false,
        // itemsTablet: false,
        // itemsMobile : false
    });
});
// JQuery end
$(document).on('click', '.m-menu .dropdown-menu', function (e) {
    e.stopPropagation()
})

$(document).ready(function () {
    $("#id_2").removeClass("tag_lg purple")
    $("#id_2").addClass("tag_lg blue")
    $("#sideBa_2").removeClass("feature_static_wrapper")
    $("#sideBa_2").addClass("feature_static_last_wrapper")
})


$(document).ready(function () {
    $('a').attr('target','_blank');
    // Add scrollspy to <body>
    $('body').scrollspy({target: ".navbar", offset: 50});

    $("#menuHeader a").on('click', function (event) {
        if (location.pathname == "/") {
            if (this.hash !== "") {

                // Prevent default anchor click behavior
                event.preventDefault();
                // Store hash
                var hash = this.hash;

                // $("#menuHeader li").removeClass("active");

                // $($(this).parent()).addClass('active');
                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 150
                }, 800);
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
//
            }  // End if
        }
        else {
            window.location.href = "/" + this.hash
        }
        // Make sure this.hash has a value before overriding default behavior

    });

});


