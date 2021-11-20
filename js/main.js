
// objectFitImages();


// ===== fullscreen =====

(function () {
// 	window.addEventListener('resize', () => {
		var vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
// 	});
}());


// ===== webp =====

(function () {

	function testWebP(callback) {

		var webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	testWebP(function (support) {

		if (support == true) {
			document.querySelector('body').classList.add('webp');
		} else {
			document.querySelector('body').classList.add('no-webp');
		}
	});
}());


// ==== rezet focus ====

(function () {
	var button = document.querySelectorAll('a, button, label, input');

	var isMouseDown = false;

	for (var i = 0; i < button.length; i++) {
		var el = button[i];

		if (el.tagName !== 'LABEL') {
			el.classList.add('focus');
		}

		el.addEventListener('mousedown', function () {
			this.classList.remove('focus');
			isMouseDown = true;
		});
		el.addEventListener('keydown', function (e) {
			if (e.key === "Tab") {
				isMouseDown = false;
			}
		});
		el.addEventListener('focus', function () {
			if (isMouseDown) {
				this.classList.remove('focus');
			}
		});
		el.addEventListener('blur', function () {
			this.classList.add('focus');
		});
	}
}());


// ===== lazyload img =====

(function () {
	var images = document.querySelectorAll('img[loading="lazy"]');

	if ("loading" in HTMLImageElement.prototype) {
		images.forEach(function (img) {

			img.src = img.dataset.src;
			var sources = img.parentElement.querySelectorAll('source');
			if (sources) {
				sources.forEach(function (source) {
					source.srcset = source.dataset.srcset;
				});
			}
		});

	} else {

		var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {

					var lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					var sources = lazyImage.parentElement.querySelectorAll('source');
					if (sources) {
						sources.forEach(function (source) {
							source.srcset = source.dataset.srcset;
						});
					}
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		}, {
			threshold: 0,
			rootMargin: '0px 0px 1000px 0px',
		});

		images.forEach(function (lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});
	}

}());


// ===== adaptiv =====

(function () {
	var dataMove = document.querySelector('[data-move]');

	if (dataMove) {

		var mqls = [
			window.matchMedia('(max-width: 767px)'),
			window.matchMedia('(max-width: 991px)'),
			// window.matchMedia('(min-width: 768px) and (max-width: 1199px)'),
		]

		for (i = 0; i < mqls.length; i++) {
			mqls[i].addListener(move.bind(null, i));
			// mqls[i].addEventListener('change', move);
			move(i);
		}

		function move(num) {
			var itemsMove = document.querySelectorAll('[data-media="' + num + '"]');

			if (itemsMove) {
				for (var i = 0; i < itemsMove.length; i++) {
					var itemMove = itemsMove[i];
					var itemNamber = itemMove.getAttribute('data-move');
					var startMove = document.querySelector('[data-start="' + itemNamber + '"]');
					var whereMove = document.querySelector('[data-where="' + itemNamber + '"]');

					if (mqls[num].matches) {
						if (!itemMove.classList.contains('done')) {
							whereMove.appendChild(itemMove);
							itemMove.classList.add('done');
						}
					} else {
						if (itemMove.classList.contains('done')) {
							startMove.appendChild(itemMove);
							itemMove.classList.remove('done');
						}
					}
				}
			}
		}
	}
}());




/**************** 
		navigation 
****************/

// ===== up static btn =====

(function () {
	var btnUp = document.querySelector('[data-up]');

	function scrollUp() {
		window.scrollBy(0, -80);

		if (window.pageYOffset > 0) {
			requestAnimationFrame(scrollUp);
		}
	}

	if (btnUp) {
		btnUp.addEventListener('click', scrollUp);
	}
}());



// ===== navigation ===== 

