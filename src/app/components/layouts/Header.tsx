import Link from 'next/link';
import React from 'react';

const Header = () => {
	return (
		// デザイン考案中
		// ヘッダーにアイコン、ハンバーガーを表示させるように
		<div>
			<div>
				<Link href={'/'}>home</Link>
			</div>
		</div>
	)
}

export default Header;