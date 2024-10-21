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
            style: { color: 'white', fontSize: '1rem'},
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
            <div>
                <SpeedDial model={items} direction="right" style={{ position: 'absolute', top: '-2.2rem', right: '4.43rem',   }} 
                    buttonStyle={{ width: '2.5rem', height: '2.5rem', border: '1px solid rgb(144, 195, 207)'}}
                    />
            </div>
        </div>
    );
}