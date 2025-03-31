import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  required,
  maxLength,
  minLength,
  AutocompleteInput,
  NumberInput,
  FormDataConsumer
} from 'react-admin';
import { CardContent, Box, Typography, Card } from '@mui/material';

// Validation rules
const validateName = [required(), minLength(2), maxLength(255)];
const validateSlug = [maxLength(255)];

// Helper for generating the slug from name
const slugify = (text:string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word characters
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

// Component for category description and metadata
const CategoryDetails = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
    <Typography variant="h6" gutterBottom>Category Details</Typography>
    
    <TextInput 
      source="name" 
      fullWidth 
      validate={validateName} 
      helperText="The name of the category"
      onChange={(e) => {
        // Optional - triggers slug auto-generation on name change
        const nameField = document.querySelector('[name="name"]');
        const slugField = document.querySelector('[name="slug"]');
        if (nameField && slugField && !slugField.value) {
          slugField.value = slugify(nameField.value);
          // Dispatch input event to notify React Admin of the change
          slugField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }}
    />
    
    <TextInput 
      source="slug" 
      fullWidth 
      validate={validateSlug} 
      helperText="URL-friendly identifier (auto-generated if left empty)"
    />
    
    <TextInput 
      source="description" 
      multiline 
      rows={4} 
      fullWidth 
      helperText="Detailed description of the category"
    />
  </Box>
);

// Component for hierarchy settings
const CategoryHierarchy = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
    <Typography variant="h6" gutterBottom>Category Hierarchy</Typography>
    
    <ReferenceInput source="parentId" reference="categories">
      <AutocompleteInput 
        label="Parent Category" 
        fullWidth
        optionText="name"
        helperText="Select a parent category (leave empty for top-level categories)"
      />
    </ReferenceInput>
    
    <FormDataConsumer>
      {({ formData, ...rest }) => formData.parentId && (
        <NumberInput 
          source="parentId" 
          disabled
          helperText="Parent category ID (automatically set)"
          {...rest}
        />
      )}
    </FormDataConsumer>
  </Box>
);

// Main CreateCategory component
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