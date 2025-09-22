import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './views/Login';
import Dashboard from './views/Dashboard';
import Routers from './views/Routers';
import WebBoards from './views/WebBoards';
import Comments from './views/Comments';
import UserManage from './views/UserManage';
import WebsiteSetting from './views/WebsiteSetting';

import "./assets/scss/MyStyle.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route path='/route' element={<Routers />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='webboards' element={<WebBoards />} />
          <Route path='comments' element={<Comments />} />
          <Route path='users' element={<UserManage />} />
          <Route path='website-setting' element={<WebsiteSetting />} />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>}> </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
