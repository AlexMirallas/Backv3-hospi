import { Admin, EditGuesser, ListGuesser, Resource, ShowGuesser, LoginWithEmail } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import  authProvider  from "./authProvider"; 


export const App = () => 

<Admin loginPage={LoginWithEmail} dataProvider={dataProvider} layout={Layout} authProvider={authProvider} >
    <Resource name="users" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="products" />
    <Resource name="attributes" />
    <Resource name="attribute-values" />
    <Resource name="categories" />    
</Admin>;
