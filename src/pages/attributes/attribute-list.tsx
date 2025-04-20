import { Datagrid, List, TextField, EditButton, BooleanField } from 'react-admin';
import { CustomCheckIcon } from '../../components/CustomCheckIcon';
import { CustomCrossIcon } from '../../components/CustomCrossIcon';
import { SuperAdminClientFilterList } from '../../components/SuperAdminClientFilterList';

export const AttributeList = () => {

    
    return(
    <List aside={<SuperAdminClientFilterList/>}>
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="id" />
            <TextField source="name" label="Nom" />
            <TextField source="position" label="Position" />
            <BooleanField source="isActive" label="Actif" TrueIcon={CustomCheckIcon} FalseIcon={CustomCrossIcon} />            
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};