import { Admin, Resource, LoginWithEmail, ListGuesser, EditGuesser, ShowGuesser, Edit } from "react-admin";
import { Layout } from "./Layout";
import  myDataProvider  from "./dataProvider";
import  authProvider  from "./authProvider"; 

import { UserShow } from "./pages/users/user-show";
import UserCreate  from "./pages/users/user-create";
import { UserEdit } from "./pages/users/user-edit";
import { UserList } from "./pages/users/user-list";

import  ProductCreate  from "./pages/products/product-create";
import { ProductList } from "./pages/products/product-list";
import { ProductEdit } from "./pages/products/product-edit";
import { ProductShow } from "./pages/products/product-show";

import  CreateCategory  from "./pages/categories/category-create";
import { CategoryList } from "./pages/categories/category-list";
import { CategoryEdit } from "./pages/categories/category-edit";
import { CategoryShow } from "./pages/categories/category-show";

import { AttributeList } from "./pages/attributes/attribute-list";
import  AttributeCreate  from "./pages/attributes/attribute-create";
import { AttributeEdit } from "./pages/attributes/attribute-edit";
import { AttributeShow } from "./pages/attributes/attribute-show";

import  AttributeValueCreate  from "./pages/attributes-values/attributeValue-create";
import { AttributeValueEdit } from "./pages/attributes-values/attributeValue-edit";
import { AttributeValueShow } from "./pages/attributes-values/attributeValue-show";
import { AttributeValueList } from "./pages/attributes-values/attributeValue-list";

import { VariantList } from "./pages/product-variants/variants-list";

import { Dashboard } from "./pages/dashboard/dashboard";


import UserIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ProductIcon from '@mui/icons-material/ProductionQuantityLimits';
import { VariantShow } from "./pages/product-variants/variants-show";
import { VariantEdit } from "./pages/product-variants/variants-edit";



export const App = () => 

<Admin 
    loginPage={LoginWithEmail} 
    dataProvider={myDataProvider} 
    layout={Layout} 
    authProvider={authProvider}  
    dashboard={Dashboard}
>
        <Resource 
            icon={UserIcon} 
            name="users" 
            list={UserList} 
            edit={UserEdit} 
            show={UserShow} 
            create={UserCreate} 
        />
        <Resource 
            icon={ProductIcon} 
            name="products" 
            list={ProductList} 
            edit={ProductEdit} 
            show={ProductShow} 
            create={ProductCreate} 
        />
        <Resource 
            name="attributes" 
            list={AttributeList} 
            edit={AttributeEdit} 
            show={AttributeShow}
            create={AttributeCreate} 
        />
        <Resource 
            name="attribute-values" 
            list={AttributeValueList} 
            edit={AttributeValueEdit} 
            show={AttributeValueShow}
            create={AttributeValueCreate}
        />
        <Resource 
            icon={CategoryIcon} 
            name="categories" 
            list={CategoryList} 
            edit={CategoryEdit} 
            show={CategoryShow} 
            create={CreateCategory} 
        />
        <Resource
            name="variants" 
            list={VariantList} 
            edit={VariantEdit} 
            show={VariantShow} 
        />
</Admin>;
