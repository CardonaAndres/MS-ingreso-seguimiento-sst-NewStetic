# 🏥 Microservicio – Ingreso y Seguimiento de Personal

Este microservicio se encarga de gestionar el **ingreso de nuevos colaboradores**, el **seguimiento médico programado** y la **historia ocupacional** completa del personal. Está diseñado para integrarse con plataformas externas como **Colmédicos** y **Softexpert**, cumpliendo con la normativa legal colombiana en materia de salud ocupacional.

> 📁 Este servicio forma parte de un ecosistema modular basado en microservicios dentro del sistema de gestión SST.

---

## 🚀 Funcionalidades Clave

### 🔹 1. Ingreso de Personal

* Coordinación de exámenes médicos de ingreso con **Colmédicos**.
* Registro, almacenamiento y consulta de resultados médicos iniciales.
* Registro de nuevos empleados y envío de datos históricos a **Softexpert**.
* Conservación de conceptos médicos de personal retirado hasta por **20 años**, en cumplimiento con la ley.

### 🔹 2. Seguimiento Médico Programado

* Programación de exámenes periódicos tipo *planner*.
* Seguimiento activo del estado de salud del personal.
* Carga y análisis de condiciones médicas a partir de archivos Excel integrados con **Colmédicos**.

### 🔹 3. Historial de Exámenes Médicos

* Consulta consolidada del historial médico por colaborador.
* Vinculación del historial al **ciclo laboral** completo del trabajador.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js + Express.js** – API REST para lógica de negocio.
* **SQL Server** – Almacenamiento estructurado y seguro de información médica y laboral
* **JWT** – Seguridad mediante autenticación basada en tokens.

---

## ⚖️ Requisitos Legales

Este microservicio garantiza:

* Conservación de información médica sensible hasta por **20 años** para colaboradores retirados.
* Confidencialidad, integridad y trazabilidad de la historia ocupacional.
* Cumplimiento con los lineamientos establecidos por las autoridades de salud laboral.

---

## 🔗 Integraciones Externas

* **Colmédicos** – Interfaz para programación y consulta de exámenes médicos.
* **Softexpert** – Plataforma para almacenamiento y seguimiento de la historia ocupacional del personal.

---

## ⚙️ Variables de Entorno

Para el correcto funcionamiento del microservicio, se deben definir las variables de entorno en un archivo `.env` ubicado en la raíz del proyecto.

### 📄 Ejemplo de `.env`:

```env
# Puerto en el que se ejecuta el microservicio
NODE_ENV=development

# Client URLs
SST_CLIENT=http://localhost:5001

# URLs de servicios externos
COLMEDICOS_API_URL=
SOFTEXPERT_API_URL=

PORT=

JWT_SECRET=
COOKIE_SECRET=

#DB
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_PORT=
```

---

## 👨‍💻 Autoría

Desarrollado por el equipo TIC con **Andrés Cardona**

---
