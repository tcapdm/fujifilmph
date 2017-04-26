;(function($, window, document, undefined) {


	$(function() {
	// globals
	
	var $window = $(window),
	$document = $(document),
	docHeight = $document.innerHeight(),
	winWidth = $window.innerWidth(),
	winHeight = $window.innerHeight(),
	$header = $('.header'),
	hh = $header.innerHeight(),
	imgs = document.body.getElementsByTagName('img'),
	widthOfSearch = winWidth-50,
	sgw = $('.slider-guide').innerWidth(),
	sgh = $('.slider-guide').innerHeight(),
	sliderDataHeight = $('.slider-guide').attr('data-height'),
	percent = sliderDataHeight.split("%")[0],
	sliderHeight = winWidth*percent/100,
	$allVideos = $("iframe"),
	$fluidEl = $("figure");

	var updateOnResize = debounce(function() {
		updateValueOnResize();
		updateStyleOnResize();
	}, 250);


	sliderColorText();
	updateStyleOnResize();
	searchResponsive();


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
		$('.header, .burger, .search').css('top', '-'+hh+'px');
		// $('.burger').css('top',)
	} else {
		// Scroll Up
		if(st + winHeight < docHeight) {
			$('.header').css('top', 0);
			$('.burger').css('top', 10);
			$('.search').css('top', 7);
		}
	}
	lastScrollTop = st;
}

/**
* --------------------------------------------------------------------------
* SLIDER
* --------------------------------------------------------------------------
*/



$('.home-slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	fade: true,
	asNavFor: '.home-thumbs-slider',

});

$('.home-thumbs-slider').slick({
	slidesToShow: 3,
	slidesToScroll: 1,
	asNavFor: '.home-slider',
	dots: true,
	focusOnSelect: true,
	arrows: true,
	infinite: true,
	focusOnSelect: true,
	variableWidth: true
});

if ($('.home-slider .slick-track .slick-slide.slick-current.slick-active video').length)
{
	$('.home-slider .slick-track .slick-slide.slick-current.slick-active video').get(0).play();
}
var cssLink = '<link rel="stylesheet" href="../assets/css/style.css" type="text/css">';
var iframes = $('.home-slider .slick-track .slick-slide').find('iframe');
$(iframes).each(function(i, item){
	var src = $(item).attr('src');
	$(item).attr('src', src + '?rel=0&fs=1&autoplay=1');
	var h = (winHeight * .18) + winHeight;
	var newHeight = (winHeight / $(item).width()) * $(item).height();
	// var newHeightAddedPercentage = 60 / 100;
	// newHeight = newHeight + (newHeight * newHeightAddedPercentage);
	// $(item).attr('width', winWidth + 'px').attr( 'height', newHeight + 'px');
	// $(item).css({ 'width': winWidth + 'px', height: newHeight + 'px' });
	// var youTubeURL = $(item).attr('src');
	// var youtuibe_api = "https://www.youtube.com/oembed?url="+ youTubeURL +"&rel=0&fs=1&autoplay=1&format=json";
	// var ako = $(this);
	// var json = (function() {
	//     var json = null;
	//     $.ajax({
	//         'async': false,
	//         'global': false,
	//         'url': youtuibe_api,
	//         'dataType': "json",
	//         'success': function(data) {
	//             json = data;
	//             ako.replace(data.html);

	//         }
	//     });
	//     return json;
	// })();

});
$(".home-slider").on("DOMSubtreeModified",function(){
	$(this).find('iframe').one('load', function(){
		var cssLink = document.createElement("link");
		cssLink.href = "../assets/css/style.css";  
		cssLink.rel = "stylesheet";  
		cssLink.type = "text/css";
		$(this).contents().find("head").append(cssLink);
	});
});
// $(document).on('ready', function(){
// var a = $('iframe#sliderVideo').contents().find('video');
// 		var iframeElem = $(this);
// 		var parentElem = $(this).closest('.cameraContents');
// 		var elemSibs = $(parentElem).children();
// 		var targetElem = '';
// 		$(elemSibs).each(function(index, item){
// 			if($(item).find($(iframeElem)).length)
// 			{
// 				targetElem = $('div.camera_src.camerastarted').children().get(index);
// 				$(targetElem).attr('data-time',$(a).get(0).duration);
// 			}
// 		});
// });
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
	getImageBrightness($(".home-slider .slick-active img, .home-slider .slick-active video").attr('src'),function(brightness) {
		if (brightness <= 135){
			$('.home-slider-txt h2, .header-nav ul li a').css('color','#f7f7f7');
			$('.header-logo a img').attr('src','images/logo-white.png');
		} else {
			$('.home-slider-txt h2, .header-nav ul li a').css('color','#242424');
			$('.header-logo a img').attr('src','images/logo-dark.png');
		}
	});
}


