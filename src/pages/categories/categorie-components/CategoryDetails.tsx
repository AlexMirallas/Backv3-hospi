import { Box, Typography } from "@mui/material";
import { maxLength, minLength, required, TextInput } from "react-admin";


const validateName = [required(), minLength(2), maxLength(255)];
const validateSlug = [maxLength(255)];


const slugify = (text:string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           
      .replace(/&/g, '-and-')         
      .replace(/[^\w\-]+/g, '')      
      .replace(/\-\-+/g, '-');        
  };
  
  export const CategoryDetails = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, width: '100%' }}>
        <Typography variant="h6" gutterBottom>Category Details</Typography>
      
      <TextInput 
        source="name" 
        fullWidth 
        validate={validateName} 
        helperText="The name of the category"
        onChange={(event:any) => {
          const slug = slugify(event.target.value);
          event.target.form.slug.value = slug; 
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