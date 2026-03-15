# taskflow-prueba-tecnica

TaskFlow es una aplicación moderna de gestión de tareas que permite a los usuarios crear proyectos y organizar tareas.

Tecnologias utilizadas **Next.js, Supabase, Prisma ORM, Typescript, Tailwind CSS y Docker**.

---

##  Características

* Autenticación de usuarios con Supabase Auth
* Creación y gestión de proyectos
* Creación de tareas dentro de proyectos
* Seguimiento del estado de las tareas
* Niveles de prioridad para las tareas
* Registro de auditoría de cambios
* Seguridad de datos entre usuarios

---


##  Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto.

Ejemplo:

```id="envexample01"
DATABASE_URL="conexion_pooler_supabase"
DIRECT_URL="conexion_directa_supabase"

```

---

##  Configuración de Base de Datos

El esquema de la base de datos está definido usando Prisma.

Tablas principales:

* projects
* tasks
* audit_logs

Relaciones:

* Un usuario puede tener múltiples proyectos
* Un proyecto puede tener múltiples tareas

Ejecutar migraciones:

```id="migratecmd01"
npx prisma migrate dev
```

---