/**
* --------------------------------------------------------------------------
* DYNAMIC CHANGE OF COLOR ON SLIDER
* --------------------------------------------------------------------------
*/
function searchResponsive() {

	if(winWidth <= 1110){
		$('input[type=search]').css('width',0);
		$('input[type=search]').focusin(function(){
			$('.shadow').fadeIn();
			$(this).css('width',widthOfSearch);
			$('.burger').css('z-index','-1');
			$('input[type=search]').siblings().toggleClass('fa-search fa-close');
			$('input[type=search]').siblings().css('z-index','9');
			
		});
		$('input[type=search]').focusout(function(){
			$(this).css('width',0);
			$('.burger').css('z-index','2');
			$('.shadow').fadeOut();
			$('input[type=search]').siblings().toggleClass('fa-close fa-search');
			$('input[type=search]').siblings().css('z-index','-1');
		});
	} else {
		$('input[type=search]').css('width',150);
		$('input[type=search]').focusin(function(){
			$(this).css('width',200);
		});
		$('input[type=search]').focusout(function(){
			$(this).css('width',150);
		});
	}
}

searchResponsive();


/**
* --------------------------------------------------------------------------
* RESPONSIVE MENU
* --------------------------------------------------------------------------
*/

var mobileNav = function(){
	$('.burger').on('click', function(){
		$('.shadow').fadeIn();
		$('.header-nav').css('left',0);
		$('.search').css('z-index','-1');
		$('body').animate({'left':200},400);
	});
	$('.shadow').on('click',function(){
		$('.shadow').fadeOut();
		$('.header-nav').css('left',-200);
		$('body').animate({'left':0},400);
		$('.search').css('z-index','7');
	});
}();

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
	widthOfSearch = winWidth-80;
	sgw = $('.slider-guide').innerWidth();
	sgh = $('.slider-guide').innerHeight();
	sliderDataHeight = $('.slider-guide').attr('data-height');
	percent = sliderDataHeight.split("%")[0];
	sliderHeight = winWidth*percent/100;
}

function updateStyleOnResize() {
	$('.nav-up').css('top', '-'+hh);
	searchResponsive();
	$('.home-slider .slick-track').css('height',sliderHeight);
	resiveIframe();
}

resiveIframe();

function resiveIframe() {
	$allVideos.each(function() {
		$(this).removeAttr('style');
	});
	$('.home-slider .slick-track iframe').each(function(index ,item){
		$(item).css({'width':sgw , 'height':sgh});
	});
	console.log($allVideos)
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
$('.home-slider .slick-track').css('height',sliderHeight);


/**
* --------------------------------------------------------------------------
* FEATURED PRODUCTS
* --------------------------------------------------------------------------
*/

$('.feat-prod-a').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: true,
	dots: true,
	fade: true,
	asNavFor: '.feat-prod-b',
	prevArrow: $('.feat-prod-left-arw'),
	appendDots:$('.feat-prod-dots'),
	nextArrow: $('.feat-prod-right-arw')
});

$('.feat-prod-b').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	adaptiveHeight: true,
	asNavFor: '.feat-prod-a'
});


/**
* --------------------------------------------------------------------------
* FOOTER SUBMIT BUTTON
* --------------------------------------------------------------------------
*/

$('.footer-subscribe-icon').on('click', function(){
	$('.footer-subscribe-submit').trigger('click');
});

});

// $('.sliderVideo').addClassName('withborder');

})(jQuery, window, document);
