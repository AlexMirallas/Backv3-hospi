import {
  Create,
  SimpleForm,
} from 'react-admin';
import { Typography} from '@mui/material';

import { CategoryDetails } from './categorie-components/CategoryDetails';
import { CategoryHierarchy } from './categorie-components/CategoryHierarchy';


const CreateCategory = (props:any) => (
  <Create {...props}>
    <SimpleForm>
          <Typography variant="h5" style={
                            { marginTop: '16px',
                            marginBottom: '16px',
                            color: '#333333',
                            fontSize: '2rem'
                             }
          }>Créer une nouvelle catégorie</Typography>
          <CategoryDetails />
          <CategoryHierarchy />
    </SimpleForm>
  </Create>
);

export default CreateCategory;