import React from 'react';
import { Button } from 'react-admin';
import RefreshIcon from '@mui/icons-material/Refresh';

interface RefreshButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    label?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ 
    onClick, 
    isLoading = false,
    label = 'Refresh',
    ...rest 
}) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <Button
            label={label}
            onClick={handleClick}
            disabled={isLoading}
            {...rest}
        >
            <RefreshIcon />
        </Button>
    );
};