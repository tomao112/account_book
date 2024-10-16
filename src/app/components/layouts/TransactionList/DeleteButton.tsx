
import React from 'react'; 
import { Button } from 'primereact/button';

interface DeleteButtonProps {
	onClick: () => void;
}

const IconOnlyButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center gap-3 border-2 rounded-full bg-red-400">
                <Button onClick={onClick} style={{ color: 'white' }} icon="pi pi-trash" rounded outlined aria-label="Filter" />
            </div>
        </div>
    )
}
        
export default IconOnlyButton;