(function () {
	var burger = document.querySelector('.burger');
	var nav = document.querySelector('.navbar');
	var head = document.querySelector('.head');
	// var overlay = document.querySelector('.overlay');
	var body = document.querySelector('body');

	if (burger) {
		burger.addEventListener('click', toggleMenu);
	}

	function toggleMenu() {
		this.classList.toggle('active');
		nav.classList.toggle('active');
		head.classList.toggle('active');
		// overlay.classList.toggle('active');
		body.classList.toggle('lock');
		// swipe(nav);
	}

	function closeMenu() {
		burger.classList.remove('active');
		nav.classList.remove('active');
		head.classList.remove('active');
		// overlay.classList.remove('active');
		body.classList.remove('lock');
	}

	var links = nav.querySelectorAll('a[href^="#"]');
	for (i = 0; i < links.length; i += 1) {
		links[i].addEventListener('click', closeMenu);
	}

	// ===== swipe =====

	function swipe(elem) {

		var touchstartX = 0;
		var touchstartY = 0;
		var touchendX = 0;
		var touchendY = 0;
		var minDist = 10;  // px
		// var maxDist = 120;
		var startTime = 0;
		var endTime = 0;

		var minSpeed = 1.0;

		elem.addEventListener('touchstart', touchstart, { passive: true });
		elem.addEventListener('touchend', touchend);

		function touchstart(event) {
			touchstartX = event.changedTouches[0].screenX;
			touchstartY = event.changedTouches[0].screenY;
			startTime = new Date().getTime();
		}

		function touchend(event) {
			touchendX = event.changedTouches[0].screenX;
			touchendY = event.changedTouches[0].screenY;
			endTime = new Date().getTime();
			getDirection();
		}

		function getDirection() {
			var dx = touchendX - touchstartX;
			var dy = touchendY - touchstartY;
			var abs_dx = Math.abs(dx);
			var abs_dy = Math.abs(dy);

			var time = endTime - startTime;
			var speedX = abs_dx / time;
			var speedY = abs_dy / time;

			if (speedX > minSpeed || speedY > minSpeed) {

				if (abs_dx > minDist && abs_dx > abs_dy) {
					if (dx < 0) {
						elem.dispatchEvent(new CustomEvent("onSwipeLeft"));
					} else {
						elem.dispatchEvent(new CustomEvent("onSwipeRight"));
					}
				}

				if (abs_dy > minDist && abs_dy > abs_dx) {
					if (dy < 0) {
						elem.dispatchEvent(new CustomEvent("onSwipeUp"));
					} else {
						elem.dispatchEvent(new CustomEvent("onSwipeDown"));
					}
				}
			}
		}
	}
	swipe(nav);
	nav.addEventListener("onSwipeUp", closeMenu);

}());



function scrollMenu(nav, offset, speed, easing) {

	var menu = document.querySelector(nav);
	var menuHeight;
	if (offset) {
		var head = document.querySelector(offset);

		if (head) {
			menuHeight = head.clientHeight;
			// отступ под меню
			// document.body.style.paddingTop = menuHeight + 'px';

		} else {
			menuHeight = 0;
		}
	} else {
		menuHeight = 0;
	}

	function fncAnimation(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

	window.requestAnimFrame = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fncAnimation;
	}();


	function scrollToY(height, speed, easing) {
		var scrollTargetY = height || 0;
		scrollTargetY += 2;
		var speed = speed || 2000;
		var easing = easing || 'easeOutSine';

		var scrollY = window.pageYOffset;
		var currentTime = 0;
		var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

		var easingEquations = {
			easeOutSine: function easeOutSine(pos) {
				return Math.sin(pos * (Math.PI / 2));
			},
			easeInOutSine: function easeInOutSine(pos) {
				return -0.5 * (Math.cos(Math.PI * pos) - 1);
			},
			easeInOutQuint: function easeInOutQuint(pos) {
				/* eslint-disable-next-line */
				if ((pos /= 0.5) < 1) {
					return 0.5 * Math.pow(pos, 5);
				}
				return 0.5 * (Math.pow(pos - 2, 5) + 2);
			}
		};

		function tick() {
			currentTime += 1 / 60;
			var p = currentTime / time;
			var t = easingEquations[easing](p);

			if (p < 1) {
				window.requestAnimFrame(tick);
				window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
			} else {
				window.scrollTo(0, scrollTargetY);
			}
		}

		tick();
	};

	function menuControl(menu) {
		var i = void 0;
		var currLink = void 0;
		var refElement = void 0;
		var links = menu.querySelectorAll('a[href^="#"]');
		var scrollY = window.pageYOffset;

		for (i = 0; i < links.length; i += 1) {
			currLink = links[i];
			refElement = document.querySelector(currLink.getAttribute('href'));

			if (refElement) {
				var box = refElement.getBoundingClientRect();

				var topElem = box.top + scrollY - menuHeight;

				if (topElem <= scrollY && topElem + refElement.clientHeight > scrollY) {
					currLink.classList.add('active');
				} else {
					currLink.classList.remove('active');
				}
			}
		}
	}

	function animated(menu, speed, easing) {

		function control(e) {
			e.preventDefault();
			if (head) {
				menuHeight = head.clientHeight;
			} else {
				menuHeight = 0;
			}
			var elem = document.querySelector(this.hash);
			if (elem) {
				var box = elem.getBoundingClientRect();
				var topElem = box.top + window.pageYOffset;
				scrollToY(topElem - menuHeight, speed, easing);
			}
		}

		var i = void 0;
		var link = void 0;
		var links = menu.querySelectorAll('a[href^="#"]');

		for (i = 0; i < links.length; i += 1) {
			link = links[i];
			link.addEventListener('click', control);
		}
	}

	animated(menu, speed, easing);
	document.addEventListener('scroll', function () {
		menuControl(menu);
	});
}
scrollMenu('.menu', '.head');



