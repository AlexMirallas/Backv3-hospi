import { Datagrid, List, TextField, TextInput,SelectInput, EditButton, FunctionField } from 'react-admin';
import { statusChoices } from '../../enums/enums';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircleFilled';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Chip } from '@mui/material';

export const ClientList = () => {



    const clientFilters = [
        <TextInput label="Nom" source="name" resettable />,
        <TextInput label="Sous-domaine" source="subdomain" resettable />,
        <SelectInput label="Statut" source="status" choices={statusChoices} resettable />,
    ];
    
    return(
    <List filters={clientFilters} >
        <Datagrid rowClick="edit" bulkActionButtons={false} sx={{ fontSize: 14 }}>
            <TextField source="name" label="Nom de Client" />
            <TextField source="subdomain" label="Sous-domaine" />
            <FunctionField source="status" render={(record:any)=>{
                if(!record || !record.status) return null;
                let icon;
                let color: "success" | "warning" | "error" | "default" | "info" = "default";

                switch (record.status) {
                    case "active":
                        icon = <CheckCircleIcon sx={{fontSize:16, mr:0.5 }} />;
                        color = "success";
                        break;
                    case "inactive":
                        icon = <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />;
                        color = "warning";
                        break;
                    case "suspended":
                        icon = <PauseCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />;
                        color = "error";
                        break;
                    case "deleted":
                        icon = <DeleteForeverIcon sx={{ fontSize: 16, mr: 0.5 }} />;
                        color = "default";
                        break;
                    default:
                        icon = <HelpOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />;
                        color = "default";
                }

                const statusName = statusChoices.find(choice => choice.id === record.status)?.name || record.status;

                return (
                    <Chip
                        icon={icon}
                        label={statusName}
                        color={color}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 12, padding: 0.5 }}
                    />
                )
            }} />
            <TextField source="settings" />
            <EditButton label="Modifier" scrollToTop={true} />
        </Datagrid>
    </List>
)};