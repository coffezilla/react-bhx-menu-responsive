/* eslint-disable operator-linebreak */

import { useState, useRef, useEffect } from 'react';

import './MenuResponsive.css';

interface IProps {
	menus: string[];
	children?: any;
}

const MenuResponsive = ({ menus, children }: IProps) => {
	const [menuState, setMenuState] = useState(false);
	const refMenuResponsive = useRef<any>();

	// swipe controller
	let swipeStartPosition = { x: 0, y: 0 }; // positions X and Y at the first touch
	let swipeCurrentPosition = { x: 0, y: 0 }; // positions X and Y swiping
	let movePixelX = 0; // diff of the start and current position in X swip
	let movePixelY = 0; // diff of the start and current position in Y swip
	let isSwipingX = false; // check if is swipingX

	const handleMenu = () => {
		refMenuResponsive.current.scrollTop = 0;
		setMenuState(!menuState);
	};

	// swiping event
	const swipe = (e: any) => {
		const touch = e.targetTouches[0];
		swipeCurrentPosition = { x: touch.screenX, y: touch.screenY };
		const diffMoveX = touch.screenX - swipeStartPosition.x;
		const diffMoveY = touch.screenY - swipeStartPosition.y;
		movePixelX = diffMoveX > 0 ? 0 : diffMoveX;
		movePixelY = diffMoveY;
		console.log(diffMoveY, diffMoveX, swipeCurrentPosition, refMenuResponsive);

		// move the menu
		if ((diffMoveY > -60 && diffMoveY < 60 && movePixelX < -30) || isSwipingX) {
			refMenuResponsive.current.style.left = `${movePixelX}px`;
			if (!isSwipingX) {
				isSwipingX = true;
			}
		}
		// refMenuResponsive.current.style.transition = 'left 0s';
	};
	const swipeStart = (e: any) => {
		isSwipingX = false;
		console.log('swipeStart');
		movePixelX = 0;
		const touch = e.targetTouches[0];
		swipeStartPosition = { x: touch.screenX, y: touch.screenY };
		refMenuResponsive.current.style.transition = 'left 0s';
	};
	const swipeEnd = () => {
		if (movePixelY > -60 && movePixelY < 60) {
			console.log('swipeEnd', movePixelX);
			if (movePixelX < -40) {
				setMenuState(false);
			}
			// refMenuResponsive.current.style.transition = 'left .5s';
		}
		refMenuResponsive.current.style = '';
	};

	//
	useEffect(() => {
		const controllerDom = document.querySelector('.menu-responsive');
		if (controllerDom !== null) {
			if (controllerDom !== null) {
				controllerDom.addEventListener('touchstart', (e: any) => swipeStart(e), false);
				controllerDom.addEventListener('touchmove', (e: any) => swipe(e), false);
				controllerDom.addEventListener('touchend', () => swipeEnd(), false);
			}
		}
		return () => {
			if (controllerDom !== null) {
				controllerDom.removeEventListener('touchstart', (e: any) => swipeStart(e), false);
				controllerDom.removeEventListener('touchmove', (e: any) => swipe(e), false);
				controllerDom.removeEventListener('touchend', () => swipeEnd(), false);
			}
		};
	}, []);

	return (
		<>
			<div className="menu-responsive-wrapper-mobile">
				{!menuState && (
					<button type="button" onClick={handleMenu}>
						ABRIR
					</button>
				)}
				<ul
					ref={refMenuResponsive}
					className={`menu-responsive ${
						menuState ? 'menu-responsive--open' : 'menu-responsive--close'
					}`}
				>
					{menus &&
						menus.map((item) => (
							<li key={item}>
								<a href="/">{item}</a>
							</li>
						))}
				</ul>
			</div>
			{menuState && (
				<button type="button" className="menu-responsive__background" onClick={handleMenu}>
					Close
				</button>
			)}
			<div className="menu-responsive-wrapper">{children}</div>
		</>
	);
};

export default MenuResponsive;
