// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import UserRoutes from './routes/routes.js';
import SideMenu from './components/side-menu/side-menu.js';
import { AuthProvider } from './contexts/auth.js';
import Profile from './components/profile/profile.js';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

      <div
        style={{
          display:'flex',
          height:'100%'
      }}>
        <SideMenu/>
        <UserRoutes/>
        <Profile/>
      </div>

      </BrowserRouter>
    </AuthProvider>
  );
};
