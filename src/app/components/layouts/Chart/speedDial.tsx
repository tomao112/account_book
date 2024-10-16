// speedDialComponents
import React, { useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast'; //ユーザーに通知を表示
import { MenuItem } from 'primereact/menuitem';  
// import { useRouter } from 'next/router';

export default function SpeedDialComponent() {
    const toast = useRef<Toast>(null);
    // const router = useRouter();
    const items: MenuItem[] = [
        {
            label: 'Add',  //表示名
            icon: 'pi pi-pencil',  //アイコン
            style: { color: 'white'},
            command: () => {  //クリック時の実行換数
                toast.current?.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            style: { color: 'white'},
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