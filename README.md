# Sistema de Autogestión ASEHELLMANN

Aplicación web desarrollada para la automatización de procesos internos de la asociación ASEHELLMANN, permitiendo gestionar información mediante una interfaz web moderna conectada a una API backend.

El proyecto está compuesto por dos partes principales:

- **Frontend:** Aplicación web desarrollada con React
- **Backend:** API desarrollada con ASP.NET y C#
- **Base de datos:** SQL Server

---

# Tecnologías utilizadas

## Frontend
- React
- JavaScript
- HTML
- CSS
- Bootstrap

## Backend
- ASP.NET Web API
- C#
- Entity Framework

## Base de datos
- SQL Server

---

# Estructura del proyecto

```
asehellmann-system
│
├── frontend
│   └── react-app
│
├── backend
│   └── asehellmann-api
│
└── README.md
```

---

# Requisitos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- .NET SDK
- SQL Server
- Visual Studio o Visual Studio Code
- Git (opcional)

---

# Configuración de la base de datos

El backend utiliza **Entity Framework** para manejar la base de datos.

Antes de ejecutar el proyecto se debe configurar el **connection string**.

1. Abrir el archivo:

```
appsettings.json
```

2. Modificar el connection string con su servidor de SQL Server.

Ejemplo:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR;Database=AsehellmannDB;Trusted_Connection=True;TrustServerCertificate=True"
}
```

---

# Crear la base de datos

Una vez configurado el connection string ejecutar:

```
update-database
```

Este comando creará automáticamente la base de datos y las tablas necesarias.

---

# Ejecutar el Backend

Entrar a la carpeta del backend.

Restaurar dependencias:

```
dotnet restore
```

Ejecutar la API:

```
dotnet run
```

La API se ejecutará normalmente en:

```
https://localhost:5001
```

---

# Ejecutar el Frontend

Entrar a la carpeta del frontend.

Instalar dependencias:

```
npm install
```

Ejecutar la aplicación:

```
npm start
```

La aplicación se abrirá automáticamente en el navegador en:

```
http://localhost:3000
```

---

# Funcionalidades principales

- Interfaz web moderna
- Conexión entre frontend y backend mediante API REST
- Gestión de datos mediante operaciones CRUD
- Automatización de procesos internos
- Arquitectura separada entre cliente y servidor

---

# Objetivo del proyecto

Este proyecto fue desarrollado como una solución web para mejorar la gestión y organización de procesos internos dentro de una asociación.

El sistema demuestra la integración completa entre:

- Frontend moderno
- Backend con API
- Base de datos relacional

---

# Autor

**Jafet Vásquez Sandoval**

Ingeniero en Sistemas

Costa Rica

GitHub  
https://github.com/jafetvs

LinkedIn  
https://www.linkedin.com/in/jafet-vasquez-2b6b26162