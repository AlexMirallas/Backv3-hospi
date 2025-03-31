import { DateInput, Edit, SimpleForm, TextInput } from 'react-admin';
export const UserEdit = () => (    
    <Edit>        
        <SimpleForm>            
            <TextInput source="id" />
                <TextInput source="email" />
                <TextInput source="firstName" />            
                <TextInput source="lastName" />            
                <TextInput source="phone" />            
                <TextInput source="roles" />            
                <DateInput source="createdAt" />            
                <DateInput source="updatedAt" />        
        </SimpleForm>    
    </Edit>);