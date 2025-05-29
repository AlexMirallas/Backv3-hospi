import { Toolbar, SaveButton, DeleteButton, useNotify, useRedirect } from 'react-admin';




export const VariantEditToolbar = (props: any) => {
    const notify = useNotify();
    const redirect =  useRedirect();

    const handleDeleteSuccess = () => {
        notify('Variante supprimée avec succès', { type: 'info' });
        redirect('/products');
    };

    const handleDeleteError = (error: any) => {
        notify(`Erreur lors de la suppression : ${error.message}`, { type: 'warning' });
    };

    return (
        <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
            <DeleteButton
                mutationMode="pessimistic" 
                confirmTitle="Confirmer la suppression"
                confirmContent="Êtes-vous sûr de vouloir supprimer cette variante ? Cette action est irréversible."
                mutationOptions={{
                    onSuccess: handleDeleteSuccess,
                    onError: handleDeleteError,
                }}
            />
        </Toolbar>
    );
};