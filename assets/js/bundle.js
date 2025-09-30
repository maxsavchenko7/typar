document.addEventListener('DOMContentLoaded', () => {
	const langOpen = document.querySelector('.lang__title');
	const langPopup = document.querySelector('.lang__popup');

	const popupClose = document.querySelectorAll('.popup-close');
	const menuBtnOpen = document.querySelector('.burger');

	const overlay = document.querySelector('.overlay');
	const feedbackPopup = document.querySelector('.popup-feedback');
	const menu = document.querySelector('.menu');
	const form = document.querySelector('.feedback__form');

	if (popupClose) {
		popupClose.forEach(btnClose => {
			btnClose.addEventListener('click', e => {
				e.stopPropagation();
				feedbackPopup.classList.remove('show');
				menu.classList.remove('show');
				overlay.classList.remove('show');
			});
		});
	}

	if (langOpen) {
		langOpen.addEventListener('click', e => {
			e.stopPropagation();
			langOpen.classList.toggle('active');
			langPopup.classList.toggle('show');
		});

		document.addEventListener('click', () => {
			langOpen.classList.remove('active');
			langPopup.classList.remove('show');
		});
	}

	if (menuBtnOpen) {
		menuBtnOpen.addEventListener('click', e => {
			e.stopPropagation();
			menu.classList.toggle('show');
			overlay.classList.toggle('show');
		});

		document.addEventListener('click', () => {
			menu.classList.remove('show');
			overlay.classList.remove('show');
		});
	}

	const reviewSwiper = new Swiper('.review__swiper', {
		slidesPerView: 1,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'progressbar'
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				allowTouchMove: false
			}
		}
	});

	const usageImgsSwiper = new Swiper('.usage__swiper-imgs', {
		slidesPerView: 1,
		effect: 'fade',
		allowTouchMove: false
	});

	const usageInfoSwiper = new Swiper('.usage__swiper-info', {
		slidesPerView: 1,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'progressbar'
		},
		allowTouchMove: false,
		thumbs: {
			swiper: usageImgsSwiper
		}
	});

	const resultsSwiper = new Swiper('.results__swiper', {
		slidesPerView: 1,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		spaceBetween: 0,
		breakpoints: {
			540: {
				slidesPerView: 2
			},
			768: {
				slidesPerView: 3,
				allowTouchMove: false,
				spaceBetween: 10
			},
			912: {
				slidesPerView: 4,
			}
		}
	});

	if (form) {
		const inputs = form.querySelectorAll('.feedback__form-input');

		inputs.forEach(input => {
			input.addEventListener('blur', () => validateField(input));
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			let allValid = true;

			inputs.forEach(input => {
				if (!validateField(input)) {
					allValid = false;
				}
			});

			if (allValid) {
				form.reset();
				overlay.classList.add('show');
				feedbackPopup.classList.add('show');
			}
		});
	}

	function validateField(input) {
		let isValid = true;

		if (!input.value.trim()) {
			isValid = false;
		}

		if (input.type === 'email') {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (input.value.trim() && !emailPattern.test(input.value.trim())) {
				isValid = false;
			}
		}

		if (!isValid) {
			input.classList.add('input-error');
		} else {
			input.classList.remove('input-error');
		}

		return isValid;
	}

	const dropdownMobile = () => {
		const titles = document.querySelectorAll('.js-dropdown-title');
		const contents = document.querySelectorAll('.js-dropdown-content');
		
		if (window.innerWidth >= 768) return;

		titles.forEach(title => {
			title.addEventListener('click', (e) => {
				e.preventDefault();

				const content = title.parentElement.querySelector('.js-dropdown-content');

				if (title.classList.contains('opened')) {
					title.classList.remove('opened');
					content.style.display = 'none';
					return;
				}

				titles.forEach(item => {
					item.classList.remove('opened');
				});

				title.classList.add('opened');

				if (content) {
					contents.forEach(item => {
						item.style.display = 'none';
					});

					content.style.display = 'block';
				}
			});
		});
	};

	dropdownMobile();

	const headerScroll = () => {
		const header = document.querySelector('.header');
		const isHome = document.body.classList.contains('home');

		if (!header || !isHome) return;

		if (window.scrollY >= 10) {
			header.classList.remove('header--transparent');
		} else {
			header.classList.add('header--transparent');
		}
	};

	window.addEventListener('scroll', headerScroll);
});