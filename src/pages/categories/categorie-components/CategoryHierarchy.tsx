import { ReferenceInput, AutocompleteInput, FormDataConsumer } from 'react-admin';

export const CategoryHierarchy = ({ isSuperAdmin }: { isSuperAdmin: boolean },) => {
  return (
    <FormDataConsumer>
      {({ formData, ...rest }) => {
        const categoryFilter = isSuperAdmin && formData?.clientId 
          ? { clientId: formData.clientId }
          : {};
          
        return (
          <ReferenceInput
            source="parentId"
            reference="categories"
            filter={categoryFilter}
            {...rest}
          >
            <AutocompleteInput
              optionText="name"
              label="Parent Category"
              helperText="Select a parent category (optional)"
            />
          </ReferenceInput>
        );
      }}
    </FormDataConsumer>
  );
};