// ===== scroll head =====

(function () {
	var head = document.querySelector('.head');

	if (head) {
		document.addEventListener('scroll', function () {
			if (window.pageYOffset) {
				head.classList.add('scroll');
			} else {
				head.classList.remove('scroll');
			}
		});
	}
}());



/**************** 
			slider 
****************/

// ===== slider-our + filter  =====

(function () {

	$('.slider-our').slick({
		prevArrow: $('.slider-our__prev'),
		nextArrow: $('.slider-our__next'),
		dots: true,
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		variableWidth: true,
		// adaptiveHeight: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					variableWidth: false,
				}
			},
			{
				breakpoint: 1023,
				settings: {
					slidesToShow: 3,
					variableWidth: false,
				}
			},
		]
	});

	$('.our__filter-btn').on('click', function () {
		$('.our__filter-btn').removeClass('active');
		$(this).addClass('active');

		var filter = $(this).data('filter');
		if (filter == 'all') {
			$('.slider-our').slick('slickUnfilter');
		} else {
			$('.slider-our').slick('slickUnfilter').slick('slickFilter', '.' + filter);
		}
	});

}());



// ===== reviews__slider =====

(function () {
	var mq = window.matchMedia('(min-width: 768px)');

	mq.addListener(startSlider);
	startSlider();

	function startSlider() {
		if (mq.matches) {
			$('.reviews__slider').slick({
				prevArrow: $('.reviews__prev'),
				nextArrow: $('.reviews__next'),
				infinite: false,
				slidesToShow: 2,
				slidesToScroll: 2,
				dots: true,
			});
		} else {
			if ($('.reviews__slider').hasClass('slick-initialized')) {
				$('.reviews__slider').slick('unslick');
			}
		}
	}
}());



// ===== photo__slider =====ч

(function () {

	var name = 'photo';

	var sliderSettings = {
		prevArrow: $('.' + name + '__prev'),
		nextArrow: $('.' + name + '__next'),
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: true,
		variableWidth: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					variableWidth: false,
				}
			}
		]
	}

	var wrapSlider = document.querySelector('.' + name + '__wrap-slider');
	var slider = document.querySelector('.' + name + '__slider');
	var list = [].slice.call(document.querySelectorAll('.' + name + '__list li'), 0);
	var copyList;
	var qtyImg;

	var mqls = [
		// window.matchMedia('(min-width: 480px)'),
		window.matchMedia('(min-width: 768px)'),
		window.matchMedia('(min-width: 1200px)')
	]

	for (i = 0; i < mqls.length; i++) {
		mqls[i].addListener(updateSlider);
	}

	updateSlider();

	function updateSlider() {

		qtyImg = 1;

		if (mqls[0].matches) {
			qtyImg = 4;
		}
		if (mqls[1].matches) {
			qtyImg = 6;
		}

		slider.remove();

		var newSlider = document.createElement('div');
		newSlider.className = name + '__slider slider';
		wrapSlider.insertAdjacentElement('afterBegin', newSlider);
		slider = document.querySelector('.' + name + '__slider');

		copyList = list.slice(0);

		for (var i = copyList.length; i > 0; i = i - qtyImg) {
			createSlide();
		}

		$('.' + name + '__slider').slick(sliderSettings);
		baguetteBox.run('.gallery');

	}


	function createSlide() {

		var newSlide = document.createElement('div');
		var newList = document.createElement('ul');

		imgList = copyList.splice(0, qtyImg);

		for (var i = 0; i < imgList.length; i++) {
			newList.insertAdjacentElement('beforeEnd', imgList[i]);
		}

		newList.className = name + '__slide slide gallery';

		newSlide.insertAdjacentElement('afterBegin', newList);
		slider.insertAdjacentElement('beforeEnd', newSlide);
	}

}());





