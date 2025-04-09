import { Datagrid, DateField, EditButton, List, NumberField, ReferenceField, ReferenceInput, SelectInput, TextField } from 'react-admin';



export const AttributeValueList = () => {
   

    const attributeFilters = [
        <ReferenceInput label="Par Attribut " source="attributeId" reference="attributes" allowEmpty>
            <SelectInput optionText="name" resettable />
        </ReferenceInput>,
    ];
    
    return(
    <List filters={attributeFilters} >
        <Datagrid sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#f0f0f0',
                },
            }}>
            <TextField source="id" />
            <NumberField source="position" />
            <TextField source="value" />
            <TextField source="hexCode" />
            <ReferenceField source="attributeId" reference="attributes" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton label='Modifier' />
        </Datagrid>
    </List>
)};