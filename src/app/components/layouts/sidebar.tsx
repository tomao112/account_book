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
        

export default function HeadlessDemo() {
    const [visible, setVisible] = useState(false);
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);

    return (
      <div className="card flex justify-content-center">
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
				<Sidebar
    visible={visible}
    onHide={() => setVisible(false)}
    content={({ closeIconRef, hide }) => (
        <div className="">
            <div id="app-sidebar-2" className="">
                <div className="">
                    <div className="flex justify-end pr-3 pt-3">
                            <Button type="button" onClick={(e) => hide(e)} icon="pi pi-times" rounded outlined className="h-2rem w-2rem"></Button>
                    </div>
										<ul>
											<Link href="./TransactionList">
												<li>
													<a>日別</a>
												</li>
											</Link>
											<Link href="./income-expense">
												<li>
													<a>カレンダー</a>
												</li>
											</Link>
											<Link href="">
												<li>
													<a>チャート</a>
												</li>
											</Link>
											<Link href="">
												<li>
													<a>設定</a>
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