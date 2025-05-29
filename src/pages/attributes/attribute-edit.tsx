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




const AttributeValuesActions = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    if (!record) return null;
    
    const handleClick = () => {
        navigate('/attribute-values/create');
    };
    
    return (
        <TopToolbar>
            <Button
                onClick={handleClick}
                label="Créer une valeur"
                startIcon={<AddIcon />}
            />
        </TopToolbar>
    );
};

export const AttributeEdit: React.FC<EditProps> = (props) => (
    <Edit {...props} actions={<AttributeValuesActions />}>
        <SimpleForm>
            <TextInput source="name" label="Nom" validate={required()}  />
            <NumberInput source="position" />
            <BooleanInput source="isActive" label="Est actif" defaultValue={true} />
            <Typography variant="h6" mt={4} mb={2}>Valeurs d'attribut</Typography>
            <ReferenceManyField
                label="Valeurs possibles"
                reference="attribute-values"
                target="attributeId"
                filter={{ attributeId: props.id }}
                sort={{ field: 'position', order: 'ASC' }}
            >
                <Datagrid bulkActionButtons={false} rowClick="edit">
                    <TextField source="value" label="Valeur" />
                    <TextField source="position" label="Position" />
                    <EditButton />
                    <DeleteButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);