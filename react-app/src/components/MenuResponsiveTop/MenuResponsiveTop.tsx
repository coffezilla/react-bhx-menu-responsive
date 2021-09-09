/* eslint-disable */
/* eslint-disable operator-linebreak */

import { useState, useRef, useEffect } from 'react';
import './MenuResponsiveTop.css';

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
let isMobile = true; // variable to check width

const MenuResponsiveTop = ({ menus, children }: IProps) => {
	const [menuState, setMenuState] = useState(false);
	const [swipping, setSwipping] = useState(false);
	const [width, setWidth] = useState<number>(window.innerWidth); // check width size of the window
	const refMenuResponsive = useRef<any>();

	const handleWindowSizeChange = () => {
		setWidth(window.innerWidth);
		isMobile = window.innerWidth < 700 ? true : false;
	};

	const handleMenu = (newMenuState: boolean) => {
		refMenuResponsive.current.scrollTop = 0;
		setMenuState(newMenuState);
		isMobileMenuOpened = newMenuState;
		if (newMenuState) {
			// listener back click browser
			window.location.hash = 'responsive-menu';
			document.querySelector('body')?.classList.add('menu-responsive--body-block');
		} else {
			window.location.hash = '';
		}
	};

	// swiping event
	const swipe = (e: any) => {
		if (isMobile) {
			if (
				refMenuResponsive.current.scrollTop + window?.innerHeight >=
				refMenuResponsive.current.scrollHeight
			) {
				const touch = e.targetTouches[0];
				const diffMoveX = touch.screenX - swipeStartPosition.x;
				const diffMoveY = touch.screenY - swipeStartPosition.y;
				movePixelX = diffMoveX;
				movePixelY = diffMoveY;

				// block scroll inner content
				if (movePixelY < 0) {
					refMenuResponsive.current.style.overflow = 'hidden';
				} else {
					refMenuResponsive.current.style = '';
				}

				if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
					// push to close menu to the left
					const movePixelYNotNegative = movePixelY > 0 ? 0 : movePixelY;
					if ((movePixelX > -60 && movePixelX < 60 && movePixelYNotNegative < -30) || isSwipingX) {
						refMenuResponsive.current.style.top = `${movePixelYNotNegative}px`;
						if (!isSwipingX) {
							isSwipingX = true;
							document.querySelector('body')?.classList.add('menu-responsive--body-block');
						}
					}
				}
			}
		}
	};

	const swipeStart = (e: any) => {
		if (isMobile) {
			if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
				movePixelX = 0;
				const touch = e.targetTouches[0];
				swipeStartPosition = { x: touch.screenX, y: touch.screenY };
				refMenuResponsive.current.style.transition = 'top 0s';
				console.log('movendo start', swipeStartPosition);
			}
		}
	};
	const swipeEnd = (e: any) => {
		if (isMobile) {
			if (isMobileMenuOpened && e.target.id !== 'js-menu-responsive__background') {
				if (movePixelX > -60 && movePixelX < 60) {
					if (movePixelY < -40) {
						handleMenu(false);
					}
				}
			}

			refMenuResponsive.current.style = '';

			if (!isMobileMenuOpened) {
				setTimeout(() => {
					document.querySelector('body')?.classList.remove('menu-responsive--body-block');
				}, 500);
			}

			setSwipping(false);
			movePixelX = 0;
			movePixelY = 0;
			isSwipingX = false;
			refMenuResponsive.current.style = '';
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange);
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		};
	}, []);

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
				{width < 700 && (
					<button
						type="button"
						onClick={() => {
							handleMenu(true);
						}}
					>
						ABRIR
					</button>
				)}

				<div className="menu-responsive-container">
					<div
						ref={refMenuResponsive}
						className={`menu-responsive ${
							menuState ? 'menu-responsive--open' : 'menu-responsive--close'
						}`}
					>
						<button
							type="button"
							onClick={() => {
								handleMenu(false);
							}}
						>
							FECHAR
						</button>
						<ul>{menus && menus.map((item) => <li key={item}>{item}</li>)}</ul>
					</div>
				</div>
			</div>
			{(menuState || swipping) && width < 700 && (
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

export default MenuResponsiveTop;
