// account_book/src/app/components/layouts/sidebar.tsx
'use client'
import React, { useState, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
// import { Avatar } from 'primereact/avatar';
// import { Ripple } from 'primereact/ripple';
// import { StyleClass } from 'primereact/styleclass';
import 'primereact/resources/themes/saga-blue/theme.css'; // テーマ
import 'primereact/resources/primereact.min.css'; // PrimeReactのスタイル
import 'primeicons/primeicons.css';
import Link from 'next/link';
        

export default function Headless() {
    const [visible, setVisible] = useState(false);
		const [ currentPage, setCurrentPage ] = useState('/');
    // const btnRef1 = useRef(null);
    // const btnRef2 = useRef(null);
    // const btnRef3 = useRef(null);
    // const btnRef4 = useRef(null);

    return (
      <div className="card flex justify-content-center">
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
				<Sidebar
				className='w-16rem'
					visible={visible}
					onHide={() => setVisible(false)}
					content={({ closeIconRef, hide }) => (
        <div className="w-56">
            <div id="app-sidebar-2" className="">
                <div className="">
									{/* 閉じるボタン */}
                    {/* <div className="flex justify-end pr-3 pt-3">
                      <Button type="button" onClick={(e) => hide(e)} icon="pi pi-times" rounded outlined className="h-2rem w-2rem"></Button>
                    </div> */}
										<ul className='pl-10 pt-10 flex flex-col gap-2'>
											<Link href="./TransactionList">
												<li className='' style={{ backgroundColor: currentPage ===  './TransactionList' ? 'var(--highlight-bg)' : 'white', color: 'var(--highlight-text-color)', borderRadius: '0.7rem', padding: '0.7rem' }}
												onClick={() => setCurrentPage('./TransactionList')}>
													<Button className='text-xl flex gap-4' >
														<span className='pi pi-book' style={{ fontSize: '1.5rem' }}></span>
														<span>日別</span>
													</Button>
												</li>
											</Link>
											<Link href="./income-expense">
												<li style={{ backgroundColor: currentPage ===  './income-expense' ?'var(--highlight-bg)': 'white', color: 'var(--highlight-text-color)', borderRadius: '0.7rem', padding: '0.7rem' }}
												onClick={() => setCurrentPage('./income-expense')}>
													<Button className='text-xl flex gap-4'>
														<span className='pi pi-calendar' style={{ fontSize: '1.5rem' }}></span>
														<span>カレンダー</span>
													</Button>
												</li>
											</Link>
											<Link href="">
												<li style={{ backgroundColor: currentPage ===  './' ? 'var(--highlight-bg)': 'white', color: 'var(--highlight-text-color)', borderRadius: '0.7rem', padding: '0.7rem' }}>
													<Button className='text-xl flex gap-4'>
														<span className='pi pi-chart-line' style={{ fontSize: '1.5rem' }}></span>
														<span>チャート</span>
													</Button>
												</li>
											</Link>
											<Link href="">
												<li style={{ backgroundColor: currentPage ===  './' ?'var(--highlight-bg)': 'white', color: 'var(--highlight-text-color)', borderRadius: '0.7rem', padding: '0.7rem' }}>
													<Button className='text-xl flex gap-4'>
														<span className='pi pi-cog' style={{ fontSize: '1.5rem' }}></span>
														<span>設定</span>
													</Button>
												</li>
											</Link>
										</ul>
                </div>
            </div>
        </div>
    )}
></Sidebar>
      </div>
    )
}