/**************** 
			form 
****************/

// ====== validate and sendform ========

(function () {
	var form = document.querySelectorAll('form');

	if (form) {
		for (var i = 0; i < form.length; i++) {
			// form[i].addEventListener('submit', validate);
			form[i].addEventListener('submit', ajaxSend);
		}
	}


	var reg = document.querySelectorAll('input[required]');

	if (reg) {
		for (var i = 0; i < reg.length; i++) {
			reg[i].addEventListener('blur', check);
			reg[i].addEventListener('focus', rezet);
		}
	}


	function rezet() {
		var error = this.parentElement.querySelector('.error');
		this.classList.remove('invalid');
		if (error) {
			error.classList.remove('active');
			error.addEventListener('transitionend', function () {
				if (!this.classList.contains('active')) {
					this.innerHTML = '';
				}
			});
		}
	}

	function check() {
		var error = this.parentElement.querySelector('.error');

		if (!this.validity.valid) {
			this.classList.add('invalid');
			if (error) {
				error.classList.add('active');
				error.innerHTML = 'ошибка / неправильный формат';
				if (this.validity.valueMissing || this.value === '') {
					error.classList.add('active');
					error.innerHTML = 'ошибка / заполните поле';
				}
			}
			return 1;
		} else {
			return 0;
		}
	}

	// rating-star

	var rating = document.querySelector('.rating');

	if (rating) {
		var input = rating.querySelectorAll('input');

		for (var i = 0; i < input.length; i++) {

			input[i].addEventListener('focus', rezetRating);
			input[i].addEventListener('blur', checkRating);
		}
	}

	function rezetRating() {
		var error = rating.nextElementSibling;
		rating.classList.remove('invalid');
		if (error) {
			error.classList.remove('active');
			error.addEventListener('transitionend', function () {
				if (!this.classList.contains('active')) {
					this.innerHTML = '';
				}
			});
		}
	}

	function checkRating() {
		var error = rating.nextElementSibling;
		var input = rating.querySelector('[name="rating"]');

		if (input.checked) {
			rating.classList.add('invalid');
			if (error) {
				error.classList.add('active');
				error.innerHTML = 'ошибка / заполните поле';
			}

			return 1;
		} else {
			return 0;
		}
	}
	// end rating-star

	var messageBox;  // popup


	function validate(e) {
		var test = this.hasAttribute('data-test');
		messageBox = this.getAttribute('data-message');
		var rating = this.querySelector('.rating');
		var reg = this.querySelectorAll('input[required]');
		var agree = this.querySelector('input[name="agree"]');
		var countError = 0;
		if (!agree || agree.checked) {

			if (rating) {
				countError += checkRating();
			}

			for (var i = 0; i < reg.length; i++) {
				var input = reg[i];
				countError += check.call(input);
				if (countError) {
					e.preventDefault();
				}
			}
		} else {
			e.preventDefault();
			countError++;
		}
		if (test && countError === 0) {
			e.preventDefault();
			countError++;
			this.reset();
			setDate('test');
		}
		return countError;
	}


	function ajaxSend(e) {
		e.preventDefault();
		var el = this;
		var error = validate.call(el, e);

		if (error === 0) {
			this.classList.add('sending');
			var formData = new FormData(this);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.getAttribute("action"));
			// xhr.responseType = 'json';
			xhr.send(formData);

			xhr.onloadend = function () {
				if (xhr.status == 200) {
					// alert('Сообщение отправлено.');
					// alert(xhr.response);  //ответ сервера
					el.reset();
					var select = el.querySelector('select');
					if (select) {
						select.options[0].selected = 'selected';
						select.dispatchEvent(new Event('change'));
					}
					el.classList.remove('sending');
					setDate.call(el, xhr.response);
				} else {
					alert('Ошибка' + this.status);
					// console.log('Ошибка' + this.status);
					el.classList.remove('sending');
				}
			}
		}
	}

	// вывод ответа сервера в popup

	function setDate(data) {
		if (messageBox) {
			var messageId = document.querySelector('#dialog-' + messageBox);
			var messageText = messageId.querySelector('[data-message-text]')
			if (messageText) {
				messageText.textContent = data;
				// messageText.textContent = data.message;
			}
			// window.replaceDialog('dialog-' + messageBox);
			window.openDialog('dialog-' + messageBox, this);
		}
	}
}());


