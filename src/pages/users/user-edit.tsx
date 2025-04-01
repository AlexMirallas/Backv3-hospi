import { DateInput, Edit, SimpleForm, TextInput } from 'react-admin';
export const UserEdit = () => (    
    <Edit>        
        <SimpleForm>            
                <TextInput source="id" disabled />
                <TextInput source="email" required />
                <TextInput source="firstName" required />            
                <TextInput source="lastName" required />            
                <TextInput source="phone" required />            
                <TextInput source="roles" disabled />            
                <DateInput source="createdAt" disabled />            
                <DateInput source="updatedAt" disabled />        
        </SimpleForm>    
    </Edit>);