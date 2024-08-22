import Link from 'next/link';
import React from 'react';

const Header = () => {
	return (
		<div>
			<div>
				<Link href={'/'}>home</Link>
			</div>
			<div>
				<Link href={'/'}>月ごとの収支</Link>
			</div>
		</div>
	)
}

export default Header;