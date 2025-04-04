import { Box, Typography } from "@mui/material";
import { AutocompleteInput, FormDataConsumer, NumberInput, ReferenceInput } from "react-admin";





export const CategoryHierarchy = () => (
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