// ===== выбрано файлов =====

(function () {

	var fileName = document.querySelector('.file__name');
	var inputFile = document.querySelector('.file__input');

	if (fileName && inputFile) {
		inputFile.addEventListener('change', countFile);

		// выбрано файлов имя если один или кол-во

		function countFile() {
			files = this.files;

			if (files.length == 1) {
				fileName.innerHTML = 'Имя файла: ' + files[0].name;
			} else {
				fileName.innerHTML = 'Выбрано ' + files.length + ' Файла(ов)';
			}
		}


		// выбрано файлов кол-во и названия

		function countFile1() {
			files = this.files,
				files_names = [];

			for (var i = 0; i < files.length; i++) {
				files_names.push(files[i].name);
			}

			if (files.length == 1) {
				fileName.innerHTML = 'Имя файла: ' + files[0].name;
			} else {
				fileName.innerHTML = 'Выбрано ' + files.length + ' Файла(ов) : ' + files_names.join(', ');
			}
		}
	}
}());


// ===== .focus parent-input =====

(function () {
	var input = document.querySelectorAll('input');
	if (input) {
		for (var i = 0; i < input.length; i++) {

			input[i].addEventListener('focus', function () {
				this.parentElement.classList.add('focus');
			});

			input[i].addEventListener('blur', function () {
				this.parentElement.classList.remove('focus');
			});
		}
	}
}());


// ===== focus rating =====

(function () {
	// var box = document.querySelector('.rating__group');
	var box = document.querySelector('.rating');
	if (box) {
		var input = box.querySelectorAll('input');

		for (var i = 0; i < input.length; i++) {

			input[i].addEventListener('focus', function () {
				if (this.classList.contains('focus')) {
					box.classList.add('focus');
				}
			});

			input[i].addEventListener('blur', function () {
				box.classList.remove('focus');
			});
		}
	}
}());


// ==== select gibrid-4 ====

