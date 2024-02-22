'use client';

import { useEffect } from 'react';

/** TODO: 這個 component 需要拆成 script 載入，不應該放盡 component */
/** 解決 Safari 100vh 問題 */
const SafariHacks = () => {
	useEffect(() => {
		setCorrectViewHeight();
		window.addEventListener('resize', setCorrectViewHeight);
	}, []);
	return null;
};

/** 設定 CSS 變數 --vh 為真正的 vh */
const setCorrectViewHeight = () => {
	const windowVH = window.innerHeight / 100;
	document.documentElement.style.setProperty('--vh', `${windowVH}px`);
};

export default SafariHacks;
