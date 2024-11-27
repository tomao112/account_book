// account_book/src/app/components/layouts/sidebar.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { Tooltip } from 'primereact/tooltip';
import TransactionList from './Chart/page';
import Link from 'next/link';

export default function Headless() {

    return (
        <div className='w-20 flex flex-col h-screen'>
            <Tooltip target=".tooltip" className="tooltip-custom" />
            <div className='flex items-center justify-center flex-col gap-5'>
							<Link className='tooltip w-14 h-14 flex items-center justify-center' data-pr-tooltip="daily" href={"./TransactionList"}>
                <span className='pi pi-book mt-2' style={{ fontSize: '1.75rem', color: '#495057' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="calendar" href={"./income-expense"}>
								<span className='pi pi-calendar mt-2' style={{ fontSize: '1.75rem', color: '#495057' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="chart" href={"./Chart"}>
								<span className='pi pi-chart-line mt-2' style={{ fontSize: '1.75rem', color: '#495057' }}></span>
							</Link>
							<Link className="tooltip w-14 h-14 flex items-center justify-center" data-pr-tooltip="setting" href={"./"}>
								<span className='pi pi-cog mt-2' style={{ fontSize: '1.75rem', color: '#495057' }}></span>
							</Link>
            </div>
        </div>
    )
}