(function () {
	var natives = document.querySelectorAll('[data-select]');

	if (natives) {

		for (var i = 0; i < natives.length; i++) {
			select(i);
		}

		function select(i) {

			var native = natives[i];
			var nativeClass = native.classList;
			var parent = native.parentElement;

			var optionInvalid = native.querySelector('.invalid');
			var optionChecked = native.querySelector('option:checked');
			var optionCheckedText = optionChecked.textContent;
			var optionCheckedValue = optionChecked.value;
			var optionCheckedIndex;

			var optionsClass = [];

			createSelectCustom(native);

			function createClass(addClass) {
				if (nativeClass) {
					var customClass = '';

					for (var i = 0; i < nativeClass.length; i++) {

						customClass = customClass + ' ' + nativeClass[i] + addClass;
					}
					return customClass;
				}
			}

			function createSelectCustom(select) {
				var options = select.querySelectorAll('option');

				var selectedClass = optionChecked.getAttribute('class');
				var selectBtn;

				if (optionInvalid) {
					selectBtn = '<div class="' + createClass('-custom__btn') + ' invalid">' +
						optionCheckedText + '</div>';
				} else {
					selectBtn = '<div class="' + createClass('-custom__btn') + selectedClass + '">' +
						optionCheckedText + '</div>';
				}

				parent.insertAdjacentHTML('beforeend',
					'<div class="' + createClass('-custom') + '" aria-hidden="true">' +
					selectBtn +
					'<div class="' + createClass('-custom__options') + '">' +
					createCustomOptions(options) + '' +
					'</div></div></div>');
			}

			function createCustomOptions(options) {
				if (options) {
					var customOptions = '';
					for (var i = 0; i < options.length; i++) {
						var option = options[i];
						var optionValue = option.value;

						if (!option.hasAttribute('hidden')) {
							var optionClass = option.getAttribute('class') || '';
							optionsClass.push(optionClass);
						}

						if (option == optionChecked) {
							optionCheckedIndex = i;
						}

						if (optionValue != '') {
							var optionText = option.text;

							customOptions = customOptions +
								'<div data-value="' + optionValue +
								'" class="' + createClass('-custom__option') +
								' ' + optionClass + ' ">' + optionText + '</div>';
						}
					}
					return customOptions;
				}
			}

			var selectCustom = native.nextElementSibling;
			var selectCustomBtn = selectCustom.children[0];
			var selectCustomOpts = selectCustom.children[1];
			var customOptsList = [].slice.call(selectCustomOpts.children, 0);;
			var optionsCount = customOptsList.length;
			var optionHoveredIndex = -1;

			if (optionCheckedValue) {
				updateCustomSelectChecked(optionCheckedValue, optionCheckedText, optionCheckedIndex);
			}

			selectCustomBtn.addEventListener("click", function (e) {
				var isClosed = !selectCustom.classList.contains("isActive");
				if (isClosed) {
					openSelectCustom();
				} else {
					closeSelectCustom();
				}
			});

			function openSelectCustom() {
				selectCustom.classList.add("isActive");
				parent.classList.add("isActive");
				selectCustom.setAttribute("aria-hidden", false);

				if (optionCheckedValue) {
					for (var i = 0; i < customOptsList.length; i++) {
						var customValue = customOptsList[i].getAttribute("data-value");
						if (customValue === optionCheckedValue) {
							optionCheckedIndex = i;
						}
					}

					updateCustomSelectHovered(optionCheckedIndex);
				}

				document.addEventListener("click", watchClickOutside);
				document.addEventListener("keydown", supportKeyboardNavigation);
			}

			function closeSelectCustom() {
				selectCustom.classList.remove("isActive");
				parent.classList.remove("isActive");

				selectCustom.setAttribute("aria-hidden", true);

				updateCustomSelectHovered(-1);

				document.removeEventListener("click", watchClickOutside);
				document.removeEventListener("keydown", supportKeyboardNavigation);
			}

			function updateCustomSelectHovered(newIndex) {
				var prevOption = selectCustomOpts.children[optionHoveredIndex];
				var option = selectCustomOpts.children[newIndex];

				if (prevOption) {
					prevOption.classList.remove("isHover");
				}
				if (option) {
					option.classList.add("isHover");
				}
				optionHoveredIndex = newIndex;
			}

			function updateCustomSelectChecked(value, text, optionIndex) {
				var prevValue = optionCheckedValue;
				var elPrevOption = selectCustomOpts.querySelector(`[data-value="${prevValue}"`);
				var elOption = selectCustomOpts.querySelector(`[data-value="${value}"`);

				if (elPrevOption) {
					elPrevOption.classList.remove("isActive");
				}

				if (elOption) {
					elOption.classList.add("isActive");
				}

				selectCustomBtn.textContent = text;
				selectCustomBtn.className = createClass('-custom__btn') + ' ' + optionsClass[optionIndex];
				optionCheckedValue = value;
			}

			function watchClickOutside(e) {
				var didClickedOutside = !selectCustom.contains(e.target);
				if (didClickedOutside) {
					closeSelectCustom();
				}
			}

			function supportKeyboardNavigation(e) {
				// press down -> go next
				if (e.keyCode === 40 && optionHoveredIndex < optionsCount - 1) {
					var index = optionHoveredIndex;
					e.preventDefault(); // prevent page scrolling
					updateCustomSelectHovered(optionHoveredIndex + 1);
				}

				// press up -> go previous
				if (e.keyCode === 38 && optionHoveredIndex > 0) {
					e.preventDefault(); // prevent page scrolling
					updateCustomSelectHovered(optionHoveredIndex - 1);
				}

				// press Enter or space -> select the option
				if (e.keyCode === 13 || e.keyCode === 32) {
					e.preventDefault();

					var option = selectCustomOpts.children[optionHoveredIndex];
					var value = option && option.getAttribute("data-value");
					//  console.log(option);

					if (value) {
						native.value = value;
						updateCustomSelectChecked(value, option.textContent);
					}
					closeSelectCustom();
				}

				// press ESC -> close selectCustom
				if (e.keyCode === 27) {
					closeSelectCustom();
				}
			}

			function getIndex(el) {
				for (var i = 0; el = el.previousElementSibling; i++);
				return i;
			}

			native.addEventListener("change", function (e) {
				var value = e.target.value;
				if (value) {
					var respectiveCustomOpt = selectCustomOpts.querySelector(`[data-value="${value}"]`);

					var index = getIndex(respectiveCustomOpt);

					updateCustomSelectChecked(value, respectiveCustomOpt.textContent, index);

				} else {  // rezet select

					selectCustomBtn.textContent = optionCheckedText;
					selectCustomBtn.classList.add("invalid")
					optionCheckedValue = '';

					for (var i = 0; i < customOptsList.length; i++) {
						customOptsList[i].classList.remove("isActive");
					}
				}
			});

			for (var i = 0; i < customOptsList.length; i++) {
				func(i);
			}

			function func(i) {
				var el = customOptsList[i];
				el.addEventListener("click", function (e) {
					var value = e.target.getAttribute("data-value");
					native.value = value;
					updateCustomSelectChecked(value, e.target.textContent, i);
					closeSelectCustom();
				});

				el.addEventListener("mouseenter", function (e) {
					updateCustomSelectHovered(i);
				});
			}

			// ===== select gibrid arrow =====

			native.addEventListener('click', function () {
				parent.classList.toggle('oupen');
			});

			native.addEventListener('keydown', function (e) {
				if (e.keyCode === 13 || e.keyCode === 32) {
					parent.classList.toggle('oupen');
				}
			});

			native.addEventListener('focus', function () {
				parent.classList.add('focus');
			});

			native.addEventListener('blur', function () {
				parent.classList.remove('oupen');
				parent.classList.remove('focus');
			});
		}
	}
}());





