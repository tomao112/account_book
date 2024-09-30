
import React from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';

export default function Tab() {
    const items: MenuItem[] = [
        { label: '収入', icon: 'pi pi-home' },
        { label: '支出', icon: 'pi pi-chart-line' },
        { label: '貯金', icon: 'pi pi-list' },
        { label: '差額', icon: 'pi pi-inbox' }
    ];

    return (
        <div className="card">
            <TabMenu model={items} />
        </div>
    )
}
        