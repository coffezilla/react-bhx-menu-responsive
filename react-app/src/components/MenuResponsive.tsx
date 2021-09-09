/* eslint-disable */
/* eslint-disable operator-linebreak */

import { useState, useRef, useEffect } from 'react';

import './MenuResponsive.css';

interface IProps {
	menus: string[];
	children?: any;
}

// swipe controller
let swipeStartPosition = { x: 0, y: 0 }; // positions X and Y at the first touch
let movePixelX = 0; // diff of the start and current position in X swip
let movePixelY = 0; // diff of the start and current position in Y swip
let isSwipingX = false; // check if is swipingX
let isMobileMenuOpened = false; // check if is opened the mobile menu or not

// opening menu
let clickOnTheCorner = false; // check if was a push from the corner
let menuHidePositionX = 0; // position pixel of the menu <ul>

const MenuResponsive = ({ menus, children }: IProps) => {
	const [menuState, setMenuState] = useState(false);
	const [swipping, setSwipping] = useState(false);

	const refMenuResponsive = useRef<any>();

	const handleMenu = (newMenuState: boolean) => {
		refMenuResponsive.current.scrollTop = 0;
		setMenuState(newMenuState);
		isMobileMenuOpened = newMenuState;
		if (newMenuState) {
			document.querySelector('body')?.classList.add('menu-responsive--body-block');
			// listener back click browser
			window.location.hash = 'responsive-menu';
		} else {
			document.querySelector('body')?.classList.remove('menu-responsive--body-block');
			window.location.hash = '';
		}
	};

	// swiping event
	const swipe = (e: any) => {
		const touch = e.targetTouches[0];
		const diffMoveX = touch.screenX - swipeStartPosition.x;
		const diffMoveY = touch.screenY - swipeStartPosition.y;
		movePixelX = diffMoveX;
		movePixelY = diffMoveY;

		if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
			// push to close menu to the left
			const movePixelXNotNegative = movePixelX > 0 ? 0 : movePixelX;
			if ((movePixelY > -60 && movePixelY < 60 && movePixelXNotNegative < -30) || isSwipingX) {
				refMenuResponsive.current.style.left = `${movePixelXNotNegative}px`;
				if (!isSwipingX) {
					isSwipingX = true;
					document.querySelector('body')?.classList.add('menu-responsive--body-block');
				}
			}
		}

		// push to open menu from the left
		if (clickOnTheCorner) {
			if (movePixelY > -30 && movePixelY < 30 && diffMoveX > 30) {
				if (!isSwipingX) {
					isSwipingX = true;
					setSwipping(true);
					document.querySelector('body')?.classList.add('menu-responsive--body-block');
				}
				if (isSwipingX) {
					const menuMoveX = menuHidePositionX + diffMoveX;
					const movePixelXNotNegative = menuMoveX > 0 ? 0 : menuMoveX;
					refMenuResponsive.current.style.left = `${movePixelXNotNegative}px`;
				}
			}
		}
	};

	const swipeStart = (e: any) => {
		if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
			movePixelX = 0;
			const touch = e.targetTouches[0];
			swipeStartPosition = { x: touch.screenX, y: touch.screenY };
			refMenuResponsive.current.style.transition = 'left 0s';
		}
		if (!isMobileMenuOpened) {
			menuHidePositionX = refMenuResponsive.current.offsetLeft;
			const touch = e.targetTouches[0];
			swipeStartPosition = { x: touch.screenX, y: touch.screenY };

			// check if was clicked on the corner
			if (swipeStartPosition.x < 36) {
				refMenuResponsive.current.style.transition = 'left 0s';
				clickOnTheCorner = true;
			}
		}
	};
	const swipeEnd = (e: any) => {
		if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
			if (movePixelY > -60 && movePixelY < 60) {
				if (movePixelX < -40) {
					handleMenu(false);
				}
			}
		}

		if (!isMobileMenuOpened && movePixelX > 50 && clickOnTheCorner && isSwipingX) {
			handleMenu(true);
		}

		if (!isMobileMenuOpened) {
			document.querySelector('body')?.classList.remove('menu-responsive--body-block');
		}

		setSwipping(false);
		movePixelX = 0;
		movePixelY = 0;
		clickOnTheCorner = false;
		isSwipingX = false;
		refMenuResponsive.current.style = '';
	};

	//
	useEffect(() => {
		window.onhashchange = (e: any) => {
			e.preventDefault();
			if (!location.hash) {
				handleMenu(false);
			}
		};

		if (document !== null) {
			document.addEventListener('touchstart', (e: any) => swipeStart(e), false);
			document.addEventListener('touchmove', (e: any) => swipe(e), false);
			document.addEventListener('touchend', (e: any) => swipeEnd(e), false);
		}
		return () => {
			if (document !== null) {
				document.removeEventListener('touchstart', (e: any) => swipeStart(e), false);
				document.removeEventListener('touchmove', (e: any) => swipe(e), false);
				document.removeEventListener('touchend', (e: any) => swipeEnd(e), false);
			}
		};
	}, []);

	return (
		<>
			<div className="menu-responsive-wrapper-mobile">
				{!menuState && (
					<button
						type="button"
						onClick={() => {
							handleMenu(true);
						}}
					>
						ABRIR
					</button>
				)}
				<ul
					ref={refMenuResponsive}
					className={`menu-responsive ${
						menuState ? 'menu-responsive--open' : 'menu-responsive--close'
					}`}
				>
					{menus && menus.map((item) => <li key={item}>{item}</li>)}
				</ul>
			</div>
			{(menuState || swipping) && (
				<button
					id="js-menu-responsive__background"
					type="button"
					className="menu-responsive__background"
					style={swipping ? { opacity: '.1' } : { opacity: '.3' }}
					onClick={() => {
						handleMenu(false);
					}}
				>
					Close
				</button>
			)}
			<div className="menu-responsive-wrapper">{children}</div>
		</>
	);
};

export default MenuResponsive;
