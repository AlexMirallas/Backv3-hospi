import { Edit, SimpleForm} from 'react-admin';
import { CategoryHierarchy } from './categorie-components/CategoryHierarchy';
import { CategoryDetails } from './categorie-components/CategoryDetails';

export const CategoryEdit = () => {
    
    return(
    <Edit>
        <SimpleForm>
            <CategoryDetails />
            <CategoryHierarchy />
        </SimpleForm>
    </Edit>
)};