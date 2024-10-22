import Link from 'next/link';
import React from 'react';
import { Button } from 'primereact/button';
import Headless from '@/app/components/layouts/sidebar';

const Header = () => {
	return (
		// デザイン考案中
		// ヘッダーにアイコン、ハンバーガーを表示させるように
		<div>
			<div className='bg-gray-100 pt-3 pb-3 flex'>
				<Headless />
				<Button style={{ color: 'black', fontSize: '2rem' }} icon="pi pi-home" rounded aria-label="Filter" />
				{/* <Button style={{ color: 'gray', justifyContent: 'end' }} icon="pi pi-pencil" rounded aria-label="Filter" /> */}
			</div>
		</div>
	)
}

export default Header;