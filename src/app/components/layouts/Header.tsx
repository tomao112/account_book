import Link from 'next/link';
import React from 'react';
import { Button } from 'primereact/button';
import Headless from '@/app/components/layouts/sidebar';

const Header = () => {
	return (
		// デザイン考案中
		// ヘッダーにアイコン、ハンバーガーを表示させるように
		<div>
			<div className='bg-gray-100 pt-3 pb-3  grid grid-cols-1'>
				<Headless />
				<div className='flex justify-between'>
					<Button style={{ color: 'black', fontSize: '2rem' }} icon="pi pi-home" rounded aria-label="Filter" />
					<div className='flex items-center'>
						<Button>会員</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header;