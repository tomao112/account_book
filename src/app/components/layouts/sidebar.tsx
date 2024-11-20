// account_book/src/app/components/layouts/sidebar.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { Tooltip } from 'primereact/tooltip';
import TransactionList from './Chart/page';
import Link from 'next/link';

export default function Headless() {

    return (
        <div className='w-20 flex flex-col'>
            <Tooltip target=".tooltip" className="tooltip-custom" />
            <div className='flex items-center justify-center flex-col gap-5'>
							<Link className='tooltip w-14 h-14 flex items-center justify-center' data-pr-tooltip="日別" href={"./TransactionList"}>
                <span className='pi pi-book mt-2' style={{ fontSize: '1.75rem' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="カレンダー" href={"./income-expense"}>
								<span className='pi pi-calendar mt-2' style={{ fontSize: '1.75rem' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="チャート" href={"./Chart"}>
								<span className='pi pi-chart-line mt-2' style={{ fontSize: '1.75rem' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="設定" href={"./"}>
								<span className='pi pi-cog mt-2' style={{ fontSize: '1.75rem' }}></span>
							</Link>
            </div>
        </div>
    )
}