import { 
    Edit, 
    NumberInput, 
    ReferenceInput, 
    SimpleForm, 
    TextInput, 
    AutocompleteInput,
    usePermissions,
    Loading,
    required,
    FormDataConsumer
} from 'react-admin';
import { Typography, Box } from '@mui/material';

export const AttributeValueEdit = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    
    const isSuperAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('superadmin');
    
    if (permissionsLoading) {
        return <Loading />;
    }
    
    return (
        <Edit>
            <Typography variant="h5" style={{ 
                marginTop: '16px',
                marginBottom: '16px',
                color: '#333333',
                fontSize: '2rem'
            }}>
                Modifier la valeur d'attribut
            </Typography>
            
            <SimpleForm>
                <TextInput source="id" disabled fullWidth />
                
                {isSuperAdmin && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <ReferenceInput source="clientId" reference="clients">
                            <AutocompleteInput 
                                optionText="name" 
                                label="Client" 
                                helperText="Client associé à cette valeur d'attribut (lecture seule)"
                                disabled
                            />
                        </ReferenceInput>
                    </Box>
                )}
                
                <FormDataConsumer>
                    {({ formData, ...rest }) => {
                        const attributeFilter = isSuperAdmin && formData?.clientId 
                            ? { clientId: formData.clientId }
                            : {};
                            
                        return (
                            <ReferenceInput 
                                source="attributeId" 
                                reference="attributes"
                                filter={attributeFilter}
                                label="Attribut"
                                {...rest}
                            >
                                <AutocompleteInput optionText="name" />
                            </ReferenceInput>
                        );
                    }}
                </FormDataConsumer>
                
                <TextInput source="value" validate={required()} fullWidth />
                <NumberInput source="position" validate={required()} min={1} fullWidth />
                <TextInput 
                    source="hexCode" 
                    label="Hex Code if colour" 
                    fullWidth 
                    helperText="Laisser vide si ce n'est pas une couleur"
                />
            </SimpleForm>
        </Edit>
    );
};
