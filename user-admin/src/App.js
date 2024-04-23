import * as React from 'react';
import {Admin, Resource} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import {UserCreate, UserEdit, UserList} from './Users';

const server = process.env.USER_API || 'http://localhost:4000';
const dataProvider = jsonServerProvider(server);
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="users"
      list={UserList}
      create={UserCreate}
      edit={UserEdit}
    />
  </Admin>
);

export default App;
