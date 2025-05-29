import { Admin, Resource, LoginWithEmail, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import myDataProvider from "./dataProvider";
import authProvider from "./authProvider";


import { UserShow } from "./pages/users/user-show";
import UserCreate from "./pages/users/user-create";
import UserEdit  from "./pages/users/user-edit";
import { UserList } from "./pages/users/user-list";

import ProductCreate from "./pages/products/product-create";
import { ProductList } from "./pages/products/product-list";
import { ProductEdit } from "./pages/products/product-edit";
import { ProductShow } from "./pages/products/product-show";

import CreateCategory from "./pages/categories/category-create";
import { CategoryList } from "./pages/categories/category-list";
import { CategoryEdit } from "./pages/categories/category-edit";
import { CategoryShow } from "./pages/categories/category-show";

import { AttributeList } from "./pages/attributes/attribute-list";
import AttributeCreate from "./pages/attributes/attribute-create";
import { AttributeEdit } from "./pages/attributes/attribute-edit";
import { AttributeShow } from "./pages/attributes/attribute-show";

import AttributeValueCreate from "./pages/attributes-values/attributeValue-create";
import { AttributeValueEdit } from "./pages/attributes-values/attributeValue-edit";
import { AttributeValueShow } from "./pages/attributes-values/attributeValue-show";
import { AttributeValueList } from "./pages/attributes-values/attributeValue-list";


import { VariantShow } from "./pages/product-variants/variants-show";
import { VariantEdit } from "./pages/product-variants/variants-edit";

import { ClientList } from "./pages/clients/client-list";
import { ClientShow } from "./pages/clients/client-show";
import { ClientEdit } from "./pages/clients/client-edit";
import { ClientCreate } from "./pages/clients/client-create";

import ImageEdit from "./components/imageComponents/Image-Edit";

import { Dashboard } from "./pages/dashboard/DashBoard";


import UserIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ProductIcon from '@mui/icons-material/ProductionQuantityLimits';
import AttributeIcon from '@mui/icons-material/Settings';
import AttributeValueIcon from '@mui/icons-material/SettingsInputComponent';






export const App = () => {

    
    return(
    <Admin
        loginPage={LoginWithEmail}
        dataProvider={myDataProvider}
        layout={Layout}
        authProvider={authProvider}
        dashboard={Dashboard}
    >
        {(permissions) => {

            const isSuperAdmin = Array.isArray(permissions) && permissions.includes('superadmin');
            const isAdmin = Array.isArray(permissions) && permissions.includes('admin');

            const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

            return (
                <>
                    {isAdminOrSuperAdmin  && (
                    <>
                        <Resource
                            icon={UserIcon} name="users" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} options={{ label: 'Utilisateurs' }}
                        />
                        <Resource
                            icon={ProductIcon} name="products" list={ProductList} edit={ProductEdit} show={ProductShow} create={ProductCreate} options={{ label: 'Produits' }}
                        />
                        <Resource
                            icon={CategoryIcon} name="categories" list={CategoryList} edit={CategoryEdit} show={CategoryShow} create={CreateCategory} options={{ label: 'Catégories' }}
                        />
                        <Resource
                            icon={AttributeIcon} name="Attributes" list={AttributeList} edit={AttributeEdit} show={AttributeShow} create={AttributeCreate} options={{ label: 'Attributs' }}
                        />
                        <Resource
                            icon={AttributeValueIcon} name="attribute-values" list={AttributeValueList} edit={AttributeValueEdit} show={AttributeValueShow} create={AttributeValueCreate} options={{ label: 'Valeurs des attributs' }}
                        />
                        <Resource
                             name="variants"  edit={VariantEdit} show={VariantShow}
                        />
                        <Resource
                             name="images"  edit={ImageEdit} show={ShowGuesser} 
                        />
                        <Resource
                            name="stock-movements" 
                        />
                        <Resource
                            name="adjust-stock" 
                        />
                    </>
                    )}
                    
                    {isSuperAdmin && (
                        <>
                            <Resource
                                icon={UserIcon}
                                name="clients"
                                list={ClientList}
                                edit={ClientEdit}
                                show={ClientShow}
                                create={ClientCreate}
                            />
                        </>
                    )}
                </>
            );
        }}
    </Admin>
)};