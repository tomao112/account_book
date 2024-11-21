import Link from 'next/link';
import React from 'react';
import { Button } from 'primereact/button';
import Headless from '@/app/components/layouts/sidebar';
import Image from "next/image"


const Header = () => {
	return (
		<div className='h-20'>
			<div className='pt-3 pb-3 pl-3 pr-10 grid grid-cols-1'>
				<div className='flex justify-between'>
					{/* ホームアイコンもサイドバーに追加予定 */}
					{/* <Button style={{ color: 'black', fontSize: '2rem' }} icon="pi pi-home" rounded aria-label="Filter" /> */}
					<Image 
						src="/header_hum.jpg"
						width={60}
						height={60}
						alt="はむ"
					/>
					<div className='flex items-center'>
						<Button className='gap-2'>
							<Image
								src="/icon_hum.jpg"
								width={40}
								height={40}
								alt="icon"
								/>
								<span>
									register
								</span>
								<i className='pi pi-angle-down'></i>
						</Button>
					</div>
				</div>
			</div>
			<Headless />
		</div>
	)
}

export default Header;