import {
  Create,
  SimpleForm,
} from 'react-admin';
import { CardContent, Typography, Card } from '@mui/material';

import { CategoryDetails } from './categorie-components/CategoryDetails';
import { CategoryHierarchy } from './categorie-components/CategoryHierarchy';


const CreateCategory = (props:any) => (
  <Create {...props}>
    <SimpleForm>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Create New Category</Typography>
          
          <CategoryDetails />
          <CategoryHierarchy />
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);

export default CreateCategory;