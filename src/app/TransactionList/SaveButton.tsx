
import React from 'react'; 
import { Button } from 'primereact/button';

interface SaveButtonProps {
	onClick: () => void;
}

const IconOnlyButton: React.FC<SaveButtonProps> = ({ onClick }) => {
    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center gap-3 border-2 rounded-full bg-blue-300">
                <Button onClick={onClick} style={{ color: 'white' }} icon="pi pi-save" rounded  aria-label="Filter" />
            </div>
        </div>
    )
}
        
export default IconOnlyButton;