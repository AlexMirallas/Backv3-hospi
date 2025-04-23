import { DataProvider, fetchUtils } from 'react-admin';


/**
 * Check if a value is a file object with a rawFile property
 */
const isFileObject = (value: any): value is { rawFile: File } => 
    value && typeof value === 'object' && value.rawFile instanceof File;

/**
 * Check if a value is an array of file objects
 */
const isArrayOfFileObjects = (value: any): value is Array<{ rawFile: File }> =>
    Array.isArray(value) && value.every(item => isFileObject(item));

/**
 * Enhance a dataProvider to handle file uploads.
 * It calls the backend's /upload endpoint for files and replaces the file objects
 * with the URLs returned by the backend before calling the original dataProvider method.
 */
export const addUploadCapabilities = (dataProvider: DataProvider): DataProvider => ({
    ...dataProvider,
    create: async (resource, params) => {
        if (resource !== 'products' && resource !== 'variants') {
            // fallback to the default implementation
            return dataProvider.create(resource, params);
        }

        const newParams = { ...params, data: { ...params.data } };
        const productId = newParams.data.id; 
        const imageFieldsToUpload: string[] = [];

        // Identify image fields that need uploading
        if (isFileObject(newParams.data.mainImage)) imageFieldsToUpload.push('mainImage');
        if (isArrayOfFileObjects(newParams.data.additionalImages)) imageFieldsToUpload.push('additionalImages');
        if (isFileObject(newParams.data.image)) imageFieldsToUpload.push('image'); // For variants

        if (imageFieldsToUpload.length === 0) {
            // No new images, call original provider
            return dataProvider.create(resource, params);
        }

        // Upload files first
        try {
            const uploadPromises = imageFieldsToUpload.map(async (fieldName) => {
                const filesToUpload = Array.isArray(newParams.data[fieldName]) 
                    ? newParams.data[fieldName] 
                    : [newParams.data[fieldName]];
                
                const formData = new FormData();
                filesToUpload.forEach((fileObj: { rawFile: File }) => {
                    formData.append('files', fileObj.rawFile); // 'files' should match your NestJS endpoint @UploadedFiles('files')
                });

                // Replace with your actual API URL and auth logic
                const apiUrl = `${import.meta.env.VITE_API_URL || ''}/products/images/product/${productId}`; // Adjust the URL as needed
                const token = localStorage.getItem('token'); 
                const httpClient = fetchUtils.fetchJson;

                const { json } = await httpClient(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: token ? new Headers({ Authorization: `Bearer ${token}` }) : new Headers(),
                });

                // Assuming your API returns { urls: ['url1', 'url2', ...] }
                if (Array.isArray(newParams.data[fieldName])) {
                    newParams.data[fieldName] = json.urls; // Assign array of URLs
                } else {
                    newParams.data[fieldName] = json.urls[0]; // Assign single URL
                }
            });

            await Promise.all(uploadPromises);
            // Now call the original dataProvider with updated data (URLs instead of files)
            return dataProvider.create(resource, newParams);

        } catch (error) {
            console.error("Image upload failed:", error);
            throw new Error('Image upload failed. Please try again.'); // Propagate error
        }
    },

    update: async (resource, params) => {
        if (resource !== 'products' && resource !== 'variants') {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }

        const newParams = { ...params, data: { ...params.data } };
        const imageFieldsToUpload: string[] = [];

        // Identify image fields that need uploading in update
        if (isFileObject(newParams.data.mainImage)) imageFieldsToUpload.push('mainImage');
        if (isArrayOfFileObjects(newParams.data.additionalImages)) imageFieldsToUpload.push('additionalImages');
        if (isFileObject(newParams.data.image)) imageFieldsToUpload.push('image'); // For variants

        if (imageFieldsToUpload.length === 0) {
            // No new images, call original provider
            return dataProvider.update(resource, params);
        }

        // --- Upload logic (same as in create) ---
        try {
            const uploadPromises = imageFieldsToUpload.map(async (fieldName) => {
                const filesToUpload = Array.isArray(newParams.data[fieldName]) 
                    ? newParams.data[fieldName] 
                    : [newParams.data[fieldName]];
                
                const formData = new FormData();
                filesToUpload.forEach((fileObj: { rawFile: File }) => {
                    // Only upload if it's a new file object
                    if (fileObj.rawFile instanceof File) {
                        formData.append('files', fileObj.rawFile);
                    }
                });

                // Only proceed if there are actual files to upload for this field
                if (!formData.has('files')) {
                    // If the field contained existing URLs (not file objects), keep them
                    if (Array.isArray(newParams.data[fieldName])) {
                         newParams.data[fieldName] = newParams.data[fieldName]
                            .filter(item => typeof item === 'string' || (item && typeof item.src === 'string')) // Keep existing URLs/objects with src
                            .map(item => typeof item === 'string' ? item : item.src); // Extract URL if needed
                    } else if (typeof newParams.data[fieldName] === 'object' && newParams.data[fieldName]?.src) {
                         newParams.data[fieldName] = newParams.data[fieldName].src; // Keep existing URL
                    }
                    return; // Skip API call if no new files
                }


                const apiUrl = `${import.meta.env.VITE_API_URL || ''}/uploads`;
                const token = localStorage.getItem('token');
                const httpClient = fetchUtils.fetchJson;

                const { json } = await httpClient(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: token ? new Headers({ Authorization: `Bearer ${token}` }) : new Headers(),
                });

                // Combine new URLs with existing ones if necessary (for multiple images)
                if (Array.isArray(newParams.data[fieldName])) {
                    const existingUrls = params.data[fieldName]
                        ?.filter((item: any) => typeof item === 'string' || (item && typeof item.src === 'string')) // Filter out old file objects
                        .map((item: any) => typeof item === 'string' ? item : item.src) || []; // Get existing URLs
                    newParams.data[fieldName] = [...existingUrls, ...json.urls];
                } else {
                    newParams.data[fieldName] = json.urls[0]; // Assign single URL
                }
            });

            await Promise.all(uploadPromises);
             // Now call the original dataProvider with updated data (URLs instead of files)
            return dataProvider.update(resource, newParams);

        } catch (error) {
            console.error("Image upload failed:", error);
            throw new Error('Image upload failed. Please try again.');
        }
    },
});