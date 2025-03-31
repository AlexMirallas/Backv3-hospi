import { Admin, EditGuesser, ListGuesser, Resource, ShowGuesser, LoginWithEmail } from "react-admin";
import { Layout } from "./Layout";
import  myDataProvider  from "./dataProvider";
import  authProvider  from "./authProvider"; 

import { UserShow } from "./pages/users/user-show";
import UserCreate  from "./pages/users/user-create";
import { UserEdit } from "./pages/users/user-edit";
import { UserList } from "./pages/users/user-list";

import  ProductCreate  from "./pages/products/product-create";

import  CreateCategory  from "./pages/categories/category-create";
import { CategoryList } from "./pages/categories/category-list";
import { CategoryEdit } from "./pages/categories/category-edit";
import { CategoryShow } from "./pages/categories/category-show";

import UserIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ProductIcon from '@mui/icons-material/ProductionQuantityLimits';


export const App = () => 

<Admin loginPage={LoginWithEmail} dataProvider={myDataProvider} layout={Layout} authProvider={authProvider}  >
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
    list={ListGuesser} 
    edit={EditGuesser} 
    show={ShowGuesser} 
    create={ProductCreate} 
    />
    <Resource 
    name="attributes" 
    list={ListGuesser} 
    edit={EditGuesser} 
    show={ShowGuesser} 
    />
    <Resource 
    name="attribute-values" 
    list={ListGuesser} 
    edit={EditGuesser} 
    show={ShowGuesser} 
    />
    <Resource 
    icon={CategoryIcon} 
    name="categories" 
    list={CategoryList} 
    edit={CategoryEdit} 
    show={CategoryShow} 
    create={CreateCategory} 
    />    
</Admin>;