/**************** 
			more 
****************/

// ===== elem more =====

(function () {
	$('[data-btn-more]').each(function () {
		var count = $(this).attr('data-btn-more');
		var parent = $(this).parent();

		$(this).on('click', function () {
			parent.children('*:hidden').slice(0, count).slideDown(500);
			if (parent.children('*:hidden').length == 0) {
				$(this).text('Конец').addClass('hidden');
			}
		});
	});
}());


// ===== slide more =====

(function () {
	$('[data-slide-more]').each(function () {
		var count = $(this).attr('data-slide-more');
		var prev = $(this).prev();

		$(this).on('click', function () {
			prev.children('*:hidden').slice(0, count).slideDown(500);
			if (prev.children('*:hidden').length == 0) {
				$(this).text('Конец').addClass('hidden');
			}
		});
	});
}());


// ===== clamp text =====

(function () {
	var elClamp = document.querySelectorAll('[data-clamp]');
	if (elClamp) {
		for (var i = 0; i < elClamp.length; i++) {

			var dataClamp = elClamp[i].getAttribute('data-clamp');
			var line = Number(dataClamp);
			clamp(elClamp[i], line);
		}
	}

	var btn = document.querySelectorAll('[data-clamp-btn]');
	if (btn) {
		for (var i = 0; i < btn.length; i++) {
			btn[i].addEventListener('click', function () {

				var el = this.parentElement.querySelector('[data-clamp]');
				clamp(el, 0);
				this.classList.add('hidden');
			});
		}
	}
}());





// ===== animation observe =====

(function () {

	var target = document.querySelector('.how');
	var elem = document.querySelectorAll('._anim')

	var options = {
		threshold: 0.5,
	}

	var callback = function (entries, observer) {
		entries.forEach(function (entry) {

			if (entry.isIntersecting) {
				elem.forEach(function (el) {
					el.classList.add('play');
				});
			} else {
				elem.forEach(function (el) {
					el.classList.remove('play');
				});
			}
		});
	}

	var observer = new IntersectionObserver(callback, options);

	if (target) {
		observer.observe(target);
	}
}());










