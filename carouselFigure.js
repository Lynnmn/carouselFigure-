
(function($){

	$.fn.carouselFigure = function(options){
		return this.each(function(){
			var me = $(this),
				instance = me.data('carouselFigure');

			if(!instance){
				me.data('carouselFigure', (instance = new carouselFigure(me,options)));
			}

			if($.type(options) === 'string') return instance[options]();
		});
	};

	$.fn.carouselFigure.defaults = {
		selectors: {
			list: '.list',   // 父元素
			item: '.item',   // 列表元素
			dots: '.dot', // 下标小圆点
			active: '.active'  
		},
		index: 1,   // 当前元素索引
		easing: 'ease',   // 过渡方式
		duration: 2000,   // loop的时间间隔
		loop: false,    // 是否循环
		callback:""   // 回调函数
	}

	/*说明:获取浏览器前缀*/
	/*实现：判断某个元素的css样式中是否存在transition属性*/
	/*参数：dom元素*/
	/*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
	var _prefix = (function(temp){
		var aPrefix = ["webkit", "Moz", "o", "ms"],
			props = "";
		for(var i in aPrefix){
			props = aPrefix[i] + "Transition";
			if(temp.style[props] !== undefined){
				return "-" + aPrefix[i].toLowerCase() + "-";
			}
		}
		return false;
	})(document.createElement(carouselFigure));

	var carouselFigure = (function(){
		function carouselFigure(element,options){
			this.settings = $.extend(true, $.fn.carouselFigure.defaults, options || {});
			this.element = element;
			this.init();
		}

		carouselFigure.prototype = {
			/* 初始化插件 */
			init: function(){
				var me = this;
				me.selectors = me.settings.selectors;
				me.list = me.element.find(me.selectors.list);
				me.item = me.element.find(me.selectors.item);
				me.dots = me.element.find(me.selectors.dots);

				me.itemCount = me.itemCount();
				me.itemWidth = me.itemWidth();
				me.itemHeight = me.itemHeight();
				me.index = (me.settings.index > 0 && me.settings.index < me.itemCount) ? me.settings.index : 0;

				if(me.index){
					me.initLayout();
				}

				me._initEvent();
			},   
			initLayout: function(){
				var me = this;
				me.list.css({
					'width': me.itemCount * me.itemWidth + 'px',
					'height': me.itemHeight + 'px',
					'display': 'flex',
					'left': 0,
					'transition': 'left 1s'
				});
			},
			/* 获取滑动的图片数量 */
			itemCount: function(){
				return this.item.length;
			},
			/* 获取滑动图片的宽度 */ 
			itemWidth: function(){
				var me = this;
				return me.item.width();
			},
			/* 获取滑动图片的宽度 */ 
			itemHeight: function(){
				var me = this;
				return me.item.height();
			},
			// loop: function(){
			// 	var me = this;
			// 	if(me.index < me.itemCount ){
			// 		me.index ++;
			// 	}else{
			// 		me.index = 1;
			// 	}
			// 	me.animate();
			// },
			animate: function(){
				var me = this;
				me.list.css({
					'left': -(me.index-1)*me.itemWidth + 'px'
				})
				me.dots.eq(me.index-1).addClass('active').siblings().removeClass('active');
			},
			_initEvent: function(){
				var me = this;
				var startX, endX;
				me.list.on('touchstart',function(e){
					startX = ( e.touches && e.touches[0] ? e.touches[0] : e ).pageX;
				}).on('touchmove', function(e){
					endX = ( e.touches && e.touches[0] ? e.touches[0] : e ).pageX;
				}).on('touchend',function(){
					if( endX - startX > 50 ){   // 向右滑
						if(me.index > 1){
							me.index--;
						}else{                 // 第一个图片位置，向右滑，回到最后一个图片位置
							me.index = me.itemCount;
						}
					}else if( startX - endX > 50 ){   // 向左滑

						if(me.index < me.itemCount){
							me.index++;
						}else{               // 最后一个位置向左滑，回到第一个图片位置
							me.index = 1;
						}
						
					}
					me.animate(me.index);
				})
			}
		}
		return carouselFigure;
	})();

	$(function(){
		$('[data-carouselFigure]').carouselFigure();
	})


})(jQuery)

