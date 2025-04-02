import { Toolbar, SaveButton } from 'react-admin';

export const CustomToolbar = (props: any) => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);