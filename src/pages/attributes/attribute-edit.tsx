import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    ReferenceManyField,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    required,
    useRecordContext,
    TopToolbar,
    Button,
    EditProps,
    NumberInput,
    BooleanInput,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {  Typography } from '@mui/material';




// Custom action buttons for the attribute values list
const AttributeValuesActions = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    if (!record) return null;
    
    const handleClick = () => {
        navigate('/attribute-values/create', {
            state: { attributeId: record.id }
        });
    };
    
    return (
        <TopToolbar>
            <Button
                onClick={handleClick}
                label="Create Value"
                startIcon={<AddIcon />}
            />
        </TopToolbar>
    );
};

export const AttributeEdit: React.FC<EditProps> = (props) => (
    <Edit {...props} actions={<AttributeValuesActions />}>
        <SimpleForm>
            <TextInput source="name" validate={required()}  />
            <NumberInput source="position" />
            <BooleanInput source="isActive" label="Active" defaultValue={true} />
            <Typography variant="h6" mt={4} mb={2}>Attribute Values</Typography>
            <ReferenceManyField
                label="Possible Values"
                reference="attribute-values"
                target="attributeId"
                filter={{ attributeId: props.id }}
                sort={{ field: 'position', order: 'ASC' }}
            >
                <Datagrid bulkActionButtons={false} rowClick="edit">
                    <TextField source="value" />
                    <TextField source="position" label="Position" />
                    <EditButton />
                    <DeleteButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);