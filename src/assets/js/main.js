(function($){
	"use strict";
	/* -------------------------------------
			CUSTOM FUNCTION WRITE HERE
	-------------------------------------- */
	$(document).ready(function() {
		/* -------------------------------------
				SVG INJECTOR
		-------------------------------------- */
		if ($(".tg-svginject").length) {
			$(".tg-svginject").svgInject();
		}
		/* -------------------------------------
				FIXED HEADER
		-------------------------------------- */
		$(window).on('scroll', function(){
			var scrollAmount = $(window).scrollTop();
			if(scrollAmount > 180){
				$("body").addClass('tg-fixednav');
			}else{
				$("body").removeClass('tg-fixednav');
			}
		});
		/* -------------------------------------
				COLLAPSE MENU SMALL DEVICES
		-------------------------------------- */
		function collapseMenu(){
			$('.tg-navigation ul li.tg-hasdropdown, .tg-navigation ul li.menu-item-has-mega-menu').prepend('<span class="tg-dropdowarrow"><i class="fa fa-angle-down"></i></span>');
			$('.tg-navigation ul li.tg-hasdropdown span, .tg-navigation ul li.menu-item-has-mega-menu span').on('click', function() {
				$(this).next().next().slideToggle(300);
			});
		}
		collapseMenu();
		/* -------------------------------------
				MEGA MENU
		-------------------------------------- */
		jQuery(function ($) {
			function hoverIn() {
				var a = jQuery(this);
				var nav = a.closest('.tg-navigation');
				var mega = a.find('.mega-menu');
				var offset = rightSide(nav) - leftSide(a);
				mega.width(Math.min(rightSide(nav), columns(mega)*292));
				mega.css('left', Math.min(0, offset - mega.width()));
			}
			function hoverOut() {}
			function columns(mega) {
				var columns = 0;
				mega.children('.mega-menu-row').each(function () {
					columns = Math.max(columns, jQuery(this).children('.mega-menu-col').length);
				});
				return columns;
			}
			function leftSide(elem) {
				return elem.offset().left;
			}
			function rightSide(elem) {
				return elem.offset().left + elem.width();
			}
			jQuery('.tg-nav .menu-item-has-mega-menu').hover(hoverIn, hoverOut);
		});
		/* -------------------------------------
				Google Map
		-------------------------------------- 
		$("#tg-location-map").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});
		$("#tg-footerlocation-map").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});
		$("#tg-companylocationmap").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});
		$("#tg-locationmap").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});
		$(".tg-addressmap").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});
		$(".tg-joblocationmap").gmap3({
			marker: {
				address: "123 Eccles Old Road, Salford Road, East London, Uk, M6 7AF",
				options: {
					title: "Finance Hawk Financial Advisor Theme",
					icon: "images/map-marker.png",
				}
			},
			map: {
				options: {
					zoom: 16,
					scrollwheel: false,
					disableDoubleClickZoom: true,
				}
			}
		});*/
		/* -------------------------------------
				HOME SLIDER
		-------------------------------------- */
		var owl = $("#tg-homeslider");
		owl.owlCarousel({
			pagination : false,
			navigation : true,
			singleItem : true,
			navigationText: [
				"<i class='tg-btnnext fa fa-angle-left'></i>",
				"<i class='tg-btnprev fa fa-angle-right'></i>"
			],
		});
		/* -------------------------------------
				WHAT WE OFFERS SLIDER
		-------------------------------------- */
		var owl = $("#tg-servicesslider");
		owl.owlCarousel({
			pagination: true,
			autoPlay: 3000,
			itemsCustom : [
							[1200,3],
							[992, 2],
							[768, 1],
							[481, 2],
							[0, 1],
			],
		});
		/*---------------------------------------
				SKILLS PROGRESS BAR
		---------------------------------------*/
		try {
			$('#tg-ourskill').appear(function () {
				jQuery('.tg-skillholder').each(function () {
					jQuery(this).find('.tg-skillbar').animate({
						width: jQuery(this).attr('data-percent')
					}, 2500);
				});
			});
		} catch (err) {}
		/* -------------------------------------
				TEAM SLIDER
		-------------------------------------- */
		var owl = $("#tg-teamslider");
		owl.owlCarousel({
			pagination: true,
			autoPlay: 3000,
			items : 4,
			itemsCustom : [
							[992,4],
							[768, 3],
							[480, 2],
							[0, 1],
			],
		});
		var owl = $("#tg-teamslidertwo");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[1200, 3],
							[480, 2],
							[1, 1],
			],
		});
		/* ---------------------------------------
				STATISTICS
		 -------------------------------------- */
		try {
			$('.tg-statistic').appear(function () {
				$('.tg-statistic-count').countTo();
			});
		} catch (err) {}
		/* -------------------------------------
				PROJECTS SLIDERS
		-------------------------------------- */
		var owl = $("#tg-projectsliderall");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[992,5],
							[768, 4],
							[568, 3],
							[360, 2],
							[0, 1],
			],
		});
		var owl = $("#tg-projectsliderinvestment");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[992,5],
							[768, 4],
							[568, 3],
							[360, 2],
							[0, 1],
			],
		});
		var owl = $("#tg-projectslidertaxes");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[992,5],
							[768, 4],
							[568, 3],
							[360, 2],
							[0, 1],
			],
		});
		var owl = $("#tg-projectsliderplanning");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[992,5],
							[768, 4],
							[568, 3],
							[360, 2],
							[0, 1],
			],
		});
		var owl = $("#tg-projectsliderfinancial");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[992,5],
							[768, 4],
							[568, 3],
							[360, 2],
							[0, 1],
			],
		});
		/* -------------------------------------
				TESTIMONIALS SLIDER
		-------------------------------------- */
		var owl = $("#tg-testimonialsslider");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[640,2],
							[0, 1],
			],
		});
		var owl = $("#tg-testimonialsslidertwo");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			itemsCustom : [
							[1200, 3],
							[568, 2],
							[1, 1],
			],
		});
		/* -------------------------------------
				BRANDS SLIDER
		-------------------------------------- */
		var owl = $("#tg-brandsslider");
		owl.owlCarousel({
			pagination: true,
			//autoPlay: 3000,
			items : 4,
			itemsDesktop : [1199,4],
			itemsDesktopSmall : [991,3]
		});
		/* -------------------------------------
				SERVICE HOURS SLIDER
		-------------------------------------- */
		var owl = $("#tg-servicehourslider");
		owl.owlCarousel({
			pagination : false,
			navigation : true,
			singleItem : true,
			navigationText: [
				"<i class='tg-btnnext fa fa-angle-left'></i>",
				"<i class='tg-btnprev fa fa-angle-right'></i>"
			],
		});
		/* ---------------------------------------
				PORTFOLIO FILTERABLE
		-------------------------------------- */
		var $container = $('.tg-projects');
		var $optionSets = $('.option-set');
		var $optionLinks = $optionSets.find('a');
		function doIsotopeFilter() {
			if ($().isotope) {
				var isotopeFilter = '';
				$optionLinks.each(function () {
					var selector = $(this).attr('data-filter');
					var link = window.location.href;
					var firstIndex = link.indexOf('filter=');
					if (firstIndex > 0) {
						var id = link.substring(firstIndex + 7, link.length);
						if ('.' + id == selector) {
							isotopeFilter = '.' + id;
						}
					}
				});
				$container.isotope({
					filter: isotopeFilter
				});
				$optionLinks.each(function () {
					var $this = $(this);
					var selector = $this.attr('data-filter');
					if (selector == isotopeFilter) {
						if (!$this.hasClass('tg-active')) {
							var $optionSet = $this.parents('.option-set');
							$optionSet.find('.tg-active').removeClass('tg-active');
							$this.addClass('tg-active');
						}
					}
				});
				$optionLinks.on('click', function () {
					var $this = $(this);
					var selector = $this.attr('data-filter');
					$container.isotope({itemSelector: '.tg-project', filter: selector});
					if (!$this.hasClass('tg-active')) {
						var $optionSet = $this.parents('.option-set');
						$optionSet.find('.tg-active').removeClass('tg-active');
						$this.addClass('tg-active');
					}
					return false;
				});
			}
		}
		var isotopeTimer = window.setTimeout(function () {
			window.clearTimeout(isotopeTimer);
			doIsotopeFilter();
		}, 1000);
		/* -------------------------------------
				PRETTY PHOTO GALLERY
		-------------------------------------- */
		$("a[data-rel]").each(function () {
			$(this).attr("rel", $(this).data("rel"));
		});
		$("a[data-rel^='prettyPhoto']").prettyPhoto({
			animation_speed: 'normal',
			theme: 'dark_square',
			slideshow: 3000,
			autoplay_slideshow: false,
			social_tools: false
		});
		/* -------------------------------------
				MOST COMMENTED SLIDER
		-------------------------------------- */
		var owl = $("#tg-mostcommentslider");
		owl.owlCarousel({
			pagination : true,
			navigation : false,
			singleItem : true,
		});
		/* -------------------------------------
				MOST COMMENTED SLIDER
		-------------------------------------- */
		var owl = $("#tg-galleryslider");
		owl.owlCarousel({
			pagination: true,
			autoPlay: 3000,
			items : 4,
			itemsDesktop : [1199,4],
			itemsDesktopSmall : [991,3]
		});
		/* -------------------------------------
				ADDRESS SLIDER
		-------------------------------------- */
		var owl = $("#tg-addressslider");
		owl.owlCarousel({
			pagination: true,
			autoPlay: 3000,
			items : 3,
			itemsCustom : [
							[992,3],
							[481, 2],
							[0, 1],
			],
		});
		/* -------------------------------------
				ACCORDION
		-------------------------------------- */
		$(function() {
			$('.tg-panelcontent').hide();
			$('#tg-accordion h4:first').addClass('active').next().slideDown('slow');
			$('#tg-accordion h4').click(function() {
				if($(this).next().is(':hidden')) {
					$('#tg-accordion h4').removeClass('active').next().slideUp('slow');
					$(this).toggleClass('active').next().slideDown('slow');
				}
			});
		});
		/* -------------------------------------
				SIDEBAR TEAM SLIDER
		-------------------------------------- */
		var owl = $("#tg-teamsidebarslider");
		owl.owlCarousel({
			pagination : true,
			navigation : false,
			singleItem : true,
		});
		/* -------------------------------------
				SIDEBAR TESTIMONIALS SLIDER
		-------------------------------------- */
		var owl = $("#tg-testimonialsidebarslider");
		owl.owlCarousel({
			pagination : true,
			navigation : false,
			singleItem : true,
		});
		/* -------------------------------------
				DONUT CHART
		-------------------------------------- */
		if(jQuery('#tg-chartContainer').length > 0 ){
			google.charts.load("current", {packages:["corechart"]});
			google.charts.setOnLoadCallback(drawChart);
			function drawChart() {
				var data = google.visualization.arrayToDataTable([
					['Task',					'Hours per Day'],
					['dolor sit amet',			12],
					['adipisicing elit',		13],
					['incididunt liptae',		25],
					['magna aliua fitoa',		7],
					['aliu liarota',			7],
					['aute irure pikori',		36],
				]);
				var options = {
					pieHole: 0.9,
					width: 323,
					height: 350,
					legend: { position: 'top'},
					chartArea: { width: "90%", height: "90%" },
					pieSliceTextStyle:{color: '#515151'},
					colors: ['#f7464a', '#46bfbd', '#fdb45c', '#949fb1', '#4689f7', '#4d5360'],
					tooltip: {isHtml: true},
				};
				var chart = new google.visualization.PieChart(document.getElementById('tg-chartContainer'));
				chart.draw(data, options);
			}
		}
	});
	window.onload = function () {
		/*-------------------------------------
				LINE CHART
		-------------------------------------*/
		if(jQuery('#tg-performancechart').length > 0 ){
			google.charts.load('current', {'packages':['line']});
			google.charts.setOnLoadCallback(drawChart);
			function drawChart() {
				var data = google.visualization.arrayToDataTable([
					['',		'PROFIT RATIO',			'Expenses RATIO'],
					['JAN',			10,					10],
					['FEB',			20,					15],
					['MAR',			30,					20],
					['APR',			50,					25],
					['MAY',			40,					18],
					['JUN',			70,					20],
				]);
				var options = {
					width: '100%',
					legend: { position: 'bottom'},
					pointSize: 4,
					vAxis: {minValue:0, maxValue:100},
					tooltip: {trigger: 'selection'},
					colors:["#4689f7","#f7464a"],
					chartArea:{
						left:'0',
						top:'5%',
						width:"100%",
						height:"90%",
					},
				};
				var chart = new google.charts.Line(document.getElementById('tg-performancechart'));
				chart.draw(data, options);
			}
		}
	};
})(jQuery);
	