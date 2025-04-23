import {
  Create,
  SimpleForm,
  usePermissions,
  useGetIdentity,
  Loading,
  ReferenceInput,
  AutocompleteInput,
  required
} from 'react-admin';
import { Typography, Box } from '@mui/material';
import { useCallback } from 'react';

import { CategoryDetails } from './categorie-components/CategoryDetails';
import { CategoryHierarchy } from './categorie-components/CategoryHierarchy';

const CreateCategory = (props: any) => {
  const { isLoading: permissionsLoading, permissions } = usePermissions();
  const { identity, isLoading: identityLoading } = useGetIdentity();
  
  const isSuperAdmin = !permissionsLoading && Array.isArray(permissions) && permissions.includes('superadmin');
  
  const transform = useCallback((data: any) => {
    if (isSuperAdmin) {
      return data;
    }
    if (identity?.clientId) {
      return {
        ...data,
        clientId: identity.clientId
      };
    }
    return data;
  }, [isSuperAdmin, identity]);
  
  if (permissionsLoading || identityLoading) {
    return <Loading />;
  }
  
  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <Typography variant="h5" style={{ 
          marginTop: '16px',
          marginBottom: '16px',
          color: '#333333',
          fontSize: '2rem'
        }}>
          Créer une nouvelle catégorie
        </Typography>
        
        {isSuperAdmin && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <ReferenceInput source="clientId" reference="clients">
              <AutocompleteInput 
                optionText="name" 
                validate={required()} 
                label="Client" 
                helperText="Choisissez le client pour cette catégorie"
              />
            </ReferenceInput>
          </Box>
        )}
        
        <CategoryDetails />
        <CategoryHierarchy isSuperAdmin={isSuperAdmin} />
      </SimpleForm>
    </Create>
  );
};

export default CreateCategory;
