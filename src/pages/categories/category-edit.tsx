import { 
    Edit, 
    SimpleForm, 
    usePermissions, 
    ReferenceInput,
    AutocompleteInput,
    TextInput,
    FormDataConsumer
} from 'react-admin';
import { Typography, Box } from '@mui/material';
import { CategoryHierarchy } from './categorie-components/CategoryHierarchy';
import { CategoryDetails } from './categorie-components/CategoryDetails';

export const CategoryEdit = () => {
    const { isLoading: permissionsLoading, permissions } = usePermissions();
    const isSuperAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('superadmin');
    
    return(
        <Edit>
            <Typography variant="h5" style={{ 
                marginTop: '16px',
                marginBottom: '16px',
                color: '#333333',
                fontSize: '2rem'
            }}>
                Modifier la catégorie
            </Typography>
            
            <SimpleForm>
                <TextInput source="id" disabled fullWidth />
                
                {isSuperAdmin && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <ReferenceInput source="clientId" reference="clients">
                            <AutocompleteInput 
                                optionText="name" 
                                label="Client" 
                                helperText="Client associé à cette catégorie (lecture seule)"
                                disabled
                            />
                        </ReferenceInput>
                    </Box>
                )}
                
                {!isSuperAdmin && (
                    <TextInput source="clientId" style={{ display: 'none' }} />
                )}
                
                <CategoryDetails />
                
                <FormDataConsumer>
                    {({ formData }) => (
                        <CategoryHierarchy 
                            isSuperAdmin={isSuperAdmin} 
                        />
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Edit>
    );
};
