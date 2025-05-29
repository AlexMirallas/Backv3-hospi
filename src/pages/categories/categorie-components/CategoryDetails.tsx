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
        label="Nom"
        fullWidth 
        validate={validateName} 
        helperText="Le nom de la catégorie"
        onChange={(event:any) => {
          const slug = slugify(event.target.value);
          event.target.form.slug.value = slug; 
        }}
      />
      
      <TextInput 
        source="slug" 
        fullWidth 
        validate={validateSlug} 
        helperText="Identifiant convivial pour l'URL (généré automatiquement s'il est laissé vide)"
      />
      
      <TextInput 
        source="description" 
        multiline 
        rows={4} 
        fullWidth
        label="Description" 
        helperText="Description détaillée de la catégorie"
      />
    </Box>
  );