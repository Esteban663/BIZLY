APLICACION WEB DE GESTIÓN EMPRESARIAL – FASE DE PRODUCCIÓN

---

DESCRIPCIÓN GENERAL

Aplicación web fullstack para la gestión de procesos empresariales. Permite administrar usuarios, inventario, ingresos, egresos y nómina mediante una arquitectura cliente-servidor basada en API REST.

El sistema está diseñado para ejecutarse en entorno de producción mediante el empaquetado del backend y la compilación del frontend.

---

ARQUITECTURA

* Frontend: Angular
* Backend: Spring Boot (API REST)
* Base de Datos: PostgreSQL
* Comunicación: HTTP / JSON

---

DESPLIEGUE EN PRODUCCIÓN

El sistema se ejecuta en producción mediante:

1. Backend empaquetado como archivo ejecutable (.jar)
2. Frontend compilado en archivos estáticos optimizados

---

BACKEND – EJECUCIÓN EN PRODUCCIÓN

1. Generar el archivo ejecutable:

mvn clean install

2. Ubicar el archivo generado en:

target/nombre-del-proyecto.jar

3. Ejecutar el backend:

java -jar target/nombre-del-proyecto.jar

4. Resultado:

El servidor se inicia en:
http://localhost:8080

El backend incluye:

* Servidor embebido (Tomcat)
* Configuración JPA/Hibernate
* Conexión a PostgreSQL
* Exposición de endpoints REST

---

FRONTEND – EJECUCIÓN EN PRODUCCIÓN

1. Generar build optimizado:

ng build

2. Se genera la carpeta:

dist/

3. Contenido generado:

* index.html
* Archivos JavaScript optimizados
* Archivos CSS

4. Ejecución del frontend:

Opción 1 (simple):
Abrir el archivo index.html en el navegador

Opción 2 (recomendada):

npx serve dist/

5. Resultado:

La aplicación queda disponible en:
http://localhost:4200

---

INTEGRACIÓN FRONTEND - BACKEND

El frontend consume la API REST del backend mediante peticiones HTTP.

Configuración en Angular:

export const environment = {
apiUrl: 'http://localhost:8080'
};

Todas las solicitudes del frontend se dirigen a dicha URL.

---

BASE DE DATOS

Motor: PostgreSQL

Configuración en application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5433/bizly
spring.datasource.username=postgres
spring.datasource.password=123

spring.jpa.hibernate.ddl-auto=update

El sistema genera automáticamente las tablas al iniciar.

---

FUNCIONALIDADES EN PRODUCCIÓN

* Registro de usuarios
* Inicio de sesión
* Gestión de inventario
* Registro de ingresos
* Registro de egresos
* Gestión de nómina

---

CONSIDERACIONES TÉCNICAS

* Arquitectura sin capa de servicios (Controller → Repository)
* Persistencia gestionada con JPA/Hibernate
* Comunicación basada en JSON
* Configuración CORS habilitada para integración
* Backend desacoplado del frontend

---

ESTADO DEL SISTEMA

* Backend funcional en entorno de producción
* Frontend compilado y optimizado
* Integración completa entre capas
* Sistema listo para demostración

---

AUTOR

Samuel Murillo Vásquez

---

EQUIPO DE PRODUCCION

Bizly

Lider de proyecto: Esteban Arroyave Gomez
QA: Juan Pablo Ramirez Gonzales
Frontend Developers: Maria Giraldo - Mateo Quintero
Backend Developers: Samuel Murillo - Jhon Deivid Hoyos
---
