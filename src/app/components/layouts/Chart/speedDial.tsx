import React, { useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/router';

export default function SpeedDialComponent() { // コンポーネント名を修正
    const toast = useRef<Toast>(null);
    // const router = useRouter();
    const items: MenuItem[] = [
        {
            label: 'Add',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current?.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current?.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
            }
        },
    ];

    return (
        <div className="card">
            <div style={{ position: 'relative' }}>
                <SpeedDial model={items} direction="right" style={{ position: 'absolute', top: '-1.2rem', right: '2rem'  }} />
            </div>
        </div>
    );
}