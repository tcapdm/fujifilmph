;(function($, window, document, undefined) {


$(function() {
	// globals
	
	var $window = $(window),
		$document = $(document),
		docHeight = $document.innerHeight(),
		winWidth = $window.innerWidth(),
		winHeight = $window.innerHeight(),
		$header = $('header'),
		hh = $header.innerHeight(),
		imgs = document.body.getElementsByTagName('img');

	var updateOnResize = debounce(function() {
		updateValueOnResize();
		updateStyleOnResize();
		menuTransfer();
		breadcrumbsResponsive();
	}, 250);


updateStyleOnResize();


/**
* --------------------------------------------------------------------------
* HIDE HEADER ON ON SCROLL DOWN
* --------------------------------------------------------------------------
*/

var didScroll;
var lastScrollTop = 0;
var delta = 0;

setInterval(function() {
	if (didScroll) {
		hasScrolled();
		didScroll = false;
	}
});

function hasScrolled() {
	var st = $(this).scrollTop();
	if(Math.abs(lastScrollTop - st) <= delta)
		return;
	
	// If they scrolled down and are past the navbar, add class .nav-up.
	// This is necessary so you never see what is "behind" the navbar.
	if (st > lastScrollTop && st > hh){
		// Scroll Down
		$('header').removeClass('nav-down').addClass('nav-up');
		$('.nav-up').css('top', '-'+hh+'px');
	} else {
		// Scroll Up
		if(st + winHeight < docHeight) {
			$('header').removeClass('nav-up').addClass('nav-down');
			$('.nav-down').css('top', 0);
		}
	}
	lastScrollTop = st;
}

/**
* --------------------------------------------------------------------------
* SLIDER
* --------------------------------------------------------------------------
*/

$('#homeSlider').camera({
	height: '40%',
	fx:'simpleFade',
	pagination: true,
	navigation:true,
	opacityOnGrid: false,
	time: 3000, //tagal ng pagstay ng image
	transPeriod: 1000, //animation ng pagpalit ng image
	imagePath: 'assets/vendor/camera/images/',
	hover: false,
	loader: 'bar',
	thumbnails: true
});

$(".cameraContent").on("DOMSubtreeModified",function(){
	$(this).find('iframe').one('load', function(){
		var cssLink = document.createElement("link");
		cssLink.href = "../assets/css/style.css";  
		cssLink.rel = "stylesheet";  
		cssLink.type = "text/css";
		$(this).contents().find("head").append(cssLink);
	});
});


/**
* --------------------------------------------------------------------------
* SEARCH
* --------------------------------------------------------------------------
*/

var searchForm = function(){
	$('.search').on('click', function(e){
		e.preventDefault();
		$('.search-form, .shadow').toggleClass('open');
		$(".search-form input").val("");
	});
	$('.shadow, .seach-close, .search-close').on('click', function(){
		$('.shadow, .seach-close, .search-form').removeClass('open')
	});
	$('.search-form').on('submit', function(e) {
		e.preventDefault();
		if(!$('.search-tag-list a').length > 0) {
			var text = $(this).serializeArray()[0].value.split(' ');
			$('.search-tag-container').fadeIn();
			for (var i = 0; i < text.length; i++) {
				console.log(text[i]);
				if(text[i] != 0) {
					$('.search-tag-container .search-tag-list').append("<li><a href='#'>" + text[i] + "<i class='fa fa-times'></i></a></li>");
				}
			}

			$('.search-tag-list a').click(function(e) {
				e.preventDefault();
				console.log();
				if($('.search-tag-list li').length != 1) {
					$(this).parent('li').remove();
				} else {
					$('#search-keywords').val('');
					$(this).parent('li').remove();
					$('.search-tag-container').fadeOut();
				}
			});
		}
	});
}();

/**
* --------------------------------------------------------------------------
* DYNAMIC CHANGE OF COLOR ON SLIDER
* --------------------------------------------------------------------------
*/

$('.home-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
	sliderColorText();
});


function sliderColorText(){
	var brightness = 0;
	$(".home-slider .slick-active img, .home-slider .slick-active video").each(function(){
		getImageBrightness($(this).attr('src'),function(brightness) {
            // document.getElementsByTagName('pre')[0].innerHTML = "Brightness: "+brightness;
            console.log(brightness);
            if (brightness <= 135){
				$('.home-slider-txt').css('color','#f7f7f7');
			} else {
				$('.home-slider-txt').css('color','#242424');
			}
        });
	});
}


/**
* --------------------------------------------------------------------------
* GOOGLE MAP
* --------------------------------------------------------------------------
*/

// google.maps.event.addDomListener(window, 'load', init);
// function init() {
// 	var mapOptions = {
// 		zoom: 15,
// 		center: new google.maps.LatLng(14.5839664, 121.0633393),
// 		styles: [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"-3"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#748ca3"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ff000a"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":"23"},{"lightness":"20"},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#ffdbda"},{"saturation":"0"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":"100"},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#f39247"},{"saturation":"0"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#008eff"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#ffe5e5"},{"saturation":"0"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}]
// 	};
// 	mapOptions = $.extend({
// 		scrollwheel: false,
// 		mapTypeId: google.maps.MapTypeId.ROADMAP
// 	}, mapOptions);
// 	var mapElement = document.getElementById('map');
// 	var map = new google.maps.Map(mapElement, mapOptions);
// 	var marker = new google.maps.Marker({
// 		position: new google.maps.LatLng(14.5839664, 121.0633393),
// 		map: map,
// 		title: 'Transcosmos'
// 	});
// }



/**
* --------------------------------------------------------------------------
* EVENTS
* --------------------------------------------------------------------------
*/

$(window).resize(function(){
	updateOnResize();
});

$(window).scroll(function(event){
	didScroll = true;
});

/**
* --------------------------------------------------------------------------
* FUNCTIONS
* --------------------------------------------------------------------------
*/

function updateValueOnResize() {
	winWidth = $window.innerWidth();
	winHeight = $window.innerHeight();
	hh = $header.innerHeight();
	docHeight = $document.innerHeight();
}

function updateStyleOnResize() {

	//hide header on on scroll down
	$('.nav-up').css('top', '-'+hh);

	// height of slider
	$('.home-slider-wrap, .home-slider').css({
		'height': winHeight * 0.85
	});
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function getImageBrightness(imageSrc,callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

          for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*this.height));
        callback(brightness);
    }
}

});

// $('.sliderVideo').addClassName('withborder');

})(jQuery, window, document);