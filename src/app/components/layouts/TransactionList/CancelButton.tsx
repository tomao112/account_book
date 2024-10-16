
import React from 'react'; 
import { Button } from 'primereact/button';

interface CancelButtonProps {
	onClick: () => void;
}

const IconOnlyButton: React.FC<CancelButtonProps> = ({ onClick }) => {
    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center gap-3 border-2 rounded-full bg-gray-300">
                <Button onClick={onClick} style={{ color: 'white' }} icon="pi pi-times" rounded  aria-label="Filter" />
            </div>
        </div>
    )
}
        
export default IconOnlyButton;