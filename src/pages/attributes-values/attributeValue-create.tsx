import { 
    Create, 
    SimpleForm, 
    TextInput, 
    ReferenceInput, 
    NumberInput,
    usePermissions,
    useGetIdentity,
    Loading,
    AutocompleteInput,
    required,
    FormDataConsumer
} from "react-admin";
import { useCallback, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const AttributeValueCreate = () => {
    const location = useLocation();
    const attributeIdFromState = location.state?.attributeId; // Get attributeId if passed from AttributeEdit
    
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const { identity, isLoading: identityLoading } = useGetIdentity();
    
    // Check if user is superadmin
    const isSuperAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('superadmin');
    const isAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('admin') && !isSuperAdmin;
    

    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    const transform = useCallback((data: any) => {
        if (isAdmin && identity?.clientId) {
            return {
                ...data,
                clientId: identity.clientId
            };
        }
        
        if (isSuperAdmin && selectedClientId) {
            return {
                ...data,
                clientId: selectedClientId
            };
        }
        
        
        return data;
    }, [isAdmin, identity, isSuperAdmin, selectedClientId]);

    if (permissionsLoading || identityLoading) {
        return <Loading />;
    }

    
    const canCreate = isSuperAdmin || isAdmin;
    if (!canCreate) {
        return <Typography color="error">Vous n'avez pas l'autorisation de créer des valeurs.</Typography>;
    }

    return (
        <Create transform={transform}>
            <Typography variant="h5" style={{ 
                marginTop: '16px',
                marginBottom: '16px',
                fontWeight: 'bold',
                color: '#333333',
                textAlign: 'center',
                fontSize: '2rem'
            }}>
                Créer une nouvelle valeur d'attribut
            </Typography>
            
            <SimpleForm>
                {isSuperAdmin && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <ReferenceInput source="clientId" reference="clients">
                            <AutocompleteInput 
                                optionText="name" 
                                validate={required()} 
                                label="Client" 
                                helperText="Sélectionnez le client auquel appartient cette valeur d'attribut"
                                onChange={(value) => setSelectedClientId(value)}
                            />
                        </ReferenceInput>
                    </Box>
                )}
                
                <FormDataConsumer>
                    {({ formData, ...rest }) => {
                        const attributeFilter = isSuperAdmin && selectedClientId 
                            ? { clientId: selectedClientId }
                            : {};
                            
                        return (
                            <ReferenceInput 
                                source="attributeId" 
                                reference="attributes"
                                defaultValue={attributeIdFromState} 
                                filter={attributeFilter}
                                {...rest}
                            >
                                <AutocompleteInput 
                                    optionText="name"
                                    label="Attribut"
                                    helperText="Sélectionnez l'attribut auquel cette valeur appartient" 
                                    disabled={!!attributeIdFromState} 
                                    validate={required()}
                                />
                            </ReferenceInput>
                        );
                    }}
                </FormDataConsumer>
                
                <TextInput source="value" label="Valeur" validate={required()} fullWidth />
                <NumberInput source="position" validate={required()} min={1} fullWidth />
                <TextInput source="hexCode" label="Code hex si couleur" fullWidth />
            </SimpleForm>
        </Create>
    );
};

export default AttributeValueCreate;