//Implementación con jwt: 

import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (id, password) => {
    try {
      // Aquí haces la solicitud al backend para obtener el token usando las credenciales proporcionadas
      const response = await fetch('https://localhost:7190/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula: id, password: password })
      });
  
      const data = await response.json();
  
      if (response.ok || response.status === 200) {
        // Obtener los roles del usuario desde la respuesta del endpoint
        const roles = data.result.usuario.roles;
  
        // Verificar si el usuario es un administrador
        const isAdmin = roles.includes('ADMIN');
  
        // Establecer el usuario en el estado
        setUser({
          id: data.result.usuario.cedula,
          username: data.result.usuario.nombre + ' ' + data.result.usuario.apellidos,
          isAdmin: isAdmin,
          token: data.result.token
        });
  
        // Redirigir al usuario a la página correspondiente
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        throw new Error(data.errorMessages.join(', ')); // Manejar errores de autenticación
      }
    } catch (error) {
      throw error;
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/');
  };


  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
