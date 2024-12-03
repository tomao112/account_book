
import React from 'react'; 
import { Button } from 'primereact/button';

interface EditButtonProps {
	onClick: () => void;
}

const IconOnlyButton: React.FC<EditButtonProps> = ({ onClick }) => {
    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center gap-3 border-2 rounded-full bg-muted-green">
                <Button onClick={onClick} style={{ color: 'white' }} icon="pi pi-pencil" rounded  aria-label="Filter" />
            </div>
        </div>
    )
}
        
export default IconOnlyButton;