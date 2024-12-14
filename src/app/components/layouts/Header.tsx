'use client'

import Link from 'next/link';
import React from 'react';
import Headless from '@/app/components/layouts/sidebar';
import Image from "next/image"
import Setting from './setting';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/clerk-react';


const Header = () => {
	const { isSignedIn } = useAuth();

	return (
		<div className='h-20'>
			<div className='pt-3 pb-3 pl-3 pr-10 grid grid-cols-1'>
				<div className='flex justify-between'>
					<Image 
						src="/header_hum.jpg"
						width={60}
						height={60}
						alt="はむ"
					/>
					<div className='flex items-center'>
						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</div>
			</div>
			{isSignedIn && (
				<>
				<Setting />
				<Headless />
			</>
			)}
		</div>
	)
}

export default Header;