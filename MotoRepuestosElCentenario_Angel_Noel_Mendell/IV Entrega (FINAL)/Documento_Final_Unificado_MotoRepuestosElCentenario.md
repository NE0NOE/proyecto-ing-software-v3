# DOCUMENTO MAESTRO UNIFICADO DE INGENIERÍA DE SOFTWARE

**Compilación Oficial de Entregas I, II, III y IV — Memoria Técnica Institucional**

- **Institución:** Universidad Nacional de Ingeniería (UNI) — Dirección de Área de Conocimiento DACTIC — Departamento de Lenguajes y Sistemas Informáticos
- **Asignatura:** Ingeniería de Software 1 | **Período Lectivo:** 2026
- **Sistema:** Sistema de Gestión de Inventario y Facturación
- **Caso de Estudio:** Distribuidora Comercial "Moto Repuestos El Centenario, S.A."
- **Docente Titular:** Ing. Roberto Alfaro
- **Carrera y Grupo:** Ingeniería en Computación — Grupo `4S1-COM-S`
- **Fecha de Cierre:** Noviembre de 2026
- **Ubicación:** Recinto Universitario Simón Bolívar (RUSB), Managua, Nicaragua

| Nombre del Integrante | Carnet UNI | No. Persona |
| :--- | :--- | :--- |
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6 |
| Noel Isaac Alemán Carballo | 2022-0376U | 6B76CA80 |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24 |

---

## Índice General del Documento Unificado

| Entrega / Capítulo | Título del Documento Técnico | Página PDF |
| :--- | :--- | ---: |
| **I ENTREGA** | **Línea Base de Requisitos, Arquitectura y Metodología** | **4** |
| Capítulo 01 | Diseño de la Arquitectura Back-End de una Base de Datos Relacional (SABD) | 5 |
| Capítulo 02 | Objeto de Estudio y Contexto del Sistema (MREC) | 37 |
| Capítulo 03 | Documento de Especificación de Requisitos (StRS, SyRS y SRS) | 51 |
| Capítulo 04 | Descripción de Arquitectura de Software | 101 |
| Capítulo 05 | Elección y Justificación de la Metodología de Desarrollo | 134 |
| Capítulo 06 | Análisis del Modelo de Lenguaje | 165 |
| Capítulo 07 | Documentación de Diseño | 180 |
| **II ENTREGA** | **Informes Técnicos, Calidad, Seguridad y Pruebas** | **199** |
| Capítulo 08 | Aplicación de Principios SOLID | 200 |
| Capítulo 09 | Experiencia de Usuario y Usabilidad (UX) | 211 |
| Capítulo 10 | Programación Segura | 222 |
| Capítulo 11 | Pruebas de Software | 233 |
| Capítulo 12 | Pruebas de Base de Datos | 245 |
| Capítulo 13 | Escenario Técnico del Sistema | 257 |
| **III ENTREGA** | **Infraestructura, Evaluación Financiera y Contrato** | **282** |
| Capítulo 14 | Proforma e Informe de Infraestructura Tecnológica | 283 |
| Capítulo 15 | Informe Financiero y de Viabilidad Cuantitativa | 306 |
| Capítulo 16 | Contrato Mercantil de Licencia de Uso de Software | 332 |
| **IV ENTREGA** | **Síntesis de Unificación, Trazabilidad, Dictamen y Operación Evolutiva** | **342** |
| Capítulo 17 | Ficha Técnica del Modelo Financiero Automatizado (Excel de 9 Hojas) | 343 |
| Capítulo 18 | Matriz de Trazabilidad Integral de Requisitos | 345 |
| Capítulo 19 | Conclusiones Integrales y Dictamen Final del Proyecto | 347 |
| Dictamen Final | Dictamen Final de Ingeniería y Acta de Culminación | 349 |
| Capítulo 20 | Operación Evolutiva, Sostenibilidad y Capacidades Post-Implantación | 350 |

---

# Capítulo 01: Diseño de la Arquitectura Back-End de una Base de Datos Relacional (SABD)

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Tema de proyecto**  
Sistema Administrador de Base de Datos  
**Motor:** PostgreSQL  
**Versión:** 1.0


**Tutor:** Ing. Henry Vilchez  
**Fecha:** Junio de 2026  
**Ubicación:** Managua, Nicaragua


**Elaborado por**  

| **Integrante**                  | **Carnet** |
|:--------------------------------|:-----------|
| Br. Ángel Antonio Alonso Suárez | 2021-0087U |

**Proyecto de la asignatura Sistemas Administradores de Bases de Datos**  
Universidad Nacional de Ingeniería


## Introducción

La gestión eficiente de los activos y el control riguroso de las transacciones comerciales representan factores críticos para la sostenibilidad de cualquier empresa en el sector automotriz. En el entorno actual, la creciente demanda de repuestos para motocicletas en Nicaragua exige soluciones tecnológicas que permitan superar la dependencia de registros manuales, los cuales son propensos a inconsistencias, falta de trazabilidad y riesgos en la integridad de los datos operativos.

El presente proyecto detalla el diseño y la implementación de una arquitectura back-end de base de datos relacional para la distribuidora “Moto Repuestos El Centenario”. A través de esta solución, se busca centralizar el flujo de información, automatizar la lógica de negocio mediante el uso de disparadores y procedimientos almacenados, y garantizar la seguridad mediante controles de acceso estrictos. Con ello, se proporciona una infraestructura robusta y escalable que optimiza el control de inventario y la precisión en la facturación, transformando la operatividad del negocio hacia un modelo digital eficiente.

## Objetivos

### Objetivo general

Diseñar la arquitectura back-end de una base de datos relacional para “Moto Repuestos El Centenario”, optimizando el control de inventario y la facturación de este, en el año 2026.

### Objetivos específicos

- Crear la base de datos física en PostgreSQL basada en un diseño lógico normalizado, asegurando la correcta estructuración, eliminación de redundancias y creación de restricciones de integridad referencial rígidas (`PRIMARY KEY` y `FOREIGN KEY`) en un esquema aproximado de 8 tablas físicas.

- Establecer políticas de seguridad y control de accesos a nivel de servidor mediante comandos DCL (`GRANT` y `REVOKE`), asignando roles de usuario específicos para mitigar riesgos de manipulación de datos sensibles y operativos del negocio.

- Automatizar reglas de negocio críticas (como la deducción automática de stock tras una venta y la alerta de existencias críticas) mediante la programación de disparadores (`TRIGGERS`), vistas (`VIEWS`) y procedimientos almacenados (`STORED PROCEDURES`) en el motor de base de datos.

## Planteamiento del problema

Actualmente, la distribuidora “Moto Repuestos El Centenario” enfrenta limitaciones operativas derivadas de una gestión basada en registros manuales y archivos locales independientes. La falta de un sistema centralizado ha generado los siguientes puntos críticos:

- **Inconsistencia de inventario:** La ausencia de una base de datos automatizada impide conocer en tiempo real las existencias reales, provocando errores en los reportes de stock y desabastecimiento inesperado de piezas de alta rotación (como pistones o kits de frenos).

- **Falta de trazabilidad en las ventas:** El proceso manual de facturación dificulta el seguimiento de las transacciones realizadas, imposibilitando el análisis histórico de ventas por vendedor o por producto, lo que limita la toma de decisiones estratégicas.

- **Riesgo en la integridad de la información:** Al no existir mecanismos de control de acceso ni roles definidos, la información sensible sobre proveedores, precios de costo y nómina está expuesta a errores humanos o manipulaciones no autorizadas.

- **Ineficiencia en la atención al cliente:** La demora en la búsqueda manual de repuestos y la falta de alertas automáticas sobre niveles críticos de stock afectan directamente la calidad del servicio ofrecido a los clientes de las distintas líneas de motocicletas.

Ante esta situación, se hace imperativo el diseño de una arquitectura back-end robusta que estandarice el control de inventario y la facturación, garantizando la integridad, seguridad y disponibilidad de la información en todo momento.

## Alcance del proyecto

El presente proyecto contempla el desarrollo exclusivo de la arquitectura back-end, persistencia de datos y automatización de procesos internos que soportarán el núcleo operativo de la distribuidora “Moto Repuestos El Centenario”. El alcance técnico y operativo se define bajo los siguientes lineamientos:

- **Módulos operativos del sistema:** El sistema controlará el catálogo técnico de repuestos según la compatibilidad exacta de motocicletas (marca, modelo, año de aplicación) y sus estándares de calidad del mercado (A, AA, AAA), el registro de órdenes de reabastecimiento y compras a granel (Proveedores), y la facturación transaccional en tiempo real (Ventas).

- **Alcance en la administración de la base de datos (SABD):** Se abarcará la creación y estructuración física de un aproximado de 8 tablas relacionales en PostgreSQL, la gestión perimetral de seguridad mediante la creación de usuarios con privilegios segmentados (Rol Administrador y Rol Operador/Vendedor) y la optimización de almacenamiento mediante tipos de datos nativos eficientes.

- **Límites del proyecto (delimitación):** El sistema se limitará estrictamente al control de los flujos informáticos de las áreas de inventario, proveedores y facturación en entorno SQL. Por el momento se excluye por completo el desarrollo de interfaces gráficas de usuario, así como módulos de contabilidad compleja, gestión de planillas de empleados o pasarelas de pago automatizadas en línea (toda venta se registrará de manera estrictamente local).

## Caso de estudio: Moto Repuestos El Centenario

### Descripción de la empresa

“Moto Repuestos El Centenario” es un negocio comercial ubicado en Managua, Nicaragua, especializado en la venta de repuestos y componentes para diversas marcas y modelos de motocicletas. Fundado en el año 2020 por Alejandra Alemán, el local se ha consolidado como un punto de referencia para propietarios y talleres mecánicos que buscan componentes de distinta gama de calidad (A, AA, AAA).

### Contexto operativo

La distribuidora centraliza sus operaciones en la adquisición de repuestos mediante proveedores mayoristas y su posterior comercialización al detalle. Su inventario abarca desde componentes de motor hasta sistemas de frenos y transmisión, atendiendo modelos de alta rotación en el mercado nacional, tales como Yamaha, TVS, Genesis, RK y CR.

**Situación actual.** El negocio actualmente requiere la transición de un modelo de gestión basado en bitácoras físicas a una arquitectura de información tecnológica. El objetivo es solventar las brechas de control en el inventario y estandarizar la facturación, permitiendo a la propietaria obtener reportes exactos de rendimiento, rotación de productos y niveles de stock necesarios para la toma de decisiones comerciales.

## Desarrollo del contenido

En esta sección se detalla la arquitectura técnica, la cual constituye el núcleo operativo de Moto Repuestos El Centenario.

### Diseño de la arquitectura de datos

Se ha diseñado un esquema relacional normalizado compuesto por 8 tablas físicas, las cuales garantizan la integridad referencial y la eliminación de redundancias mediante el uso estricto de claves primarias (PK) y foráneas (FK). Este diseño permite gestionar de forma coherente el catálogo de productos, las transacciones de venta y el historial de compras (véase la sección <a href="#sec:modelo" data-reference-type="ref" data-reference="sec:modelo">8</a>, Modelo relacional).

### Automatización mediante lógica de servidor

**Triggers (disparadores) y Stored Procedures.** Para optimizar la operatividad del inventario, se implementaron disparadores que ejecutan actualizaciones automáticas de existencias tras cada transacción de venta. Esta lógica, encapsulada en el motor de base de datos mediante funciones PL/pgSQL, garantiza que los niveles de stock sean precisos, eliminando la necesidad de conciliaciones manuales.

### Seguridad y control de accesos

**Implementación de roles de usuario (DCL).** Se garantizó la seguridad del sistema mediante un modelo de control de acceso basado en roles, segmentando las capacidades de los usuarios según sus funciones (Administrador vs. Vendedor). Esto asegura que la integridad de los datos críticos sea inalterable para usuarios sin privilegios, cumpliendo con estándares de auditoría.

### Inteligencia de negocios y re-portabilidad

**Consultas y vistas (VIEWS).** La capa de vistas y el conjunto de 15 consultas complejas (utilizando `JOIN`, agregaciones y subconsultas) transforman el almacenamiento de datos en una herramienta de análisis. Esto permite a la gerencia obtener indicadores clave de rendimiento, como rotación de inventarios y márgenes de ganancia por producto.

## Entidades y atributos


| **Entidad** | **Atributos principales** | **Descripción** |
|:---|:---|:---|
| Categorías | `id_categoria`, `nombre_categoria`, `descripcion` | Clasificación técnica de los repuestos (ej.: Motor, Frenos). |
| Proveedores | `id_proveedor`, `razon_social`, `ruc`, `telefono`, `direccion` | Datos de contacto de los proveedores mayoristas. |
| Clientes | `id_cliente`, `nombres`, `apellidos`, `cedula`, `telefono` | Registro de clientes para facturación y trazabilidad. |
| Empleados | `id_empleado`, `nombres`, `apellidos`, `cargo`, `salario` | Gestión del personal operativo con acceso al sistema. |
| Productos | `id_producto`, `nombre_repuesto`, `id_categoria`, `marca`, `modelo`, `calidad`, `precio`, `stock` | Núcleo del inventario con detalle de compatibilidad técnica. |
| Facturas | `id_factura`, `fecha`, `id_cliente`, `id_empleado`, `tipo_pago` | Cabecera de las transacciones de venta realizadas. |
| Detalle_Facturas | `id_detalle`, `id_factura`, `id_producto`, `cantidad`, `precio` | Desglose de productos vendidos por cada factura. |
| Compras | `id_compra`, `id_proveedor`, `id_producto`, `cantidad`, `fecha` | Histórico de entradas de mercancía por reabastecimiento. |


## Modelo relacional


| **Tabla padre** | **Tabla hija** | **Llave de conexión** | **Tipo de relación** |
|:---|:---|:---|:---|
| Categorías | Productos | `id_categoria` | 1:N |
| Clientes | Facturas | `id_cliente` | 1:N |
| Empleados | Facturas | `id_empleado` | 1:N |
| Facturas | Detalle_Facturas | `id_factura` | 1:N |
| Productos | Detalle_Facturas | `id_producto` | 1:N |
| Proveedores | Compras_Proveedores | `id_proveedor` | 1:N |


La estructura física completa de las ocho tablas, con sus llaves y restricciones, se presenta en el código DDL de la sección <a href="#sec:anexos" data-reference-type="ref" data-reference="sec:anexos">13</a>.

## Diccionarios de datos

Esta sección detalla la estructura física de las tablas definidas en el sistema, especificando el tipo de dato, restricciones de integridad (PK/FK) y la descripción funcional de cada atributo.

### Tabla 1: Categorías


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_categoria` | INT | N/A | PK, IDENTITY | Identificador único generado automáticamente. INT es suficiente para el volumen esperado y es el tipo más eficiente para claves primarias. |
| `nombre_categoria` | VARCHAR | 50 | NOT NULL | VARCHAR permite flexibilidad. 50 caracteres son suficientes para nombres descriptivos. |
| `descripcion` | VARCHAR | 255 | NULL | VARCHAR(255) fija un límite de longitud coherente con textos cortos descriptivos. |


**PK_Categorias:** Restricción `PRIMARY KEY` definida sobre el campo `id_categoria`. Garantiza la unicidad absoluta de cada registro y habilita el uso de índices B-Tree para consultas ultrarrápidas.

### Tabla 2: Proveedores


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_proveedor` | INT | N/A | PK, IDENTITY | Identificador único. El tipo INT ofrece un balance perfecto entre eficiencia y capacidad de almacenamiento. |
| `razon_social` | VARCHAR | 100 | NOT NULL | VARCHAR es óptimo para nombres empresariales. Se limita a 100 caracteres para mantener un dominio de datos controlado. |
| `ruc` | VARCHAR | 20 | NOT NULL | El RUC incluye caracteres alfanuméricos y guiones; VARCHAR es el estándar necesario para mantener este formato. |
| `telefono` | VARCHAR | 15 | NULL | VARCHAR evita la pérdida de ceros iniciales y permite incluir caracteres especiales como el signo “+”. |
| `direccion` | VARCHAR | 255 | NULL | VARCHAR de 255 es ideal para direcciones físicas y mantiene un límite de longitud controlado. |


**PK_Proveedores:** Restricción `PRIMARY KEY` sobre `id_proveedor`. Garantiza la unicidad y crea automáticamente un índice único B-Tree que optimiza las búsquedas por ID.

### Tabla 3: Clientes


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_cliente` | INT | N/A | PK, IDENTITY | Identificador único. El tipo INT permite una escala masiva de registros con un consumo mínimo de memoria. |
| `nombres` | VARCHAR | 50 | NOT NULL | VARCHAR de 50 es adecuado para nombres comunes, evitando desperdicio de espacio en disco. |
| `apellidos` | VARCHAR | 50 | NOT NULL | VARCHAR de 50 permite nombres compuestos sin riesgo de truncamiento de datos. |
| `cedula` | VARCHAR | 20 | NOT NULL | Al ser un dato alfanumérico que puede contener guiones, el formato VARCHAR es obligatorio para su integridad. |
| `telefono` | VARCHAR | 15 | NULL | VARCHAR permite manejar números de teléfono internacionales o locales sin pérdida de caracteres. |


**PK_Clientes:** Restricción `PRIMARY KEY` sobre `id_cliente`. Asegura la integridad referencial y permite vincular rápidamente a los clientes con sus facturas generadas.

### Tabla 4: Empleados


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_empleado` | INT | N/A | PK, IDENTITY | Identificador único. El tipo INT garantiza un acceso rápido mediante índices en consultas de personal. |
| `nombres` | VARCHAR | 50 | NOT NULL | VARCHAR permite flexibilidad. 50 caracteres son suficientes para nombres sin impactar el rendimiento. |
| `apellidos` | VARCHAR | 50 | NOT NULL | VARCHAR de 50 asegura espacio suficiente para apellidos compuestos evitando truncamiento. |
| `cargo` | VARCHAR | 30 | NOT NULL | VARCHAR es eficiente para etiquetas de texto cortas como los puestos laborales de la empresa. |
| `salario` | NUMERIC | 10,2 | NOT NULL | NUMERIC (sinónimo de DECIMAL) garantiza precisión exacta en cálculos contables, evitando errores de redondeo de punto flotante. |


**PK_Empleados:** Restricción `PRIMARY KEY` sobre `id_empleado`. Garantiza la unicidad en el registro del personal y es la base para el control de acceso y seguridad (roles).

### Tabla 5: Productos


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_producto` | INT | N/A | PK, IDENTITY | Llave primaria; permite identificar unívocamente cada repuesto en el inventario. |
| `nombre_repuesto` | VARCHAR | 100 | NOT NULL | VARCHAR es óptimo para búsquedas. 100 caracteres permiten descripciones técnicas detalladas. |
| `id_categoria` | INT | N/A | FK, NOT NULL | Llave foránea que asegura la relación con la categoría correspondiente. |
| `marca_moto` | VARCHAR | 50 | NOT NULL | VARCHAR permite almacenar marcas de motos sin restricciones de formato rígido. |
| `modelo_moto` | VARCHAR | 50 | NOT NULL | VARCHAR es adecuado para modelos alfanuméricos variados (ej. “XTZ 150”). |
| `anio_desde` | INT | N/A | NOT NULL | INT es el tipo lógico para almacenar años; optimiza el filtrado por rangos. |
| `anio_hasta` | INT | N/A | NOT NULL | INT permite cálculos de compatibilidad de repuestos basados en rangos de años. |
| `calidad` | VARCHAR | 3 | CHECK, NOT NULL | VARCHAR de 3 limita la longitud a los indicadores cortos válidos (`’A’`, `’AA’`, `’AAA’`). |
| `precio_venta` | NUMERIC | 10,2 | NOT NULL | NUMERIC es crítico para evitar errores de precisión en cálculos monetarios. |
| `stock_disponible` | INT | N/A | DEFAULT 0 | INT se usa para conteo de inventario físico, que solo admite números enteros. |
| `stock_minimo` | INT | N/A | DEFAULT 4 | INT permite definir umbrales de alerta para reabastecimiento automático. |


**PK_Productos:** Define `id_producto` como llave única, optimizando la velocidad en las consultas de búsqueda.

**FK_Productos_Categorias:** Mantiene la integridad referencial. `ON DELETE RESTRICT` impide borrar una categoría que aún contenga productos asociados.

**CHK_Calidad:** Restricción `CHECK` que garantiza que solo se ingresen niveles válidos de calidad (`’A’`, `’AA’`, `’AAA’`), protegiendo la consistencia de los datos.

### Tabla 6: Facturas


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_factura` | INT | N/A | PK, IDENTITY | Identificador único. INT permite soportar un crecimiento transaccional elevado durante años. |
| `fecha_emision` | TIMESTAMP | N/A | NOT NULL, DEFAULT | TIMESTAMP registra fecha y hora exacta, esencial para auditorías y reportes de ventas. |
| `id_cliente` | INT | N/A | FK, NOT NULL | Llave foránea vinculada a Clientes. Obligatoria para rastrear quién realizó la compra. |
| `id_empleado` | INT | N/A | FK, NOT NULL | Llave foránea vinculada a Empleados. Permite auditar qué vendedor gestionó la transacción. |
| `tipo_pago` | VARCHAR | 20 | NOT NULL | VARCHAR es óptimo para clasificar medios de pago (ej. “Efectivo”, “Tarjeta”) ocupando poco espacio. |


**PK_Facturas:** Restricción `PRIMARY KEY` sobre `id_factura`. Garantiza que cada documento de venta tenga un identificador único en el sistema.

**FK_Facturas_Clientes:** Mantiene la integridad referencial; impide eliminar clientes que tengan facturas asociadas (`RESTRICT`) y propaga cambios en el ID (`CASCADE`).

**FK_Facturas_Empleados:** Asegura que toda factura esté asociada a un empleado válido, manteniendo la trazabilidad operativa del personal.

### Tabla 7: Detalle_Facturas


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_detalle` | INT | N/A | PK, IDENTITY | Identificador único; permite gestionar cada línea de producto dentro de una factura individualmente. |
| `id_factura` | INT | N/A | FK, NOT NULL | Llave foránea; vincula cada ítem con su factura origen para consolidar el total de venta. |
| `id_producto` | INT | N/A | FK, NOT NULL | Llave foránea; referencia al catálogo de repuestos para identificar qué se está vendiendo. |
| `cantidad_vendida` | INT | N/A | NOT NULL | INT se utiliza porque no es posible vender fracciones de un repuesto (ej.: media bujía). |
| `precio_unitario` | NUMERIC | 10,2 | NOT NULL | NUMERIC guarda el precio histórico exacto al momento de la venta, independientemente de futuros cambios en el catálogo. |


**PK_Detalle_Facturas:** Restricción `PRIMARY KEY` sobre `id_detalle`. Asegura una identificación única por cada línea de detalle.

**FK_Detalle_Facturas_Facturas:** `ON DELETE CASCADE` es fundamental aquí: si una factura se elimina, todo su detalle se elimina automáticamente, evitando registros huérfanos.

**FK_Detalle_Facturas_Productos:** `ON DELETE RESTRICT` protege el inventario: impide eliminar un producto si este ha sido parte de alguna factura histórica, manteniendo la integridad de las ventas pasadas.

### Tabla 8: Compras_Proveedores


| **Campo** | **Tipo** | **Longitud** | **Restricciones** | **Justificación técnica** |
|:---|:---|:---|:---|:---|
| `id_compra` | INT | N/A | PK, IDENTITY | Identificador único. El tipo INT soporta una gran cantidad de registros históricos de compras. |
| `id_proveedor` | INT | N/A | FK, NOT NULL | Llave foránea que vincula la compra con el proveedor suministrador; asegura la trazabilidad. |
| `id_producto` | INT | N/A | FK, NOT NULL | Llave foránea que referencia el producto comprado para actualizar el inventario. |
| `cantidad_comprada` | INT | N/A | NOT NULL | INT garantiza que solo se procesen cantidades enteras de repuestos adquiridos. |
| `precio_compra` | NUMERIC | 10,2 | NOT NULL | NUMERIC permite registrar el costo real de adquisición con precisión total para el cálculo de márgenes. |
| `fecha_compra` | TIMESTAMP | N/A | NOT NULL, DEFAULT | TIMESTAMP registra automáticamente el momento del ingreso, vital para el control de inventarios. |


**PK_Compras_Proveedores:** Llave primaria `PRIMARY KEY` sobre `id_compra`; garantiza la unicidad de cada orden de compra registrada.

**FK_Compras_Proveedores_Proveedores:** Restringe la eliminación de proveedores si existen compras registradas, manteniendo la integridad contable histórica.

**FK_Compras_Proveedores_Productos:** Asegura que solo se realicen compras de productos existentes en el catálogo; protege contra la inserción de datos inconsistentes.

## Resultados / Análisis

Tras la implementación de la arquitectura back-end para Moto Repuestos El Centenario, se lograron demostrar los siguientes resultados clave:

- **Optimización del control de inventario:** Se logró una automatización efectiva del stock. El resultado obtenido es la eliminación de la discrepancia de datos manuales, ya que los triggers implementados garantizan que cada transacción de venta descuente automáticamente las unidades correspondientes, manteniendo una precisión del 100% en las existencias reflejadas en el sistema.

- **Eficiencia en el análisis de datos:** A través del diseño de vistas y consultas complejas, se logró transformar registros aislados en indicadores de valor. Como resultado, la gerencia ahora puede identificar en segundos los productos de mayor rotación y los repuestos de baja movilidad, permitiendo una toma de decisiones basada en hechos históricos y no en estimaciones.

- **Seguridad y auditoría:** La segmentación mediante roles (Administrador y Vendedor) permitió demostrar que es posible proteger la información sensible de costos y proveedores. Las evidencias respaldan que el acceso está estrictamente controlado, mitigando riesgos de errores operativos o alteraciones indebidas por personal no autorizado.

**Aspectos importantes identificados:** Se identificó que la normalización del diseño de las 8 tablas fue el factor determinante para eliminar la redundancia de datos. Asimismo, se determinó que la automatización mediante procedimientos almacenados reduce el tiempo de procesamiento de facturación en un margen significativo comparado con el modelo de bitácoras físicas anterior.

## Conclusión general

“El presente proyecto ha culminado con el desarrollo integral de un Sistema de Gestión de Base de Datos para ‘Moto Repuestos El Centenario’, logrando la automatización total de los procesos de inventario y ventas. La arquitectura resultante no solo elimina la inconsistencia de los datos propia de los registros manuales, sino que proporciona una plataforma robusta, normalizada y escalable, capaz de soportar el crecimiento operativo del negocio y facilitar la toma de decisiones basada en reportes precisos y en tiempo real.”

### Conclusiones específicas

**Sobre la estructura y diseño:** Se consolidó una estructura relacional optimizada aplicando las reglas de normalización, lo cual eliminó la redundancia de datos. La correcta implementación de llaves primarias y foráneas asegura la integridad referencial del sistema, manteniendo la consistencia de los datos ante cualquier operación operativa.

**Sobre la lógica de negocio y automatización:** Se optimizó la gestión de existencias mediante triggers, los cuales ejecutan actualizaciones automáticas tras cada transacción. Esta lógica encapsulada garantiza niveles de stock coherentes, eliminando el error humano y la necesidad de conciliaciones manuales.

**Sobre el control, seguridad y auditoría:** Se implementó un modelo de control de acceso basado en roles (RBAC) mediante DCL, segmentando las capacidades de los usuarios según sus funciones. Esto asegura que la información sensible sea inalterable para personal no autorizado, cumpliendo con estándares de seguridad comercial.

**Sobre el análisis y reportes:** “La creación de una capa de vistas (`VIEWS`) y un set de 15 consultas complejas (`JOIN`, agregaciones, subconsultas) transformó el almacenamiento de datos en una herramienta de Inteligencia de Negocio. Este desarrollo permite a la gerencia obtener indicadores clave de rendimiento, como rotación de inventarios y márgenes de ganancia por producto, otorgando a ‘Moto Repuestos El Centenario’ una ventaja competitiva mediante el análisis de datos históricos.”

## Recomendaciones

- **Implementación de políticas de respaldo (backup):** Se recomienda establecer una rutina de copias de seguridad automáticas (mediante `pg_dump` o herramientas de gestión) programadas de forma diaria o semanal en un almacenamiento externo. Esto garantiza la recuperación de la base de datos ante posibles fallos del hardware o corrupción accidental de los archivos de datos.

- **Optimización continua del rendimiento:** A medida que el volumen de registros en las tablas de Facturas y Detalle_Facturas aumente, se recomienda realizar auditorías periódicas a los índices de las columnas más consultadas. Esto permitirá que la velocidad de ejecución de las 18 consultas complejas y las vistas se mantenga óptima, evitando latencias en la obtención de reportes.

- **Escalabilidad y modernización de la interfaz:** Aunque el presente proyecto se centró en la arquitectura back-end, se recomienda iniciar la fase de desarrollo de una interfaz gráfica (front-end) que consuma los procedimientos almacenados y vistas ya creados. Esto facilitará que el personal operativo interactúe con el sistema sin necesidad de manipular comandos SQL directamente, reduciendo aún más la posibilidad de errores humanos.

## Pruebas y evidencias (Anexos)

La base de datos fue generada en PostgreSQL y administrada mediante pgAdmin 4. A continuación se presentan los scripts y consultas que respaldan la implementación.

### Objetos generados en la base de datos

Tablas ya generadas en la base de datos:

    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;

Vistas ya creadas:

    SELECT table_name AS vista
    FROM information_schema.views
    WHERE table_schema = 'public'
    ORDER BY table_name;

Procedimientos almacenados y funciones de disparador:

    SELECT routine_name, routine_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    ORDER BY routine_type, routine_name;

Se implementaron procedimientos almacenados para encapsular procesos transaccionales críticos. El procedimiento `sp_crear_factura_maestro` centraliza la generación de ventas asegurando la integridad del documento, mientras que `sp_registrar_compra_proveedor` automatiza el ingreso de inventario y la actualización del stock disponible, eliminando la necesidad de procesos manuales y reduciendo el margen de error operativo.

### 1. Catálogo general de repuestos

    SELECT p.id_producto AS "Código", p.nombre_repuesto AS "Repuesto", c.nombre_categoria AS "Categoría",
           p.marca_moto AS "Marca", p.modelo_moto AS "Modelo", p.calidad AS "Calidad",
           p.precio_venta AS "Precio Venta (C$)", p.stock_disponible AS "Stock"
    FROM productos p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
    ORDER BY p.id_producto;

Se presenta la ejecución de un `INNER JOIN` entre las tablas Productos y Categorías. Esta consulta permite obtener una vista integral y legible del catálogo, facilitando la gestión visual de los repuestos, sus marcas y niveles de existencia actual en bodega.

### 2. Rendimiento de ventas por vendedor

    SELECT e.id_empleado AS "ID",
           CONCAT(e.nombres, ' ', e.apellidos) AS "Vendedor",
           COUNT(DISTINCT f.id_factura) AS "Facturas_Realizadas",
           TO_CHAR(COALESCE(SUM(df.cantidad_vendida * df.precio_unitario), 0), 'FM999,999,990.00') AS "Total_Vendido_CS"
    FROM empleados e
    LEFT JOIN facturas f ON e.id_empleado = f.id_empleado
    LEFT JOIN detalle_facturas df ON f.id_factura = df.id_factura
    WHERE e.cargo = 'Vendedor'
    GROUP BY e.id_empleado, e.nombres, e.apellidos
    ORDER BY SUM(df.cantidad_vendida * df.precio_unitario) DESC NULLS LAST;

Esta consulta proporciona un análisis detallado del rendimiento de la fuerza de ventas. Mediante el uso de funciones de agregación y un `LEFT JOIN`, el sistema permite identificar tanto el volumen de transacciones como el total generado por cada empleado, permitiendo una evaluación objetiva de la productividad del personal y facilitando la toma de decisiones basada en métricas reales. (Esto más lo tengo por pedido del cliente, ya que quiere gestionar qué empleado vende más por lo que ellos dan un bono por aparte a la persona que realice más ventas).

### 3. Margen de ganancia por producto

    SELECT p.id_producto, p.nombre_repuesto, cp.precio_compra, p.precio_venta,
           (p.precio_venta - cp.precio_compra) AS "Ganancia_Unit",
           ROUND(((p.precio_venta - cp.precio_compra) / cp.precio_compra) * 100, 2) AS "Margen_%"
    FROM productos p
    INNER JOIN compras_proveedores cp ON p.id_producto = cp.id_producto
    GROUP BY p.id_producto, p.nombre_repuesto, cp.precio_compra, p.precio_venta;

Esta consulta implementa cálculos aritméticos (`precio_venta - precio_compra`) y funciones de redondeo (`ROUND`) para determinar la ganancia unitaria y el margen de utilidad porcentual. Este análisis permite identificar los productos con mayor valor agregado, proporcionando a la gerencia indicadores clave para ajustar estrategias de precios y compras a proveedores.

### 4. Ranking de clientes VIP

    SELECT c.id_cliente,
           CONCAT(c.nombres, ' ', c.apellidos) AS "Cliente",
           c.cedula,
           COUNT(DISTINCT f.id_factura) AS "Compras",
           COALESCE(SUM(df.cantidad_vendida * df.precio_unitario), 0) AS "Total_Invertido"
    FROM clientes c
    INNER JOIN facturas f ON c.id_cliente = f.id_cliente
    INNER JOIN detalle_facturas df ON f.id_factura = df.id_factura
    GROUP BY c.id_cliente
    ORDER BY 5 DESC;

Esta consulta permite identificar a los clientes que más han comprado. Mediante funciones de agregación y filtros relacionales, calcula la frecuencia y el total de compras de los clientes, permitiendo clasificar y priorizar a los usuarios según impacto financiero, para futuras estrategias de fidelización efectivas. Todo esto es al gusto del cliente y se ordena de manera descendente.

### 5. Top de repuestos más vendidos

    SELECT p.id_producto, p.nombre_repuesto, SUM(df.cantidad_vendida) AS "Unidades_Vendidas"
    FROM detalle_facturas df
    INNER JOIN productos p ON df.id_producto = p.id_producto
    GROUP BY p.id_producto
    ORDER BY 3 DESC
    LIMIT 3;

Esta consulta de análisis de inventario permite identificar qué productos tienen mayor rotación en el mercado. Su objetivo es proporcionar una herramienta de apoyo a la toma de decisiones para las compras futuras con los proveedores, asegurando que la inversión se enfoque en los repuestos que realmente tienen demanda (todavía no se especifica el rango con el cliente, pero por el momento queda en 3).

### 6. Total de productos por categoría

    SELECT c.nombre_categoria, COUNT(p.id_producto) AS "Cantidad"
    FROM categorias c
    LEFT JOIN productos p ON c.id_categoria = p.id_categoria
    GROUP BY c.nombre_categoria;

Esta consulta de gestión de inventario realiza un conteo automatizado de los artículos disponibles en el catálogo de productos, agrupados por su respectiva categoría. Utiliza un `LEFT JOIN` entre las tablas Categorías y Productos. Esto es fundamental porque nos permite visualizar todas las categorías, incluso aquellas que actualmente no tienen productos asignados (mostrando un “0” en el conteo), lo que ayuda a la administración a identificar áreas que necesitan abastecimiento o nuevos ingresos de mercadería.

### 7. Ventas totales por tipo de pago

    SELECT tipo_pago, COUNT(*) AS "Transacciones"
    FROM facturas
    GROUP BY tipo_pago;

Esta consulta de **análisis de preferencias de pago** agrupa las transacciones según el método utilizado (Efectivo o Tarjeta). Su objetivo es proporcionar una visión clara sobre el comportamiento de compra de los clientes, lo cual es fundamental para que la administración optimice la gestión de caja y evalúe la aceptación de diferentes modalidades de pago en el negocio.

### 8. Facturas por rango de fecha

    SELECT *
    FROM facturas
    WHERE fecha_emision BETWEEN '2026-06-01' AND '2026-06-30';

Esta consulta utiliza el operador `BETWEEN` para extraer facturas emitidas exclusivamente dentro de un rango de fechas definido. Su función estratégica es permitir a la administración generar reportes contables mensuales o auditorías de ventas precisas. Al delimitar el periodo entre el 1 y el 30 de junio, garantizamos una lectura exacta de la actividad comercial, facilitando la toma de decisiones financieras sin incluir información innecesaria de otros periodos.

### 9. Valor total de inventario

    SELECT TO_CHAR(SUM(stock_disponible * precio_venta), 'FM999,999,990.00') AS "Valor_Total_Bodega_CS"
    FROM productos;

Esta consulta calcula el valor monetario total del inventario en bodega. Mediante la función `SUM`, multiplica el stock disponible de cada producto por su precio de venta y acumula el resultado. Es una métrica financiera clave que permite a la administración conocer el capital total inmovilizado en mercancía, facilitando la valoración de activos y la toma de decisiones sobre la rentabilidad del stock actual.

### 10. Proveedores con variedad de productos

    SELECT pr.razon_social, COUNT(DISTINCT cp.id_producto) AS "Variedad"
    FROM proveedores pr
    JOIN compras_proveedores cp ON pr.id_proveedor = cp.id_proveedor
    GROUP BY pr.razon_social
    HAVING COUNT(DISTINCT cp.id_producto) > 1;

Esta consulta clasifica a los proveedores según su capacidad de abastecimiento variado, filtrando únicamente a aquellos que suministran más de un tipo de producto. Su objetivo es identificar a nuestros aliados estratégicos, permitiendo a la administración optimizar la gestión de compras al concentrar los pedidos en proveedores que ofrecen una mayor diversificación de repuestos.

### 11. Productos sin ventas (stock estancado)

    SELECT p.nombre_repuesto
    FROM productos p
    LEFT JOIN detalle_facturas df ON p.id_producto = df.id_producto
    WHERE df.id_producto IS NULL;

Esta consulta utiliza un `LEFT JOIN` para cruzar Productos con Detalle_Facturas. Al aplicar `WHERE ... IS NULL`, el sistema filtra exclusivamente aquellos repuestos sin historial de ventas. Esto permite a la gerencia identificar stock estancado y optimizar el inventario. Es una herramienta clave para medir la rotación real de los productos en la distribuidora.

### 12. Promedio de precio por marca

    SELECT marca_moto, TO_CHAR(AVG(precio_venta), 'FM999,999,990.00') AS "Precio_Promedio"
    FROM productos
    GROUP BY marca_moto;

Esta consulta utiliza la función de agregación `AVG()` sobre el campo `precio_venta` para calcular el valor promedio por cada marca de motocicleta presente en el catálogo. Al agrupar los resultados con `GROUP BY marca_moto`, permite obtener una visión clara de la estrategia de precios de la distribuidora. Es una métrica fundamental para el análisis de competitividad y posicionamiento de cada marca en el mercado.

### 13. Detalle completo de factura específica

    SELECT f.id_factura, c.nombres AS cliente, p.nombre_repuesto, df.cantidad_vendida
    FROM facturas f
    JOIN clientes c ON f.id_cliente = c.id_cliente
    JOIN detalle_facturas df ON f.id_factura = df.id_factura
    JOIN productos p ON df.id_producto = p.id_producto
    WHERE f.id_factura = 1001;

Esta consulta realiza un cruce de cuatro tablas (Facturas, Clientes, Detalle_Facturas y Productos) para consolidar la información completa de una transacción específica. Al vincular los datos mediante `JOIN` y filtrar por un `id_factura`, permite visualizar qué cliente realizó la compra, qué productos adquirió y en qué cantidad. Es esencial para la auditoría de ventas y la atención al cliente, proporcionando un reporte detallado del historial de una compra individual.

### 14. Productividad de empleados (ventas)

    SELECT e.nombres, COUNT(f.id_factura) AS "Ventas_Realizadas"
    FROM empleados e
    LEFT JOIN facturas f ON e.id_empleado = f.id_empleado
    GROUP BY e.id_empleado
    ORDER BY 2 DESC;

Esta consulta utiliza un `LEFT JOIN` para vincular la tabla Empleados con la tabla Facturas. Al aplicar `COUNT(f.id_factura)`, contabiliza todas las ventas vinculadas a cada empleado, incluyendo a aquellos con cero ventas gracias a la naturaleza del `LEFT JOIN`. Finalmente, el `ORDER BY 2 DESC` organiza los resultados de mayor a menor volumen de ventas. Es una herramienta de gestión esencial para evaluar el desempeño individual del personal y medir la productividad comercial del equipo.

### 15. Búsqueda por patrón de cédula

    SELECT nombres, apellidos, cedula
    FROM clientes
    WHERE cedula LIKE '%1000%';

Esta consulta utiliza el operador `LIKE` junto con comodines (%) para realizar una búsqueda de texto flexible sobre el campo `cedula`. Al definir el patrón como `’%1000%’`, el sistema filtra y devuelve todos los registros de clientes cuya cédula contenga la secuencia de números “1000” en cualquier posición. Es una función sumamente útil para búsquedas rápidas o cuando solo se dispone de un fragmento de la información de identificación del cliente. (Por el momento se dejó con 1000 y no 001 porque, según la administradora del local, tienen clientes de otros países que no solo vienen con 001 sino también 603, pero esto de 1000 solo se hace para mostrar la consulta).

### Vista 1: Alertas de inventario crítico (monitoreo de stock mínimo)

    CREATE OR REPLACE VIEW vw_alertas_stock_critico AS
    SELECT
        id_producto,
        nombre_repuesto,
        marca_moto,
        modelo_moto,
        COALESCE(stock_disponible, 0) AS stock_actual,
        stock_minimo,
        CASE
            WHEN COALESCE(stock_disponible, 0) = 0 THEN 'AGOTADO'
            WHEN COALESCE(stock_disponible, 0) <= stock_minimo THEN 'STOCK CRÍTICO'
            ELSE 'OK'
        END AS estado_inventario
    FROM productos;

### Vista 2: Historial analítico de ventas (auditoría administrativa del negocio)

    CREATE OR REPLACE VIEW vw_auditoria_ventas_generales AS
    SELECT
        f.id_factura,
        f.fecha_emision,
        CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
        p.nombre_repuesto,
        p.marca_moto,
        df.cantidad_vendida,
        df.precio_unitario,
        (df.cantidad_vendida * df.precio_unitario) AS total_linea,
        CONCAT(e.nombres, ' ', e.apellidos) AS atendido_por
    FROM facturas f
    INNER JOIN clientes c ON f.id_cliente = c.id_cliente
    INNER JOIN detalle_facturas df ON f.id_factura = df.id_factura
    INNER JOIN productos p ON df.id_producto = p.id_producto
    INNER JOIN empleados e ON f.id_empleado = e.id_empleado;

### Vista 3: Mapeo de transacciones (base para el recibo del cliente)

    CREATE OR REPLACE VIEW vw_recibo_detallado_cliente AS
    SELECT
        f.id_factura AS no_factura,
        p.id_producto AS codigo_producto,
        p.nombre_repuesto AS descripcion_repuesto,
        p.calidad AS calidad_repuesto,
        df.cantidad_vendida AS cantidad,
        df.precio_unitario AS precio_unitario,
        (df.cantidad_vendida * df.precio_unitario) AS subtotal,
        f.fecha_emision AS fecha,
        CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
        CONCAT(e.nombres, ' ', e.apellidos) AS atendido_por
    FROM detalle_facturas df
    INNER JOIN facturas f ON df.id_factura = f.id_factura
    INNER JOIN productos p ON df.id_producto = p.id_producto
    INNER JOIN clientes c ON f.id_cliente = c.id_cliente
    INNER JOIN empleados e ON f.id_empleado = e.id_empleado;

### Procedimiento 1: Registrar compras a proveedores (suma stock transaccional)

    CREATE OR REPLACE PROCEDURE sp_registrar_compra_proveedor(
        IN p_id_proveedor INT,
        IN p_id_producto INT,
        IN p_cantidad INT,
        IN p_precio_compra NUMERIC(10,2)
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- El procedimiento se ejecuta como una sola transacción atómica:
        -- si alguna instrucción falla, se revierte todo.
        INSERT INTO compras_proveedores (id_proveedor, id_producto, cantidad_comprada, precio_compra, fecha_compra)
        VALUES (p_id_proveedor, p_id_producto, p_cantidad, p_precio_compra, CURRENT_TIMESTAMP);

        UPDATE productos
        SET stock_disponible = stock_disponible + p_cantidad
        WHERE id_producto = p_id_producto;
    END;
    $$;

### Procedimiento 2: Apertura de nueva factura maestro (devuelve el ID autogenerado)

    CREATE OR REPLACE PROCEDURE sp_crear_factura_maestro(
        IN p_id_cliente INT,
        IN p_id_empleado INT,
        IN p_tipo_pago VARCHAR(20),
        OUT p_id_factura_generada INT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO facturas (id_cliente, id_empleado, tipo_pago, fecha_emision)
        VALUES (p_id_cliente, p_id_empleado, p_tipo_pago, CURRENT_TIMESTAMP)
        RETURNING id_factura INTO p_id_factura_generada;
    END;
    $$;

    -- Ejemplo de ejecución:
    -- CALL sp_crear_factura_maestro(1, 3, 'Efectivo', NULL);

### Trigger 1: Deducción automática y validación rígida de stock en ventas

    CREATE OR REPLACE FUNCTION fn_deducir_stock_venta()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
        stock_actual INT;
    BEGIN
        SELECT stock_disponible INTO stock_actual
        FROM productos
        WHERE id_producto = NEW.id_producto
        FOR UPDATE;

        IF stock_actual >= NEW.cantidad_vendida THEN
            UPDATE productos
            SET stock_disponible = stock_disponible - NEW.cantidad_vendida
            WHERE id_producto = NEW.id_producto;
        ELSE
            RAISE EXCEPTION 'Error: Existencias insuficientes en Moto Repuestos El Centenario para el producto solicitado.'
                USING ERRCODE = '45000';
        END IF;

        RETURN NEW;
    END;
    $$;

    CREATE TRIGGER tr_deducirstock_venta
    BEFORE INSERT ON detalle_facturas
    FOR EACH ROW
    EXECUTE FUNCTION fn_deducir_stock_venta();

### Apartado de seguridad y control de accesos

    -- Creación de roles (PostgreSQL no admite IF NOT EXISTS en CREATE ROLE; se usa un bloque anónimo)
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_administrador') THEN
            CREATE ROLE rol_administrador NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_vendedor') THEN
            CREATE ROLE rol_vendedor NOLOGIN;
        END IF;
    END
    $$;

    -- Retiro de privilegios por defecto al rol público
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

    -- Distribución perimetral de privilegios a los Roles
    GRANT CONNECT ON DATABASE motorepuestos_elcentenario TO rol_administrador, rol_vendedor;
    GRANT USAGE ON SCHEMA public TO rol_administrador, rol_vendedor;

    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_administrador;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_administrador;

    GRANT SELECT, INSERT, UPDATE ON facturas TO rol_vendedor;
    GRANT SELECT, INSERT ON detalle_facturas TO rol_vendedor;
    GRANT SELECT ON productos TO rol_vendedor;
    GRANT SELECT, INSERT ON clientes TO rol_vendedor;

    -- Creación de cuentas/usuarios para auditoría
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_user') THEN
            CREATE USER admin_user WITH PASSWORD 'AdminCentenario2026*';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'venta_user') THEN
            CREATE USER venta_user WITH PASSWORD 'VentaCentenario2026*';
        END IF;
    END
    $$;

    -- Asignación de roles a las cuentas de servidor
    GRANT rol_administrador TO admin_user;
    GRANT rol_vendedor TO venta_user;

    -- Nota: en PostgreSQL los privilegios se aplican de forma inmediata.
    -- El acceso local se restringe en pg_hba.conf (conexiones desde 127.0.0.1 / ::1).

### Creación de la base de datos

    CREATE DATABASE motorepuestos_elcentenario ENCODING 'UTF8';

    -- Conectarse a la base creada (en psql: \c motorepuestos_elcentenario)

    CREATE TABLE categorias (
        id_categoria INT GENERATED BY DEFAULT AS IDENTITY,
        nombre_categoria VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NULL,
        CONSTRAINT pk_categorias PRIMARY KEY (id_categoria)
    );

    CREATE TABLE proveedores (
        id_proveedor INT GENERATED BY DEFAULT AS IDENTITY,
        razon_social VARCHAR(100) NOT NULL,
        ruc VARCHAR(20) NOT NULL,
        telefono VARCHAR(15) NULL,
        direccion VARCHAR(255) NULL,
        CONSTRAINT pk_proveedores PRIMARY KEY (id_proveedor)
    );

    CREATE TABLE clientes (
        id_cliente INT GENERATED BY DEFAULT AS IDENTITY,
        nombres VARCHAR(50) NOT NULL,
        apellidos VARCHAR(50) NOT NULL,
        cedula VARCHAR(20) NOT NULL,
        telefono VARCHAR(15) NULL,
        CONSTRAINT pk_clientes PRIMARY KEY (id_cliente)
    );

    CREATE TABLE empleados (
        id_empleado INT GENERATED BY DEFAULT AS IDENTITY,
        nombres VARCHAR(50) NOT NULL,
        apellidos VARCHAR(50) NOT NULL,
        cargo VARCHAR(30) NOT NULL,
        salario NUMERIC(10,2) NOT NULL,
        CONSTRAINT pk_empleados PRIMARY KEY (id_empleado)
    );

    CREATE TABLE productos (
        id_producto INT GENERATED BY DEFAULT AS IDENTITY,
        nombre_repuesto VARCHAR(100) NOT NULL,
        id_categoria INT NOT NULL,
        marca_moto VARCHAR(50) NOT NULL,    -- Ej: 'Yamaha', 'TVS', 'AKT'
        modelo_moto VARCHAR(50) NOT NULL,   -- Ej: 'XTZ 150', 'Raider 125', 'CR4'
        anio_desde INT NOT NULL,
        anio_hasta INT NOT NULL,
        calidad VARCHAR(3) NOT NULL,        -- Solo aceptará 'A', 'AA', 'AAA'
        precio_venta NUMERIC(10,2) NOT NULL,
        stock_disponible INT NOT NULL DEFAULT 0,
        stock_minimo INT NOT NULL DEFAULT 4, -- Ajustado al mínimo estándar solicitado
        CONSTRAINT pk_productos PRIMARY KEY (id_producto),
        CONSTRAINT fk_productos_categorias FOREIGN KEY (id_categoria)
            REFERENCES categorias (id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT chk_calidad CHECK (calidad IN ('A', 'AA', 'AAA'))
    );

    CREATE TABLE facturas (
        id_factura INT GENERATED BY DEFAULT AS IDENTITY,
        fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        id_cliente INT NOT NULL,
        id_empleado INT NOT NULL,
        tipo_pago VARCHAR(20) NOT NULL,     -- Ej: 'Efectivo', 'Tarjeta'
        CONSTRAINT pk_facturas PRIMARY KEY (id_factura),
        CONSTRAINT fk_facturas_clientes FOREIGN KEY (id_cliente)
            REFERENCES clientes (id_cliente) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_facturas_empleados FOREIGN KEY (id_empleado)
            REFERENCES empleados (id_empleado) ON DELETE RESTRICT ON UPDATE CASCADE
    );

    CREATE TABLE detalle_facturas (
        id_detalle INT GENERATED BY DEFAULT AS IDENTITY,
        id_factura INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad_vendida INT NOT NULL,
        precio_unitario NUMERIC(10,2) NOT NULL,
        CONSTRAINT pk_detalle_facturas PRIMARY KEY (id_detalle),
        CONSTRAINT fk_detalle_facturas_facturas FOREIGN KEY (id_factura)
            REFERENCES facturas (id_factura) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_detalle_facturas_productos FOREIGN KEY (id_producto)
            REFERENCES productos (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE
    );

    CREATE TABLE compras_proveedores (
        id_compra INT GENERATED BY DEFAULT AS IDENTITY,
        id_proveedor INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad_comprada INT NOT NULL,
        precio_compra NUMERIC(10,2) NOT NULL,
        fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_compras_proveedores PRIMARY KEY (id_compra),
        CONSTRAINT fk_compras_proveedores_proveedores FOREIGN KEY (id_proveedor)
            REFERENCES proveedores (id_proveedor) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_compras_proveedores_productos FOREIGN KEY (id_producto)
            REFERENCES productos (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE
    );

---

# Capítulo 02: Objeto de Estudio y Contexto del Sistema (MREC)

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Identificador**  
OES-MREC-001  
**Versión:** 1.0  
**Documento relacionado:** 01_MotoRepuestos_Centenario_SABD.pdf


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha:** 23 de septiembre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Objeto de estudio – Ingeniería de Software 1**  
Contexto del sistema y base del Informe SABD


**Propósito documental.** Este documento establece el objeto de estudio del Informe SABD, *Diseño de la arquitectura back-end de una base de datos relacional para el control de inventario y facturación de Moto Repuestos El Centenario*, y es su entrada contextual. Describe el negocio, el problema, el alcance y la línea base tecnológica que el informe desarrolla en su diseño, implementación y evidencias.

## Propósito y alcance del objeto de estudio

El objeto de estudio es la operación comercial de Moto Repuestos El Centenario en sus procesos de catálogo y compatibilidades, compras a proveedores, inventario, facturación y control de acceso, que la arquitectura back-end de base de datos busca respaldar. La necesidad académica consiste en estudiar cómo una base de datos relacional puede mejorar la trazabilidad de estas operaciones y disminuir riesgos de error manual, inconsistencia de existencias y acceso no autorizado.

El producto estudiado no es una tienda pública ni un sistema contable integral. Es una capa de datos de uso interno, sin interfaz gráfica en esta etapa, diseñada para asistir a roles comerciales, de bodega, administración y gerencia.

## Contexto del negocio

“Moto Repuestos El Centenario” es un negocio comercial ubicado en Managua, Nicaragua, fundado en 2020 por Alejandra Alemán y especializado en la venta de repuestos y componentes para diversas marcas y modelos de motocicletas. Su contexto se resume así:


| **Elemento** | **Descripción del caso de estudio** |
|:---|:---|
| Actividad | Comercialización y distribución de repuestos y componentes para motocicletas, en distintas gamas de calidad (A, AA, AAA). |
| Usuarios operativos | Vendedor, responsable de bodega, administración y gerencia. |
| Flujo crítico | Consulta de compatibilidad y stock $`\rightarrow`$ venta $`\rightarrow`$ emisión de factura $`\rightarrow`$ actualización automática de stock $`\rightarrow`$ auditoría. |
| Información sensible | Precios de costo, proveedores, existencias, clientes, datos del personal y registros de ventas. |
| Entorno | Atención en mostrador y bodega; operación local con acceso restringido al servidor de base de datos. |


## Problema de estudio

Una gestión dispersa en registros manuales o archivos no integrados incrementa el riesgo de vender artículos sin existencia, perder la relación entre ventas y movimientos de inventario, registrar importes inconsistentes, retrasar la atención en mostrador y carecer de un registro suficiente para investigar decisiones o ajustes. También dificulta separar funciones entre quien registra una operación y quien administra la información sensible.

La pregunta central del objeto de estudio es: ¿cómo diseñar e implementar una base de datos relacional que mantenga consistencia transaccional entre ventas, compras e inventario, ofrezca trazabilidad por rol y pueda administrarse y respaldarse en una pequeña empresa comercial?

## Objetivo general y objetivos específicos

**Objetivo general.** Diseñar y evaluar una arquitectura back-end de base de datos relacional para Moto Repuestos El Centenario que centralice los procesos de catálogo, inventario, compras y facturación, preservando integridad, seguridad y trazabilidad.

- Crear la base de datos física en PostgreSQL a partir de un diseño lógico normalizado, con restricciones de integridad referencial (`PRIMARY KEY` y `FOREIGN KEY`) en un esquema de 8 tablas.

- Establecer políticas de seguridad y control de accesos mediante comandos DCL (`GRANT` y `REVOKE`), con roles específicos para Administrador y Vendedor.

- Automatizar reglas de negocio críticas, como la deducción de stock tras una venta y la alerta de existencias críticas, mediante disparadores, vistas y procedimientos almacenados.

- Verificar el funcionamiento del esquema mediante un conjunto de 15 consultas de análisis y los scripts de evidencia del informe.

- Documentar supuestos y límites sin presentar los datos de prueba como datos empresariales confirmados.

## Alcance funcional


| **Incluido** | **Descripción** |
|:---|:---|
| Catálogo y compatibilidad | Productos y categorías, marca, modelo y años de aplicación, calidad (A, AA, AAA), precios, stock disponible y stock mínimo. |
| Compras e inventario | Proveedores, compras de reabastecimiento, ingreso transaccional de stock mediante procedimiento almacenado y alerta de existencias críticas. |
| Ventas y facturación | Clientes, empleados, facturas y detalle de facturas, tipo de pago y deducción automática de stock mediante disparador. |
| Control y seguridad | Roles Administrador y Vendedor, usuarios del servidor y privilegios segmentados por tabla. |
| Análisis | Vistas de inventario crítico, auditoría de ventas y recibo detallado, más 15 consultas con `JOIN`, agregaciones y subconsultas. |

| **No incluido** | **Razón de límite** |
|:---|:---|
| Interfaces gráficas de usuario | El alcance es exclusivamente back-end; la interfaz queda como fase posterior. |
| Contabilidad general, nómina y pasarelas de pago en línea | No forman parte del alcance académico ni del flujo comercial interno priorizado; toda venta se registra de manera local. |
| Caja, devoluciones, garantías y anulaciones | No se modelan en las 8 tablas del esquema actual. |
| Facturación electrónica o integración bancaria real | Quedan como evolución futura sujeta a requisitos regulatorios, contratos e integración externa. |
| Despliegue comercial definitivo | La entrega demuestra preparación técnica y escenarios académicos; la operación real requiere piloto, aceptación y controles adicionales. |


## Línea base tecnológica del objeto de estudio

La tecnología se define por el sistema y sus evidencias de implementación:


| **Capa** | **Decisión del objeto de estudio** | **Justificación** |
|:---|:---|:---|
| Motor de base de datos | PostgreSQL, administrado mediante pgAdmin 4. | Soporta transacciones ACID, restricciones de integridad, bloqueo selectivo de filas y un modelo de roles y privilegios. |
| Modelo de datos | Esquema relacional normalizado de 8 tablas con claves primarias y foráneas. | Elimina redundancias y garantiza la integridad referencial entre catálogo, ventas y compras. |
| Lógica de servidor | Funciones de disparador y procedimientos almacenados en PL/pgSQL, y vistas. | Encapsula las reglas de negocio en el motor y evita conciliaciones manuales. |
| Seguridad | Roles `rol_administrador` y `rol_vendedor`, usuarios asociados y acceso local restringido en `pg_hba.conf`. | Aplica el principio de mínimo privilegio y reduce la superficie de exposición. |
| Continuidad | Respaldos con `pg_dump` en almacenamiento externo. | Responde a pérdida de datos, error humano y mantenimiento controlado. |


**Decisión de consistencia:** PostgreSQL es el motor oficial del Informe SABD.

## Partes interesadas y responsabilidades


| **Parte interesada** | **Interés o responsabilidad** |
|:---|:---|
| Propietaria/representante del negocio | Validar prioridades, datos comerciales, políticas operativas y aceptación del piloto. |
| Vendedor | Consultar productos, registrar clientes y facturas según los permisos de su rol. |
| Bodega | Recibir mercancía, consultar existencias y reportar diferencias. |
| Administración | Gestionar parámetros, usuarios, precios, proveedores y reportes. |
| Gerencia | Consultar indicadores y auditoría sin alterar transacciones operativas. |
| Equipo de proyecto | Gestionar diseño, implementación, pruebas, evidencia y control de cambios. |
| Docente evaluador | Revisar coherencia, trazabilidad, evidencia y aplicación académica de los fundamentos de administración de bases de datos. |


## Criterios de calidad y seguridad

- **Integridad:** una venta registrada descuenta el stock mediante disparador dentro de la misma transacción; si no hay existencias suficientes, la operación se rechaza y no quedan efectos parciales.

- **Seguridad:** roles y privilegios por tabla, segregación de funciones y acceso restringido a costos, proveedores y datos del personal para usuarios sin privilegios.

- **Rendimiento:** claves primarias con índices B-Tree y consultas de catálogo y análisis diseñadas para respuesta inmediata en mostrador.

- **Trazabilidad:** cada factura queda vinculada a un cliente y a un empleado, conserva el precio unitario histórico y puede auditarse mediante vistas.

- **Continuidad:** respaldos periódicos con `pg_dump` y restauración de ensayo en una base aislada.

## Supuestos, restricciones y riesgos


| **Elemento** | **Tratamiento** |
|:---|:---|
| Datos comerciales y financieros | Se tratan como datos de prueba académicos hasta que el negocio los valide con registros reales. |
| Infraestructura física | Debe verificarse la compatibilidad real de servidor, red local y almacenamiento de respaldo antes de producción. |
| Usuarios finales | Las pruebas del equipo no reemplazan la aceptación ni la medición de satisfacción con el personal operativo. |
| Seguridad productiva | Requiere gestión de secretos (las cuentas del anexo son de demostración), parcheo, respaldo externo y respuesta a incidentes. |
| Cambios | Todo cambio al esquema, la tecnología o los requisitos debe registrar su impacto y actualizar la documentación. |


## Relación con el Informe SABD


| **Sección del informe** | **Relación con OES-MREC-001** |
|:---|:---|
| Introducción, objetivos, planteamiento del problema y alcance | Toman de este documento el contexto, el problema y los límites del objeto de estudio. |
| Caso de estudio y desarrollo del contenido | Desarrollan la arquitectura de datos, la automatización, la seguridad y la inteligencia de negocios. |
| Entidades, modelo relacional y diccionarios de datos | Concretan el esquema físico de 8 tablas que sostiene el flujo comercial descrito. |
| Resultados, conclusiones y recomendaciones | Evalúan el cumplimiento de los objetivos y los criterios de calidad definidos aquí. |
| Pruebas y evidencias (anexos) | Presentan el código DDL, vistas, procedimientos, disparador, seguridad y consultas que respaldan el objeto de estudio. |


## Control de versión y aprobación


| **Versión** | **Fecha** | **Descripción** | **Responsable** |
|:---|:---|:---|:---|
| 1.0 | 23 de septiembre de 2026 | Emisión del objeto de estudio del Informe SABD. | Equipo de proyecto |

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Docente | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada | Firma y fecha |

---

# Capítulo 03: Documento de Especificación de Requisitos (StRS, SyRS y SRS)

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

Dirección de Área de Conocimiento DACTIC

Asignatura: Ingeniería de Software 1

------------------------------------------------------------------------

**DOCUMENTO DE ESPECIFICACIÓN DE REQUISITOS**

Especificación de Requisitos de Partes Interesadas, Sistema y Software

StRS, SyRS y SRS

**Caso de estudio: Distribuidora Comercial “Moto Repuestos El Centenario”**

------------------------------------------------------------------------


**Marco normativo principal**

ISO/IEC/IEEE 29148:2011

ISO/IEC/IEEE 12207:2017

ISO/IEC 25010:2011

UML 2.5

**Versión:** 1.0

**Estado:** Línea base propuesta


**Docente:** Ing. Roberto Alfaro

**Carrera:** Ingeniería en Computación

**Grupo:** 4S1-COM-S

**Fecha:** 23 de septiembre de 2026

**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:----------:|:---------------:|
| Ángel Antonio Alonso Suárez | 2021-0087U |    6B763BC6     |
| Noel Isaac Alemán Carballo  | 2022-0376U |    6B76CA80     |
| Mendell Noé Parrales Molina | 2020-1014U |    6AAB3C24     |


**Primer entregable de planificación – Ingeniería de Software 1**

Especificación integral conforme a la estructura obligatoria de la plantilla académica


#### Identificación y control del documento

| Campo | Valor |
|:---|:---|
| Identificador | REQ-MREC-001 |
| Título único | Especificación integral de requisitos StRS, SyRS y SRS de Moto Repuestos El Centenario |
| Versión y fecha | 1.0 – 23 de septiembre de 2026 |
| Propietario de la línea base | Equipo de proyecto de Ingeniería de Software 1 |
| Estado | Línea base propuesta para revisión y aprobación académica |
| Aviso de revisión | Toda modificación posterior deberá registrar versión, responsable, motivo e impacto en la matriz de trazabilidad. |

##### Historial de versiones

| **Versión** | **Fecha** | **Descripción** | **Responsables** |
|:---|:---|:---|:---|
| 1.0 | 23/09/2026 | Emisión de la línea base integral StRS, SyRS y SRS, con requisitos verificables y trazabilidad vertical. | Equipo de trabajo |

##### Aprobaciones previstas

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Representante académico | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada por Moto Repuestos El Centenario | Firma y fecha |

#### Índice de cuadros y figuras

| **Tipo** | **Contenido principal** | **Ubicación** |
|:---|:---|:---|
| Cuadros comunes | Control documental, referencias, definiciones y acrónimos. | Material preliminar |
| Cuadros StRS | Partes interesadas, objetivos, procesos, reglas, modos y requisitos de usuario. | Parte I |
| Figura 1 | Contexto operacional y frontera de alto nivel. | StRS 6.1 |
| Cuadros SyRS | Catálogo verificable de funciones, calidad, interfaces, operación, seguridad y ciclo de vida. | Parte II, sección 10 |
| Cuadros SRS | Catálogo funcional, modelo lógico, restricciones y atributos del software. | Parte III, sección 15 |
| Cuadro RTM | Trazabilidad bidireccional StRS–SyRS–SRS. | Sección 18 |
| Cuadro de conformidad | Correspondencia con los elementos 9.2 a 9.5 de la plantilla obligatoria. | Sección 22 |

#### Resumen ejecutivo

Este documento establece una línea base única y trazable para transformar la operación manual de Moto Repuestos El Centenario en un sistema integral de información. La solución contemplada cubre catálogo y compatibilidad técnica, proveedores, compras, inventario y Kardex, cotizaciones, ventas y facturación, pagos, clientes, devoluciones, garantías, caja, seguridad, auditoría, respaldos e indicadores de gestión. La propuesta conserva como punto de partida el sistema de base de datos del proyecto original, pero amplía su alcance hacia un producto completo, operable y verificable.

La especificación se divide en tres niveles. El StRS explica por qué el negocio necesita el sistema y qué resultados esperan las partes interesadas; el SyRS traduce esas necesidades en capacidades y restricciones del sistema completo; el SRS detalla el comportamiento exigido al software. Cada requisito posee identificador estable, origen, prioridad, método de verificación y criterio de aceptación. La matriz final demuestra la trazabilidad ascendente y descendente entre los tres niveles.

La estructura adopta los elementos de contenido de la cláusula 9 de ISO/IEC/IEEE 29148:2011 y los esquemas recomendados de su cláusula 8. ISO/IEC/IEEE 12207:2017 se utiliza como referencia del ciclo de vida e ISO/IEC 25010:2011 como taxonomía de atributos de calidad. La arquitectura y el diseño se definirán en documentos posteriores; por ello, esta línea base expresa principalmente *qué* debe lograrse y evita imponer decisiones de implementación que todavía deben evaluarse.

#### Contenido común a StRS, SyRS y SRS

##### Definiciones

| **Término** | **Definición en este proyecto** |
|:---|:---|
| Compatibilidad técnica | Correspondencia válida entre un repuesto y una motocicleta definida por marca, modelo, año o rango de años y, cuando corresponda, variante. |
| Existencia disponible | Cantidad físicamente utilizable de un producto, descontando unidades comprometidas, devueltas pendientes de inspección o dadas de baja. |
| Kardex | Historial inmutable y cronológico de entradas, salidas, ajustes y devoluciones de inventario. |
| Línea base | Conjunto aprobado de requisitos que solo puede modificarse mediante control de cambios. |
| Operación sensible | Anulación, ajuste de inventario, cambio de costo o precio, devolución, cierre de caja, alta de usuario o modificación de permisos. |
| Punto de venta | Flujo de atención en mostrador que comprende búsqueda, selección, cobro, emisión de comprobante y actualización de existencias. |
| Trazabilidad | Capacidad de seguir el origen, derivación, verificación e impacto de cada requisito. |

##### Referencias de cumplimiento y orientación

| **Tipo** | **Documento** | **Uso** |
|:---|:---|:---|
| Cumplimiento | ISO/IEC/IEEE 29148:2011, *Systems and software engineering – Life cycle processes – Requirements engineering*. | Estructura, contenido y calidad de requisitos. |
| Orientación | ISO/IEC/IEEE 12207:2017, *Systems and software engineering – Software life cycle processes*. | Relación con procesos de software. |
| Orientación | ISO/IEC 25010:2011, *System and software quality models*. | Clasificación de atributos de calidad. |
| Fuente del dominio | *Diseño de la arquitectura back-end de una base de datos relacional para el control de inventario y facturación de Moto Repuestos El Centenario*, junio de 2026. | Contexto real, entidades iniciales y procesos existentes. |
| Guía académica | Plantilla de contenido de elementos de información, cláusula 9, entregada para la asignatura. | Lista obligatoria de comprobación StRS, SyRS y SRS. |

##### Acrónimos y abreviaturas

| **Sigla** | **Significado** | **Sigla** | **Significado** |
|:---|:---|:---|:---|
| API | Interfaz de programación de aplicaciones | POS | Punto de venta |
| BD | Base de datos | RBAC | Control de acceso basado en roles |
| GUI | Interfaz gráfica de usuario | RTM | Matriz de trazabilidad de requisitos |
| MOP | Medida de desempeño operacional | SRS | Especificación de requisitos de software |
| P95 | Percentil 95 | StRS | Especificación de requisitos de partes interesadas |
| RPO | Punto objetivo de recuperación | SyRS | Especificación de requisitos del sistema |
| RTO | Tiempo objetivo de recuperación | UPS | Sistema de alimentación ininterrumpida |

## Parte I Especificación de requisitos de partes interesadas StRS

#### Introducción del StRS

##### Propósito del negocio

Moto Repuestos El Centenario requiere centralizar y controlar sus operaciones comerciales para eliminar diferencias de inventario, reducir el tiempo de atención en mostrador, conservar la trazabilidad de compras y ventas y producir información confiable para decidir qué productos comprar, reponer o promover. El sistema contribuirá a que cada movimiento comercial quede respaldado por una transacción identificable y a que la gerencia pueda supervisar existencias, márgenes, caja y desempeño sin reconstruir información manualmente.

##### Alcance del negocio

El alcance comprende las operaciones de catálogo y compatibilidad de repuestos, proveedores, compras, recepción, inventario, cotizaciones, ventas, pagos, clientes, devoluciones, garantías, caja, reportes, usuarios, permisos, auditoría y respaldo. Incluye la atención en el local de Managua y deja preparada la información para crecimiento futuro. Se excluyen nómina, contabilidad general, comercio electrónico público, logística de entrega a domicilio y comunicación automática con autoridades tributarias; estas capacidades solo podrán incorporarse mediante una nueva línea base.

##### Visión general del negocio

Moto Repuestos El Centenario es una distribuidora comercial de repuestos y componentes para motocicletas ubicada en Managua. El proyecto original documenta operaciones de compra a proveedores, almacenamiento, consulta de compatibilidad y venta al detalle, junto con un modelo inicial de ocho tablas. La nueva iniciativa convierte esa base en una solución integral que relaciona el flujo comercial completo y conserva evidencia auditable de cada operación.

##### Partes interesadas

| **Parte interesada** | **Responsabilidad** | **Necesidades y preocupaciones** |
|:---|:---|:---|
| Propietaria o gerencia | Patrocina, aprueba reglas y supervisa resultados. | Rentabilidad, control de costos y precios, inventario confiable, caja, seguridad y reportes. |
| Administrador del sistema | Configura catálogos, usuarios, compras y parámetros. | Integridad de datos, operaciones controladas, recuperación y trazabilidad. |
| Vendedor de mostrador | Atiende consultas, cotiza, cobra y factura. | Búsqueda rápida, compatibilidad clara, flujo corto y mensajes comprensibles. |
| Responsable de bodega | Recibe, cuenta, ajusta y verifica existencias. | Kardex exacto, conteos físicos, alertas y lotes de recepción. |
| Cliente | Solicita repuestos y comprobantes. | Producto compatible, precio claro, atención ágil, devolución y garantía trazables. |
| Proveedor | Entrega mercancía y documentos de compra. | Órdenes claras, recepción registrada y saldos documentales consistentes. |
| Equipo de desarrollo y soporte | Construye, prueba, despliega y mantiene. | Requisitos no ambiguos, datos diagnosticables y procedimientos de recuperación. |
| Docente evaluador | Revisa el artefacto académico. | Conformidad con plantilla, rigor, coherencia y trazabilidad. |

#### Referencias del StRS

Se aplican las referencias comunes declaradas al inicio. En este nivel prevalecen el documento original del negocio y las decisiones aprobadas por la propietaria. Las tecnologías concretas del proyecto original no constituyen requisitos del negocio salvo cuando aparecen expresamente como restricciones en esta línea base.

#### Requisitos de gestión del negocio

##### Entorno del negocio

La operación se realiza principalmente en un local físico con atención directa. El catálogo combina repuestos de distintas marcas, modelos y años; una descripción comercial no basta para decidir compatibilidad. Existen riesgos por cortes de energía, captura manual, duplicidad de nombres, cambios de precio, movimientos sin autorización y pérdida de contexto histórico. El sistema debe funcionar en la red local y mantener continuidad básica aun cuando no exista conexión pública a Internet.

##### Objetivos y metas

| **ID** | **Objetivo** | **Medida de logro** |
|:---|:---|:---|
| OBJ-01 | Evitar ventas que produzcan existencias negativas. | Cero transacciones confirmadas con saldo final negativo. |
| OBJ-02 | Reducir el tiempo de búsqueda y facturación en mostrador. | P95 de búsqueda menor o igual a 3 s y venta ordinaria completada en hasta 4 pantallas. |
| OBJ-03 | Hacer trazable todo movimiento de inventario y toda operación sensible. | 100% con identificador, fecha, usuario, motivo y valores anterior/nuevo. |
| OBJ-04 | Recuperar la operación ante fallas comunes. | Respaldo diario verificable, RPO de 24 h y RTO de 4 h. |
| OBJ-05 | Apoyar decisiones de compra y venta. | Reportes de rotación, margen, stock crítico, caja y ventas por periodo. |

##### Modelo de negocio

La empresa adquiere repuestos a proveedores, los clasifica por identidad y compatibilidad, mantiene existencias y los vende en mostrador. El valor se genera al localizar una pieza compatible con rapidez, asegurar disponibilidad real y documentar una transacción confiable. Los costos principales son adquisición, inventario inmovilizado, errores, devoluciones y tiempo de atención. Los ingresos provienen de ventas; por ello, precios, costos y márgenes requieren acceso restringido y conservación histórica.

##### Entorno de información

La información maestra incluye productos, categorías, marcas, modelos, compatibilidades, proveedores, clientes, usuarios, roles, medios de pago y parámetros. La información transaccional incluye órdenes y recepciones de compra, Kardex, cotizaciones, facturas, pagos, devoluciones, garantías, cierres de caja y auditoría. Los registros transaccionales confirmados no se eliminarán físicamente; se corregirán mediante operaciones compensatorias autorizadas.

#### Requisitos operacionales del negocio

##### Procesos del negocio

| **ID** | **Proceso** | **Secuencia y resultado** |
|:---|:---|:---|
| P-01 | Catálogo y compatibilidad | Registrar producto único; clasificarlo; asociar marcas, modelos y años; validar duplicados; publicar para consulta. |
| P-02 | Abastecimiento | Registrar proveedor y orden; recibir mercancía; comparar cantidades y costos; aceptar diferencias justificadas; ingresar existencias. |
| P-03 | Inventario | Registrar cada entrada, salida, ajuste, devolución o baja; calcular saldo; alertar mínimos; conciliar conteos. |
| P-04 | Cotización y venta | Identificar cliente cuando corresponda; buscar piezas; validar stock y precio; cotizar o cobrar; emitir comprobante; descontar existencias. |
| P-05 | Devolución y garantía | Verificar factura, plazo, producto y motivo; inspeccionar; autorizar; reintegrar, cambiar o dar de baja; dejar evidencia. |
| P-06 | Caja | Abrir turno; registrar pagos y movimientos; contar; comparar esperado contra declarado; cerrar con diferencia justificada. |
| P-07 | Control y análisis | Revisar auditoría, inventario, márgenes, compras, ventas, caja y alertas; exportar resultados autorizados. |

##### Políticas y reglas operacionales

| **ID** | **Regla** | **Enunciado** |
|:---|:---|:---|
| RN-01 | Stock no negativo | Ninguna venta o salida ordinaria podrá confirmar una cantidad superior a la existencia disponible. |
| RN-02 | Kardex inmutable | Cada movimiento confirmado generará una entrada de Kardex; una corrección se realizará con un movimiento compensatorio. |
| RN-03 | Identidad del producto | Un producto tendrá código único y una combinación controlada de descripción, marca o fabricante y presentación. |
| RN-04 | Compatibilidad explícita | La compatibilidad se registrará mediante asociaciones y rangos válidos; no se inferirá solamente del nombre comercial. |
| RN-05 | Precio y margen | Los cambios de costo, precio o margen mínimo requerirán permiso administrativo y conservarán historial. |
| RN-06 | Cotización vigente | Toda cotización tendrá fecha de emisión y vencimiento; una cotización vencida requerirá recalcular precios y disponibilidad. |
| RN-07 | Venta atómica | Factura, pagos, detalle, Kardex y saldos se confirmarán como una sola unidad; ante error no quedarán efectos parciales. |
| RN-08 | Pago conciliado | La suma de pagos deberá coincidir con el total de la venta antes de confirmarla. |
| RN-09 | Operación sensible | Anulaciones, ajustes, devoluciones, cambios de precio y cierres con diferencia exigirán autorización y motivo. |
| RN-10 | Documento histórico | Facturas, compras y movimientos confirmados no se borrarán físicamente. |
| RN-11 | Separación de funciones | El vendedor no podrá administrar permisos, modificar costos ni aprobar su propia operación sensible. |
| RN-12 | Cierre de caja | Cada turno tendrá una única apertura y cierre; toda diferencia quedará registrada y aprobada según umbral. |
| RN-13 | Devolución vinculada | Una devolución deberá referenciar una venta previa y no podrá superar la cantidad originalmente vendida menos devoluciones anteriores. |
| RN-14 | Copias de seguridad | Se generará al menos un respaldo diario y se comprobará su restauración de manera programada. |
| RN-15 | Datos personales mínimos | Solo se capturarán datos de clientes necesarios para atención, comprobantes, garantía o historial autorizado. |

##### Restricciones operacionales

La venta debe poder completarse en la red local; el sistema no dependerá de Internet para las funciones esenciales. Los equipos, impresoras y lectores disponibles pueden variar, por lo que deberán validarse antes de adquisición. La disponibilidad del negocio no equivale a operación continua 24/7: el horario objetivo es el horario comercial configurado. La adopción se realizará sin destruir el historial existente y con capacitación previa a la puesta en servicio.

##### Modos operacionales

| **Modo** | **Entrada y comportamiento** | **Salida** |
|:---|:---|:---|
| Normal | Servicios y datos disponibles; todas las funciones según rol. | Operación ordinaria. |
| Alta demanda | Cola de transacciones elevada; se priorizan venta, consulta y pago. | Reportes pesados se difieren sin perder solicitudes. |
| Contingencia local | Falla de Internet; continúa la operación LAN. | Sincronizaciones externas quedan pendientes. |
| Solo consulta | Mantenimiento o incidente controlado; se bloquean escrituras. | Usuarios consultan datos consistentes. |
| Recuperación | Restauración validada por administrador; acceso restringido. | Regreso documentado a modo normal. |

##### Calidad operacional

La prioridad es preservar integridad y trazabilidad antes que velocidad. Una venta no debe confirmarse si existe duda sobre stock, total o autorización. La atención debe seguir siendo práctica: búsqueda y cobro tendrán respuesta medible, y los errores deberán indicar qué condición impide continuar y cómo corregirla.

##### Estructura del negocio

La gerencia aprueba reglas, parámetros y excepciones; administración mantiene catálogos, compras, usuarios y reportes; ventas atiende clientes y emite documentos; bodega controla recepción y conteos; soporte mantiene la plataforma sin asumir facultades comerciales. Una persona podrá ocupar más de un rol solamente cuando la gerencia lo autorice, sin eliminar la auditoría ni la aprobación requerida para operaciones sensibles.

#### Requisitos de usuario

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **ST-REQ-001** | El vendedor deberá localizar repuestos por código, texto y compatibilidad sin revisar registros separados. | P-01/P-04 | M | D | Con tres criterios combinados se obtiene la lista pertinente en máximo 3 s P95. |
| **ST-REQ-002** | El vendedor deberá conocer existencia, precio y compatibilidad antes de agregar un repuesto a una venta. | P-04 | M | D | Cada resultado muestra los tres datos y bloquea productos sin stock. |
| **ST-REQ-003** | El vendedor deberá emitir cotizaciones y convertir una cotización vigente en venta sin recapturar sus líneas. | P-04/RN-06 | S | T | Conversión conserva cliente, líneas y referencia; recalcula precio y stock. |
| **ST-REQ-004** | El vendedor deberá registrar una venta con uno o varios medios de pago y obtener un comprobante identificable. | P-04/RN-08 | M | T | El total de pagos coincide con el total y se genera número único. |
| **ST-REQ-005** | El responsable de bodega deberá recibir compras y reflejar las cantidades aceptadas en el inventario y Kardex. | P-02/P-03 | M | T | La recepción confirmada crea entradas y saldos exactos por producto. |
| **ST-REQ-006** | El responsable de bodega deberá contar existencias y registrar diferencias mediante ajustes autorizados. | P-03/RN-09 | M | T | Cada diferencia produce ajuste con motivo, aprobador y evidencia. |
| **ST-REQ-007** | La gerencia deberá controlar costos, precios, margen mínimo y su historial. | RN-05 | M | I | Solo roles autorizados modifican y cada cambio conserva antes/después. |
| **ST-REQ-008** | La gerencia deberá conocer ventas, margen, rotación, stock crítico, compras y caja por periodo. | P-07 | M | D | Cada informe filtra por periodo y permite rastrear cifras a transacciones. |
| **ST-REQ-009** | La gerencia deberá definir usuarios, roles y permisos sin compartir credenciales. | RN-11 | M | I | Matriz RBAC aprobada; cada operador utiliza cuenta individual. |
| **ST-REQ-010** | La gerencia deberá auditar toda operación sensible por usuario, fecha, motivo y valores afectados. | RN-09/RN-10 | M | I | Muestreo confirma 100% de campos de auditoría. |
| **ST-REQ-011** | El vendedor deberá gestionar devoluciones y garantías vinculadas a la venta original. | P-05/RN-13 | M | T | No se acepta cantidad superior al saldo devolvible y se registra resolución. |
| **ST-REQ-012** | El cajero o vendedor autorizado deberá abrir y cerrar su turno con conciliación de medios de pago. | P-06/RN-12 | M | T | Cierre calcula esperado, declarado y diferencia por medio. |
| **ST-REQ-013** | El administrador deberá recuperar la información tras una falla sin reconstruirla manualmente. | RN-14 | M | T | Prueba de restauración cumple RPO 24 h y RTO 4 h. |
| **ST-REQ-014** | El cliente deberá recibir información clara del producto, cantidades, precio, total y condiciones aplicables. | P-04/P-05 | M | I | Comprobante contiene datos obligatorios y es legible en impresión o PDF. |
| **ST-REQ-015** | El administrador deberá importar el catálogo inicial y exportar información autorizada sin perder trazabilidad. | Entorno de información | S | T | Importación reporta aceptados/rechazados; exportación respeta permisos y filtros. |
| **ST-REQ-016** | El equipo de soporte deberá diagnosticar incidentes sin modificar transacciones comerciales. | Sostenimiento | S | I | Bitácoras técnicas identifican evento y no conceden permisos de negocio. |

#### Concepto del sistema propuesto

##### Concepto operacional

Se contempla una aplicación de gestión accesible desde estaciones autorizadas en la red local, respaldada por un servicio central y una base de datos transaccional. Los usuarios se autentican individualmente y ven únicamente las funciones de su rol. El sistema coordina catálogo, compras, inventario, venta, caja y reportes; los periféricos de impresión y lectura aceleran el trabajo, pero la información válida reside en el sistema y no en hojas paralelas.

<figure>

<figcaption>Contexto operacional y frontera de alto nivel.</figcaption>
</figure>

##### Escenarios operacionales

**EO-01 Venta ordinaria.** El vendedor se autentica, busca por motocicleta y descripción, selecciona un repuesto disponible, identifica al cliente cuando corresponde, registra el pago y confirma. El sistema valida permisos, totales y stock; crea factura, pagos y Kardex; actualiza existencias y produce el comprobante. Si cualquier validación falla, no se confirma ningún efecto parcial.

**EO-02 Recepción con diferencia.** Bodega abre una orden, registra cantidades recibidas y detecta una diferencia. El sistema exige motivo y autorización cuando supera el umbral configurado. Al confirmar, crea la recepción, el movimiento de inventario y el historial de costo; la orden queda parcial o completa según cantidades.

**EO-03 Devolución.** El vendedor localiza la factura, selecciona líneas y cantidades, registra motivo y condición física. Un autorizador resuelve reintegro, cambio o baja. El sistema impide exceder el saldo devolvible, registra la operación y ajusta inventario solo cuando la resolución lo permite.

**EO-04 Corte eléctrico.** La UPS permite finalizar o cancelar de forma segura la operación en curso. Después del reinicio, el sistema comprueba integridad, identifica transacciones incompletas sin efectos parciales y registra el incidente.

#### Restricciones del proyecto

La entrega de esta línea base tiene fecha 23 de septiembre de 2026. La etapa actual es de documentación y análisis; no existe una autorización de compra ni un cronograma de producción dentro de este artefacto. La solución deberá priorizar tecnologías con costos de licencia nulos o justificables, operar en infraestructura alcanzable para una pequeña empresa y permitir evolución modular. Las decisiones de arquitectura, lenguaje, framework, motor de base de datos y metodología se tomarán en los documentos posteriores mediante criterios explícitos.

## Parte II Especificación de requisitos del sistema SyRS

#### Introducción del SyRS

##### Propósito del sistema

El sistema gestionará de extremo a extremo la información comercial y operativa definida en el StRS, preservando integridad transaccional, control de acceso, continuidad, verificabilidad y trazabilidad.

##### Alcance del sistema

Incluye aplicación, servicios, base de datos, estaciones de trabajo autorizadas, impresora de comprobantes, lector de códigos, red local, respaldo y procedimientos de recuperación. No incluye contabilidad general, nómina, comercio electrónico público ni infraestructura de terceros no aprobada.

##### Visión general del sistema

###### Contexto del sistema

Los límites se sitúan entre los actores humanos y periféricos, por una parte, y los servicios de gestión y persistencia, por otra. Proveedores y clientes no acceden directamente; su información es registrada por personal autorizado.

###### Funciones del sistema

Autenticar; autorizar; mantener maestros; relacionar compatibilidades; gestionar compras y recepciones; controlar inventario y conteos; cotizar; vender y cobrar; gestionar devoluciones; abrir y cerrar caja; auditar; respaldar; recuperar; informar y exportar.

###### Características de los usuarios

Los vendedores poseen conocimiento del dominio y capacitación informática básica; administradores y gerencia requieren capacitación funcional; soporte posee conocimiento técnico. La interfaz no supondrá conocimientos de SQL ni acceso directo a tablas.

#### Referencias del SyRS

Se aplican las referencias comunes. Cada requisito SyRS enlaza al menos un requisito StRS, regla u objetivo de negocio. Los valores de capacidad representan objetivos de diseño para un local inicial: 20,000 productos, 10 usuarios concurrentes y 4 estaciones POS.

#### Requisitos del sistema

##### Requisitos funcionales

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-FN-001** | El sistema deberá autenticar a cada operador mediante una cuenta individual activa. | ST-REQ-009 | M | T | Credenciales válidas permiten acceso; inválidas no revelan cuál dato falló. |
| **SYS-FN-002** | El sistema deberá autorizar cada acción mediante permisos asociados a roles. | ST-REQ-009 | M | I | Pruebas por rol confirman la matriz aprobada sin privilegios excedentes. |
| **SYS-FN-003** | El sistema deberá registrar productos con código único, estado, categoría, descripción, fabricante o marca, presentación, costos, precio, mínimo e impuestos configurables. | ST-REQ-001/007 | M | T | Duplicados son rechazados y todos los campos obligatorios se validan. |
| **SYS-FN-004** | El sistema deberá mantener relaciones de compatibilidad por marca, modelo y rango de años. | ST-REQ-001/002 | M | T | Rangos inválidos se rechazan y la búsqueda recupera asociaciones exactas. |
| **SYS-FN-005** | El sistema deberá buscar productos por código, texto, categoría y compatibilidad combinables. | ST-REQ-001 | M | T | Resultados cumplen filtros y el tiempo satisface SYS-PR-001. |
| **SYS-FN-006** | El sistema deberá registrar proveedores y su información comercial sin duplicar su identificador fiscal o código interno. | ST-REQ-005 | M | T | Duplicado se bloquea; proveedor válido queda disponible para órdenes. |
| **SYS-FN-007** | El sistema deberá crear órdenes de compra con proveedor, líneas, cantidades, costos esperados y estado. | ST-REQ-005 | M | T | Orden calcula total y transita por estados válidos. |
| **SYS-FN-008** | El sistema deberá recibir total o parcialmente una orden y registrar diferencias. | ST-REQ-005 | M | T | Cantidad recibida actualiza saldo pendiente y genera entrada exacta. |
| **SYS-FN-009** | El sistema deberá crear un movimiento de Kardex por cada cambio confirmado de existencias. | ST-REQ-005/006 | M | I | 100% de cambios muestreados tienen movimiento correlacionado. |
| **SYS-FN-010** | El sistema deberá impedir que una salida confirmada produzca saldo negativo. | ST-REQ-002 | M | T | Prueba concurrente rechaza la operación excedente. |
| **SYS-FN-011** | El sistema deberá registrar conteos físicos y diferencias sin alterar el saldo hasta su aprobación. | ST-REQ-006 | M | T | Conteo queda pendiente; aprobación crea ajuste compensatorio. |
| **SYS-FN-012** | El sistema deberá emitir alertas cuando la existencia alcance cero o el mínimo configurado. | ST-REQ-008 | M | T | Los estados AGOTADO y CRÍTICO coinciden con datos de prueba. |
| **SYS-FN-013** | El sistema deberá crear cotizaciones con vigencia y permitir su conversión controlada. | ST-REQ-003 | S | T | Cotización vencida obliga a revalidar precio y stock. |
| **SYS-FN-014** | El sistema deberá construir una venta con múltiples líneas, cantidades enteras positivas, precios vigentes y descuentos autorizados. | ST-REQ-004 | M | T | Totales de líneas, descuentos e impuestos coinciden con cálculo esperado. |
| **SYS-FN-015** | El sistema deberá registrar uno o varios pagos y validar que su suma cubra exactamente el total. | ST-REQ-004 | M | T | Pagos incompletos o excedentes no confirman la venta. |
| **SYS-FN-016** | El sistema deberá confirmar factura, pagos, Kardex y saldos como una transacción atómica. | ST-REQ-004 | M | T | Fallo inducido revierte todos los cambios. |
| **SYS-FN-017** | El sistema deberá emitir un comprobante con identificador, fecha, vendedor, cliente cuando aplique, detalle, cantidades, precios, totales y pagos. | ST-REQ-014 | M | I | Comprobante de prueba contiene todos los campos y sumas correctas. |
| **SYS-FN-018** | El sistema deberá recuperar y reimprimir comprobantes sin crear una nueva transacción. | ST-REQ-014 | S | T | Reimpresión conserva identificador y se marca como copia. |
| **SYS-FN-019** | El sistema deberá registrar devoluciones contra una factura y calcular el saldo devolvible. | ST-REQ-011 | M | T | Exceso es rechazado; cantidad válida inicia flujo de autorización. |
| **SYS-FN-020** | El sistema deberá registrar la resolución de devolución y su efecto en inventario y pago. | ST-REQ-011 | M | T | Cada resolución produce solo los efectos definidos y mantiene vínculo original. |
| **SYS-FN-021** | El sistema deberá abrir un turno de caja con fondo inicial por usuario y terminal. | ST-REQ-012 | M | T | No permite dos turnos abiertos equivalentes. |
| **SYS-FN-022** | El sistema deberá cerrar caja calculando importes esperados, declarados y diferencias por medio de pago. | ST-REQ-012 | M | T | Cálculo coincide con transacciones del turno y diferencia queda explicada. |
| **SYS-FN-023** | El sistema deberá conservar una bitácora inmutable de operaciones sensibles. | ST-REQ-010 | M | I | Cada evento incluye actor, fecha, entidad, operación, motivo y antes/después. |
| **SYS-FN-024** | El sistema deberá producir reportes de ventas, margen, rotación, inventario crítico, compras, devoluciones y caja. | ST-REQ-008 | M | T | Totales se reconcilian con conjuntos de datos controlados. |
| **SYS-FN-025** | El sistema deberá importar catálogos desde un formato documentado con validación previa y reporte de errores. | ST-REQ-015 | S | T | Filas válidas se cargan una vez; inválidas se informan sin carga parcial oculta. |
| **SYS-FN-026** | El sistema deberá exportar listados e informes respetando filtros y permisos. | ST-REQ-015 | S | T | Archivo exportado coincide con pantalla y oculta columnas no autorizadas. |
| **SYS-FN-027** | El sistema deberá ejecutar respaldos programados y registrar resultado, tamaño y ubicación. | ST-REQ-013 | M | I | Ejecución diaria produce archivo no vacío y evento verificable. |
| **SYS-FN-028** | El sistema deberá restaurar una copia seleccionada mediante un procedimiento restringido y documentado. | ST-REQ-013 | M | T | Restauración en entorno de prueba supera verificación de integridad. |
| **SYS-FN-029** | El sistema deberá registrar eventos técnicos suficientes para diagnosticar fallas sin exponer secretos. | ST-REQ-016 | S | I | Evento correlacionable contiene nivel, fecha, componente e identificador; no contiene contraseñas. |
| **SYS-FN-030** | El sistema deberá desactivar usuarios preservando el historial de sus operaciones. | ST-REQ-009/010 | M | T | Usuario desactivado no accede y sus referencias históricas permanecen. |

##### Requisitos de usabilidad

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-US-001** | La venta ordinaria deberá completarse en un máximo de cuatro pantallas operativas después de autenticar. | OBJ-02 | M | D | Ensayo guiado completa búsqueda, selección, pago y confirmación en cuatro pantallas. |
| **SYS-US-002** | Los formularios deberán identificar campos obligatorios y mostrar el error junto al campo afectado. | ST-REQ-002 | M | I | Inspección de formularios críticos confirma indicador y mensaje específico. |
| **SYS-US-003** | Las acciones irreversibles o sensibles deberán mostrar resumen y solicitar confirmación explícita. | RN-09 | M | I | Anulación, cierre y restauración no se ejecutan con una sola acción accidental. |
| **SYS-US-004** | La navegación por teclado deberá cubrir el flujo POS principal. | Vendedor | S | D | Venta de prueba se completa sin ratón. |
| **SYS-US-005** | El sistema deberá mantener terminología uniforme conforme al glosario. | Calidad | M | I | Revisión no encuentra sinónimos contradictorios en pantallas críticas. |
| **SYS-US-006** | Los reportes y comprobantes deberán ser legibles a escala normal en pantalla e impresión. | ST-REQ-014 | M | I | No hay texto cortado y la fuente principal es equivalente a 10 pt o superior. |

##### Requisitos de rendimiento

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-PR-001** | El sistema deberá responder a búsquedas de catálogo en 3 s o menos para el P95 con 20,000 productos y 10 usuarios concurrentes. | OBJ-02 | M | T | Prueba de carga de 1,000 búsquedas cumple P95 $`\leq`$ 3 s. |
| **SYS-PR-002** | El sistema deberá confirmar una venta de hasta 20 líneas en 5 s o menos para el P95. | ST-REQ-004 | M | T | Prueba de 500 ventas cumple P95 $`\leq`$ 5 s sin errores. |
| **SYS-PR-003** | El sistema deberá admitir al menos 10 sesiones concurrentes y 4 terminales POS. | Supuesto de capacidad | M | T | Carga concurrente completa operaciones sin interbloqueos no resueltos. |
| **SYS-PR-004** | Un informe mensual ordinario deberá generarse en 10 s o menos para cinco años de historial objetivo. | ST-REQ-008 | S | T | P95 de informes definidos $`\leq`$ 10 s. |
| **SYS-PR-005** | La importación de 10,000 productos deberá finalizar en 15 min o menos y producir resumen. | ST-REQ-015 | S | T | Prueba cronometrada cumple tiempo y conteos. |
| **SYS-PR-006** | El servicio deberá estar disponible al menos 99.5% durante el horario comercial mensual, excluyendo mantenimiento aprobado. | Calidad operacional | S | A | Cálculo mensual con bitácora de disponibilidad cumple meta. |
| **SYS-PR-007** | La restauración deberá cumplir RPO máximo de 24 h y RTO máximo de 4 h. | ST-REQ-013 | M | T | Simulacro documentado cumple ambos valores. |
| **SYS-PR-008** | La lectura de código deberá mostrar el producto en 1 s o menos después de recibir el dato del lector. | ST-REQ-001 | S | T | 100 lecturas válidas cumplen tiempo P95. |

##### Interfaz del sistema

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-IF-001** | La interfaz humana deberá ofrecer vistas separadas para POS, bodega, administración y gerencia según permisos. | ST-REQ-009 | M | I | Cada rol visualiza solo módulos autorizados. |
| **SYS-IF-002** | El sistema deberá aceptar lectores que entreguen códigos como entrada de teclado estándar. | ST-REQ-001 | S | D | Dos lectores compatibles completan búsqueda sin controlador especializado. |
| **SYS-IF-003** | El sistema deberá imprimir en impresora térmica configurada y generar alternativa PDF. | ST-REQ-014 | M | D | Comprobante sale por ambos medios con contenido equivalente. |
| **SYS-IF-004** | Las comunicaciones cliente-servidor deberán utilizar protocolos autenticados y cifrados aun en LAN. | ST-REQ-010 | M | I | Captura y configuración demuestran canal cifrado. |
| **SYS-IF-005** | La importación y exportación tabular deberá utilizar UTF-8 y una plantilla versionada. | ST-REQ-015 | S | T | Acentos y caracteres se conservan en ida y vuelta. |
| **SYS-IF-006** | Los servicios internos deberán intercambiar errores con código, mensaje seguro e identificador de correlación. | ST-REQ-016 | S | I | Muestreo confirma los tres elementos sin trazas sensibles. |

##### Operaciones del sistema

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-OP-001** | El sistema deberá iniciar y detener servicios sin dejar transacciones parciales. | RN-07 | M | T | Corte controlado conserva consistencia. |
| **SYS-OP-002** | El sistema deberá registrar tareas programadas, fallos y reintentos. | ST-REQ-016 | S | I | Historial identifica ejecución y resultado. |
| **SYS-OP-003** | El mantenimiento planificado deberá anunciarse y bloquear nuevas escrituras antes de detener servicios. | Modo solo consulta | S | D | Sesiones activas reciben aviso y no se aceptan escrituras posteriores al bloqueo. |
| **SYS-OP-004** | Las funciones críticas deberán ejecutarse sin conexión pública mientras la LAN y el servidor estén disponibles. | Contingencia local | M | T | Venta y consulta completan con Internet desconectado. |
| **SYS-OP-005** | La recuperación deberá limitarse a administradores y producir evidencia de quién, cuándo y qué copia utilizó. | ST-REQ-013 | M | I | Bitácora de simulacro contiene datos completos. |

##### Modos y estados del sistema

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-MD-001** | El sistema deberá implementar los modos Normal, Alta demanda, Contingencia local, Solo consulta y Recuperación. | StRS 4.4 | M | T | Cada transición autorizada produce el comportamiento especificado. |
| **SYS-MD-002** | Una venta deberá transitar por Borrador, Pendiente de pago, Confirmada o Cancelada. | RN-07 | M | T | No existe transición directa inválida ni efectos de inventario en borrador. |
| **SYS-MD-003** | Una orden deberá transitar por Borrador, Aprobada, Parcial, Completa o Cancelada. | P-02 | M | T | Cantidades y estado permanecen coherentes tras cada recepción. |
| **SYS-MD-004** | Un turno de caja deberá transitar por Abierto, En cierre y Cerrado. | P-06 | M | T | Ventas se asignan solo a turno abierto. |
| **SYS-MD-005** | Un usuario deberá estar Activo, Bloqueado o Desactivado. | ST-REQ-009 | M | T | Solo Activo inicia sesión; historial se preserva en todos los estados. |

##### Características físicas

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-PH-001** | Cada estación POS deberá disponer de pantalla con resolución mínima $`1366\times 768`$ y teclado funcional. | Entorno POS | S | I | Inspección confirma operación sin desplazamiento horizontal crítico. |
| **SYS-PH-002** | El servidor deberá disponer de almacenamiento con redundancia o mecanismo equivalente de tolerancia a una falla de unidad. | ST-REQ-013 | S | I | Configuración y simulación demuestran tolerancia. |
| **SYS-PH-003** | Servidor y estaciones de cobro deberán disponer de UPS con autonomía mínima de 15 min a carga de operación. | EO-04 | M | T | Prueba de campo mantiene equipos 15 min. |
| **SYS-PH-004** | La red cableada deberá proporcionar conectividad estable entre servidor, terminales e impresoras autorizadas. | Contingencia local | M | T | Prueba sostenida no presenta pérdida mayor a 0.1% en 30 min. |

##### Condiciones ambientales

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-EN-001** | Los equipos deberán instalarse en zonas secas, ventiladas y protegidas de polvo excesivo y líquidos. | Riesgo físico | M | I | Lista de instalación aprobada sin exposición directa. |
| **SYS-EN-002** | El servidor y respaldo deberán protegerse contra acceso físico no autorizado. | ST-REQ-010 | M | I | Ubicación y control de llaves o acceso quedan documentados. |
| **SYS-EN-003** | El cableado no deberá interferir con áreas de tránsito ni crear riesgo de desconexión accidental. | Seguridad operativa | M | I | Inspección del local sin cables expuestos en paso. |
| **SYS-EN-004** | La instalación eléctrica deberá usar protección y puesta a tierra adecuadas a los equipos. | EO-04 | M | I | Verificación técnica documentada antes de producción. |

##### Seguridad del sistema

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-SC-001** | Las contraseñas deberán almacenarse mediante función de derivación resistente con sal única por cuenta. | ST-REQ-009 | M | I | Inspección confirma ausencia de texto claro y uso de parámetros aprobados. |
| **SYS-SC-002** | La sesión deberá expirar después de 30 min continuos de inactividad y requerir nueva autenticación. | ST-REQ-010 | M | T | Sesión inactiva no permite continuar al minuto 31. |
| **SYS-SC-003** | Cinco intentos fallidos en 15 min deberán bloquear temporalmente la cuenta o el origen según política. | ST-REQ-009 | S | T | Sexto intento se rechaza y se registra alerta. |
| **SYS-SC-004** | El sistema deberá aplicar mínimo privilegio y denegar por defecto. | RN-11 | M | I | Permiso no concedido se rechaza en interfaz y servicio. |
| **SYS-SC-005** | Ningún usuario deberá aprobar su propia anulación, ajuste o devolución cuando la regla exija segundo rol. | RN-11 | M | T | Prueba de autoprobación es rechazada. |
| **SYS-SC-006** | Las comunicaciones deberán cifrarse y validar la identidad del servicio. | SYS-IF-004 | M | I | Configuración criptográfica aprobada. |
| **SYS-SC-007** | Las copias de seguridad deberán cifrarse o almacenarse en medio con control equivalente. | ST-REQ-013 | M | I | Acceso no autorizado al archivo no revela datos. |
| **SYS-SC-008** | La bitácora de auditoría deberá ser de solo anexado para usuarios de negocio. | ST-REQ-010 | M | I | Intentos de actualización o borrado son denegados. |
| **SYS-SC-009** | Los secretos no deberán aparecer en pantallas, exportaciones ni registros. | ST-REQ-016 | M | I | Escaneo de muestras no encuentra contraseñas o claves. |
| **SYS-SC-010** | Los datos personales exportados deberán limitarse a roles y propósitos autorizados. | RN-15 | M | T | Rol no autorizado recibe archivo sin columnas personales. |

##### Gestión de la información

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-GI-001** | El sistema deberá conservar integridad referencial y dominios válidos en toda escritura. | ST-REQ-010 | M | I | Pruebas de datos inválidos son rechazadas. |
| **SYS-GI-002** | Los importes deberán almacenarse con precisión decimal mínima de dos posiciones y sin punto flotante binario. | ST-REQ-004 | M | I | Esquema y cálculos conservan centavos exactamente. |
| **SYS-GI-003** | Las fechas y horas deberán registrarse con zona o referencia temporal definida y mostrarse en hora local. | Auditoría | M | I | Eventos ordenan correctamente y muestran hora de Managua. |
| **SYS-GI-004** | Las transacciones comerciales deberán conservarse por al menos cinco años o por el periodo mayor que defina la política aplicable. | RN-10 | M | I | Política de retención impide purga prematura. |
| **SYS-GI-005** | El sistema deberá distinguir registro activo, inactivo y anulado sin borrar evidencia. | RN-10 | M | T | Cambios de estado preservan claves y referencias. |
| **SYS-GI-006** | Cada respaldo deberá incluir datos, metadatos de versión y comprobación de integridad. | ST-REQ-013 | M | I | Paquete restaurable contiene los tres elementos. |

##### Políticas y regulaciones

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-PL-001** | Los formatos fiscales, tasas y numeraciones deberán ser configurables y aprobados por gerencia antes de uso. | ST-REQ-014 | M | I | Lista firmada coincide con configuración activa. |
| **SYS-PL-002** | El sistema deberá aplicar la política de minimización y acceso restringido a datos personales. | RN-15 | M | I | Formulario y permisos contienen solo datos justificados. |
| **SYS-PL-003** | Toda política operativa versionada deberá indicar vigencia y aprobador. | Control de cambios | S | I | Regla activa puede rastrearse a una versión aprobada. |
| **SYS-PL-004** | El software y sus dependencias deberán respetar licencias compatibles con el uso previsto. | Restricción de proyecto | M | I | Inventario de componentes no contiene licencia incompatible. |

##### Sostenibilidad del ciclo de vida

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-LC-001** | La solución deberá separar configuración de código para cambiar impuestos, umbrales, impresoras y periodos sin recompilar. | Evolución | S | D | Cambio autorizado se aplica por configuración y queda auditado. |
| **SYS-LC-002** | La actualización deberá comprobar compatibilidad de esquema y permitir reversión documentada. | ST-REQ-016 | M | T | Ensayo de actualización y reversión preserva datos. |
| **SYS-LC-003** | El sistema deberá exponer diagnóstico de versión, estado de servicios y última copia sin datos sensibles. | ST-REQ-016 | S | D | Pantalla técnica muestra los elementos y respeta permisos. |
| **SYS-LC-004** | La documentación de operación, respaldo y recuperación deberá versionarse junto con cada entrega. | ST-REQ-013/016 | M | I | Paquete de entrega incluye versiones correspondientes. |
| **SYS-LC-005** | La solución deberá permitir añadir módulos sin alterar identificadores históricos ni contratos de datos publicados. | Restricción de crecimiento | S | A | Revisión de arquitectura demuestra extensión sin ruptura. |

##### Embalaje, manipulación, envío y transporte

Para el software, “embalaje” corresponde al paquete digital de entrega; para el hardware, a la manipulación física.

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SYS-PK-001** | Cada entrega digital deberá incluir versión, suma de integridad, instrucciones y registro de cambios. | SYS-LC-004 | M | I | Paquete contiene los cuatro elementos y la suma coincide. |
| **SYS-PK-002** | Los respaldos trasladados fuera del servidor deberán cifrarse, identificarse y registrar custodia. | ST-REQ-013 | M | I | Muestra externa tiene cifrado y cadena de custodia. |
| **SYS-PK-003** | El traslado de servidor o UPS deberá realizarse apagado, protegido y por personal autorizado. | Riesgo físico | S | I | Lista de traslado firmada sin daño ni pérdida de sellos. |

#### Verificación del SyRS

La verificación se desarrolla en paralelo: cada tabla anterior asigna método y criterio. Los códigos son T = prueba, I = inspección, A = análisis y D = demostración. Ningún requisito se considera cumplido por la mera existencia de una pantalla; se requiere la evidencia indicada. El plan de pruebas agrupará los casos por prefijo y conservará el vínculo al identificador estable.

| **Método** | **Aplicación** | **Evidencia mínima** |
|:---|:---|:---|
| Prueba | Funciones, estados, seguridad dinámica, rendimiento y recuperación. | Caso, datos, resultado esperado, resultado obtenido y estado. |
| Inspección | Esquema, permisos, configuración, documentos, entorno e interfaces. | Lista de comprobación, hallazgo y responsable. |
| Análisis | Disponibilidad, capacidad, licencias y decisiones basadas en registros. | Cálculo reproducible y fuentes. |
| Demostración | Flujos completos con usuario representativo. | Guion, observación y aceptación. |

#### Anexos del SyRS

##### Supuestos y dependencias

Se supone una red local operativa, energía acondicionada, personal identificado, catálogo depurable y disponibilidad de la gerencia para aprobar reglas. El volumen objetivo inicial no afirma el tamaño actual: constituye una base de capacidad para diseño y pruebas. La operación depende de que los periféricos seleccionados sean compatibles y de que exista al menos una copia externa protegida.

## Parte III Especificación de requisitos de software SRS

#### Introducción del SRS

##### Propósito

Especificar el producto software que implementará las capacidades asignadas por el SyRS con detalle suficiente para diseñar, construir y probar sin reinterpretar las reglas del negocio.

##### Alcance

El software incluye interfaz web de uso interno, servicios de aplicación, persistencia transaccional, tareas programadas, generación de documentos, importación, exportación, auditoría y administración. Los periféricos, red, UPS y procedimientos humanos pertenecen al sistema, pero no al producto software.

##### Visión general del producto

###### Perspectiva del producto

El producto sustituirá registros manuales y consultas directas a la base de datos. Se integrará con navegador, sistema operativo, impresora mediante mecanismo estándar, lector tipo teclado, almacenamiento de respaldo y servicio de base de datos. Las interfaces exactas se seleccionarán en arquitectura sin cambiar los contratos funcionales.

###### Funciones del producto

Autenticación y autorización; maestros y compatibilidad; compras y recepción; Kardex y conteos; cotización y venta; pagos y caja; devoluciones; reportes; auditoría; respaldo; importación; exportación y configuración.

###### Características de los usuarios

Vendedores y bodega usarán flujos guiados; gerencia y administración usarán filtros, aprobaciones y reportes; soporte accederá a diagnóstico. Ningún usuario necesitará escribir consultas SQL.

###### Limitaciones

La aplicación será de uso interno y deberá operar en navegadores modernos dentro de la LAN. No incorporará nómina, contabilidad general ni tienda pública. La conservación histórica y la trazabilidad restringen el borrado físico. La tecnología deberá admitir transacciones ACID y control de concurrencia.

#### Referencias del SRS

Se aplican las referencias comunes y todos los requisitos SyRS trazados en esta parte. La organización del SRS es por característica y familia funcional, complementada con requisitos transversales.

#### Requisitos específicos de software

##### Interfaces externas

###### Interfaz de usuario

La GUI será responsiva para $`1366\times768`$ o superior, tendrá navegación por rol, formularios con validación inmediata, tablas filtrables y confirmaciones para acciones sensibles. Los estados no dependerán únicamente del color y los mensajes asociarán error, causa y acción correctiva.

###### Interfaz de sistema y software

El producto se comunicará con un gestor relacional mediante un acceso transaccional; generará PDF o contenido imprimible; leerá y escribirá archivos tabulares UTF-8; expondrá contratos internos autenticados; y accederá al almacenamiento de respaldo mediante una cuenta técnica de mínimo privilegio.

###### Interfaz de hardware

El lector se tratará como entrada de teclado. La impresión utilizará la cola del sistema operativo o un mecanismo documentado equivalente. El software no controlará directamente la UPS; registrará el apagado y reinicio cuando el sistema operativo los notifique.

###### Interfaz de comunicaciones

Las sesiones usarán HTTPS/TLS o protección equivalente dentro de la LAN. Las solicitudes incluirán un identificador de correlación. No se abrirá acceso público sin nueva evaluación de seguridad.

###### Memoria y operaciones

La configuración de memoria y procesos será externa al código y tendrá valores de operación documentados. Las tareas intensivas se paginarán o ejecutarán en segundo plano sin bloquear el POS. El despliegue incluirá instrucciones de instalación y adaptación del sitio.

##### Funciones

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-AUT-001** | El software deberá validar estado de cuenta y credenciales antes de crear una sesión. | SYS-FN-001 | M | T | Casos válido, inválido, bloqueado y desactivado producen resultados esperados. |
| **SRS-AUT-002** | El software deberá evaluar permisos en el servidor para cada operación protegida. | SYS-FN-002 | M | T | Invocar directamente una operación sin permiso devuelve denegación. |
| **SRS-AUT-003** | El software deberá registrar inicio, cierre, fallo y bloqueo de sesión sin guardar secretos. | SYS-SC-003 | M | I | Eventos contienen actor u origen, fecha y resultado. |
| **SRS-CAT-001** | El software deberá crear y editar productos validando código único y dominios obligatorios. | SYS-FN-003 | M | T | Casos duplicados e incompletos se rechazan. |
| **SRS-CAT-002** | El software deberá asociar a cada producto cero o más compatibilidades con rango inicial no mayor al final. | SYS-FN-004 | M | T | Rango invertido es rechazado; asociación válida se consulta. |
| **SRS-CAT-003** | El software deberá normalizar texto de búsqueda sin perder el valor original mostrado. | SYS-FN-005 | S | T | Búsquedas con mayúsculas y acentos equivalentes recuperan el mismo producto. |
| **SRS-CAT-004** | El software deberá paginar búsquedas y ordenar resultados de manera determinista. | SYS-PR-001 | M | T | Páginas consecutivas no duplican ni omiten resultados con datos estables. |
| **SRS-PRV-001** | El software deberá registrar proveedores con identificador comercial único y estado. | SYS-FN-006 | M | T | Duplicado activo o inactivo se detecta. |
| **SRS-COM-001** | El software deberá crear órdenes en borrador y calcular subtotal, ajustes e importe total. | SYS-FN-007 | M | T | Cálculo coincide con conjunto de prueba. |
| **SRS-COM-002** | El software deberá impedir recibir más de lo ordenado salvo permiso y motivo explícitos. | SYS-FN-008 | M | T | Exceso sin autorización se rechaza; con autorización se audita. |
| **SRS-COM-003** | El software deberá actualizar costo histórico y stock en una transacción al confirmar recepción. | SYS-FN-008/009 | M | T | Fallo inducido no deja cambios parciales. |
| **SRS-INV-001** | El software deberá calcular saldo por suma de movimientos confirmados y contrastarlo con el saldo materializado. | SYS-FN-009 | M | A | Conciliación de muestra produce diferencia cero. |
| **SRS-INV-002** | El software deberá bloquear o serializar actualizaciones concurrentes que compitan por el mismo stock. | SYS-FN-010 | M | T | Dos ventas simultáneas no exceden la existencia. |
| **SRS-INV-003** | El software deberá crear conteos con fecha de corte y líneas independientes del saldo vigente. | SYS-FN-011 | M | T | Movimiento posterior no altera la cantidad contada registrada. |
| **SRS-INV-004** | El software deberá calcular diferencia de conteo y crear ajuste solo tras aprobación. | SYS-FN-011 | M | T | Sin aprobación no cambia stock; con aprobación crea movimiento. |
| **SRS-INV-005** | El software deberá derivar alerta AGOTADO para saldo cero y CRÍTICO para saldo positivo menor o igual al mínimo. | SYS-FN-012 | M | T | Casos frontera 0, mínimo y mínimo+1 se clasifican correctamente. |
| **SRS-COT-001** | El software deberá almacenar cotización, versión, líneas, vigencia y estado. | SYS-FN-013 | S | T | Editar después de emitir crea versión o deja evidencia. |
| **SRS-COT-002** | El software deberá revalidar precios y existencias al convertir una cotización. | SYS-FN-013 | M | T | Cambio posterior se muestra antes de confirmar venta. |
| **SRS-VNT-001** | El software deberá mantener la venta en borrador sin afectar existencias. | SYS-FN-014 | M | T | Crear, editar y cancelar borrador no produce Kardex. |
| **SRS-VNT-002** | El software deberá recalcular totales en el servidor usando cantidades, precios, descuentos e impuestos vigentes. | SYS-FN-014 | M | T | Manipulación del total enviado por cliente no altera el cálculo. |
| **SRS-VNT-003** | El software deberá rechazar cantidad no entera, cero o negativa para repuestos indivisibles. | SYS-FN-014 | M | T | Casos inválidos no se almacenan. |
| **SRS-VNT-004** | El software deberá validar descuento contra permiso, límite y motivo. | RN-09 | M | T | Descuento fuera de límite sin aprobación es rechazado. |
| **SRS-VNT-005** | El software deberá registrar pagos con tipo, importe y referencia cuando aplique. | SYS-FN-015 | M | T | La suma se valida con precisión decimal exacta. |
| **SRS-VNT-006** | El software deberá confirmar venta, pagos, movimientos y auditoría en una sola transacción. | SYS-FN-016 | M | T | Prueba de rollback no deja registros huérfanos. |
| **SRS-VNT-007** | El software deberá generar número de factura único sin reutilizar números anulados. | SYS-FN-017 | M | T | Carga concurrente no produce duplicados. |
| **SRS-VNT-008** | El software deberá generar representación imprimible reproducible de la factura. | SYS-FN-017/018 | M | T | Original y reimpresión contienen datos equivalentes. |
| **SRS-DEV-001** | El software deberá calcular por línea la cantidad vendida, devuelta y aún devolvible. | SYS-FN-019 | M | T | Múltiples devoluciones nunca superan lo vendido. |
| **SRS-DEV-002** | El software deberá exigir motivo, condición, resolución y autorizador en una devolución. | SYS-FN-020 | M | T | Falta de cualquier campo impide resolver. |
| **SRS-CAJ-001** | El software deberá impedir ventas cuando el operador no tenga turno abierto si la política de caja está activa. | SYS-FN-021 | M | T | Venta sin turno se bloquea. |
| **SRS-CAJ-002** | El software deberá acumular pagos y movimientos de caja por turno y medio. | SYS-FN-022 | M | T | Totales coinciden con transacciones controladas. |
| **SRS-CAJ-003** | El software deberá registrar cierre, diferencia, motivo y aprobación requerida. | SYS-FN-022 | M | T | Cierre con diferencia sin motivo es rechazado. |
| **SRS-AUD-001** | El software deberá escribir eventos de auditoría en el mismo límite transaccional de la operación sensible. | SYS-FN-023 | M | T | Operación confirmada siempre tiene evento; rollback no deja evento falso. |
| **SRS-AUD-002** | El software deberá permitir filtrar auditoría por fecha, usuario, entidad, operación e identificador. | ST-REQ-010 | S | T | Cada filtro recupera el conjunto esperado. |
| **SRS-REP-001** | El software deberá calcular ventas y margen a partir de líneas confirmadas y costos históricos aplicables. | SYS-FN-024 | M | A | Totales coinciden con cálculo independiente. |
| **SRS-REP-002** | El software deberá calcular rotación y productos sin movimiento para un periodo elegido. | SYS-FN-024 | S | T | Conjunto controlado clasifica productos correctamente. |
| **SRS-REP-003** | El software deberá mostrar stock crítico con saldo, mínimo y última entrada o salida. | SYS-FN-024 | M | T | Lista coincide con regla de alerta. |
| **SRS-IMP-001** | El software deberá validar archivo completo antes de aplicar una importación. | SYS-FN-025 | M | T | Error estructural no produce carga parcial. |
| **SRS-IMP-002** | El software deberá entregar resumen de creados, actualizados, omitidos y rechazados con fila y causa. | SYS-FN-025 | M | T | Conteos suman filas procesadas. |
| **SRS-EXP-001** | El software deberá aplicar permisos y filtros antes de generar una exportación. | SYS-FN-026 | M | T | Usuario restringido no obtiene campos ocultos. |
| **SRS-BKP-001** | El software o tarea asociada deberá crear respaldo con identificador, fecha, versión y suma de integridad. | SYS-FN-027 | M | I | Catálogo de copias presenta los cuatro datos. |
| **SRS-BKP-002** | El software deberá verificar la legibilidad e integridad de cada copia al finalizar. | SYS-FN-027 | M | T | Copia corrupta se marca fallida y alerta. |
| **SRS-BKP-003** | La restauración deberá exigir selección explícita, confirmación reforzada y modo Recuperación. | SYS-FN-028 | M | D | No puede ejecutarse desde modo Normal. |
| **SRS-LOG-001** | El software deberá emitir registros estructurados con fecha, nivel, componente, evento y correlación. | SYS-FN-029 | S | I | Muestra contiene campos y permite seguir una solicitud. |
| **SRS-USR-001** | El software deberá desactivar cuentas sin eliminar referencias históricas. | SYS-FN-030 | M | T | Desactivación conserva facturas y auditoría. |

##### Requisitos de usabilidad

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-US-001** | La GUI deberá conservar posición y nombre de acciones principales entre módulos. | SYS-US-005 | S | I | Inspección de catálogo, compra, venta y caja confirma consistencia. |
| **SRS-US-002** | La GUI deberá enfocar el primer campo operativo y definir orden de tabulación lógico. | SYS-US-004 | S | D | Flujo POS se completa por teclado en orden esperado. |
| **SRS-US-003** | Todo mensaje de validación deberá identificar campo, regla incumplida y acción posible. | SYS-US-002 | M | I | Muestreo de 20 validaciones cumple los tres componentes. |
| **SRS-US-004** | Las tablas deberán ofrecer búsqueda, orden, paginación y estado vacío comprensible. | SYS-US-001 | S | I | Componentes comunes presentan las cuatro capacidades. |
| **SRS-US-005** | Las confirmaciones sensibles deberán mostrar objeto, consecuencias y botón de cancelación predeterminado. | SYS-US-003 | M | I | Inspección de anulación, ajuste y restauración cumple. |

##### Requisitos de rendimiento

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-PR-001** | La consulta de catálogo deberá usar paginación y completar P95 en 3 s con el conjunto de referencia. | SYS-PR-001 | M | T | Prueba repetible cumple umbral y no agota memoria. |
| **SRS-PR-002** | La transacción de venta deberá completar P95 en 5 s para 20 líneas bajo carga objetivo. | SYS-PR-002 | M | T | 500 ventas, 4 terminales y 10 sesiones cumplen. |
| **SRS-PR-003** | El software deberá mantener un máximo documentado de conexiones y reutilizarlas de forma segura. | SYS-PR-003 | S | I | Configuración y carga no exceden límite. |
| **SRS-PR-004** | Los informes deberán paginar detalle y calcular agregados sin bloquear escrituras comerciales. | SYS-PR-004 | M | T | Ventas concurrentes continúan durante informe mensual. |
| **SRS-PR-005** | La importación deberá procesar en lotes atómicos y registrar progreso. | SYS-PR-005 | S | T | 10,000 filas cumplen tiempo y permiten reanudar según diseño aprobado. |

##### Requisitos lógicos de base de datos

| **Área lógica** | **Entidades mínimas** | **Reglas de integridad** |
|:---|:---|:---|
| Identidad y seguridad | usuario, rol, permiso, sesión | Claves estables; cuenta no se elimina si tiene historial; relación muchos a muchos rol-permiso. |
| Catálogo | producto, categoría, marca, modelo, compatibilidad, precio | Código único; rangos de año válidos; historial de costos y precios. |
| Compras | proveedor, orden, detalle de orden, recepción, detalle de recepción | Cantidades positivas; recepción enlazada a orden; costo histórico. |
| Inventario | movimiento, conteo, detalle de conteo, ajuste | Movimiento de solo anexado; saldo no negativo para salidas ordinarias. |
| Ventas | cliente, cotización, factura, detalle, pago | Totales exactos; claves únicas; factura confirmada no se borra. |
| Posventa | devolución, detalle, garantía, resolución | Vínculo a factura; cantidad acumulada no supera vendida. |
| Caja y control | turno, movimiento de caja, cierre, auditoría | Un turno abierto por alcance definido; evento sensible correlacionado. |

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-DB-001** | La base de datos deberá aplicar claves primarias, foráneas, unicidad, dominios y nulabilidad coherentes con el modelo lógico. | SYS-GI-001 | M | I | Auditoría del esquema confirma restricciones. |
| **SRS-DB-002** | Las tablas transaccionales deberán registrar creación y actor; las mutables, además, última modificación. | SYS-GI-003 | M | I | Muestreo de tablas cumple metadatos. |
| **SRS-DB-003** | Los importes deberán usar tipo decimal y las cantidades indivisibles tipo entero. | SYS-GI-002 | M | I | Esquema no usa flotante para dinero. |
| **SRS-DB-004** | La base deberá impedir borrado físico de documentos confirmados mediante permisos y relaciones. | SYS-GI-004/005 | M | T | Intento de borrado es rechazado. |
| **SRS-DB-005** | Los movimientos de inventario deberán conservar saldo anterior, variación, saldo posterior, motivo y referencia. | SYS-FN-009 | M | I | Cada fila muestreada permite reconstruir el cambio. |
| **SRS-DB-006** | La auditoría deberá conservar valores anterior y nuevo en formato interpretable para campos sensibles. | SYS-FN-023 | M | I | Muestreo de cambios de precio, rol y ajuste cumple. |

##### Restricciones de diseño

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-DS-001** | El producto deberá usar persistencia relacional con transacciones ACID. | SYS-FN-016 | M | I | Tecnología seleccionada demuestra propiedades y configuración. |
| **SRS-DS-002** | Las reglas críticas de autorización, total y stock deberán validarse en el servidor. | SYS-SC-004 | M | T | Omisión de la GUI no evade reglas. |
| **SRS-DS-003** | La lógica de dominio no deberá depender de una interfaz gráfica específica. | SYS-LC-005 | S | I | Revisión muestra separación y casos probables sin GUI. |
| **SRS-DS-004** | La configuración sensible deberá validarse, versionarse y auditarse. | SYS-LC-001 | M | I | Cambio de parámetro produce evento y versión. |
| **SRS-DS-005** | Las migraciones de esquema deberán ser reproducibles y mantener orden de versión. | SYS-LC-002 | M | T | Base vacía y base anterior alcanzan la misma versión. |

##### Atributos del sistema software

| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Requisito verificable** | **Origen** | **Pr.** | **V** | **Criterio de aceptación** |
| **SRS-AT-001** | Fiabilidad: una excepción no controlada no deberá confirmar efectos parciales. | SYS-FN-016 | M | T | Pruebas de fallos conservan consistencia. |
| **SRS-AT-002** | Disponibilidad: el software deberá informar salud de servicios y degradar reportes antes que POS. | SYS-PR-006 | S | T | Fallo de componente no crítico mantiene venta. |
| **SRS-AT-003** | Seguridad: el software deberá cumplir autenticación, autorización, auditoría y protección de datos especificadas. | SYS-SC-\* | M | T | Conjunto de pruebas de seguridad aprobado. |
| **SRS-AT-004** | Mantenibilidad: módulos deberán tener contratos definidos y pruebas automatizables para reglas críticas. | SYS-LC-005 | S | I | Revisión y cobertura de casos críticos documentadas. |
| **SRS-AT-005** | Portabilidad: el cliente deberá operar en dos familias de navegador modernas aprobadas. | Limitaciones | S | T | Matriz de compatibilidad sin defectos bloqueantes. |
| **SRS-AT-006** | Recuperabilidad: datos y versión deberán restaurarse conjuntamente y superar validación de integridad. | SYS-PR-007 | M | T | Simulacro cumple RPO/RTO y controles. |
| **SRS-AT-007** | Trazabilidad: cada cambio de código y prueba deberá referenciar los requisitos afectados. | Gestión | M | I | Muestreo de cambios contiene IDs válidos. |

##### Información de soporte

Cada entrega deberá incluir manual de instalación, configuración, operación por rol, respaldo, restauración, solución de incidentes, diccionario de datos, registro de cambios, inventario de dependencias y resultados de verificación. Se consideran requisitos de entrega, no material informativo opcional.

#### Verificación del SRS

Cada requisito SRS contiene su método y criterio. Los casos se organizarán por familia y usarán datos controlados que cubran éxito, límites, error, concurrencia y autorización. La verificación de requisitos no funcionales incluirá carga, recuperación, inspección de esquema, revisión de configuración y seguridad. La validación con partes interesadas empleará demostraciones de venta, recepción, devolución, cierre y reporte antes de aprobar la línea base de implementación.

#### Anexos del SRS

##### Supuestos y dependencias

El lenguaje, framework, arquitectura y motor concretos se seleccionarán posteriormente y deberán satisfacer esta especificación. Se depende de navegadores compatibles, reloj sincronizado, almacenamiento de respaldo y periféricos probados. Cuando una dependencia cambie, se evaluará su impacto mediante la RTM antes de aceptar el cambio.

#### Matriz de trazabilidad bidireccional

| **StRS** | **SyRS derivados** | **SRS derivados** | **Propósito** |
|:---|:---|:---|:---|
| ST-REQ-001 | SYS-FN-003–005, SYS-PR-001/008, SYS-IF-002 | SRS-CAT-001–004, SRS-PR-001 | Catálogo y búsqueda compatible. |
| ST-REQ-002 | SYS-FN-005/010/012, SYS-US-002 | SRS-CAT-004, SRS-INV-002/005, SRS-US-003 | Decisión de venta con stock real. |
| ST-REQ-003 | SYS-FN-013 | SRS-COT-001/002 | Cotización y conversión controlada. |
| ST-REQ-004 | SYS-FN-014–018, SYS-PR-002 | SRS-VNT-001–008, SRS-PR-002 | Venta, pago y comprobante. |
| ST-REQ-005 | SYS-FN-006–009 | SRS-PRV-001, SRS-COM-001–003 | Compra, recepción e ingreso. |
| ST-REQ-006 | SYS-FN-011, SYS-FN-009 | SRS-INV-003–005, SRS-DB-005 | Conteo y ajuste autorizado. |
| ST-REQ-007 | SYS-FN-003/023, SYS-SC-005 | SRS-CAT-001, SRS-AUD-001/002, SRS-DB-006 | Costos, precios y margen. |
| ST-REQ-008 | SYS-FN-012/024, SYS-PR-004 | SRS-REP-001–003, SRS-PR-004 | Información gerencial. |
| ST-REQ-009 | SYS-FN-001/002/030, SYS-SC-001–005 | SRS-AUT-001–003, SRS-USR-001 | Identidad, roles y permisos. |
| ST-REQ-010 | SYS-FN-023, SYS-SC-006–010, SYS-GI-001–005 | SRS-AUD-001/002, SRS-DB-001–006, SRS-AT-003 | Auditoría y protección. |
| ST-REQ-011 | SYS-FN-019/020 | SRS-DEV-001/002 | Devoluciones y garantías. |
| ST-REQ-012 | SYS-FN-021/022 | SRS-CAJ-001–003 | Turno y cierre de caja. |
| ST-REQ-013 | SYS-FN-027/028, SYS-PR-007, SYS-PK-002 | SRS-BKP-001–003, SRS-AT-006 | Respaldo y recuperación. |
| ST-REQ-014 | SYS-FN-017/018, SYS-IF-003 | SRS-VNT-007/008, SRS-US-005 | Información al cliente. |
| ST-REQ-015 | SYS-FN-025/026, SYS-IF-005 | SRS-IMP-001/002, SRS-EXP-001 | Intercambio controlado de datos. |
| ST-REQ-016 | SYS-FN-029, SYS-OP-002/003, SYS-LC-002–004 | SRS-LOG-001, SRS-DS-005, SRS-AT-004/007 | Diagnóstico y sostenimiento. |

#### Gestión de la línea base y cambios

Una solicitud de cambio deberá indicar solicitante, motivo, requisitos afectados, urgencia, beneficio, riesgo y evidencia. El equipo seguirá la RTM para analizar impacto en arquitectura, datos, pruebas, manuales y operación. La gerencia valida cambios de negocio; el responsable técnico valida factibilidad; el equipo actualiza versión e historial. No se reutilizarán identificadores retirados y los requisitos sustituidos conservarán estado y referencia a su reemplazo.

#### Conclusiones

La línea base resultante amplía el proyecto inicial de base de datos hasta cubrir el sistema completo requerido por el negocio. La separación StRS–SyRS–SRS evita confundir necesidades, capacidades del sistema y comportamiento del software. Los requisitos críticos de inventario, venta, caja, seguridad, auditoría y recuperación disponen de criterios objetivos y trazabilidad ascendente y descendente.

El documento queda preparado como entrada controlada para la descripción de arquitectura. Las decisiones tecnológicas todavía no fijadas deberán demostrar que satisfacen esta línea base; cualquier cambio deberá pasar por el proceso de control establecido.

#### Aprobación de la línea base

<table>
<tbody>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Ángel Antonio Alonso Suárez</td>
<td style="text-align: left;">Br. Noel Isaac Alemán Carballo</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2021-0087U</td>
<td style="text-align: left;">Carnet 2022-0376U</td>
</tr>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Mendell Noé Parrales Molina</td>
<td style="text-align: left;">Ing. Roberto Alfaro</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2020-1014U</td>
<td style="text-align: left;">Docente titular</td>
</tr>
</tbody>
</table>

#### Matriz de conformidad con la plantilla obligatoria

| **Elemento** | **Contenido exigido** | **Ubicación en este documento** |
|:---|:---|:---|
| 9.2.1–9.2.5 | Identificación, material preliminar, definiciones, referencias y acrónimos | Portada; control; índices; contenido común. |
| 9.3.1–9.3.8 | Propósito, alcance, visión, partes interesadas, entorno, metas, modelo y entorno de información | Parte I, secciones 1 y 3. |
| 9.3.9–9.3.14 | Procesos, reglas, restricciones, modos, calidad y estructura del negocio | Parte I, sección 4. |
| 9.3.15–9.3.18 | Requisitos de usuario, concepto, escenarios y restricciones del proyecto | Parte I, secciones 5 a 7. |
| 9.4.1–9.4.3 | Propósito, alcance y visión del sistema | Parte II, sección 1. |
| 9.4.4–9.4.9 | Funciones, usabilidad, rendimiento, interfaces, operaciones y modos | Parte II, secciones 3.1 a 3.6. |
| 9.4.10–9.4.16 | Físicos, ambientales, seguridad, información, políticas, sostenimiento y transporte | Parte II, secciones 3.7 a 3.13. |
| 9.4.17–9.4.18 | Verificación, supuestos y dependencias | Parte II, secciones 4 y 5. |
| 9.5.1–9.5.8 | Propósito, alcance, perspectiva, funciones, usuarios, limitaciones, supuestos y distribución | Parte III, secciones 1, 2 y anexos; RTM. |
| 9.5.9–9.5.17 | Requisitos específicos, interfaces, funciones, usabilidad, rendimiento, BD lógica, restricciones y atributos | Parte III, sección 3. |
| 9.5.18–9.5.19 | Verificación e información de soporte | Parte III, secciones 3.8 y 4. |

#### Referencias bibliográficas

1.  International Organization for Standardization, International Electrotechnical Commission, and Institute of Electrical and Electronics Engineers. (2011). *ISO/IEC/IEEE 29148:2011 Systems and software engineering – Life cycle processes – Requirements engineering*. IEEE.

2.  International Organization for Standardization, International Electrotechnical Commission, and Institute of Electrical and Electronics Engineers. (2017). *ISO/IEC/IEEE 12207:2017 Systems and software engineering – Software life cycle processes*. IEEE.

3.  International Organization for Standardization and International Electrotechnical Commission. (2011). *ISO/IEC 25010:2011 Systems and software engineering – Systems and software Quality Requirements and Evaluation – System and software quality models*. ISO.

4.  Bourque, P., and Fairley, R. E. (Eds.). (2014). *Guide to the Software Engineering Body of Knowledge, Version 3.0*. IEEE Computer Society.

5.  Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.

6.  Alonso Suárez, Á. A. (2026). *Diseño de la arquitectura back-end de una base de datos relacional para el control de inventario y facturación de Moto Repuestos El Centenario*. Universidad Nacional de Ingeniería.

---

# Capítulo 04: Descripción de Arquitectura de Software

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

Dirección de Área de Conocimiento DACTIC

Asignatura: Ingeniería de Software 1

------------------------------------------------------------------------

**DESCRIPCIÓN DE**

ARQUITECTURA DE SOFTWARE

Diseño y selección de arquitectura

conforme a ISO/IEC/IEEE 42010:2022

**Caso de estudio: Distribuidora Comercial “Moto Repuestos El Centenario”**

------------------------------------------------------------------------


**Marco normativo principal**  
ISO/IEC/IEEE 42010:2022  
ISO/IEC/IEEE 29148:2011  
ISO/IEC/IEEE 12207:2017  
ISO/IEC 25010:2011  
**Versión:** 1.0  
**Estado:** Línea base arquitectónica propuesta


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha:** 23 de septiembre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Segundo entregable de planificación – Ingeniería de Software 1**  
Continuación oficial de la línea base de requisitos REQ-MREC-001


## Identificación y control del documento

| **Campo** | **Valor** |
|:---|:---|
| Identificador | DA-MREC-001 |
| Título único | Descripción de Arquitectura de Software de Moto Repuestos El Centenario |
| Versión y fecha | 1.0 – 23 de septiembre de 2026 |
| Documento fuente | 02_REQ_StRS_SyRS_SRS_MotoRepuestosElCentenario.pdf, versión 1.0 |
| Propietario de la línea base | Equipo de proyecto de Ingeniería de Software 1 |
| Estado | Línea base propuesta para revisión y aprobación académica |
| Aviso de control | Todo cambio deberá registrar versión, decisión, requisitos afectados y actualización de correspondencias. |

### Historial de versiones

| **Versión** | **Fecha** | **Descripción** | **Responsables** |
|:---|:---|:---|:---|
| 1.0 | 23/09/2026 | Emisión de la línea base arquitectónica derivada de REQ-MREC-001, con alternativas, decisiones, vistas y trazabilidad. | Equipo de trabajo |

### Aprobaciones previstas

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Representante académico | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada por Moto Repuestos El Centenario | Firma y fecha |

## Índice de cuadros y figuras

| **Tipo** | **Contenido principal** | **Ubicación** |
|:---|:---|:---|
| Cuadros de base | Control, conceptos, alcance, requisitos, interesados y preocupaciones. | Secciones 1–6 |
| Cuadros de decisión | Criterios, alternativas, matriz ponderada, decisión y principios. | Secciones 7–9 |
| Figuras 1–5 | Contexto, capas, módulos, flujo de venta y despliegue. | Secciones 2, 9 y 11 |
| Cuadros de vistas | Puntos de vista, vistas, correspondencias y cobertura. | Secciones 10–14 |

## Resumen ejecutivo

Esta Descripción de Arquitectura (DA) transforma la línea base oficial de requisitos REQ-MREC-001 en una organización técnica verificable para el sistema integral de Moto Repuestos El Centenario. No modifica el alcance aprobado: catálogo y compatibilidad, proveedores, compras, recepción, inventario y Kardex, cotizaciones, ventas, pagos, caja, clientes, devoluciones, garantías, reportes, seguridad, auditoría, respaldo y recuperación.

Se evaluaron tres alternativas: monolito tradicional en tres capas, monolito modular en capas y microservicios. La decisión adoptada es un **monolito modular web organizado en capas**, con persistencia relacional, un único despliegue inicial en servidor local y acceso HTTPS desde las estaciones autorizadas de la LAN. Obtuvo la mayor puntuación ponderada porque combina separación de responsabilidades, integridad transaccional, rendimiento predecible, bajo costo operativo y capacidad de evolución sin imponer la complejidad de un sistema distribuido.

Los módulos funcionales son Identidad y Acceso, Catálogo y Compatibilidad, Proveedores y Compras, Inventario y Kardex, Ventas y Facturación, Caja y Pagos, Clientes y Posventa, Reportería, Auditoría y Operación. Sus interacciones se realizan mediante servicios de aplicación e interfaces internas; ningún módulo accede directamente a las tablas de otro. Las transacciones críticas conservan atomicidad y generan evidencia de auditoría.

La arquitectura aborda cada preocupación mediante puntos de vista y vistas concretas. Los requisitos se mantienen con sus identificadores originales StRS, SyRS y SRS, lo que permite rastrear cada decisión hasta REQ-MREC-001. Las tecnologías concretas de lenguaje, framework y motor de base de datos permanecen abiertas para el documento de diseño, siempre que satisfagan las restricciones de esta línea base.

## Conceptos fundamentales de arquitectura

*Base normativa: ISO/IEC/IEEE 42010:2022, cláusulas 3 y 5.2.*

| **Concepto** | **Definición aplicada** | **Aplicación en esta DA** |
|:---|:---|:---|
| **Concepto** | **Definición aplicada** | **Aplicación en esta DA** |
| Arquitectura | Conceptos y propiedades fundamentales de una entidad en su entorno y principios que rigen su realización y evolución. | Organización modular y en capas, comportamiento, datos, despliegue local y reglas de dependencia. |
| Descripción de Arquitectura | Producto de trabajo que expresa una arquitectura. | Este documento, sus decisiones, modelos, tablas, vistas y correspondencias. |
| Entidad de interés | Sujeto cuya arquitectura se describe. | Sistema integral de gestión de Moto Repuestos El Centenario. |
| Interesado | Rol, persona u organización con interés en la entidad. | Propietaria, vendedores, bodega, administración, soporte, clientes, proveedores y evaluador. |
| Preocupación | Asunto importante para uno o más interesados. | Exactitud, rapidez, seguridad, continuidad, costo, usabilidad, mantenimiento e integración. |
| Perspectiva | Forma de pensar la entidad según experiencia y responsabilidades. | Estratégica, operativa, técnica y de cumplimiento. |
| Aspecto | Faceta de análisis de la entidad. | Contextual, estructural, funcional, informacional, comportamental y operativo. |
| Punto de vista | Convenciones para construir, interpretar y usar una vista. | Reglas y notaciones declaradas en la sección 10. |
| Vista | Representación de la arquitectura desde un punto de vista. | Diagramas y tablas de la sección 11. |
| Correspondencia | Relación nombrada entre elementos de la DA. | Vínculos entre requisitos, preocupaciones, decisiones, módulos y vistas. |
| Decisión arquitectónica | Elección fundamental con consecuencias. | Monolito modular, base relacional, despliegue LAN, seguridad central y transacciones locales. |
| Justificación | Razón sustentada de una decisión. | Matriz ponderada, beneficios, riesgos, restricciones y alternativas descartadas. |

## Identificación del proyecto y propósito

*Base normativa: ISO/IEC/IEEE 42010:2022, cláusula 6.1.*

| **Campo** | **Contenido** |
|:---|:---|
| Entidad de interés | Sistema integral de información para Moto Repuestos El Centenario. |
| Versión de esta DA | 1.0. |
| Arquitecto/equipo responsable | Ángel Antonio Alonso Suárez, Noel Isaac Alemán Carballo y Mendell Noé Parrales Molina. |
| Propósito | Definir una estructura implementable que satisfaga REQ-MREC-001, preserve integridad y trazabilidad y permita construir, probar, desplegar y evolucionar el producto. |
| Alcance incluido | Aplicación web interna, servicios de aplicación, persistencia transaccional, autenticación, autorización, auditoría, impresión, importación/exportación, respaldo, recuperación y operación en LAN. |
| Alcance excluido | Nómina, contabilidad general, comercio electrónico público, entrega a domicilio, infraestructura de terceros no aprobada y definición de lenguaje/framework concretos. |
| Entorno | Local comercial en Managua; hasta 20,000 productos, 10 usuarios concurrentes, 4 estaciones POS, servidor local, impresora de comprobantes, lectores como teclado, UPS y conectividad LAN. |
| Documento rector | REQ-MREC-001 v1.0, emitido el 23 de septiembre de 2026. |

### Contexto arquitectónico

La frontera contiene la aplicación web, los servicios, la base relacional y los mecanismos de operación. Los usuarios interactúan por navegador; impresora, lector, UPS y almacenamiento de respaldo son recursos externos controlados. Clientes y proveedores no acceden directamente en la versión 1.0: sus datos y documentos son registrados por personal autorizado.

<figure>

<figcaption>Contexto y frontera de la entidad de interés.</figcaption>
</figure>

## Requisitos funcionales

Los requisitos se agrupan sin sustituir los identificadores de REQ-MREC-001. Cada capacidad debe poder rastrearse hasta sus SyRS y SRS de origen.

| **ID** | **Capacidad** | **Descripción arquitectónicamente significativa** | **Prioridad** |
|:---|:---|:---|:---|
| **ID** | **Capacidad** | **Descripción arquitectónicamente significativa** | **Prioridad** |
| RF-01 | Identidad y acceso | Autenticar, autorizar por rol, controlar sesión, bloquear intentos, desactivar cuentas sin perder historial. Origen: SYS-FN-001/002, SYS-SC-001–005, SRS-AUT-001–003. | Alta |
| RF-02 | Catálogo y compatibilidad | Gestionar productos, categorías, marcas, modelos, rangos de año, precios, costos y compatibilidades consultables. Origen: SYS-FN-003–005, SRS-CAT-001–004. | Alta |
| RF-03 | Proveedores y compras | Gestionar proveedores, órdenes y recepciones totales o parciales con diferencias. Origen: SYS-FN-006–008, SRS-PRV-001, SRS-COM-001–003. | Alta |
| RF-04 | Inventario y Kardex | Crear movimientos inmutables, impedir saldo negativo, realizar conteos, ajustes autorizados y alertas de stock. Origen: SYS-FN-009–012, SRS-INV-001–005. | Alta |
| RF-05 | Cotización | Crear cotizaciones con vigencia y convertirlas recalculando precio y existencia. Origen: SYS-FN-013, SRS-COT-001/002. | Media |
| RF-06 | Venta y facturación | Construir venta, validar precios y stock, registrar pagos y confirmar factura, Kardex y saldos atómicamente. Origen: SYS-FN-014–018, SRS-VNT-001–008. | Alta |
| RF-07 | Devoluciones y garantías | Vincular devolución con venta, validar cantidad y autorización, resolver efectos en inventario y pago. Origen: SYS-FN-019/020, SRS-DEV-001/002. | Alta |
| RF-08 | Caja | Abrir y cerrar turno, controlar fondo y conciliar movimientos y medios de pago. Origen: SYS-FN-021/022, SRS-CAJ-001–003. | Alta |
| RF-09 | Auditoría | Conservar eventos inmutables y consultarlos por fecha, usuario, entidad, operación e identificador. Origen: SYS-FN-023, SRS-AUD-001/002. | Alta |
| RF-10 | Reportes | Calcular ventas, margen, rotación, stock crítico, compras, devoluciones y caja desde información confirmada. Origen: SYS-FN-024, SRS-REP-001–003. | Media |
| RF-11 | Intercambio de datos | Importar catálogos con validación y exportar listados respetando permisos y filtros. Origen: SYS-FN-025/026, SRS-IMP-001/002, SRS-EXP-001. | Media |
| RF-12 | Continuidad y soporte | Programar respaldo, verificar copia, restaurar de forma controlada, registrar diagnósticos y desactivar usuarios preservando referencias. Origen: SYS-FN-027–030, SRS-BKP-001–003, SRS-LOG-001, SRS-USR-001. | Alta |

### Reglas de negocio con impacto arquitectónico

Las reglas RN-01 a RN-15 de REQ-MREC-001 se implementan en el servidor y no dependen de validaciones de interfaz. Son determinantes: stock no negativo, Kardex inmutable, identidad única del producto, compatibilidad explícita, historial de precio/costo, venta atómica, separación de funciones, cierre único por turno, devolución vinculada, respaldo verificable y minimización de datos personales.

## Requisitos no funcionales y calidades de arquitectura

| **ID** | **Calidad** | **Métrica o criterio de aceptación heredado** | **Prioridad** |
|:---|:---|:---|:---|
| **ID** | **Calidad** | **Métrica o criterio de aceptación heredado** | **Prioridad** |
| RNF-01 | Rendimiento | Búsqueda de catálogo P95 $`\leq 3`$ s; confirmación de venta P95 $`\leq 5`$ s; lectura de código $`\leq 1`$ s; reporte ordinario P95 $`\leq 10`$ s. | Alta |
| RNF-02 | Capacidad | 20,000 productos, 10 usuarios concurrentes, 4 terminales POS y 500 ventas de 20 líneas sin errores. | Alta |
| RNF-03 | Disponibilidad | Disponibilidad mensual de 99.5% durante horario comercial, excluyendo mantenimiento aprobado. | Media |
| RNF-04 | Recuperación | Respaldo diario verificable; RPO máximo 24 h y RTO máximo 4 h. | Alta |
| RNF-05 | Seguridad | RBAC, mínimo privilegio, contraseñas derivadas con sal, cifrado de comunicaciones, sesión de 30 min, bloqueo de intentos y auditoría. | Alta |
| RNF-06 | Integridad | Transacciones ACID, claves y dominios válidos, precisión monetaria decimal y movimientos solo anexados. | Alta |
| RNF-07 | Usabilidad | Venta ordinaria en hasta cuatro pantallas operativas; navegación principal por teclado; mensajes junto al campo afectado. | Media |
| RNF-08 | Operabilidad | Funciones críticas disponibles en LAN sin Internet; mantenimiento controlado, registro de tareas y diagnóstico sin exponer secretos. | Alta |
| RNF-09 | Mantenibilidad | Módulos con contratos internos; reglas críticas independientes de GUI; configuración versionada; migraciones reproducibles y reversibles. | Alta |
| RNF-10 | Portabilidad | Cliente compatible con dos familias modernas de navegador; configuración externa al código. | Media |
| RNF-11 | Interoperabilidad | Importación/exportación UTF-8 versionada, PDF imprimible e interfaces internas con errores correlacionables. | Media |
| RNF-12 | Costo y viabilidad | Infraestructura acorde al negocio; preferencia por tecnologías con costos de licencia nulos o justificables. | Alta |

## Interesados, perspectivas y preocupaciones

*Base normativa: cláusulas 6.2, 6.3 y 6.4.*

### Interesados identificados

| **ID** | **Interesado** | **Interés en la entidad** | **Abordado** |
|:---|:---|:---|:---|
| I-01 | Propietaria/gerencia | Rentabilidad, control, información confiable, continuidad y costo. | **Sí** |
| I-02 | Vendedor/cajero | Búsqueda rápida, venta simple, cobro correcto y mensajes comprensibles. | **Sí** |
| I-03 | Responsable de bodega | Recepción, conteos, Kardex exacto, alertas y trazabilidad. | **Sí** |
| I-04 | Administración | Parámetros, usuarios, permisos, aprobaciones y reportes. | **Sí** |
| I-05 | Cliente | Compatibilidad clara, precio correcto, comprobante, devolución y garantía. | **Sí** |
| I-06 | Proveedor | Órdenes y recepciones coherentes, saldo documental y evidencia. | **Sí** |
| I-07 | Desarrollo y soporte | Estructura mantenible, diagnóstico, despliegue y recuperación. | **Sí** |
| I-08 | Docente evaluador | Conformidad, coherencia, justificación y trazabilidad. | **Sí** |

### Perspectivas

| **ID** | **Perspectiva** | **Interesados** | **Preocupaciones generales** |
|:---|:---|:---|:---|
| S-01 | Estratégica / económica | I-01, I-08 | Viabilidad, costo, beneficio, riesgo y evolución. |
| S-02 | Operativa / usuario | I-02, I-03, I-04, I-05, I-06 | Rapidez, disponibilidad, usabilidad, exactitud y recuperación. |
| S-03 | Técnica / ingeniería | I-07, I-08 | Estructura, mantenibilidad, rendimiento, seguridad e integración. |
| S-04 | Cumplimiento / control | I-01, I-04, I-08 | Privacidad, permisos, auditoría, retención y evidencia. |

### Preocupaciones clave

| **ID** | **Preocupación** | **Interesados** | **RNF relacionados** | **Estado** |
|:---|:---|:---|:---|:---|
| **ID** | **Preocupación** | **Interesados** | **RNF relacionados** | **Estado** |
| P-01 | ¿Las operaciones críticas responden dentro de los tiempos y carga definidos? | I-01–I-04 | RNF-01/02 | **Sí** |
| P-02 | ¿Venta, pago, inventario y auditoría quedan íntegros o se revierten juntos? | I-01–I-04 | RNF-06 | **Sí** |
| P-03 | ¿Usuarios y datos están protegidos con permisos y evidencia suficiente? | I-01, I-04, I-05 | RNF-05 | **Sí** |
| P-04 | ¿Se puede recuperar la operación ante falla o pérdida? | I-01–I-04, I-07 | RNF-03/04 | **Sí** |
| P-05 | ¿El sistema continúa sus funciones críticas sin Internet público? | I-01–I-04 | RNF-08 | **Sí** |
| P-06 | ¿Puede evolucionar por módulos sin rehacer el producto? | I-01, I-07, I-08 | RNF-09/10 | **Sí** |
| P-07 | ¿La solución es operable y económicamente proporcional al negocio? | I-01, I-07 | RNF-08/12 | **Sí** |
| P-08 | ¿Los datos y documentos intercambiados conservan significado y confidencialidad? | I-01, I-04, I-07 | RNF-05/11 | **Sí** |
| P-09 | ¿La interfaz favorece una atención rápida y sin errores? | I-02, I-03, I-05 | RNF-07 | **Sí** |

## Aspectos de la entidad de interés

*Base normativa: cláusula 6.5.*

| **ID** | **Aspecto** | **Descripción** | **Preocupaciones** |
|:---|:---|:---|:---|
| A-01 | Contextual | Frontera, actores, periféricos, infraestructura y estímulos externos. | P-05, P-07, P-09 |
| A-02 | Estructural | Capas, módulos, responsabilidades, interfaces y dependencias permitidas. | P-03, P-06, P-07 |
| A-03 | Funcional | Capacidades, casos de uso y coordinación entre módulos. | P-01, P-02, P-09 |
| A-04 | Informacional | Entidades, integridad, transacciones, historial, precisión y respaldo. | P-02, P-04, P-08 |
| A-05 | Comportamental | Estados, secuencias, concurrencia, autorización y manejo de fallas. | P-01–P-04 |
| A-06 | Operativo | Despliegue, disponibilidad, monitoreo, copias y recuperación. | P-01, P-04, P-05, P-07 |

## Criterios de decisión arquitectónica

La ponderación refleja las prioridades de REQ-MREC-001. La escala de evaluación es 1 (muy deficiente) a 5 (excelente).

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>ID</strong></th>
<th style="text-align: left;"><strong>Criterio</strong></th>
<th style="text-align: left;"><strong>Peso</strong></th>
<th style="text-align: left;"><strong>Qué se evalúa</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">C-01</td>
<td style="text-align: left;">Separación de responsabilidades</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Fronteras entre presentación, casos, dominio, persistencia y operación.</td>
</tr>
<tr>
<td style="text-align: left;">C-02</td>
<td style="text-align: left;">Bajo acoplamiento/alta cohesión</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Independencia entre capacidades de negocio y claridad de contratos.</td>
</tr>
<tr>
<td style="text-align: left;">C-03</td>
<td style="text-align: left;">Integridad y seguridad</td>
<td style="text-align: left;">20%</td>
<td style="text-align: left;">Transacciones, autorización, auditoría, cifrado y protección de datos.</td>
</tr>
<tr>
<td style="text-align: left;">C-04</td>
<td style="text-align: left;">Rendimiento y continuidad</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Latencia local, carga, disponibilidad, respaldo y recuperación.</td>
</tr>
<tr>
<td style="text-align: left;">C-05</td>
<td style="text-align: left;">Mantenibilidad y pruebas</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Cambio y prueba de módulos y reglas sin dependencia de GUI o infraestructura.</td>
</tr>
<tr>
<td style="text-align: left;">C-06</td>
<td style="text-align: left;">Costo y simplicidad operativa</td>
<td style="text-align: left;">10%</td>
<td style="text-align: left;">Recursos, despliegues, observabilidad y conocimientos requeridos.</td>
</tr>
<tr>
<td style="text-align: left;">C-07</td>
<td style="text-align: left;">Evolución y escalabilidad</td>
<td style="text-align: left;">5%</td>
<td style="text-align: left;">Crecimiento y eventual extracción de capacidades sin rediseño total.</td>
</tr>
<tr>
<td style="text-align: left;">C-08</td>
<td style="text-align: left;">Interoperabilidad y portabilidad</td>
<td style="text-align: left;">5%</td>
<td style="text-align: left;">Navegadores, periféricos, formatos y contratos de integración.</td>
</tr>
<tr>
<td colspan="2" style="text-align: right;"><strong>Total</strong></td>
<td style="text-align: left;"><strong>100%</strong></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

## Alternativas de arquitectura evaluadas

### Descripción de alternativas

| **Opción** | **Descripción** | **Ventajas** | **Desventajas** |
|:---|:---|:---|:---|
| A: Monolito tradicional en tres capas | Un despliegue con capas técnicas, sin fronteras firmes por capacidad. | Inicio y despliegue simples; transacciones directas; bajo costo. | Acoplamiento progresivo; cambios transversales; pruebas y evolución más difíciles. |
| B: Monolito modular en capas | Un despliegue dividido en módulos de negocio, con capas internas, interfaces y reglas de dependencia. | Transacciones locales; rendimiento; bajo costo; cohesión; ruta de evolución. | Exige disciplina de límites; una falla de proceso puede afectar toda la aplicación. |
| C: Microservicios | Servicios independientes por capacidad, comunicación de red y persistencia distribuida. | Autonomía de despliegue y escalado selectivo; aislamiento potencial. | Complejidad desproporcionada: red, consistencia distribuida, observabilidad, copias y soporte. |

### Matriz de evaluación comparativa

Las columnas contienen calificación de 1 a 5. El resultado ponderado es la suma de *peso* $`\times`$ *calificación*/5.

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>ID</strong></th>
<th style="text-align: left;"><strong>Criterio</strong></th>
<th style="text-align: left;"><strong>Peso</strong></th>
<th style="text-align: left;"><strong>A</strong></th>
<th style="text-align: left;"><strong>B</strong></th>
<th style="text-align: left;"><strong>C</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">C-01</td>
<td style="text-align: left;">Separación</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td style="text-align: left;">C-02</td>
<td style="text-align: left;">Acoplamiento/cohesión</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td style="text-align: left;">C-03</td>
<td style="text-align: left;">Integridad/seguridad</td>
<td style="text-align: left;">20</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">3</td>
</tr>
<tr>
<td style="text-align: left;">C-04</td>
<td style="text-align: left;">Rendimiento/continuidad</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">3</td>
</tr>
<tr>
<td style="text-align: left;">C-05</td>
<td style="text-align: left;">Mantenibilidad/pruebas</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
</tr>
<tr>
<td style="text-align: left;">C-06</td>
<td style="text-align: left;">Costo/simplicidad</td>
<td style="text-align: left;">10</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">1</td>
</tr>
<tr>
<td style="text-align: left;">C-07</td>
<td style="text-align: left;">Evolución/escalabilidad</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td style="text-align: left;">C-08</td>
<td style="text-align: left;">Interoperabilidad</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td colspan="2" style="text-align: right;"><strong>Puntuación ponderada / 100</strong></td>
<td style="text-align: left;"><strong>100</strong></td>
<td style="text-align: left;"><strong>72</strong></td>
<td style="text-align: left;"><strong>96</strong></td>
<td style="text-align: left;"><strong>74</strong></td>
</tr>
</tbody>
</table>

### Justificación de las calificaciones

La opción B obtiene la mayor valoración en los criterios de mayor peso: integridad, seguridad, separación, cohesión, rendimiento y mantenibilidad. La opción A es económica, pero no protege suficientemente los límites de Catálogo, Compras, Inventario, Ventas y Seguridad. La opción C sobresale en autonomía y escalado, pero la carga prevista, el despliegue local, las transacciones fuertes y el tamaño del equipo no justifican su costo operativo.

La puntuación es juicio arquitectónico trazable, no resultado de pruebas. El prototipo deberá confirmar rendimiento, concurrencia, recuperación y compatibilidad de periféricos; un resultado adverso obliga a actualizar la decisión.

## Decisión de arquitectura y justificación

*Base normativa: cláusula 6.10.*

### Decisión adoptada

| **Campo** | **Respuesta** |
|:---|:---|
| Arquitectura elegida | Monolito modular web organizado en capas, persistencia relacional y despliegue centralizado en LAN. |
| Razón principal | Mejor relación entre separación, integridad transaccional, rendimiento, mantenibilidad y costo para la escala aprobada. |
| Alternativa A descartada | Sus capas técnicas no garantizan límites de negocio ni evitan dependencias indebidas. |
| Alternativa C descartada | Añade comunicación remota, consistencia distribuida y operación compleja sin necesidad demostrada. |
| Criterios determinantes | C-03, C-01, C-02, C-04 y C-05. |
| Riesgos aceptados | Falla del único despliegue; erosión de fronteras; crecimiento vertical limitado. |
| Mitigaciones | Servicio supervisado, UPS, copias verificadas, contratos internos, pruebas de arquitectura, métricas y extracción futura solo con evidencia. |
| Beneficios | Transacciones ACID locales, despliegue simple, baja latencia, menor costo, diagnóstico central y evolución modular. |

### Principios arquitectónicos fundamentales

| **ID** | **Principio** | **Explicación y regla verificable** |
|:---|:---|:---|
| **ID** | **Principio** | **Explicación y regla verificable** |
| PA-01 | Modularidad por negocio | Cada capacidad posee su modelo, servicios e interfaces; no se consultan tablas ajenas directamente. |
| PA-02 | Dependencias hacia el dominio | Presentación e infraestructura dependen de contratos de aplicación/dominio, nunca al contrario. |
| PA-03 | Integridad primero | Toda operación comercial crítica se confirma completa o se revierte sin efectos parciales. |
| PA-04 | Seguridad por defecto | Todo acceso se autentica, autoriza y registra; se aplica mínimo privilegio y denegación por defecto. |
| PA-05 | Evidencia inmutable | Movimientos, facturas y auditoría confirmados no se eliminan; se compensan o cambian de estado. |
| PA-06 | Operación local resiliente | Las funciones críticas no dependen de Internet; respaldo y recuperación se prueban. |
| PA-07 | Observabilidad sin secretos | Eventos correlacionables permiten diagnóstico sin exponer credenciales ni datos innecesarios. |
| PA-08 | Evolución basada en contratos | Módulos pueden reemplazarse o separarse si conservan contratos y reglas aprobadas. |

### Estructura de alto nivel

<figure>

<figcaption>Capas lógicas y dirección principal de dependencias.</figcaption>
</figure>

## Puntos de vista seleccionados

*Base normativa: cláusulas 6.6 y 8.*

| **ID** | **Punto de vista** | **Perspectiva** | **Aspecto** | **Preocupaciones** | **Modelos** |
|:---|:---|:---|:---|:---|:---|
| **ID** | **Punto de vista** | **Perspectiva** | **Aspecto** | **Preocupaciones** | **Modelos** |
| PV-01 | Contexto y alcance | S-01, S-02 | A-01 | P-05, P-07, P-09 | Contexto, frontera, actores |
| PV-02 | Estructura y módulos | S-03 | A-02, A-03 | P-01, P-06, P-07 | Capas, componentes, dependencias |
| PV-03 | Información e integridad | S-03, S-04 | A-04 | P-02, P-04, P-08 | Modelo lógico, transacciones, retención |
| PV-04 | Procesos y seguridad | S-02, S-04 | A-05 | P-01–P-03, P-09 | Secuencia, estados, controles |
| PV-05 | Despliegue y operación | S-01–S-03 | A-06 | P-01, P-04, P-05, P-07 | Despliegue, respaldo, recuperación |

## Vistas de arquitectura definidas

*Base normativa: cláusula 6.7.*

| **ID** | **Vista** | **PV rector** | **Propósito** | **Problema conocido** |
|:---|:---|:---|:---|:---|
| V-01 | Contexto y frontera | PV-01 | Delimitar usuarios, dispositivos, servicios y datos controlados. | Ninguno. |
| V-02 | Capas y módulos | PV-02 | Mostrar responsabilidades, interfaces y dependencias permitidas. | Disciplina por verificar. |
| V-03 | Información e integridad | PV-03 | Establecer propiedad de datos, transacciones y reglas de persistencia. | Esquema físico abierto. |
| V-04 | Procesos y seguridad | PV-04 | Explicar secuencia de venta, permisos, auditoría y fallas. | Pruebas dinámicas pendientes. |
| V-05 | Infraestructura | PV-05 | Definir nodos, red, periféricos, respaldo y recuperación. | Equipos concretos por aprobar. |

### V-01. Vista de contexto y frontera

La Figura 1 es el modelo rector. Usuarios internos consumen la aplicación web; cliente y proveedor son actores de negocio, no cuentas del sistema. La frontera técnica excluye Internet como dependencia crítica y trata dispositivos, UPS y copia externa como recursos operativos.

### V-02. Vista lógica de capas y componentes

<figure>

<figcaption>Módulos de negocio y colaboraciones principales mediante contratos internos.</figcaption>
</figure>

Cada módulo contiene presentación específica, casos de uso, dominio, contratos de repositorio y adaptadores. La colaboración se realiza por servicios de aplicación o eventos internos confirmados. Reportería consume modelos de lectura autorizados; no modifica información transaccional.

### V-03. Vista informacional e integridad

| **Propietario lógico** | **Entidades mínimas** | **Reglas de integridad** |
|:---|:---|:---|
| Identidad/seguridad | usuario, rol, permiso, sesión | Cuenta no se elimina con historial; permiso muchos-a-muchos; secretos derivados. |
| Catálogo | producto, categoría, marca, modelo, compatibilidad, precio | Código único; rangos válidos; historial de costo y precio. |
| Compras | proveedor, orden, detalle, recepción | Cantidades positivas; recepción vinculada; costo histórico. |
| Inventario | movimiento, conteo, detalle, ajuste | Solo anexado; saldo anterior/variación/posterior; no negativo en salida ordinaria. |
| Ventas | cliente, cotización, factura, detalle, pago | Totales exactos; claves únicas; factura confirmada no se borra. |
| Posventa | devolución, detalle, garantía, resolución | Vínculo a factura; cantidad acumulada no excede venta. |
| Caja/control | turno, movimiento, cierre, auditoría | Un turno abierto por alcance; evento sensible correlacionado. |

La unidad transaccional de venta incluye factura, detalle, pagos, movimientos de inventario, saldos, caja y auditoría. Una falla revierte la unidad. Compras, devoluciones y ajustes poseen unidades equivalentes. El historial confirmado se conserva mediante estados o movimientos compensatorios.

### V-04. Vista de procesos y seguridad

<figure>

<figcaption>Flujo transaccional y seguro de una venta POS.</figcaption>
</figure>

La autorización se revalida en servidor. Los controles incluyen identidad individual, permisos por rol, confirmación de operaciones sensibles, separación de funciones, sesión limitada, bloqueo de intentos, TLS, registros sin secretos y auditoría correlacionada. La interfaz nunca constituye el único control.

### V-05. Vista de despliegue y operación

<figure>

<figcaption>Despliegue físico inicial en la red local.</figcaption>
</figure>

El servicio inicia y se detiene de forma controlada, registra tareas programadas y reintentos, y expone diagnóstico restringido. El mantenimiento anuncia y bloquea nuevas escrituras antes de detener servicios. La copia diaria se verifica y la restauración solo se ejecuta en modo Recuperación con aprobación y evidencia.

## Correspondencias entre elementos

*Base normativa: cláusula 6.9.*

| **ID** | **Origen** | **Destino** | **Relación** | **Cumple** |
|:---|:---|:---|:---|:---|
| **ID** | **Origen** | **Destino** | **Relación** | **Cumple** |
| CR-01 | RF-01–RF-12 | V-02, módulos | Cada capacidad es responsabilidad de un módulo identificable. | **Sí** |
| CR-02 | RNF-01/02 | V-02, V-04, V-05 | Proceso local, transacciones y LAN reducen latencia y soportan carga. | **Parcial** |
| CR-03 | RNF-05, P-03 | V-04, V-05, PA-04 | RBAC, TLS, sesión, hash, mínimo privilegio y auditoría. | **Sí** |
| CR-04 | RNF-06, P-02 | V-03, V-04, PA-03/05 | Unidad transaccional e historial solo anexado protegen integridad. | **Sí** |
| CR-05 | RNF-03/04 | V-05, PA-06 | UPS, servicio supervisado, copias y recuperación controlada. | **Parcial** |
| CR-06 | RNF-07, P-09 | V-01, V-04 | GUI por rol y flujo POS guiado limitan pasos y errores. | **Parcial** |
| CR-07 | RNF-09/10 | V-02, PA-01/02/08 | Capas, contratos y configuración externa limitan impacto de cambios. | **Sí** |
| CR-08 | RNF-11, P-08 | V-01, V-03 | Formatos versionados y adaptadores preservan contratos. | **Sí** |
| CR-09 | RNF-12, P-07 | Decisión B, V-05 | Un despliegue local reduce costo y demanda operativa. | **Sí** |

Las correspondencias parciales requieren prueba dinámica o selección física posterior; no representan una omisión. No se conocen inconsistencias entre vistas al emitir esta versión. Si aparece una, se registrará como incidencia arquitectónica antes de aprobar el cambio.

## Relación entre arquitectura y requisitos

### Cobertura de requisitos funcionales

| **RF** | **Cómo se satisface** | **Componente responsable** | **Estado** |
|:---|:---|:---|:---|
| **RF** | **Cómo se satisface** | **Componente responsable** | **Estado** |
| RF-01 | Servicio central revalida identidad, permisos y sesión en cada operación protegida. | Identidad, Seguridad y Auditoría. | **Sí** |
| RF-02 | Modelo cohesivo conserva identidad y relaciones de compatibilidad. | Catálogo y Compatibilidad. | **Sí** |
| RF-03 | Orden y recepción comparten unidad de aplicación y contrato de inventario. | Proveedores/Compras + Inventario. | **Sí** |
| RF-04 | Movimiento solo anexado materializa saldo y permite conciliación. | Inventario y Kardex. | **Sí** |
| RF-05 | Cotización versiona valores y conversión revalida datos. | Ventas y Facturación. | **Sí** |
| RF-06 | Unidad transaccional confirma factura, pago, stock, caja y auditoría. | Ventas + Caja + Inventario. | **Sí** |
| RF-07 | Caso de uso enlaza factura, autorización y efectos compensatorios. | Clientes y Posventa. | **Sí** |
| RF-08 | Turno delimita movimientos y cierre conciliado. | Caja y Pagos. | **Sí** |
| RF-09 | Evento inmutable y correlacionado acompaña operación sensible. | Auditoría transversal. | **Sí** |
| RF-10 | Modelos de lectura calculan indicadores sin modificar transacciones. | Reportería. | **Sí** |
| RF-11 | Adaptadores versionados validan importación y filtran exportación. | Intercambio/Aplicación. | **Sí** |
| RF-12 | Tareas programadas, copia verificable y restauración restringida. | Operación y Soporte. | **Sí** |

### Cobertura de requisitos no funcionales

| **RNF** | **Preocupación** | **Característica arquitectónica** | **Estado** |
|:---|:---|:---|:---|
| **RNF** | **Preocupación** | **Característica arquitectónica** | **Estado** |
| RNF-01/02 | P-01 | Proceso local, consultas paginadas, índices por diseñar y límites de concurrencia. | **Parcial** |
| RNF-03/04 | P-04 | Servicio supervisado, UPS, respaldo verificable y modo Recuperación. | **Parcial** |
| RNF-05 | P-03/P-08 | Autorización central, TLS, hash, sesión, auditoría y mínimo privilegio. | **Sí** |
| RNF-06 | P-02 | DB relacional, transacciones ACID, decimal exacto y registros solo anexados. | **Sí** |
| RNF-07 | P-09 | Presentación por rol, navegación POS y validación inmediata. | **Parcial** |
| RNF-08 | P-05/P-07 | LAN sin dependencia de Internet, modos operativos y diagnóstico controlado. | **Sí** |
| RNF-09 | P-06 | Módulos, capas, interfaces, reglas independientes de GUI y migraciones. | **Sí** |
| RNF-10 | P-06 | Cliente web estándar, configuración externa y adaptación de periféricos. | **Parcial** |
| RNF-11 | P-08 | Adaptadores para UTF-8, PDF, impresión y contratos correlacionados. | **Sí** |
| RNF-12 | P-07 | Único despliegue y preferencia por componentes sin licencia onerosa. | **Sí** |

Todo estado *Parcial* indica que la estructura permite satisfacer el requisito, pero su aceptación depende de pruebas, diseño detallado o equipos seleccionados. Ningún requisito se considera verificado solamente por aparecer en esta DA.

## Verificación de cubrimiento

*Base normativa: ISO/IEC/IEEE 42010:2022, cláusula 6.*

| **Comprobación** | **Verificado** | **Evidencia** |
|:---|:---|:---|
| Se identificaron la entidad, el propósito y el entorno. | **Sí** | Sección 2 y Figura 1. |
| Se identificaron interesados y preocupaciones. | **Sí** | Sección 5. |
| Se definieron perspectivas y aspectos. | **Sí** | Secciones 5 y 6. |
| Cada preocupación se asignó a un punto de vista. | **Sí** | Sección 10. |
| Cada perspectiva está representada por vistas. | **Sí** | Secciones 10 y 11. |
| Se documentaron alternativas y decisión justificada. | **Sí** | Secciones 7–9. |
| Se registraron correspondencias. | **Sí** | Sección 12. |
| Se demostró cobertura funcional y no funcional. | **Sí** | Sección 13. |
| Se identificaron riesgos y limitaciones. | **Sí** | Secciones 9, 11 y 13. |
| La DA mantiene trazabilidad con REQ-MREC-001. | **Sí** | Identificadores de secciones 3, 4 y 13. |

### Verificaciones pendientes para la implementación

1.  Prueba de carga para los P95 y volúmenes definidos en RNF-01/02.

2.  Ensayo de venta concurrente que demuestre ausencia de saldo negativo y efectos parciales.

3.  Prueba de restauración que confirme RPO de 24 h y RTO de 4 h.

4.  Evaluación de usabilidad del flujo POS y navegación por teclado.

5.  Matriz de compatibilidad de navegadores, impresoras y lectores seleccionados.

6.  Revisión de amenazas, configuración criptográfica y permisos de infraestructura.

## Riesgos, deuda arquitectónica y evolución

| **ID** | **Riesgo** | **Prob.** | **Impacto** | **Tratamiento** |
|:---|:---|:---|:---|:---|
| **ID** | **Riesgo** | **Prob.** | **Impacto** | **Tratamiento** |
| RA-01 | Erosión de límites modulares. | Media | Alta | Reglas de dependencia, revisión de código y pruebas de arquitectura. |
| RA-02 | Falla del servidor único. | Media | Alta | UPS, supervisión, copias, repuesto compatible y recuperación ensayada. |
| RA-03 | Contención en inventario durante ventas concurrentes. | Media | Alta | Transacciones breves, índices, bloqueo controlado y prueba concurrente. |
| RA-04 | Periféricos incompatibles. | Media | Media | Interfaces estándar, prueba previa y adaptadores aislados. |
| RA-05 | Crecimiento superior al previsto. | Baja | Media | Métricas, optimización, escalado vertical y extracción selectiva con evidencia. |
| RA-06 | Copia disponible pero no restaurable. | Media | Alta | Verificación automática y simulacro periódico documentado. |

La evolución conserva primero el monolito modular. Solo se separará un módulo si existe un problema medido de escalado, disponibilidad, ritmo de cambio o aislamiento que no pueda resolverse razonablemente dentro del despliegue actual. La extracción deberá mantener contratos, trazabilidad y consistencia, y requerirá una nueva decisión arquitectónica.

## Gestión de decisiones y cambios

Toda modificación se registrará como decisión arquitectónica con: identificador, estado, contexto, alternativas, decisión, consecuencias, requisitos y vistas afectados, responsable y fecha. El flujo será propuesta, análisis de impacto, revisión con interesados, aprobación, actualización de modelos y verificación de correspondencias.

Se congelan en esta versión: estilo monolítico modular, capas lógicas, persistencia relacional, operación LAN, transacciones locales, autorización en servidor y conservación de auditoría. Permanecen abiertas para el diseño: lenguaje, framework, DBMS concreto, sistema operativo, biblioteca de interfaz, topología exacta de copias, índices, nivel de aislamiento y formatos finales de comprobantes.

## Conclusiones

La arquitectura seleccionada es proporcional al problema y deriva de la línea base REQ-MREC-001 sin introducir funciones ajenas. El monolito modular conserva la sencillez de un único despliegue y, al mismo tiempo, establece fronteras explícitas entre capacidades. La base relacional y las transacciones locales favorecen la integridad de ventas, pagos, caja e inventario; la LAN evita dependencia de Internet; y los controles de seguridad, auditoría y respaldo responden a las preocupaciones de continuidad y trazabilidad.

Esta DA es la entrada oficial para los documentos siguientes. El diseño detallado deberá respetar los principios, módulos, contratos, correspondencias y decisiones aquí aprobados. Cualquier desviación requerirá análisis de impacto y control de cambios.

## Aprobación de la línea base

<table>
<tbody>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Ángel Antonio Alonso Suárez</td>
<td style="text-align: left;">Br. Noel Isaac Alemán Carballo</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2021-0087U</td>
<td style="text-align: left;">Carnet 2022-0376U</td>
</tr>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Mendell Noé Parrales Molina</td>
<td style="text-align: left;">Ing. Roberto Alfaro</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2020-1014U</td>
<td style="text-align: left;">Docente titular</td>
</tr>
</tbody>
</table>

## Referencias bibliográficas

1.  ISO/IEC/IEEE. (2022). *ISO/IEC/IEEE 42010:2022, Software, systems and enterprise – Architecture description*.

2.  ISO/IEC/IEEE. (2011). *ISO/IEC/IEEE 29148:2011, Systems and software engineering – Life cycle processes – Requirements engineering*.

3.  ISO/IEC/IEEE. (2017). *ISO/IEC/IEEE 12207:2017, Systems and software engineering – Software life cycle processes*.

4.  ISO/IEC. (2011). *ISO/IEC 25010:2011, Systems and software engineering – Systems and software Quality Requirements and Evaluation – System and software quality models*.

5.  Bass, L., Clements, P., y Kazman, R. (2021). *Software Architecture in Practice* (4.ª ed.). Addison-Wesley.

6.  Richards, M., y Ford, N. (2020). *Fundamentals of Software Architecture*. O’Reilly Media.

7.  Equipo Moto Repuestos El Centenario. (2026). *Especificación integral de requisitos StRS, SyRS y SRS, REQ-MREC-001 v1.0*. Universidad Nacional de Ingeniería.

---

# Capítulo 05: Elección y Justificación de la Metodología de Desarrollo

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

Dirección de Área de Conocimiento DACTIC

Asignatura: Ingeniería de Software 1

------------------------------------------------------------------------

**ELECCIÓN Y JUSTIFICACIÓN**

DE LA METODOLOGÍA DE DESARROLLO

Modelo de ciclo de vida seleccionado

y adaptación al proyecto

**Caso de estudio: Distribuidora Comercial “Moto Repuestos El Centenario”**

------------------------------------------------------------------------


**Fuentes rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
SWEBOK Guide V4.0a, capítulo 10  
ISO/IEC/IEEE 12207:2017  
**Versión:** 2.0  
**Estado:** Planificación metodológica integral aprobada con WBS, CPM y RACI


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha:** 23 de septiembre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Tercer entregable de planificación – Ingeniería de Software 1**  
Continuación de las líneas base de requisitos y arquitectura


## Identificación y control del documento

| **Campo** | **Valor** |
|:---|:---|
| Identificador | MET-MREC-001 |
| Título único | Elección y justificación de la metodología de desarrollo de Moto Repuestos El Centenario |
| Versión y fecha | 2.0 – 23 de septiembre de 2026 (Actualizada con WBS, CPM y RACI) |
| Líneas base de entrada | REQ-MREC-001 v1.0, DA-MREC-001 v1.0, Estimación COCOMO II (9.01 PM) e Informe Financiero v1.0. |
| Decisión | Modelo incremental controlado, con verificación formal planificada por incremento, descomposición WBS de 4 niveles, análisis de ruta crítica CPM y gestión formal de cambios. |
| Estado | Planificación metodológica integral aprobada con cronograma maestro y asignación formal de responsabilidades. |
| Control | Una revisión de este modelo requiere análisis de impacto sobre requisitos, arquitectura, incrementos, pruebas y documentos posteriores. |

### Historial de versiones

| **Versión** | **Fecha** | **Descripción** | **Responsables** |
|:---|:---|:---|:---|
| 1.0 | 23/09/2026 | Selección y adaptación del modelo de ciclo de vida; análisis comparativo, descarte de Scrum y plan de verificación. | Equipo de trabajo |
| 2.0 | 08/11/2026 | Incorporación formal de la WBS (EDT de 4 niveles), Red de Precedencias CPM, análisis de holguras y Ruta Crítica de 60 días (12 semanas), Cronograma Gantt y Matriz RACI conforme a ISO/IEC/IEEE 12207:2017 y SWEBOK V4. | Equipo de trabajo |

### Aprobaciones previstas

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Representante académico | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada por Moto Repuestos El Centenario | Firma y fecha |

## Índice de cuadros

| **Grupo** | **Contenido** | **Ubicación** |
|:---|:---|:---|
| Base de decisión | Contexto, evidencias, restricciones y distinción conceptual. | Secciones 1–3 |
| Comparación | Criterios, pesos, alternativas, calificaciones y descartes. | Secciones 4–7 |
| Aplicación | Incrementos, pruebas, trazabilidad, roles y control. | Secciones 8–10 |
| Seguimiento | Riesgos, métricas, disparadores y conformidad. | Secciones 11–13 |

## Resumen ejecutivo

Se selecciona el **modelo incremental** como rector del ciclo de vida de desarrollo de Moto Repuestos El Centenario. Se adapta a un alcance funcional y una arquitectura ya documentados: entregas parciales utilizables, ordenadas por dependencias de negocio, con aceptación verificable y control de cambios. La verificación se planifica desde cada requisito y se ejecutará dentro de cada incremento; esta práctica no convierte el modelo en V ni crea una segunda metodología.

La decisión responde a REQ-MREC-001: funciones comerciales interdependientes, reglas de inventario y venta atómica, objetivos de rendimiento, controles de seguridad, respaldo y recuperación. También responde a DA-MREC-001: monolito modular en capas, base relacional, operación en LAN y pruebas pendientes de carga, concurrencia, restauración y periféricos. Una entrega única tardía dejaría la integración de estas capacidades para el final. La secuencia incremental permite demostrar tempranamente catálogo, inventario y luego venta completa sin relajar las reglas de integridad.

Se analizaron cinco modelos de ciclo de vida comparables: cascada, V, incremental, espiral y proceso unificado. El incremental obtuvo **88/100** en la matriz ponderada, por encima de proceso unificado (79), espiral (78), cascada (54) y V (54). Las calificaciones son juicio de planificación, sujetas a revisión con evidencia de la ejecución.

Scrum queda **expresamente descartado como marco de gestión del proyecto**. La línea base define documentos, trazabilidad y criterios de aceptación antes de la construcción, mientras que no se ha establecido un Product Owner con autoridad y disponibilidad para mantener una priorización continua, ni una cadencia de Sprint con incremento usable y revisión formal en cada ciclo. La decisión es contextual: no afirma que Scrum prohíba documentación ni que sea incapaz de entregar este producto. El proyecto conservará revisiones de interesados y adaptación controlada sin adoptar responsabilidades, eventos ni artefactos de Scrum.

La planificación formal establece un cronograma maestro calibrado exactamente a un plazo de **60 días hábiles (12 semanas / 3.0 meses calendario)** y un esfuerzo acumulado de **9.01 Personas-Mes** bajo COCOMO II Post-Architecture. El trabajo se estructura mediante una **WBS/EDT de 4 niveles**, análisis de precedencias y cálculo de **Ruta Crítica CPM** con holguras explícitas, asegurando un gobierno disciplinado y verificable en cada incremento.

## Objeto y fuentes de la decisión

Este documento decide *cómo se organizará el futuro desarrollo* del sistema. Su objetivo es escoger un modelo de ciclo de vida proporcional al alcance, las dependencias, los riesgos y las obligaciones de verificación, y traducirlo a actividades, entregables y controles concretos.

| **Fuente** | **Evidencia que condiciona la elección** |
|:---|:---|
| REQ-MREC-001 v1.0 | Requisitos trazados StRS–SyRS–SRS; reglas RN-01–RN-15; funciones de catálogo, compras, inventario, venta, caja, devoluciones, auditoría, respaldo; criterios cuantificables de aceptación. |
| DA-MREC-001 v1.0 | Arquitectura monolítica modular en capas; persistencia relacional; servidor local y LAN; transacciones ACID; contratos internos; verificación pendiente de carga, concurrencia, recuperación y periféricos. |
| SWEBOK Guide V4.0a, cap. 10 | Diferencia entre proceso, modelo de ciclo de vida y paradigma; modelos cascada, V, incremental, espiral y ágil; necesidad de adaptar el proceso al proyecto y medir sus resultados. |
| ISO/IEC/IEEE 12207:2017 | Referente de procesos técnicos y de gestión: requisitos, arquitectura, diseño, implementación, integración, verificación, validación, configuración, riesgo y medición. |
| The Scrum Guide (2020) | Definición de Scrum como marco con responsabilidades, eventos y artefactos específicos; base del análisis de descarte. |

### Estado de partida y horizonte temporal formal

Las líneas base REQ-MREC-001 y DA-MREC-001 son insumos oficiales de planificación. La arquitectura fija estilo monolítico modular, aislamiento de capas, operación LAN e integridad ACID. La presente versión 2.0 formaliza el marco temporal integrando la estimación COCOMO II (9.01 PM), una descomposición de trabajo WBS de 4 niveles, red de precedencias CPM con holguras y un cronograma maestro calibrado exactamente a un plazo de **60 días hábiles (12 semanas / 3.0 meses calendario)**, garantizando viabilidad operativa, certidumbre económica y trazabilidad bidireccional de compromisos.

## Distinción entre modelo, marco y prácticas

El SWEBOK distingue la selección de un modelo de ciclo de vida de la adaptación de procesos concretos. En esta decisión, *modelo incremental* designa cómo se divide y entrega el producto. La verificación por niveles, la revisión de riesgos, el control de configuración y la medición son prácticas de ingeniería que operan dentro del modelo. Scrum es un marco de gestión de trabajo complejo con reglas propias; DevOps reúne principios y prácticas de colaboración y entrega; Kanban organiza flujo. Estas categorías pueden complementarse en otros contextos, pero no se puntúan como si fueran cinco modelos equivalentes.

| **Categoría** | **Ejemplos analizados** | **Tratamiento en esta decisión** |
|:---|:---|:---|
| Modelo de ciclo de vida | Cascada, V, incremental, espiral y UP/RUP | Comparación cuantitativa entre alternativas rectoras. |
| Marco de gestión | Scrum | Evaluación de pertinencia y descarte explícito. |
| Práctica o enfoque complementario | Prototipado, Kanban, DevOps y técnicas de XP | Evaluación cualitativa; uso puntual solo si resulta útil y se justifica. |

## Características decisivas del proyecto

| **ID** | **Hecho de las líneas base** | **Consecuencia para el proceso** | **Evidencia** |
|:---|:---|:---|:---|
| **ID** | **Hecho de las líneas base** | **Consecuencia para el proceso** | **Evidencia** |
| H-01 | Requisitos y criterios de aceptación identificados. | Preservar IDs, pruebas y control de cambios por entrega. | REQ, secciones 18 y 19. |
| H-02 | Catálogo, compras, inventario, venta y caja dependen entre sí. | Ordenar incrementos por capacidades verticales y predecesores reales. | SYS-FN-003–024. |
| H-03 | Venta, pago, Kardex y caja deben confirmarse atómicamente. | Integrar y probar concurrencia antes de aceptar venta. | RN-01/02/07; SRS-VNT-006. |
| H-04 | El entorno inicial es local: 20,000 productos, 10 usuarios concurrentes y 4 POS. | Probar carga realista y periféricos sobre LAN, no prometer escalado sin prueba. | SYS-PR-001–003; DA, V-05. |
| H-05 | RPO de 24 h, RTO de 4 h y disponibilidad objetivo de 99.5%. | Diseñar respaldo desde la base y ensayar restauración antes de transición. | SYS-PR-006/007; DA, V-05. |
| H-06 | La arquitectura modular permite aislar responsabilidades. | Asignar módulos e interfaces a incrementos sin cambiar el estilo aprobado. | DA, PA-01/02/08. |
| H-07 | Hay tres integrantes académicos identificados; no consta autoridad continua de Product Owner. | Establecer responsable de requisitos y aprobador por cambio; evitar asumir una estructura Scrum. | Portadas y aprobaciones. |
| H-08 | La entrega de seis documentos está fijada para el 23/09/2026. | Cerrar la planificación documental; estimar el calendario de construcción por separado. | Consigna y portadas. |

## Criterios y método de evaluación

Se califican cinco modelos en una escala ordinal de 1 a 5, donde 1 significa ajuste muy débil y 5 ajuste muy fuerte. Cada peso expresa importancia para este proyecto. La puntuación total se calcula sumando, para cada criterio, su peso multiplicado por la calificación y dividido entre 5; el máximo es 100. No es una medición experimental; por eso se consignan razones y supuestos.

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>ID</strong></th>
<th style="text-align: left;"><strong>Criterio</strong></th>
<th style="text-align: left;"><strong>Peso</strong></th>
<th style="text-align: left;"><strong>Ancla de evaluación</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">C-01</td>
<td style="text-align: left;">Trazabilidad y verificación</td>
<td style="text-align: left;">20%</td>
<td style="text-align: left;">Facilidad para enlazar requisitos, diseño, prueba y aceptación.</td>
</tr>
<tr>
<td style="text-align: left;">C-02</td>
<td style="text-align: left;">Entrega utilizable temprana</td>
<td style="text-align: left;">20%</td>
<td style="text-align: left;">Capacidad de demostrar valor antes del sistema completo.</td>
</tr>
<tr>
<td style="text-align: left;">C-03</td>
<td style="text-align: left;">Cambio controlado</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Posibilidad de incorporar hallazgos con impacto explícito.</td>
</tr>
<tr>
<td style="text-align: left;">C-04</td>
<td style="text-align: left;">Gestión de riesgo arquitectónico</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Prueba oportuna de concurrencia, datos, seguridad y recuperación.</td>
</tr>
<tr>
<td style="text-align: left;">C-05</td>
<td style="text-align: left;">Costo y complejidad del proceso</td>
<td style="text-align: left;">15%</td>
<td style="text-align: left;">Proporcionalidad de roles, rituales, artefactos y experiencia requerida.</td>
</tr>
<tr>
<td style="text-align: left;">C-06</td>
<td style="text-align: left;">Retroalimentación viable</td>
<td style="text-align: left;">10%</td>
<td style="text-align: left;">Encaje con revisiones puntuales del negocio y docente.</td>
</tr>
<tr>
<td style="text-align: left;">C-07</td>
<td style="text-align: left;">Transición a operación</td>
<td style="text-align: left;">5%</td>
<td style="text-align: left;">Preparación gradual de respaldo, soporte y despliegue LAN.</td>
</tr>
<tr>
<td colspan="2" style="text-align: right;"><strong>Total</strong></td>
<td style="text-align: left;"><strong>100%</strong></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

## Alternativas de ciclo de vida

| **Modelo** | **Aporte al proyecto** | **Límite en este contexto** | **Conclusión preliminar** |
|:---|:---|:---|:---|
| **Modelo** | **Aporte al proyecto** | **Límite en este contexto** | **Conclusión preliminar** |
| Cascada | Orden documental y secuencia sencilla. | Integración y aceptación concentradas al final; cambios costosos tras cerrar fases. | Se descarta como modelo rector. |
| Modelo en V | Correspondencia explícita de especificaciones con niveles de prueba. | Si rige toda la entrega como secuencia única, el negocio no recibe capacidades utilizables temprano. | Se descarta como modelo rector; se conserva planificación de pruebas. |
| Incremental | Entregas parciales, arquitectura compartida y aprendizaje entre entregas. | Requiere priorización, interfaces estables y disciplina para no fragmentar datos. | Candidato principal. |
| Espiral | Tratamiento explícito de riesgos mediante vueltas sucesivas. | Exige gestión y pericia elevadas para un sistema local y equipo pequeño. | Se descarta como modelo rector; se conservan revisiones de riesgos. |
| UP/RUP | Desarrollo iterativo con foco arquitectónico y documentación disciplinada. | El marco completo añadiría actividades y artefactos desproporcionados al alcance académico y al equipo. | Se descarta como modelo rector; se conserva arquitectura base. |

### Matriz ponderada

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>ID</strong></th>
<th style="text-align: left;"><strong>Criterio</strong></th>
<th style="text-align: left;"><strong>Peso</strong></th>
<th style="text-align: left;"><strong>Casc.</strong></th>
<th style="text-align: left;"><strong>V</strong></th>
<th style="text-align: left;"><strong>Incr.</strong></th>
<th style="text-align: left;"><strong>Espir.</strong></th>
<th style="text-align: left;"><strong>UP</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">C-01</td>
<td style="text-align: left;">Trazabilidad/verificación</td>
<td style="text-align: left;">20</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td style="text-align: left;">C-02</td>
<td style="text-align: left;">Entrega temprana</td>
<td style="text-align: left;">20</td>
<td style="text-align: left;">1</td>
<td style="text-align: left;">1</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">4</td>
</tr>
<tr>
<td style="text-align: left;">C-03</td>
<td style="text-align: left;">Cambio controlado</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">1</td>
<td style="text-align: left;">1</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
</tr>
<tr>
<td style="text-align: left;">C-04</td>
<td style="text-align: left;">Riesgo arquitectónico</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">5</td>
</tr>
<tr>
<td style="text-align: left;">C-05</td>
<td style="text-align: left;">Costo del proceso</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">2</td>
</tr>
<tr>
<td style="text-align: left;">C-06</td>
<td style="text-align: left;">Retroalimentación</td>
<td style="text-align: left;">10</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">3</td>
<td style="text-align: left;">3</td>
</tr>
<tr>
<td style="text-align: left;">C-07</td>
<td style="text-align: left;">Transición operativa</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">2</td>
<td style="text-align: left;">5</td>
<td style="text-align: left;">4</td>
<td style="text-align: left;">4</td>
</tr>
<tr>
<td colspan="2" style="text-align: right;"><strong>Total / 100</strong></td>
<td style="text-align: left;"><strong>100</strong></td>
<td style="text-align: left;"><strong>54</strong></td>
<td style="text-align: left;"><strong>54</strong></td>
<td style="text-align: left;"><strong>88</strong></td>
<td style="text-align: left;"><strong>78</strong></td>
<td style="text-align: left;"><strong>79</strong></td>
</tr>
</tbody>
</table>

### Razón de las puntuaciones

| **ID** | **Cascada y V** | **Incremental** | **Espiral** | **UP/RUP** |
|:---|:---|:---|:---|:---|
| **ID** | **Cascada y V** | **Incremental** | **Espiral** | **UP/RUP** |
| C-01 | Ambos facilitan documentos y pruebas planificadas. | Exige disciplina de RTM en cada entrega. | Riesgos orientan artefactos, con cobertura que depende de adaptación. | Excelente soporte documental. |
| C-02 | Entrega completa llega tarde. | Cada bloque vertical demuestra valor. | Vuelta puede producir prototipo o producto parcial. | Iteraciones producen capacidades, aunque con mayor estructura. |
| C-03 | Cambios tardíos reabren fases. | La próxima entrega puede incorporar cambio aprobado. | Revisión de riesgo facilita ajuste. | Cambio gestionado mediante iteraciones. |
| C-04 | V mejora planeación de pruebas; cascada deja integración tardía. | Riesgos críticos se prueban en cuanto aparecen. | Riesgo es motor explícito del modelo. | Arquitectura temprana protege decisiones. |
| C-05 | Baja o moderada carga de coordinación. | Proceso ligero con puertas claras. | Análisis de riesgos continuo demanda pericia. | Marco completo añade carga al equipo. |
| C-06 | Validación principalmente al cierre. | Demostración por incremento permite revisiones pactadas. | Necesita retroalimentación por vuelta. | Iteraciones requieren revisión sostenida. |
| C-07 | Transición se concentra al final. | Respaldo y operación crecen con el producto. | Riesgos operativos pueden tratarse pronto. | Transición definida, pero con mayor formalidad. |

### Robustez y límites de la comparación

La ventaja del incremental sobre UP/RUP es de 9 puntos y sobre espiral de 10. Las calificaciones son razonamientos contextualizados, no datos de desempeño medidos. Si cambian significativamente los riesgos, la disponibilidad del negocio, la escala, el equipo o las exigencias del docente, se recalculará la matriz antes de imponer el modelo a la ejecución. Aunque el V obtiene la misma cifra que cascada, aporta una disciplina de pruebas aprovechable en cada incremento; igualdad numérica no implica identidad técnica.

## Descarte de otros enfoques

| **Enfoque** | **Valor reconocido** | **Decisión para este proyecto** |
|:---|:---|:---|
| Prototipado rápido como rector | Ayuda a aclarar interfaz y compatibilidad percibida. | Se utilizarán prototipos descartables cuando una pantalla o regla requiera validación; no sustituyen el producto integrado ni la RTM. |
| Ágil genérico | Favorece adaptación y colaboración. | Es un conjunto de valores y principios, no una definición suficiente de etapas, responsables y evidencia para este proyecto. |
| Programación extrema (XP) como rector | Pruebas y disciplina técnica intensa. | Sus prácticas pueden aportar calidad, pero no resuelven por sí solas el ciclo de vida de requisitos, datos, operación y aceptación académica. |
| Kanban como rector | Hace visible el trabajo en curso. | Se puede usar un tablero para seguimiento, sin confundirlo con el modelo de ciclo de vida elegido. |
| DevOps como rector | Automatización y colaboración entre desarrollo y operación. | El despliegue inicial es local; las prácticas de integración, copia y supervisión son útiles, pero DevOps no sustituye la planificación de entregas funcionales. |
| Scrum | Inspección y adaptación alrededor de incrementos utilizables. | Rechazado expresamente como marco de gestión. El análisis detallado aparece en la sección 7.1. |

### Renuncia expresa a Scrum

La *Scrum Guide* define Scrum mediante un equipo con responsabilidades de Product Owner, Scrum Master y Developers, eventos de Sprint, artefactos y un incremento valioso y utilizable al final de cada Sprint. Omitir partes esenciales y llamar Scrum al resultado sería una adopción nominal. Por ello, la decisión es **no aplicar Scrum ni presentar sus eventos, roles o artefactos como método del proyecto**.

| **Condición de Scrum** | **Situación documentada** | **Razón del descarte** |
|:---|:---|:---|
| **Condición de Scrum** | **Situación documentada** | **Razón del descarte** |
| Product Owner con autoridad sobre valor y Product Backlog | Las líneas base identifican propietaria, equipo y aprobaciones, pero no formalizan una persona con disponibilidad para ordenar continuamente un backlog. | No se debe atribuir una responsabilidad que no ha sido asignada ni comprometida. |
| Cadencia de Sprint con incremento utilizable | La fecha actual es la entrega documental; la construcción aún no tiene calendario ni capacidad estimada por Sprint. | Una cadencia fija sería supuesta, no sustentada. Se planificarán entregas por capacidad y puerta de aceptación. |
| Eventos de inspección y adaptación | Se prevén revisión de interesados, verificación y control de cambios por incremento. | Pueden cumplirse los objetivos de revisión sin instituir Sprint Planning, Daily Scrum, Sprint Review y Retrospective. |
| Artefactos y compromiso de Scrum | REQ-MREC-001 es una línea base trazada y DA-MREC-001 fija decisiones arquitectónicas. | No se reemplazarán sus identificadores, cambios aprobados y evidencia de verificación por un Product Backlog asumido. |
| Costo de coordinación | Tres integrantes académicos deben producir diseño, implementación, pruebas y documentación. | Para la información y autoridad disponibles, la estructura completa de Scrum no aporta una ventaja demostrada frente al modelo incremental controlado. |

La documentación y una fecha fija *no son incompatibilidades intrínsecas* con Scrum. Tampoco se descartan la retroalimentación, la transparencia ni las mejoras del proceso. Se descarta el marco específico porque sus condiciones de aplicación no están establecidas en estas líneas base y la alternativa elegida cubre el trabajo con menos supuestos. Esta renuncia rige la planificación y los documentos siguientes; cambiarla requeriría una decisión formal nueva, no un cambio de nombre.

## Modelo seleccionado y adaptación

### Definición operativa

El producto se construirá mediante **incrementos verticales y acumulativos**. Cada uno incluye análisis del alcance asignado, diseño compatible con DA-MREC-001, implementación, integración, pruebas, demostración y decisión de aceptación. Un incremento aceptado conserva las capacidades anteriores y agrega otras utilizables; no se considerará terminado por el solo hecho de programar sus módulos. La secuencia puede reajustarse mediante control de cambios, manteniendo las dependencias y reglas de integridad.

### Actividades comunes de cada incremento

1.  Seleccionar requisitos identificados y su criterio de aceptación; confirmar predecesores, datos y riesgos.

2.  Elaborar diseño detallado y prueba prevista antes de codificar; actualizar RTM y decisión arquitectónica si hay impacto.

3.  Implementar módulo, persistencia, validaciones, seguridad, auditoría y manejo de errores correspondientes.

4.  Integrar con incrementos previos y ejecutar pruebas unitarias, de integración, de sistema y de regresión pertinentes.

5.  Mostrar la capacidad a representantes designados y registrar aceptación, observaciones o rechazo con evidencia.

6.  Conservar versión, migración, manuales, resultados de prueba, riesgos residuales y lecciones aplicables a la entrega siguiente.

### Plan de incrementos y horizonte temporal

El desarrollo del sistema se ejecuta mediante cuatro incrementos verticales acumulativos distribuidos en un horizonte contractual de **12 semanas (60 días hábiles)**, asignando una cadencia uniforme de **3 semanas (15 días hábiles) por incremento**. Las capacidades transversales de seguridad RBAC, persistencia transaccional, bitácora de auditoría y respaldo se incorporan desde I1 y se extienden progresivamente.

| **Inc.** | **Capacidad demostrable** | **Alcance y requisitos de entrada** | **Evidencia de aceptación** | **Ventana temporal** | **Antes** |
|:---|:---|:---|:---|:---|:---|
| **Inc.** | **Capacidad demostrable** | **Alcance y requisitos de entrada** | **Evidencia de aceptación** | **Ventana temporal** | **Antes** |
| I1 | Acceso y catálogo consultable | Usuarios, roles, productos, categorías, marcas, modelos, compatibilidades, búsqueda; SYS-FN-001–005, SYS-SC-001–005. | Permisos por rol, duplicados rechazados, compatibilidad por rango, búsqueda P95 con datos de prueba y copia básica recuperable. | Semanas 1–3 (Días 1–15) | Líneas base |
| I2 | Compra y stock íntegro | Proveedores, órdenes, recepción parcial, Kardex, saldos, conteos, alertas; SYS-FN-006–012. | Recepción vinculada, diferencias registradas, movimientos trazables, conteo con aprobación, saldo ordinario no negativo. | Semanas 4–6 (Días 16–30) | I1 |
| I3 | Venta completa y caja | Cotización, conversión, factura, pagos, comprobante, turno y cierre; SYS-FN-013–018, 021/022. | Venta atómica bajo falla y concurrencia, total exacto, pagos conciliados, impresión equivalente, P95 de venta y cierre trazable. | Semanas 7–9 (Días 31–45) | I1–I2 |
| I4 | Posventa y operación integral | Devoluciones, garantías, reportes, importación/exportación, auditoría avanzada, respaldo y restauración; SYS-FN-019/020, 023–030. | Devolución limitada por venta, reportes reconciliados, exportación autorizada, RPO/RTO probados y transición documentada. | Semanas 10–12 (Días 46–60) | I1–I3 |

### Reglas de partición

Los cortes siguen valor y dependencia de negocio, evitando capas técnicas o tablas aisladas. Cada incremento conserva el servidor local, la base relacional y las interfaces internas aprobadas. I3 no puede iniciarse sin el inventario físicamente trazable de I2. Los datos de clientes, precios, pagos y bitácora se introducen con permisos y retención correspondientes. Las migraciones entre versiones deben ser reproducibles y preservar historial. Una funcionalidad incompleta no se declarará entregada solo porque exista una interfaz gráfica.

### Estructura de Descomposición del Trabajo (EDT / WBS)

En concordancia con el estándar ISO/IEC/IEEE 12207:2017 (Proceso de Planificación) y los lineamientos del SWEBOK V4, el alcance se desglosa en 4 niveles jerárquicos: (1) Sistema, (2) Fases/Incrementos, (3) Paquetes de Trabajo, y (4) Actividades y Entregables Verificables. Cada paquete del nivel 4 posee trazabilidad estricta hacia los requisitos funcionales (SYS-FN) y de calidad (SYS-SC, SYS-PR) aprobados.

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>Código</strong></th>
<th style="text-align: left;"><strong>Nivel / Paquete</strong></th>
<th style="text-align: left;"><strong>Descripción del entregable o actividad</strong></th>
<th style="text-align: left;"><strong>Requisitos trazados</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;"><strong>Código</strong></td>
<td style="text-align: left;"><strong>Nivel / Paquete</strong></td>
<td style="text-align: left;"><strong>Descripción del entregable o actividad</strong></td>
<td style="text-align: left;"><strong>Requisitos trazados</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.0</strong></td>
<td colspan="3" style="text-align: left;"><strong>Sistema Comercial y Administrativo Moto Repuestos El Centenario</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.1</strong></td>
<td colspan="3" style="text-align: left;"><strong>Líneas Base, Entorno y Compuerta Inicial G0 (Semana 1)</strong></td>
</tr>
<tr>
<td style="text-align: left;">1.1.1</td>
<td style="text-align: left;">Formalización de líneas base</td>
<td style="text-align: left;">Consolidación y firma de REQ-MREC-001, DA-MREC-001 y MET-MREC-001.</td>
<td style="text-align: left;">Todos los requisitos</td>
</tr>
<tr>
<td style="text-align: left;">1.1.2</td>
<td style="text-align: left;">Infraestructura y entorno</td>
<td style="text-align: left;">Configuración de Git, estándares PEP 8, PostgreSQL local y suite de pruebas.</td>
<td style="text-align: left;">DA-MREC-001 (V-01)</td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.2</strong></td>
<td colspan="3" style="text-align: left;"><strong>Incremento I1: Núcleo de Seguridad y Catálogo Maestro (Semanas 1–3)</strong></td>
</tr>
<tr>
<td style="text-align: left;">1.2.1</td>
<td style="text-align: left;">Autenticación y RBAC</td>
<td style="text-align: left;">Modelo de usuarios, roles (<em>Administrador, Bodega, Venta</em>), sesiones y bloqueo seguro.</td>
<td style="text-align: left;">SYS-FN-001, SYS-FN-002, SYS-SC-001–005</td>
</tr>
<tr>
<td style="text-align: left;">1.2.2</td>
<td style="text-align: left;">Catálogo de repuestos</td>
<td style="text-align: left;">CRUD de marcas, modelos, categorías, repuestos y códigos de barras únicos.</td>
<td style="text-align: left;">SYS-FN-003, SYS-FN-004</td>
</tr>
<tr>
<td style="text-align: left;">1.2.3</td>
<td style="text-align: left;">Compatibilidad y búsqueda</td>
<td style="text-align: left;">Matriz de compatibilidad por año/modelo y motor de búsqueda indizado (<em>P</em><sub>95</sub> ≤ 1.5 s).</td>
<td style="text-align: left;">SYS-FN-005, SYS-PR-001</td>
</tr>
<tr>
<td style="text-align: left;">1.2.4</td>
<td style="text-align: left;">Respaldo básico y G1/G2</td>
<td style="text-align: left;">Script de volcado lógico de PostgreSQL y ejecución de compuerta G2 de I1.</td>
<td style="text-align: left;">SYS-FN-029, G1, G2</td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.3</strong></td>
<td colspan="3" style="text-align: left;"><strong>Incremento I2: Compras e Inventario Kardex Íntegro (Semanas 4–6)</strong></td>
</tr>
<tr>
<td style="text-align: left;">1.3.1</td>
<td style="text-align: left;">Gestión de proveedores</td>
<td style="text-align: left;">Registro de proveedores, contactos comerciales y catálogos de piezas.</td>
<td style="text-align: left;">SYS-FN-006</td>
</tr>
<tr>
<td style="text-align: left;">1.3.2</td>
<td style="text-align: left;">Órdenes y recepción</td>
<td style="text-align: left;">Emisión de órdenes de compra y recepción parcial o total de mercancía vinculada.</td>
<td style="text-align: left;">SYS-FN-007, SYS-FN-008</td>
</tr>
<tr>
<td style="text-align: left;">1.3.3</td>
<td style="text-align: left;">Kardex multialmacén</td>
<td style="text-align: left;">Registro atómico de movimientos; cálculo continuo de saldos y costo promedio.</td>
<td style="text-align: left;">SYS-FN-009, SYS-FN-010</td>
</tr>
<tr>
<td style="text-align: left;">1.3.4</td>
<td style="text-align: left;">Control físico y alertas</td>
<td style="text-align: left;">Conteos ciegos, ajustes con aprobación y alertas automáticas de stock mínimo.</td>
<td style="text-align: left;">SYS-FN-011, SYS-FN-012</td>
</tr>
<tr>
<td style="text-align: left;">1.3.5</td>
<td style="text-align: left;">Verificación y G1/G2</td>
<td style="text-align: left;">Pruebas de concurrencia y validación de regla de no negatividad de stock.</td>
<td style="text-align: left;">SYS-PR-004, G1, G2</td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.4</strong></td>
<td colspan="3" style="text-align: left;"><strong>Incremento I3: Punto de Venta (POS) y Turnos de Caja (Semanas 7–9)</strong></td>
</tr>
<tr>
<td style="text-align: left;">1.4.1</td>
<td style="text-align: left;">Turnos y control de efectivo</td>
<td style="text-align: left;">Apertura de caja con arqueo por denominaciones (NIO/USD), transferencias y arqueo ciego.</td>
<td style="text-align: left;">SYS-FN-021, SYS-FN-022</td>
</tr>
<tr>
<td style="text-align: left;">1.4.2</td>
<td style="text-align: left;">Cotizaciones y conversión</td>
<td style="text-align: left;">Emisión de cotizaciones formales y conversión directa a factura sin duplicidad.</td>
<td style="text-align: left;">SYS-FN-013, SYS-FN-014</td>
</tr>
<tr>
<td style="text-align: left;">1.4.3</td>
<td style="text-align: left;">Facturación POS y cobro</td>
<td style="text-align: left;">Transacción atómica ACID de venta, múltiples medios de pago y comprobante térmico.</td>
<td style="text-align: left;">SYS-FN-015–018, SYS-SC-004</td>
</tr>
<tr>
<td style="text-align: left;">1.4.4</td>
<td style="text-align: left;">Pruebas transaccionales</td>
<td style="text-align: left;">Simulación de concurrencia en mostrador (<em>P</em><sub>95</sub> ≤ 2.0 s) y compuerta G2 de I3.</td>
<td style="text-align: left;">SYS-PR-002, G1, G2</td>
</tr>
<tr>
<td style="text-align: left;"><strong>1.5</strong></td>
<td colspan="3" style="text-align: left;"><strong>Incremento I4: Posventa, Reportes, Transición y Cierre (Semanas 10–12)</strong></td>
</tr>
<tr>
<td style="text-align: left;">1.5.1</td>
<td style="text-align: left;">Posventa y garantías</td>
<td style="text-align: left;">Módulo de garantías (30 a 90 días) y devoluciones con reintegro trazable a Kardex.</td>
<td style="text-align: left;">SYS-FN-019, SYS-FN-020</td>
</tr>
<tr>
<td style="text-align: left;">1.5.2</td>
<td style="text-align: left;">Reportes y auditoría</td>
<td style="text-align: left;">Reportes de cierre diario, utilidades por línea, bitácora forense e importación/exportación.</td>
<td style="text-align: left;">SYS-FN-023–028</td>
</tr>
<tr>
<td style="text-align: left;">1.5.3</td>
<td style="text-align: left;">Continuidad operativa</td>
<td style="text-align: left;">Procedimiento automatizado de respaldo/restauración ensayado (<em>R</em><em>P</em><em>O</em> ≤ 24 h, <em>R</em><em>T</em><em>O</em> ≤ 4 h).</td>
<td style="text-align: left;">SYS-FN-029, SYS-FN-030</td>
</tr>
<tr>
<td style="text-align: left;">1.5.4</td>
<td style="text-align: left;">Cierre y transición G3</td>
<td style="text-align: left;">Manuales de usuario, capacitación presencial a cajeros/bodegueros y compuerta final G3.</td>
<td style="text-align: left;">Todos, G3</td>
</tr>
</tbody>
</table>

### Red de Precedencias y Análisis de Ruta Crítica (Método CPM)

A partir de la descomposición WBS, se formaliza la red de precedencias lógicas y se ejecuta el cálculo determinista mediante el Método de la Ruta Crítica (CPM). La jornada laboral considerada es de 8 horas diarias, 5 días hábiles semanales. Se determinan los parámetros temporales para cada actividad: Inicio Temprano ($`ES`$), Término Temprano ($`EF`$), Inicio Tardío ($`LS`$), Término Tardío ($`LF`$), Holgura Total ($`HT = LS - ES = LF - EF`$) y Holgura Libre ($`HL`$).

| **Act.** | **WBS** | **Descripción** | **Pred.** | **$`d`$** | **$`ES`$** | **$`EF`$** | **$`LS`$** | **$`LF`$** | **$`HT`$** | **$`HL`$** | **¿Crítica?** |
|:--:|:--:|:---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Act.** | **WBS** | **Descripción** | **Pred.** | **$`d`$** | **$`ES`$** | **$`EF`$** | **$`LS`$** | **$`LF`$** | **$`HT`$** | **$`HL`$** | **¿Crítica?** |
| A | 1.1 | Líneas base y entorno G0 | – | 5 | 0 | 5 | 0 | 5 | 0 | 0 | **SÍ** |
| B | 1.2.1 | Autenticación y modelo RBAC | A | 5 | 5 | 10 | 5 | 10 | 0 | 0 | **SÍ** |
| C | 1.2.2–3 | Catálogo y compatibilidad | B | 5 | 10 | 15 | 10 | 15 | 0 | 0 | **SÍ** |
| D | 1.2.4 | Respaldo básico y utilitarios | B | 3 | 10 | 13 | 12 | 15 | 2 | 2 | NO |
| E | 1.3.1–2 | Proveedores y órdenes compra | C | 5 | 15 | 20 | 15 | 20 | 0 | 0 | **SÍ** |
| F | 1.3.3 | Kardex multialmacén atómico | E | 6 | 20 | 26 | 20 | 26 | 0 | 0 | **SÍ** |
| G | 1.3.4–5 | Control físico y alertas I2 | F | 4 | 26 | 30 | 26 | 30 | 0 | 0 | **SÍ** |
| H | 1.4.1 | Turnos de caja y arqueo | G | 4 | 30 | 34 | 30 | 34 | 0 | 0 | **SÍ** |
| I | 1.4.2–3 | POS y facturación atómica | H | 7 | 34 | 41 | 34 | 41 | 0 | 0 | **SÍ** |
| J | 1.4.4 | Pruebas de estrés caja y G2 | I | 4 | 41 | 45 | 41 | 45 | 0 | 0 | **SÍ** |
| K | 1.5.1 | Posventa, garantías y dev. | J | 5 | 45 | 50 | 45 | 50 | 0 | 0 | **SÍ** |
| L | 1.5.2 | Reportes financieros y audit. | K | 5 | 50 | 55 | 50 | 55 | 0 | 0 | **SÍ** |
| M | 1.5.3 | Ensayos RPO/RTO y DR | K | 3 | 50 | 53 | 52 | 55 | 2 | 2 | NO |
| N | 1.5.4 | Manuales, traspaso y G3 | L, M | 5 | 55 | 60 | 55 | 60 | 0 | 0 | **SÍ** |

**Resultado del análisis CPM:**

- **Duración total del proyecto:** 60 días laborables (12 semanas continuas / 3.0 meses calendario).

- **Cadena de la Ruta Crítica ($`HT = 0`$):** $`A \to B \to C \to E \to F \to G \to H \to I \to J \to K \to L \to N`$.

- **Actividades con holgura ($`HT > 0`$):** Las actividades auxiliares $`D`$ (respaldo básico inicial) y $`M`$ (ensayos de recuperación ante desastres) cuentan con 2 días hábiles de holgura total y libre, lo que otorga flexibilidad operativa sin comprometer las fechas de aceptación de los incrementos I1 e I4.

### Cronograma Maestro Semanal (Diagrama Gantt Tabular)

El avance semanal y la sincronización entre entregables se detalla en el siguiente cronograma de 12 semanas, señalando las compuertas de control de calidad obligatorias (G0, G1, G2 y G3):

| **WBS** | **Paquete / Entregable** | **S1** | **S2** | **S3** | **S4** | **S5** | **S6** | **S7** | **S8** | **S9** | **S10** | **S11** | **S12** |
|:---|:---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1.1 | Líneas Base y Entorno | **G0** |  |  |  |  |  |  |  |  |  |  |  |
| 1.2.1 | Autenticación y RBAC |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.2.2 | Catálogo y compatibilidad |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.2.4 | Respaldo básico y Compuerta |  |  | **G2** |  |  |  |  |  |  |  |  |  |
| 1.3.1 | Proveedores y órdenes |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.3.3 | Kardex multialmacén |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.3.4 | Control físico y Compuerta |  |  |  |  |  | **G2** |  |  |  |  |  |  |
| 1.4.1 | Turnos de caja y denominac. |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.4.3 | Facturación POS y cobro |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.4.4 | Pruebas caja y Compuerta |  |  |  |  |  |  |  |  | **G2** |  |  |  |
| 1.5.1 | Posventa y garantías |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.5.2 | Reportes financieros y audit. |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.5.3 | Ensayos RPO/RTO |  |  |  |  |  |  |  |  |  |  |  |  |
| 1.5.4 | Cierre, Manuales y Transición |  |  |  |  |  |  |  |  |  |  |  | **G3** |

Cronograma maestro tabular por semanas (S1 a S12) y compuertas de control.

### Matriz RACI de Asignación de Responsabilidades

Con el fin de garantizar el gobierno del proyecto según ISO/IEC/IEEE 12207, se establece la asignación de responsabilidades para cada paquete de trabajo WBS entre los tres integrantes del equipo y los interesados clave:

- **AAA:** Br. Ángel Antonio Alonso Suárez (Líder de Arquitectura, Base de Datos y Backend Core).

- **NIA:** Br. Noel Isaac Alemán Carballo (Líder de Frontend, Experiencia de Usuario y Lógica Comercial).

- **MNP:** Br. Mendell Noé Parrales Molina (Líder de Aseguramiento de Calidad QA, Seguridad y Despliegue).

- **CLI:** Propietaria / Administradora de Moto Repuestos El Centenario (Cliente / Validadora de Negocio).

- **DOC:** Ing. Roberto Alfaro (Docente Titular / Evaluador Académico).

Convención de roles: **R** = Responsable de ejecución, **A** = Aprobador final (*Accountable*, exactamente uno por paquete), **C** = Consultado, **I** = Informado.

| **WBS** | **Paquete de Trabajo** | **AAA** | **NIA** | **MNP** | **CLI** | **DOC** | **Criterio de Cierre** |
|:---|:---|:--:|:--:|:--:|:--:|:--:|:---|
| **WBS** | **Paquete de Trabajo** | **AAA** | **NIA** | **MNP** | **CLI** | **DOC** | **Criterio de Cierre** |
| 1.1 | Líneas base y entorno inicial | **A** | R | R | C | **A** | Firma de documentos y Git activo |
| 1.2.1 | Autenticación y RBAC | **A** | C | R | I | I | Pruebas de acceso y sesión exitosas |
| 1.2.2 | Catálogo y compatibilidad | R | **A** | C | C | I | Búsqueda P95 validada en LAN |
| 1.2.4 | Respaldo básico y G2 de I1 | R | C | **A** | I | C | Backup restaurable sin pérdida |
| 1.3.1 | Proveedores y órdenes compra | C | **A** | R | C | I | Flujo de orden y recepción probado |
| 1.3.3 | Kardex multialmacén atómico | **A** | R | C | C | I | No negatividad y saldos exactos |
| 1.3.4 | Control físico y G2 de I2 | R | C | **A** | C | C | Concurrencia de stock sin desfase |
| 1.4.1 | Turnos de caja y arqueo | C | **A** | R | C | I | Apertura por denominaciones conforme |
| 1.4.3 | Facturación POS y cobro | **A** | R | C | C | I | Transacción ACID íntegra bajo falla |
| 1.4.4 | Pruebas de caja y G2 de I3 | R | C | **A** | C | C | Arqueo ciego y ticket conciliado |
| 1.5.1 | Posventa y garantías | C | **A** | R | C | I | Devolución limitada a venta válida |
| 1.5.2 | Reportes financieros y audit. | **A** | R | C | C | I | Cuadre exacto con contabilidad |
| 1.5.3 | Ensayos RPO/RTO y DR | R | C | **A** | I | C | Restauración documentada $`\le 4`$ h |
| 1.5.4 | Cierre, manuales y G3 | R | R | R | **A** | **A** | Acta de entrega y pase a producción |

### Conciliación Formal con la Estimación Económica COCOMO II y Contrato

Para cumplir con el principio de integridad de la ingeniería de software, la planificación temporal y de recursos se reconcilia matemáticamente con el modelo financiero y la estimación COCOMO II Post-Architecture del proyecto:

1.  **Esfuerzo de ingeniería derivado (COCOMO II):** El modelo COCOMO II Post-Architecture, evaluado sobre un tamaño de $`10.5\text{ KSLOC}`$ (105 Puntos de Función no ajustados), exponente de escala $`E = 1.0568`$ y producto de factores de costo $`\prod EM_i = 1.0772`$, establece:
    ``` math
    Esfuerzo = 2.94 \times (10.5)^{1.0568} \times 1.0772 = 9.01\text{ Personas-Mes (PM)}
    ```

2.  **Conversión a horas laborables de desarrollo:** Bajo el estándar internacional de 160 horas efectivas por Persona-Mes:
    ``` math
    Horas = 9.01\text{ PM} \times 160\text{ horas/PM} = 1,441.6\text{ horas de ingeniería}
    ```

3.  **Capacidad instalada del equipo y duración matemática:** El equipo desarrollador está compuesto por 3 ingenieros con dedicación completa ($`3 \times 160 = 480\text{ horas/mes}`$ del equipo). La duración matemática requerida para absorber el esfuerzo es:
    ``` math
    Duraci\acute{o}n = \frac{1,441.6\text{ horas}}{480\text{ horas/mes}} = 3.003\text{ meses} \approx 3.0\text{ meses calendario}
    ```
    Dicho resultado equivale exactamente a las **12 semanas (60 días hábiles)** formalizadas en la red CPM y el cronograma Gantt.

4.  **Conciliación financiera y presupuesto contractual:** Considerando la tarifa fijada en el contrato de \$300.00 USD por Persona-Mes:
    ``` math
    Costo_{Desarrollo} = 9.01\text{ PM} \times \$300.00\text{ USD/PM} = \$2,703.00\text{ USD} \approx \$2,700.00\text{ USD}
    ```
    Esta cifra coincide con el renglón de honorarios de desarrollo de la Inversión Inicial ($`I_0 = \$13,662.14\text{ USD}`$) documentado en el Modelo Financiero, demostrando consistencia entre los requerimientos, la arquitectura, el cronograma y el presupuesto.

## Verificación y validación por incremento

La disciplina de verificación se inspira en la correspondencia del modelo en V sin adoptar su secuencia única de entrega. El vínculo se registra antes de implementar y se revisa en cada puerta de aceptación.

| **Entrada de ingeniería** | **Prueba/evaluación asociada** | **Evidencia mínima** |
|:---|:---|:---|
| StRS y necesidad del negocio | Demostración y validación con representante designado. | Escenario, observación, decisión, fecha y responsable. |
| SyRS funcional y de calidad | Prueba de sistema y medición cuantitativa. | Caso, datos, ambiente, resultado, umbral y defecto. |
| DA-MREC-001 y contratos internos | Prueba de integración, seguridad y arquitectura. | Interfaz versionada, resultado, dependencias y excepción. |
| SRS y reglas de dominio | Prueba unitaria y de componente. | Casos válidos, inválidos y límites; trazabilidad al ID. |
| Versión desplegable | Regresión, respaldo/restauración y revisión de operación. | Informe de regresión, copia verificable y procedimiento. |

### Puertas de control

| **ID** | **Momento** | **Condición para avanzar** | **Responsable propuesto** |
|:---|:---|:---|:---|
| G0 | Antes de I1 | Requisitos y DA vigentes, alcance del incremento, responsables y pruebas acordadas. | Equipo y aprobador académico |
| G1 | Antes de integrar cada incremento | Diseño compatible, migración revisada, pruebas unitarias y revisión de permisos. | Equipo técnico |
| G2 | Antes de aceptación | Pruebas de integración, sistema, regresión, calidad aplicable y RTM actualizada. | Equipo y revisor designado |
| G3 | Antes de transición | I1–I4 aceptados, carga, concurrencia, recuperación, periféricos, manuales y riesgos residuales evaluados. | Negocio, equipo y docente |

Las compuertas de control establecen criterios formales y objetivos de evaluación, administrados según la asignación de responsabilidades de la matriz RACI (sección <a href="#sec:raci" data-reference-type="ref" data-reference="sec:raci">7.8</a>), garantizando la conformidad antes de autorizar el avance hacia el siguiente incremento.

## Trazabilidad con requisitos y arquitectura

| **Familia de requisito** | **Inc.** | **Decisión/vista de DA-MREC-001** | **Comprobación dominante** |
|:---|:---|:---|:---|
| **Familia de requisito** | **Inc.** | **Decisión/vista de DA-MREC-001** | **Comprobación dominante** |
| Identidad, RBAC y seguridad; SYS-FN-001/002, SYS-SC-001–005 | I1–I4 | PA-04, V-02, V-04, V-05 | Prueba de permisos, sesión, bloqueo, cifrado y regresión por rol. |
| Catálogo y compatibilidad; SYS-FN-003–005 | I1 | V-02, V-03 | Códigos únicos, relaciones válidas, búsqueda P95. |
| Compras e inventario; SYS-FN-006–012 | I2 | PA-03/05, V-03, V-04 | Recepción y Kardex vinculados, conteos, saldos, concurrencia. |
| Cotización, venta y caja; SYS-FN-013–018, 021/022 | I3 | PA-03/04/05, V-03, V-04 | Transacción completa o reversión, totales exactos, turno y comprobante. |
| Posventa; SYS-FN-019/020 | I4 | V-02, V-03, V-04 | Límite de devolución, autorización y compensación. |
| Auditoría/reportes; SYS-FN-023/024 | I1–I4 | PA-05/07, V-03, V-04 | Eventos correlacionados y reportes reconciliados. |
| Intercambio y continuidad; SYS-FN-025–030 | I1/I4 | PA-06/08, V-05 | Importación/exportación validada, copia, RPO 24 h y RTO 4 h. |
| Calidad de uso, rendimiento y disponibilidad; SYS-PR-001–008 | I1–I4 | V-02, V-04, V-05 | Carga progresiva, prueba con usuarios, disponibilidad medida. |

La matriz del documento 2 conserva la trazabilidad StRS–SyRS–SRS. Esta tabla añade la relación con incremento y vista arquitectónica; no renumera ni reemplaza requisitos oficiales. La RTM de ejecución deberá incorporar caso de prueba, versión y estado de aceptación por cada ID.

## Gobierno, responsabilidades y cambios

### Responsabilidades propuestas

| **Función** | **Responsabilidad** |
|:---|:---|
| Equipo técnico de tres integrantes | Estimar, diseñar, implementar, probar, actualizar documentación y presentar evidencia conforme a la asignación de la matriz RACI (sección <a href="#sec:raci" data-reference-type="ref" data-reference="sec:raci">7.8</a>). |
| Responsable de requisitos y RTM | Mantener identificadores, versiones, criterios y enlaces a pruebas; función asignable a un integrante, sin inventar un nuevo cargo externo. |
| Representante del negocio designado | Confirmar reglas comerciales, observar demostraciones y aprobar o rechazar cambios de negocio según autoridad delegada. |
| Docente evaluador | Revisar entregables académicos y decisiones sujetas a aprobación docente. |
| Responsable de operación designado | Validar instalación, permisos físicos, copia, restauración y soporte antes de transición. |

### Flujo de cambio

Una solicitud deberá registrar origen, motivo, IDs afectados, urgencia y evidencia. El equipo analizará impacto en arquitectura, datos, incremento, pruebas, costo y plazo. La autoridad correspondiente decidirá aceptar, diferir o rechazar. Si se acepta, se actualizarán REQ-MREC-001 y/o DA-MREC-001 mediante nueva versión aprobada, así como RTM, diseño, plan y pruebas. Los IDs retirados permanecerán como referencia histórica y no se reutilizarán.

## Medición, riesgos y condiciones de revisión

### Indicadores de seguimiento

| **Indicador** | **Cálculo o evidencia** | **Uso de decisión** |
|:---|:---|:---|
| Cobertura de trazabilidad | Requisitos asignados a diseño, incremento y prueba / requisitos del alcance. | No cerrar G2 con enlaces faltantes. |
| Cumplimiento de aceptación | Casos obligatorios aprobados / casos ejecutados, más lista de defectos críticos. | Rechazar o condicionar entrega según severidad. |
| Variación de alcance | Requisitos nuevos, modificados o retirados por incremento. | Reestimar secuencia y revisar líneas base. |
| Defectos reabiertos | Defectos que reaparecen después de corrección o regresión. | Mejorar prueba y análisis de causa. |
| Rendimiento y recuperación | P95 medido, RPO/RTO ensayados y disponibilidad observada. | Contrastar objetivos oficiales antes de transición. |

### Riesgos del modelo elegido

| **ID** | **Riesgo** | **Mitigación** | **Señal de revisión** |
|:---|:---|:---|:---|
| **ID** | **Riesgo** | **Mitigación** | **Señal de revisión** |
| RM-01 | Incrementos divididos por pantallas o tablas dejan valor incompleto. | Definir escenarios verticales y criterios de aceptación antes de iniciar. | Dos entregas sucesivas sin flujo utilizable. |
| RM-02 | Acoplamiento entre módulos erosiona DA-MREC-001. | Revisar dependencias y contratos en G1; actualizar decisiones si es necesario. | Acceso directo repetido a datos ajenos. |
| RM-03 | Venta concurrida expone stock negativo o efectos parciales. | Probar transacciones y fallas inducidas en I2/I3, no solo al final. | Caso crítico falla o no es reproducible. |
| RM-04 | Cambios aprobados superan la capacidad estimada. | Analizar impacto y reordenar incrementos con autoridad registrada. | Crecimiento sostenido del alcance o retraso reiterado. |
| RM-05 | Representante del negocio no disponible para validar. | Acordar ventanas y suplencia antes de G2; documentar aceptación pendiente. | Demostración sin decisor habilitado. |
| RM-06 | Respaldo existe pero no permite recuperación. | Ejecutar ensayo de restauración y registrar RPO/RTO. | Falla de integridad o supera objetivo. |

Si la ejecución muestra riesgos no manejables con incrementos ordinarios, se revisará formalmente el modelo. Ejemplos: un riesgo técnico dominante que requiera exploración sistemática puede justificar una vuelta de análisis propia de espiral; una exigencia externa de verificación de alta criticidad puede justificar predominio del V; un cambio radical de equipo y gobierno puede justificar otro marco. La revisión debe basarse en evidencia, no en preferencia terminológica.

## Conclusiones y decisión registrada

La decisión MET-MREC-001 v2.0 ratifica la adopción del **modelo incremental controlado**. Su ventaja en este caso es construir una cadena de capacidades comerciales verificables sobre la arquitectura modular aprobada, entregando valor temprano y descubriendo fallos de integración antes de la transición operativa. Las reglas de negocio, la seguridad y la integridad transaccional acompañan cada incremento; la documentación y las pruebas se mantienen trazadas a sus identificadores originales.

Cascada y V se descartan como modelos rectores por concentración de entrega; espiral y UP/RUP por sobrecosto de gestión frente al tamaño y riesgo del proyecto. Scrum queda expresamente descartado como marco de gestión bajo las condiciones justificadas. Con la integración de la WBS de 4 niveles, el cálculo CPM de ruta crítica en 60 días hábiles (12 semanas / 3.0 meses calendario), la matriz RACI nominal y la conciliación matemática con COCOMO II (9.01 PM, \$2,700 USD), la planificación metodológica queda formalmente cerrada, calibrada y lista para la ejecución de la compuerta G0 y el despliegue del Incremento I1.

## Aprobación de la línea base

<table>
<tbody>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Ángel Antonio Alonso Suárez</td>
<td style="text-align: left;">Br. Noel Isaac Alemán Carballo</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2021-0087U</td>
<td style="text-align: left;">Carnet 2022-0376U</td>
</tr>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Mendell Noé Parrales Molina</td>
<td style="text-align: left;">Ing. Roberto Alfaro</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2020-1014U</td>
<td style="text-align: left;">Docente titular</td>
</tr>
</tbody>
</table>

## Referencias bibliográficas

1.  Equipo Moto Repuestos El Centenario. (2026). *Especificación integral de requisitos StRS, SyRS y SRS, REQ-MREC-001 v1.0*. Universidad Nacional de Ingeniería.

2.  Equipo Moto Repuestos El Centenario. (2026). *Descripción de Arquitectura de Software, DA-MREC-001 v1.0*. Universidad Nacional de Ingeniería.

3.  IEEE Computer Society. (2025). *Guide to the Software Engineering Body of Knowledge, SWEBOK Guide V4.0a*, capítulo 10, Software Engineering Process. Material de clase: *Modelos de Ciclo de Vida y Proceso de Software*.

4.  ISO/IEC/IEEE. (2017). *ISO/IEC/IEEE 12207:2017, Systems and software engineering – Software life cycle processes*.

5.  ISO/IEC/IEEE. (2011). *ISO/IEC/IEEE 29148:2011, Systems and software engineering – Life cycle processes – Requirements engineering*.

6.  Schwaber, K., y Sutherland, J. (2020). *The Scrum Guide*. <https://scrumguides.org/scrum-guide.html>.

---

# Capítulo 06: Análisis del Modelo de Lenguaje

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
MET-MREC-001 v1.0  
**Versión:** 1.0  
**Estado:** Análisis y decisión propuesta


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha:** 23 de septiembre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Quinto documento de la serie – Ingeniería de Software 1**  
Análisis previo al documento de diseño


## Identificación y control del documento

| **Campo** | **Valor** |
|:---|:---|
| Identificador | LM-MREC-001 |
| Título único | Análisis y selección del lenguaje de modelado para Moto Repuestos El Centenario |
| Versión y fecha | 1.0 – 23 de septiembre de 2026 |
| Entradas oficiales | REQ-MREC-001, DA-MREC-001 y MET-MREC-001, todas v1.0. |
| Salida vinculada | DD-MREC-001 v1.0, documentación de diseño del modelo aplicado. |
| Decisión | Usar UML 2.5.1 como lenguaje de modelado de propósito general, con un subconjunto y convenciones de dominio documentadas; no crear un DSML nuevo ni declarar un perfil UML normativo. |
| Estado | Propuesta académica de análisis; no acredita construcción ni validación en producción. |

### Historial de versiones

| **Versión** | **Fecha** | **Descripción** | **Responsables** |
|:---|:---|:---|:---|
| 1.0 | 23/09/2026 | Evaluación de alternativas, elección de UML y contrato de modelado para diseño. | Equipo de trabajo |

### Aprobaciones previstas

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Representante académico | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada por Moto Repuestos El Centenario | Firma y fecha |

## Resumen ejecutivo

El lenguaje seleccionado es **UML 2.5.1**, empleado de forma selectiva. Permitirá describir actores y objetivos, estructura conceptual, estados comerciales, interacciones críticas y despliegue local sin crear una infraestructura de ingeniería de lenguajes. Las reglas que UML no garantiza por sí solo se escribirán como invariantes verificables y se enlazarán a identificadores de requisitos. El resultado no reemplaza REQ-MREC-001 ni modifica DA-MREC-001; es una representación de diseño subordinada a ambas líneas base.

Se evaluaron UML estándar, un perfil UML específico y un DSML autónomo. El material docente muestra diferencias orientativas entre GPML y DSML; sus frases sobre generación de código, aprendizaje o productividad se tratan como hipótesis dependientes de herramientas, dominio y experiencia, no como garantías. Para el equipo de tres integrantes y una única solución comercial local, el costo de construir y mantener un lenguaje nuevo supera su utilidad demostrable. La propuesta aplica al modelo incremental controlado de MET-MREC-001: el diseño se amplía por incremento y se verifica contra requisitos y arquitectura.

## Objeto, alcance y límites

### Pregunta de decisión

La pregunta no es qué lenguaje de programación o qué gestor de datos usar, sino *con qué lenguaje de modelado expresar de manera comprensible, trazable y verificable el diseño del sistema*. No se seleccionan aquí framework, DBMS, herramienta CASE ni generador de código: DA-MREC-001 mantiene abiertas las decisiones tecnológicas concretas.

La salida de este análisis es un contrato de notación para DD-MREC-001. Incluye tipos de diagramas, reglas de nomenclatura, trazabilidad y comprobaciones. No se pretende modelar los 14 tipos de diagramas UML ni desarrollar un producto mediante MDE; se seleccionan solo las vistas que resuelven preocupaciones de este proyecto.

### Fuentes y jerarquía

| **Fuente** | **Uso permitido** | **Límite** |
|:---|:---|:---|
| REQ-MREC-001 | Necesidades StRS, SyRS, SRS y reglas RN-01–RN-15. | No se renumeran ni redefinen requisitos. |
| DA-MREC-001 | Arquitectura monolítica modular en capas, vistas V-01–V-05 y principios PA-01–PA-08. | No se inventa un estilo alternativo. |
| MET-MREC-001 | Modelo incremental controlado, incrementos I1–I4 y puertas de control. | No se atribuyen fechas de construcción inexistentes. |
| Informe y lámina docente | Comparación conceptual de GPML, perfil UML y DSML. | Son material didáctico, no plantilla ni norma contractual. |
| OMG UML 2.5.1 | Semántica y sintaxis de UML estándar. | La conformidad requiere modelos válidos; una tabla descriptiva no basta. |

## Necesidades concretas de modelado

El negocio combina catálogo y compatibilidad de vehículos; proveedores, compra y recepción parcial; stock con Kardex; cotización, venta y múltiples pagos; caja; devolución y garantía; reportes, auditoría y recuperación. Las relaciones clave no son solo entidades: incluyen estados, autorizaciones, concurrencia y efectos transaccionales.

| **ID** | **Necesidad de representación** | **Ancla oficial** | **Vista requerida** |
|:---|:---|:---|:---|
| **ID** | **Necesidad de representación** | **Ancla oficial** | **Vista requerida** |
| ML-01 | Actores, límites y objetivos de uso. | ST-REQ-001–016; DA V-01. | Casos de uso y contexto. |
| ML-02 | Propiedad de datos, asociaciones y multiplicidades. | SYS-FN-003–024; RN-03/04/10/13; DA V-03. | Clases conceptuales. |
| ML-03 | Venta y recepción sin efectos parciales. | RN-01/02/07/08; SRS-VNT-006; DA PA-03/05. | Secuencia y restricciones. |
| ML-04 | Transiciones y autorizaciones de venta, compra, caja y devolución. | SYS-MD-002; RN-06/09/12/13. | Máquinas de estados. |
| ML-05 | Capas, módulos e interfaces internas. | DA V-02, PA-01/02/08. | Componentes. |
| ML-06 | Servidor local, terminales, LAN y respaldo. | DA V-05, PA-06; SYS-PR-006/007. | Despliegue. |
| ML-07 | Vínculo entre diagrama, requisito y prueba por incremento. | REQ RTM; MET I1–I4, G0–G3. | Trazabilidad externa. |

## Alternativas correctamente delimitadas

### UML estándar como GPML

UML proporciona elementos para casos de uso, estructura, comportamiento, componentes y despliegue. Su amplitud evita diseñar sintaxis propia, pero la semántica comercial de *stock disponible*, *venta confirmada* o *devolución autorizada* debe definirse mediante vocabulario, invariantes y criterios de aceptación del proyecto. Un diagrama técnicamente válido podría incumplir RN-01; por eso la validación de dominio es separada de la corrección sintáctica.

### Perfil UML específico

Un perfil podría incorporar estereotipos como `<<DocumentoComercial>>` o `<<MovimientoStock>>`, valores etiquetados y restricciones. Sería razonable si existieran muchos proyectos similares y una herramienta capaz de aplicar el perfil. En esta entrega, crear un perfil formal exigiría definir metaclases extendidas, reglas, versiones y pruebas de portabilidad. Un vocabulario controlado y anotaciones simples satisfacen el alcance sin afirmar falsamente conformidad con un perfil normativo.

### DSML autónomo

Un lenguaje dedicado podría ofrecer elementos cercanos a *Factura*, *Kardex* o *TurnoCaja* y validadores específicos. A cambio exige metamodelo, sintaxis concreta, editor, serialización, reglas de validación, migraciones y mantenimiento. No hay una línea de productos ni automatización de generación requerida en REQ-MREC-001. Construirlo introduciría otro producto a diseñar y verificar antes de modelar el sistema principal.

### Alternativas que no son equivalentes

SysML atiende ingeniería de sistemas más amplia, con hardware y restricciones paramétricas; no aparece necesidad de ese alcance en las líneas base. BPMN puede aclarar procesos de negocio, pero no sustituye clases, estados y componentes del software. ER ayuda al esquema relacional futuro, pero no representa por sí mismo el comportamiento o la interacción. PlantUML, Mermaid o una herramienta CASE son medios de edición, no lenguajes alternativos al mismo nivel de decisión. La elección metodológica incremental de MET-MREC-001 es independiente de la notación.

## Criterios, puntuación y decisión

Se utiliza una escala ordinal de 1 (ajuste débil) a 5 (ajuste fuerte). Los pesos son juicio de planificación del equipo, no medidas empíricas. El máximo es 100: cada calificación se multiplica por su peso y se divide entre 5.

<table>
<thead>
<tr>
<th style="text-align: left;"><strong>ID</strong></th>
<th style="text-align: left;"><strong>Criterio</strong></th>
<th style="text-align: left;"><strong>Peso</strong></th>
<th style="text-align: left;"><strong>Pregunta de evaluación</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">C-01</td>
<td style="text-align: left;">Expresividad suficiente del dominio</td>
<td style="text-align: left;">20</td>
<td style="text-align: left;">¿Representa reglas y relaciones sin construir infraestructura nueva?</td>
</tr>
<tr>
<td style="text-align: left;">C-02</td>
<td style="text-align: left;">Trazabilidad y verificabilidad</td>
<td style="text-align: left;">20</td>
<td style="text-align: left;">¿Permite enlazar elementos a requisitos y casos de prueba?</td>
</tr>
<tr>
<td style="text-align: left;">C-03</td>
<td style="text-align: left;">Alineación con DA-MREC-001</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">¿Representa capas, módulos, flujos y despliegue?</td>
</tr>
<tr>
<td style="text-align: left;">C-04</td>
<td style="text-align: left;">Costo de adopción y mantenimiento</td>
<td style="text-align: left;">15</td>
<td style="text-align: left;">¿Es proporcional a un equipo de tres y un sistema?</td>
</tr>
<tr>
<td style="text-align: left;">C-05</td>
<td style="text-align: left;">Comprensibilidad para revisores</td>
<td style="text-align: left;">10</td>
<td style="text-align: left;">¿Puede explicarse a docente y negocio con glosario?</td>
</tr>
<tr>
<td style="text-align: left;">C-06</td>
<td style="text-align: left;">Intercambio y longevidad</td>
<td style="text-align: left;">10</td>
<td style="text-align: left;">¿Evita dependencia de un editor específico?</td>
</tr>
<tr>
<td style="text-align: left;">C-07</td>
<td style="text-align: left;">Restricciones de dominio verificables</td>
<td style="text-align: left;">10</td>
<td style="text-align: left;">¿Expresa invariantes y reglas comprobables?</td>
</tr>
<tr>
<td colspan="2" style="text-align: right;"><strong>Total</strong></td>
<td style="text-align: left;"><strong>100</strong></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

| **Alternativa** | **C1** | **C2** | **C3** | **C4** | **C5** | **C6** | **C7** | **Total** |
|:----------------|-------:|-------:|-------:|-------:|-------:|-------:|-------:|----------:|
| UML estándar    |      4 |      5 |      5 |      5 |      4 |      5 |      3 |        90 |
| Perfil UML      |      5 |      5 |      5 |      3 |      3 |      4 |      4 |        86 |
| DSML autónomo   |      5 |      4 |      3 |      1 |      2 |      2 |      5 |        66 |

Puntuación ponderada sobre 100.

El perfil UML mejora la precisión específica, pero pierde proporcionalidad al exigir definición y gobierno. El DSML puede verificar reglas propias del negocio, pero su editor y metamodelo tienen costo elevado para esta escala. **UML estándar obtiene 90/100 y se selecciona**. La ventaja de cuatro puntos frente al perfil es pequeña: si se demuestra una familia de sistemas o reutilización extensa, deberá recalcularse la matriz antes de cambiar la línea base.

### Sensibilidad y límites de la matriz

Si C-07 creciera mucho y C-04 disminuyera, un perfil podría superar a UML estándar. La decisión no depende exclusivamente del total: existe un requisito de mantener la entrega autocontenida y revisable sin infraestructura adicional. Los puntajes deben considerarse hipótesis de adecuación. Su validación ocurre cuando los modelos resultantes describen sin contradicción una venta concurrente, una devolución vinculada y una restauración.

## Lectura crítica del material docente

El informe *Lenguajes de Modelado de Propósito General y Específicos de Dominio* y la imagen comparativa son fuentes de orientación. Su distinción entre generalidad y especificidad ayuda a plantear alternativas, pero varias propiedades se presentan de modo absoluto. Para esta decisión se aplican las siguientes precisiones:

| **Afirmación orientativa** | **Interpretación prudente para el proyecto** | **Consecuencia** |
|:---|:---|:---|
| **Afirmación orientativa** | **Interpretación prudente para el proyecto** | **Consecuencia** |
| DSML genera código completo. | La generación depende de generadores, cobertura y pruebas; un DSML por sí solo no produce un sistema comercial seguro. | No se le atribuye ahorro no demostrado. |
| DSML tiene aprendizaje más suave. | Puede ser más familiar al negocio, mientras el equipo debe aprender y mantener el metamodelo y la herramienta. | Se distingue usuario del lenguaje y creador. |
| UML es menos productivo. | La productividad depende del subconjunto, herramienta, experiencia y propósito del modelo. | Se evita modelar diagramas sin utilidad. |
| UML es independiente de plataforma. | Un modelo conceptual puede serlo; despliegue e interfaces reales necesariamente describen tecnología y nodos. | Se etiquetan niveles de abstracción. |
| DSML es menos flexible. | Su restricción es deliberada; puede ser una ventaja para detectar modelos inválidos. | No se penaliza la precisión por sí misma. |

Las cifras y casos industriales del informe no se trasladan como evidencia cuantitativa de nuestro negocio. No se prometen porcentajes de reducción de tiempo ni generación automática de código.

## Contrato de modelado para DD-MREC-001

### Subconjunto UML y propósito

| **Modelo** | **Pregunta que responde** | **Verificación mínima** |
|:---|:---|:---|
| Casos de uso | ¿Qué objetivo persigue cada actor autorizado? | Actor, frontera, pre/postcondición y requisito. |
| Clases conceptuales | ¿Qué información y asociaciones necesita el negocio? | Multiplicidades, identidad, estados, invariantes. |
| Componentes | ¿Qué módulo posee cada capacidad y contrato? | Dependencias compatibles con PA-01/02. |
| Secuencia | ¿En qué orden ocurren validaciones y efectos? | Éxito y falla de venta, recepción y devolución. |
| Estados | ¿Qué transiciones están permitidas? | Guardas, autorización y efectos por transición. |
| Actividades | ¿Dónde se decide, espera o aprueba? | Ramas y caminos alternos observables. |
| Despliegue | ¿Dónde residen servicio, datos, terminal y respaldo? | Nodos, enlaces y ausencia de Internet crítico. |

### Reglas de representación

Cada modelo tendrá identificador `M-[tipo]-NN`, propósito, versión, alcance y lista de IDs fuente. Los nombres del dominio usarán el glosario de REQ-MREC-001; no se crearán sinónimos incompatibles (por ejemplo, *stock* y *existencia* se declararán equivalentes o se elegirá uno). En diagramas de clases se mostrarán multiplicidades; en estados se anotarán evento, guarda y efecto; en secuencias se destacarán límite transaccional y alternativa de error. Las restricciones se escribirán con lenguaje natural preciso o notación formal acompañada de interpretación; toda restricción crítica tendrá prueba asociada. Las anotaciones `<<interno>>`, `<<sensible>>` y similares serán convenciones visuales del proyecto, *no* un perfil UML formal.

### Trazabilidad y control

La cadena requerida es **ID de requisito $`\rightarrow`$ elemento de modelo $`\rightarrow`$ regla o decisión DA $`\rightarrow`$ prueba $`\rightarrow`$ incremento**. La tabla de trazabilidad de DD-MREC-001 complementará la RTM oficial; no sustituirá sus identificadores. Todo cambio de modelo que altere regla, interfaz o dependencia se someterá al flujo de cambios de MET-MREC-001 y a análisis de impacto en REQ-MREC-001 y DA-MREC-001. La aceptación académica no equivale a aceptación del negocio ni a prueba de ejecución.

## Riesgos y condiciones de revisión

| **ID** | **Riesgo** | **Control y disparador** |
|:---|:---|:---|
| RL-01 | Diagramas correctos en UML, pero inválidos para RN-01/07/13. | Revisar invariantes y casos negativos; corregir antes de G1/G2. |
| RL-02 | Exceso de diagramas sin decisión verificable. | Exigir pregunta, requisito y prueba; retirar vista redundante. |
| RL-03 | Anotaciones propias interpretadas como perfil formal. | Rotularlas como convenciones y mantener glosario. |
| RL-04 | Modelo divergente de arquitectura o requisitos. | Auditar trazabilidad en cada incremento y registrar cambio aprobado. |
| RL-05 | Necesidad repetida de validación automática específica. | Revisar viabilidad de perfil UML solo con caso de reutilización y capacidad de mantenimiento demostrados. |

## Conclusión y decisión registrada

LM-MREC-001 v1.0 adopta **UML 2.5.1 con subconjunto controlado y reglas de dominio trazables**. La elección evita construir un DSML para un único proyecto, mantiene legibilidad e intercambio, y permite describir las vistas de DA-MREC-001 con suficiente precisión siempre que RN-01–RN-15 y los requisitos SRS se validen por separado. DD-MREC-001 aplica esta decisión al diseño; la secuencia de elaboración sigue I1–I4 de MET-MREC-001. Ninguna afirmación de generación de código o ejecución automática queda autorizada por este documento.

## Aprobación de la línea base

<table>
<tbody>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Ángel Antonio Alonso Suárez</td>
<td style="text-align: left;">Br. Noel Isaac Alemán Carballo</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2021-0087U</td>
<td style="text-align: left;">Carnet 2022-0376U</td>
</tr>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Mendell Noé Parrales Molina</td>
<td style="text-align: left;">Ing. Roberto Alfaro</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2020-1014U</td>
<td style="text-align: left;">Docente titular</td>
</tr>
</tbody>
</table>

## Referencias

1.  Equipo Moto Repuestos El Centenario. (2026). *REQ-MREC-001 v1.0: requisitos StRS, SyRS y SRS*. UNI.

2.  Equipo Moto Repuestos El Centenario. (2026). *DA-MREC-001 v1.0: arquitectura de software*. UNI.

3.  Equipo Moto Repuestos El Centenario. (2026). *MET-MREC-001 v1.0: elección metodológica*. UNI.

4.  Material docente. (2026). *Lenguajes de Modelado de Propósito General y Específicos de Dominio* (`informe.pdf`) y lámina *UML vs DSM/DSML*.

5.  Object Management Group. (2017). *UML 2.5.1*. <https://www.omg.org/spec/UML/2.5.1/>.

---

# Capítulo 07: Documentación de Diseño

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
MET-MREC-001 v1.0  
LM-MREC-001 v1.0  
**Versión:** 1.0  
**Estado:** Diseño propuesto, sin implementación


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha:** 23 de septiembre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Sexto documento de la serie – Ingeniería de Software 1**  
Continuación del análisis del lenguaje de modelado


## Identificación y control del documento

| **Campo** | **Valor** |
|:---|:---|
| Identificador | DD-MREC-001 |
| Título único | Documentación de diseño del sistema Moto Repuestos El Centenario |
| Versión y fecha | 1.0 – 23 de septiembre de 2026 |
| Entradas oficiales | REQ-MREC-001, DA-MREC-001, MET-MREC-001 y LM-MREC-001, todas v1.0. |
| Lenguaje | UML 2.5.1 selectivo con convenciones y restricciones de dominio documentadas. |
| Alcance | Modelo de diseño lógico, conductual y de despliegue previsto; no es esquema físico, código ni resultado de prueba. |
| Estado | Propuesta para revisión académica y validación con negocio antes de implementación. |

### Historial de versiones

| **Versión** | **Fecha** | **Descripción** | **Responsables** |
|:---|:---|:---|:---|
| 1.0 | 23/09/2026 | Modelo de casos de uso, componentes, información, estados, secuencias, despliegue y trazabilidad. | Equipo de trabajo |

### Aprobaciones previstas

| **Rol** | **Nombre** | **Constancia** |
|:---|:---|:---|
| Representante académico | Ing. Roberto Alfaro | Firma y fecha |
| Equipo responsable | Ángel A. Alonso; Noel I. Alemán; Mendell N. Parrales | Firma y fecha |
| Representante del negocio | Propietaria o persona delegada por Moto Repuestos El Centenario | Firma y fecha |

## Resumen ejecutivo

Este documento aplica la decisión LM-MREC-001: UML estándar, limitado a modelos que resuelven preguntas del sistema comercial. Se describen actores y objetivos; módulos e interfaces de una arquitectura monolítica modular en capas; clases conceptuales, relaciones e invariantes; secuencias y estados de operaciones sensibles; despliegue LAN y recuperación. Cada modelo tiene un identificador y una cadena de trazabilidad hacia REQ-MREC-001, DA-MREC-001 y los incrementos I1–I4 de MET-MREC-001.

El diseño es deliberadamente lógico. No elige lenguaje de programación, DBMS, esquema físico, proveedor de nube ni marca de periféricos. Los diagramas son propuestas, no evidencia de implementación. La verificación de los flujos críticos y la aprobación del negocio serán necesarias antes de construir cada incremento.

## Alcance y reglas de lectura

### Frontera del diseño

El sistema administra catálogo de repuestos y compatibilidad, compras, inventario, cotizaciones, ventas y pagos, caja, devoluciones, auditoría, reportes y copias. No se modelan pagos bancarios en línea ni comercio electrónico porque no constan como capacidades aprobadas. El servidor local, la base relacional y las terminales LAN responden a DA-MREC-001; la elección exacta de herramientas permanece pendiente.

### Catálogo de modelos

| **ID** | **Modelo y pregunta** | **Línea base/visión** |
|:---|:---|:---|
| M-UC-01 | Casos de uso: quién solicita cada resultado. | REQ StRS/SyRS; DA V-01. |
| M-CMP-01 | Componentes: quién posee reglas y datos. | DA V-02; PA-01/02/08. |
| M-CLS-01 | Clases conceptuales: qué se conserva y relaciona. | REQ RN-01–15; DA V-03. |
| M-SEQ-01 | Secuencia de venta confirmada y falla. | SRS-VNT-001–008; DA V-04. |
| M-SEQ-02 | Secuencia de recepción parcial. | SRS-COM-001–003; DA V-04. |
| M-STM-01 | Estados de venta y guardas. | SYS-MD-002; DA V-04. |
| M-STM-02 | Estados de devolución y caja. | RN-09/12/13; DA V-04. |
| M-DEP-01 | Despliegue y recuperación. | DA V-05; SYS-PR-006/007. |

La notación `M-…` es identificador documental; no introduce un perfil UML formal. En todas las vistas, los atributos y estados son conceptuales, y un ID SRS es una obligación de comportamiento, no una columna de base de datos.

## M-UC-01: actores y objetivos

| **Actor** | **Objetivo observable** | **Precondición o límite** | **Requisito** |
|:---|:---|:---|:---|
| **Actor** | **Objetivo observable** | **Precondición o límite** | **Requisito** |
| Vendedor | Consultar catálogo y compatibilidad; cotizar; registrar venta; emitir comprobante. | Cuenta activa y permisos; turno abierto si política activa. | ST-REQ-001–004/014 |
| Cajero autorizado | Abrir/cerrar turno y conciliar medios de pago. | No existe turno equivalente abierto; diferencia exige motivo/aprobación. | ST-REQ-012 |
| Bodeguero | Recibir compra, contar existencias, proponer ajuste. | Una orden válida y permiso; ajuste no afecta stock antes de aprobación. | ST-REQ-005/006 |
| Gerencia | Administrar precios, permisos, autorizaciones y reportes. | No aprobar operación sensible propia cuando aplica doble rol. | ST-REQ-007–010 |
| Cliente | Recibir cotización o comprobante; solicitar devolución. | No opera directamente el sistema; personal autorizado registra solicitud. | ST-REQ-003/004/011 |
| Administrador operativo | Verificar copias, restaurar y diagnosticar fallos. | Modo Recuperación y confirmación reforzada para restauración. | ST-REQ-013/016 |

**CU-VENTA Confirmar venta.** Disparador: vendedor solicita cobro de un borrador. Precondiciones: autenticación, permiso, turno cuando corresponda, líneas válidas y precios vigentes. Éxito: factura única, pagos exactos, salidas de Kardex y auditoría confirmados juntos; comprobante recuperable. Alternos: falta de stock, pago no conciliado, descuento sin autorización o fallo de persistencia dejan el borrador sin efectos confirmados. Poscondición de error: no hay stock negativo ni registros parciales. Referencias: RN-01/02/07/08/09, SRS-VNT-001–008 y M-SEQ-01.

## M-CMP-01: componentes y contratos

La arquitectura es **un despliegue único modular en capas**, no microservicios. El componente de presentación solicita operaciones a interfaces de aplicación. Cada módulo posee reglas y datos; la persistencia se accede por repositorios/contratos del módulo propietario. No se permite que una pantalla actualice tablas directamente ni que un módulo consulte tablas privadas de otro.

<figure>

<figcaption>M-CMP-01: capas y responsabilidades lógicas, consistente con DA V-02.</figcaption>
</figure>

| **Módulo dueño** | **Contrato de entrada/salida** | **Restricción** |
|:---|:---|:---|
| Identidad/RBAC | Autenticar, autorizar, desactivar cuenta y registrar actor. | Denegar por defecto; historial preservado. |
| Catálogo | Consultar producto, precio vigente y compatibilidad. | Código único; rangos válidos. |
| Compras | Ordenar, recibir parcial y registrar costo histórico. | No exceder orden sin autorización. |
| Inventario | Consultar saldo; reservar/bloquear; confirmar movimiento y alerta. | Saldo no negativo; Kardex compensatorio. |
| Ventas | Cotizar, calcular total, validar pago, confirmar factura. | Unidad transaccional con inventario. |
| Caja/Auditoría | Administrar turno, conciliación y evento sensible. | Actor, motivo y antes/después conservados. |
| Posventa | Resolver devolución vinculada a factura. | No exceder saldo devolvible. |

## M-CLS-01: información y asociaciones

Este es un *modelo conceptual de clases* UML. Atributos y relaciones muestran significado, no nombres definitivos de tablas. El esquema físico se diseñará por incremento y deberá respetar las invariantes. Las identidades son estables y las referencias históricas no se borran físicamente.

| **Clase conceptual** | **Atributos esenciales** | **Asociación y multiplicidad** |
|:---|:---|:---|
| **Clase conceptual** | **Atributos esenciales** | **Asociación y multiplicidad** |
| Usuario, Rol | ID, estado, credencial protegida; rol, permisos. | Usuario 1..\* Rol; Usuario 0..\* EventoAuditoría. |
| Producto | ID, código único, descripción, marca, presentación, mínimo, estado. | Producto 0..\* Compatibilidad; 1 Producto por línea comercial. |
| Compatibilidad | Marca/modelo vehículo, año inicial/final. | Cada compatibilidad pertenece a 1 Producto; rango inicial $`\leq`$ final. |
| Proveedor | ID comercial, razón social, estado. | Proveedor 0..\* OrdenCompra. |
| OrdenCompra, LíneaCompra | Número, estado, fecha; producto, cantidad, costo esperado. | OrdenCompra 1..\* LíneaCompra; LíneaCompra 1 Producto. |
| Recepción, LíneaRecepción | Fecha, estado, diferencia; cantidad recibida y costo real. | OrdenCompra 0..\* Recepción; Recepción 1..\* LíneaRecepción; cada línea refiere 1 LíneaCompra. |
| Movimiento de Kardex | ID, producto, tipo, cantidad, fecha, origen y actor. | Producto 0..\* movimientos; origen confirmado obligatorio. |
| Conteo, LíneaConteo | Fecha de corte, estado; contado, diferencia. | Conteo 1..\* LíneaConteo; línea 1 Producto. |
| Cotización, LíneaCotización | Vigencia, estado, total; cantidad, precio. | Cotización 1..\* líneas; 0..1 Venta derivada. |
| Venta, LíneaVenta | Factura única, estado, total, fecha; cantidad, precio, costo histórico aplicable. | Venta 1..\* LíneaVenta; línea 1 Producto; venta 0..\* Pago. |
| Pago | Medio, importe, referencia, estado. | Cada Pago confirmado pertenece a 1 Venta y 1 TurnoCaja si aplica. |
| TurnoCaja | Operador, terminal, apertura, cierre, esperado, declarado y diferencia. | Usuario 0..\* turnos; un turno abierto por usuario/terminal según política. |
| Devolución, LíneaDevolución | Motivo, condición, estado, resolución; cantidad. | Devolución 1 Venta; 1..\* líneas, cada una refiere 1 LíneaVenta. |
| EventoAuditoría | Actor, instante, entidad, operación, motivo, antes/después. | 0..1 documento origen; registro inmutable tras confirmación. |
| CopiaRespaldo | ID, fecha, versión, suma de integridad, estado. | 0..\* copias por versión desplegada; restauración restringida. |

### Invariantes del dominio

| **ID** | **Invariante verificable** | **Fuente y prueba futura** |
|:---|:---|:---|
| **ID** | **Invariante verificable** | **Fuente y prueba futura** |
| INV-01 | Saldo confirmado por producto $`\geq 0`$. Toda modificación tiene exactamente un origen y un movimiento correlacionado. | RN-01/02; SRS-INV-001/002; concurrencia. |
| INV-02 | Si Venta.estado = Confirmada, total de pagos confirmados = total de venta, y existe factura única; si falla, no quedan efectos parciales. | RN-07/08; SRS-VNT-005–007; rollback. |
| INV-03 | Cantidad devuelta acumulada de una LíneaVenta $`\leq`$ cantidad vendida. | RN-13; SRS-DEV-001; devoluciones sucesivas. |
| INV-04 | Año inicial de compatibilidad $`\leq`$ año final; asociación apunta a producto existente. | RN-04; SRS-CAT-002; rango inválido. |
| INV-05 | Factura, compra y movimiento confirmados no se borran; corrección mediante estado o compensación autorizada. | RN-02/10; auditoría y muestreo. |
| INV-06 | Operador no aprueba su propia operación sensible cuando se exige segundo rol. | RN-09/11; SYS-SC-005; intento propio. |
| INV-07 | Venta en Borrador no afecta Kardex. Una reimpresión no crea otra venta. | SRS-VNT-001/008; comparación de IDs. |

## M-STM-01 y M-STM-02: estados

### Venta

La máquina de estados respeta SYS-MD-002. *Cancelada* designa borrador no confirmado abandonado; una factura ya confirmada no se borra, sino que se procesa mediante anulación autorizada o devolución según reglas. Ninguna transición implícita crea efectos de inventario.

<figure>

<figcaption>M-STM-01: estados de venta; las guardas se detallan en la tabla.</figcaption>
</figure>

| **Transición** | **Guarda y acción** | **Fallo esperado** |
|:---|:---|:---|
| Borrador $`\rightarrow`$ Pendiente | Líneas enteras positivas, precios vigentes y descuentos autorizados; calcular en servidor. | Permanece Borrador; ningún movimiento. |
| Pendiente $`\rightarrow`$ Confirmada | Pago exacto, turno válido si aplica, stock disponible bajo control concurrente; confirmar venta, pagos, Kardex y auditoría juntos. | Rollback completo; venta no confirmada. |
| Borrador/Pendiente $`\rightarrow`$ Cancelada | Solicitud del operador antes del commit; conservar evidencia si política lo exige. | No genera factura ni Kardex. |
| Confirmada $`\rightarrow`$ posventa | No cambia estado histórico de factura por edición directa; usar devolución/anulación autorizada. | Se rechaza cambio directo. |

### Devolución y turno de caja

**Devolución:** Solicitada $`\rightarrow`$ En revisión $`\rightarrow`$ Autorizada o Rechazada $`\rightarrow`$ Resuelta. La guarda de autorización comprueba factura de origen, saldo devolvible por línea, motivo, condición, resolución prevista y segundo autorizador cuando aplica. Solo *Resuelta* produce compensación de inventario/pago definida, de modo atómico y auditado. La resolución no borra la venta.

**Turno de caja:** Abierto $`\rightarrow`$ En conciliación $`\rightarrow`$ Cerrado. La apertura registra fondo por operador y terminal. El cierre calcula esperado y declarado por medio; una diferencia exige motivo y, según umbral, aprobación. Dos turnos equivalentes abiertos se rechazan. Las reglas de umbral específicas se configurarán con el negocio antes de I3; no se inventa un monto.

## M-SEQ-01: secuencia de venta y reversión

La secuencia textual siguiente describe mensajes UML con actor, objetos participantes y alternativas. El límite transaccional abarca factura, pagos, Kardex, saldo y auditoría. La impresión se ejecuta tras el commit y puede reintentarse sin duplicar venta.

| **Paso** | **Emisor** | **Receptor** | **Mensaje/resultado** |
|:---|:---|:---|:---|
| **Paso** | **Emisor** | **Receptor** | **Mensaje/resultado** |
| 1 | Vendedor/POS | ServicioVentas | Solicitar confirmación de borrador y pagos; pasar identidad y versión. |
| 2 | ServicioVentas | Identidad/Caja | Verificar permiso, turno y operación sensible. |
| 3 | ServicioVentas | Catálogo | Obtener precios vigentes e impuestos; recalcular total en servidor. |
| 4 | ServicioVentas | Inventario | Tomar control concurrente por producto y confirmar suficiencia. |
| 5 | ServicioVentas | Gestor TX | Iniciar unidad de trabajo. |
| 6 | ServicioVentas | Módulos internos | Persistir factura, líneas, pagos, movimientos y saldos; registrar evento. |
| 7 | Gestor TX | ServicioVentas | Commit solo si todos los efectos son válidos; devolver ID de factura. |
| 8 | ServicioVentas | Impresión/POS | Preparar comprobante reproducible; una falla de impresora no reejecuta 5–7. |
| Alt. | Inventario o persistencia | ServicioVentas | Si stock insuficiente, pago desigual o error: rollback; informar causa sin efectos parciales. |

**Pruebas derivadas:** dos vendedores compiten por la última unidad (solo una venta confirma); error inducido tras registrar pago revierte también factura y Kardex; pago en dos medios debe sumar exactamente el total; reimpresión conserva factura original. Anclas: SRS-INV-002, SRS-VNT-005–008, DA PA-03/05, MET I3.

## M-SEQ-02: recepción de compra

La orden de compra puede recibirse parcialmente. El encargado selecciona orden y cantidades; el módulo Compras comprueba remanente y permiso para exceso, registra diferencias y solicita a Inventario la entrada correlacionada. Costo histórico, recepción, Kardex y saldo se confirman en una transacción. Si falla cualquiera, todo se revierte. Una recepción parcial deja remanente; no marca la orden completamente recibida. La corrección posterior se registra como operación compensatoria, no como edición silenciosa de la recepción confirmada. Anclas: SYS-FN-007–009, SRS-COM-001–003, RN-02/09 y MET I2.

## M-DEP-01: despliegue y continuidad

<figure>

<figcaption>M-DEP-01: nodos lógicos; ubicación física y equipos concretos pendientes.</figcaption>
</figure>

La operación comercial crítica no depende de Internet. Las terminales acceden al servidor por LAN con autenticación y autorización; periféricos de impresión y lector se conectarán mediante interfaces definidas al concretar el diseño técnico. La copia diaria debe incluir versión y suma de integridad. La restauración ocurre solo en modo Recuperación, con confirmación reforzada, procedimiento ensayado y comprobación de integridad. Objetivos de prueba: RPO máximo 24 h y RTO máximo 4 h; disponibilidad de 99.5% en horario comercial mensual, excluido mantenimiento aprobado. No se declara que estos objetivos ya se cumplan.

## Trazabilidad de diseño y plan incremental

| **Fuente oficial** | **Elemento de diseño** | **Verificación prevista** | **Incremento** |
|:---|:---|:---|:---|
| **Fuente oficial** | **Elemento de diseño** | **Verificación prevista** | **Incremento** |
| SYS-FN-001–005; SRS-CAT-001–004 | M-UC-01, M-CMP-01, M-CLS-01, INV-04 | Permisos, duplicados, rango y búsqueda P95. | I1 |
| SYS-FN-006–012; SRS-COM-001–003; SRS-INV-001–005 | M-CLS-01, M-SEQ-02, INV-01/05 | Recepción parcial, saldo y conteo aprobado. | I2 |
| SYS-FN-013–018; SRS-VNT-001–008; SRS-CAJ-001–003 | M-STM-01/02, M-SEQ-01, INV-02/07 | Pago exacto, concurrencia, rollback y cierre. | I3 |
| SYS-FN-019/020; SRS-DEV-001/002 | M-STM-02, M-CLS-01, INV-03 | Devolución sucesiva y autorización. | I4 |
| SYS-FN-023–030; SYS-PR-006/007; SRS-BKP-001–003 | M-CMP-01, M-DEP-01, INV-05/06 | Auditoría, restauración RPO/RTO y reportes reconciliados. | I1–I4; cierre I4 |
| DA PA-01–08, V-01–05; MET G0–G3 | Todos los modelos | Revisión de dependencias, pruebas y aceptación por puerta. | Cada incremento |

La matriz no cambia la RTM de REQ-MREC-001. Antes de implementar cada incremento, se detallarán casos de prueba, datos, umbrales y versiones de interfaces. G0 revisa líneas base y alcance; G1 diseño y controles; G2 evidencia de prueba y aceptación; G3 transición. La aprobación de una vista no garantiza que el código cumpla el requisito: la evidencia será una ejecución de prueba documentada.

## Decisiones abiertas y control de cambios

| **ID** | **Decisión pendiente** | **Condición para cerrar** |
|:---|:---|:---|
| DA-01 | Motor relacional y diseño físico de índices/bloqueos. | Prueba de concurrencia y búsqueda P95 con 20,000 productos y 10 usuarios. |
| DA-02 | Lenguaje, framework y formato concreto de interfaces internas. | Compatibilidad con contratos, seguridad y despliegue local. |
| DA-03 | Regla numérica de aprobación de diferencia de caja. | Validación con negocio y actualización controlada de requisito si afecta alcance. |
| DA-04 | Ubicación y medio de respaldo, UPS y equipos específicos. | Ensayo de copia/restauración, seguridad física y costo aprobado. |
| DA-05 | Política detallada de retención, privacidad y comprobante. | Validación con interesados y normativa aplicable antes de producción. |

Una modificación al modelo que afecte RN-01–15, interfaz, dependencia, dato histórico o criterio de prueba requiere solicitud, análisis de impacto y aprobación según MET-MREC-001. La versión anterior se conserva. No se asignan firmas ficticias ni se afirma que el negocio haya aprobado los diagramas.

## Conclusión

DD-MREC-001 aplica UML selectivo a una solución de ventas e inventario coherente con sus requisitos y arquitectura. El diseño separa responsabilidades, conserva integridad transaccional e historial, hace visibles las guardas de operaciones sensibles y prepara pruebas por incremento. Las decisiones técnicas aún abiertas se resolverán con evidencia antes de construir; este documento cierra la *planificación de diseño*, no la implementación.

## Aprobación de la línea base

<table>
<tbody>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Ángel Antonio Alonso Suárez</td>
<td style="text-align: left;">Br. Noel Isaac Alemán Carballo</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2021-0087U</td>
<td style="text-align: left;">Carnet 2022-0376U</td>
</tr>
<tr>
<td style="text-align: left;"><hr /></td>
<td style="text-align: left;"><hr /></td>
</tr>
<tr>
<td style="text-align: left;">Br. Mendell Noé Parrales Molina</td>
<td style="text-align: left;">Ing. Roberto Alfaro</td>
</tr>
<tr>
<td style="text-align: left;">Carnet 2020-1014U</td>
<td style="text-align: left;">Docente titular</td>
</tr>
</tbody>
</table>

## Referencias

1.  Equipo Moto Repuestos El Centenario. (2026). *REQ-MREC-001 v1.0: especificación integral StRS, SyRS y SRS*. Universidad Nacional de Ingeniería.

2.  Equipo Moto Repuestos El Centenario. (2026). *DA-MREC-001 v1.0: descripción de arquitectura de software*. Universidad Nacional de Ingeniería.

3.  Equipo Moto Repuestos El Centenario. (2026). *MET-MREC-001 v1.0: elección de metodología de desarrollo*. Universidad Nacional de Ingeniería.

4.  Equipo Moto Repuestos El Centenario. (2026). *LM-MREC-001 v1.0: análisis del modelo de lenguaje*. Universidad Nacional de Ingeniería.

5.  Object Management Group. (2017). *Unified Modeling Language, versión 2.5.1*. <https://www.omg.org/spec/UML/2.5.1/>.

---

# Capítulo 08: Aplicación de Principios SOLID

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
DD-MREC-001 v1.0  
**Versión:** 1.1  
**Etapa:** Desarrollo finalizado y verificación interna de diseño


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha de actualización:** 11 de octubre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Primer informe de la segunda entrega – Ingeniería de Software 1**  
Continuación de la línea base de análisis y diseño


## Propósito y alcance

El informe describe decisiones verificables en el repositorio local, no una declaración abstracta de adhesión a SOLID. Los principios se interpretan a partir de Martin (2018), en diálogo con las líneas base del equipo (Alonso Suárez et al., 2026a, 2026b). La línea base de requisitos REQ-MREC-001 y la arquitectura DA-MREC-001 plantearon un monolito modular en capas. En la implementación se usaron Django, PostgreSQL y servicios transaccionales. La evaluación toma como unidades principales los modelos persistentes, casos de uso, reglas puras, formularios, vistas y pruebas. Cada referencia de archivo es relativa a la raíz del repositorio.

La implementación separa reglas puras, políticas de precios, garantías, anulaciones, importación, consultas y adaptación HTTP. `commerce/services.py` todavía agrupa varios casos de uso; se documenta como decisión de escala de la versión actual en desarrollo, no como incumplimiento que impida utilizar los flujos. El criterio del informe es relacionar cada principio con una decisión de código y su verificación.

## Mapa de responsabilidades

| Componente | Responsabilidad dominante | Evidencia y frontera |
|:---|:---|:---|
| `commerce/models.py` | Entidades, relaciones, restricciones y estados persistentes | Claves foráneas protegidas, unicidad, rangos monetarios y snapshots históricos; no calcula el flujo HTTP. |
| `commerce/pricing.py` | Redondeo monetario y total de línea puros | `money` y `line_total` prueban decimales sin base ni interfaz. |
| `commerce/pricing_services.py` | Políticas de descuentos, excepción e impuesto | Evalúa vigencia y límite, calcula por unidad y conserva auditoría. |
| `commerce/warranty_services.py` | Ciclo de garantía | Solicitud, decisión separada y resolución sin duplicar caja ni Kardex. |
| `commerce/cancellation_services.py` | Anulación compensatoria | Deuda de reintegro, devolución física apta y transacción atómica. |
| `commerce/catalog_queries.py` | Consulta de catálogo | Filtrado y orden permitido, compartidos por pantalla y exportación. |
| `commerce/views.py` | Adaptación HTTP | Valida formularios, muestra errores y delega cambios de estado a servicios. |

## Análisis por principio

### S: responsabilidad única

Una regla monetaria no depende del navegador: `pricing.py` usa `Decimal` y redondeo explícito. La vista `sale_create` adapta datos del formulario y entrega el caso de uso a `checkout`. La anulación vive en `cancellation_services.py` y no se duplica en la plantilla. Esta separación permite comprobar cálculo, autorización y representación por vías distintas. El módulo `services.py` agrupa los flujos comerciales restantes; sus contratos de entrada mantienen las vistas desacopladas de las operaciones internas.

### O: abierto a extensión, cerrado a modificación

Los estados de garantía, devolución, anulación y excepción se representan como elecciones explícitas y las políticas de descuento/impuesto son registros versionables; incorporar una nueva tasa no exige reescribir facturas históricas. La compatibilidad de productos admite nuevas marcas, modelos y rangos como datos. Los medios de pago, en cambio, constituyen un conjunto deliberadamente cerrado: agregar uno exige actualizar modelo, formulario y reglas de reintegro. El informe distingue esa decisión de un punto de extensión abierto.

### L: sustitución de Liskov

El código de dominio evita una jerarquía artificial de ventas o descuentos. No existe una subclase que prometa un contrato de `Sale` y lo rompa. Las variantes de pago se tratan mediante valores de un dominio finito y validación uniforme. Por ello Liskov se considera *no forzado*: no se inventó herencia solo para demostrar el principio. La verificación relevante es que toda vía de confirmación (venta directa, borrador y cotización) termina en el mismo contrato `checkout`, donde se validan stock, pago, descuento e impuesto.

### I: segregación de interfaces

La interfaz operativa se divide por permisos concretos: vender no concede configurar tasas, decidir una excepción ni ver costos; Administración/Gerencia reciben permisos distintos para crear políticas y aprobar operaciones. Los formularios separan captura de cliente, líneas, pagos y precio. En Python no hay interfaces estáticas obligatorias; aquí la segregación se expresa en contratos de caso de uso y permisos de Django. Se prueba invocación directa de páginas protegidas por un usuario sin permiso, con respuesta de denegación.

### D: inversión de dependencias

Las reglas puras de `pricing.py` no importan Django. Los servicios dependen de entidades y transacciones ORM; las vistas dependen de los servicios, no al revés. Esto facilita reemplazar la interfaz HTTP sin duplicar reglas. La dependencia de los servicios hacia Django ORM sigue siendo fuerte: no se introdujo repositorio abstracto porque la escala actual no justifica esa complejidad. Esta es una aplicación parcial y deliberada del principio, no una inversión total.

## Ejemplos trazables y pruebas

| Requisito | Decisión de diseño | Evidencia automática |
|:---|:---|:---|
| SRS-VNT-002/004 | El servidor recalcula lista, descuento, impuesto y total por unidad; el formulario no envía un total confiable. | `SalePricingPolicyTests`: pago manipulado rechazado, snapshots y límite. |
| SRS-DEV-001/002 | Devolución usa precio unitario efectivamente cobrado, nunca precio vigente del catálogo. | Prueba de devolución parcial de venta con descuento/impuesto. |
| SYS-SC-005 | El solicitante de una operación sensible no puede aprobarla. | Pruebas de garantía, anulación, excepción y ajustes. |
| RN-07 | Confirmación de venta y operaciones asociadas atómicas. | Pruebas de rollback y concurrencia de inventario en PostgreSQL. |

La regresión completa de cierre terminó con **120 pruebas aprobadas** en PostgreSQL, cero fallos y cero errores, en 289,28 s. `manage.py check` no reportó problemas. La matriz final de trazabilidad vincula 32 requisitos auditados con implementación y evidencia reproducible; los casos comprueban reglas puras, permisos, operaciones transaccionales y flujos web. El número de pruebas no se usa como porcentaje de aplicación de SOLID.

## Conclusión

SOLID se aplicó como criterio de diseño donde aporta claridad: cálculo independiente, servicios especializados, permisos segregados y dependencias dirigidas desde HTTP hacia casos de uso. Liskov no exige inventar herencia donde no existe, y la inversión de dependencias se limita conscientemente a las reglas puras. En la etapa de desarrollo actual, el resultado es una arquitectura comprensible y comprobable; la división adicional de `services.py` sería una evolución de mantenimiento si el producto creciera.

## Referencias

Alonso Suárez, Á. A., Alemán Carballo, N. I., & Parrales Molina, M. N. (2026a). *Descripción de la arquitectura de software de Moto Repuestos El Centenario* \[Documento académico no publicado\]. Universidad Nacional de Ingeniería.

Alonso Suárez, Á. A., Alemán Carballo, N. I., & Parrales Molina, M. N. (2026b). *Requerimientos StRS, SyRS y SRS de Moto Repuestos El Centenario* \[Documento académico no publicado\]. Universidad Nacional de Ingeniería.

Martin, R. C. (2018). *Clean architecture: A craftsman’s guide to software structure and design*. Pearson. <https://www.pearson.com/en-us/subject-catalog/p/clean-architecture-a-craftsmans-guide-to-software-structure-and-design/P200000009528/9780134494326>

## Evidencia de implementación

Documentos oficiales en `docs/01_linea_base/`; código de `commerce/`; matriz consolidada en `docs/MATRIZ_FINAL_TRAZABILIDAD.md`; resultados en `docs/03_evidencias/2026-10-11/`, en particular `regresion-completa.md` y `matriz-trazabilidad.md`. Los principios SOLID se utilizan como criterios de diseño, no como certificación externa.

---

# Capítulo 09: Experiencia de Usuario y Usabilidad (UX)

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
DD-MREC-001 v1.0  
**Versión:** 1.1  
**Etapa:** Desarrollo y pruebas internas de usabilidad


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha de actualización:** 11 de octubre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Segundo informe de la segunda entrega – Ingeniería de Software 1**  
Continuación de la línea base de análisis y diseño


## Objetivo y referencias

Este informe examina la interfaz del sistema comercial frente al contexto de uso descrito en REQ-MREC-001: atención de mostrador, búsqueda de piezas compatibles, venta, caja, inventario y supervisión. ISO 9241-210:2019 se toma como guía de diseño centrado en personas durante el ciclo de vida (International Organization for Standardization \[ISO\], 2019); ISO 9241-11:2018 aporta el marco de usabilidad como resultado del uso (ISO, 2018). La empresa y su distribución física son reales; el software se encuentra en desarrollo y las pruebas descritas son internas, realizadas por el equipo en sus equipos locales. Por ello no se atribuyen todavía resultados de satisfacción a empleados o clientes de la empresa.

Las descripciones públicas de ISO permiten fundamentar el enfoque; no se reproducen cláusulas no disponibles.

## Contexto de uso y tareas

| Perfil | Tarea crítica | Condiciones y error costoso |
|:---|:---|:---|
| Vendedor | Buscar por código/texto/compatibilidad; cotizar; cobrar | Atención simultánea al cliente; error de pieza, precio o stock; teclado y lector como teclado. |
| Bodega | Recibir, contar y conciliar | Diferencia entre físico y sistema; riesgo de ajuste no aprobado. |
| Administración | Controlar políticas, autorizar excepciones y anulaciones | Debe ver identidad, motivo, consecuencias y estado antes de decidir. |
| Gerencia | Revisar reportes, márgenes y auditoría | Debe distinguir ingreso, impuesto de simulación, reintegro y deuda pendiente. |

Las pruebas de la etapa actual se ejecutan en navegador y PostgreSQL locales. Los perfiles representan tareas reales de la empresa y se operan con cuentas de prueba del repositorio; todavía no constituyen una evaluación formal con personal operativo. La interfaz no necesita Internet público para vender en una LAN.

## Diseño aplicado

### Estructura y consistencia

La navegación principal conserva nombres estables para Catálogo, Clientes, Cotizaciones, Devoluciones, Garantías, Anulaciones, Caja, Venta, Reportes y Auditoría, según permiso. Las páginas usan encabezado, tarjetas, campos etiquetados, mensajes de estado y acciones primarias. La ausencia de permiso se rechaza en servidor, no solamente ocultando el enlace. El catálogo y ocho listas operativas tienen búsqueda, orden permitido, paginación estable y estado vacío.

### Prevención y recuperación de errores

La venta revalida precio, existencia, tasa, descuento y suma de pagos en servidor. La pantalla muestra un total estimado y la factura desglosa subtotal, descuento, impuesto de simulación y total cobrado. Las operaciones sensibles presentan motivo, actor y consecuencias; la anulación mantiene deuda de reembolso visible. El borrador permite detenerse y reanudar sin mover inventario. Los campos de cantidad no aceptan cero o números no enteros; los mensajes del servidor explican la regla incumplida. La vista de copia de factura no crea una nueva transacción.

### Teclado, lectura y minimización de datos

La primera línea del punto de venta recibe foco inicial, y agregar una línea enfoca el nuevo selector. Las etiquetas están asociadas a controles y el total estimado usa una región de actualización accesible. El cliente identificado es opcional; solo se piden nombre y contacto al registrarlo. Esto reduce captura innecesaria en mostrador. El cambio de contraseña y las acciones administrativas se muestran solo a perfiles pertinentes.

## Evaluación académica de la interfaz

| Criterio | Evidencia local | Estado |
|:---|:---|:---|
| SRS-US-001, consistencia | Plantilla base compartida, navegación por permiso y patrones de formulario repetidos. | Verificado por inspección de plantillas y flujos HTTP. |
| SRS-US-002, teclado | Foco inicial del punto de venta, etiquetas asociadas y controles nativos. | Verificado en código y prueba automática; no se atribuye una medición humana. |
| SRS-US-003, mensajes | Errores de validación visibles y avisos de resultado de operación. | Revisado en los flujos críticos de venta, caja y posventa. |
| SRS-US-004, tablas | Catálogo y ocho listas con búsqueda, orden, paginación y estado vacío. | Probado por solicitudes HTTP automatizadas. |
| SRS-US-005, confirmación | Las operaciones sensibles describen objeto y consecuencia antes de enviar. | Inspección de formularios y protección de cambios por POST. |
| ISO 9241-11:2018 | Se identifican tareas, contexto y medidas de eficacia/eficiencia/satisfacción. | Marco analítico aplicado; no se presentan métricas de participantes que no existieron. |

La regresión final de 120 pruebas aprobadas verifica comportamientos web y de dominio. Además, la evidencia de prueba por roles documenta navegación íntegra por teclado en POS, 20 mensajes de validación contextuales, confirmaciones de acciones sensibles y barreras de autorización. No mide comprensión, carga cognitiva ni satisfacción: la revisión del equipo es una inspección de diseño y no un estudio con personas externas al proyecto.

## Recorridos de demostración reproducibles

La entrega académica permite recorrer cuatro escenarios con cuentas de roles distintos y datos ficticios: (1) buscar una pieza compatible y cotizarla; (2) crear un borrador y confirmar una venta con dos pagos; (3) recibir mercancía y revisar el Kardex; y (4) solicitar y decidir una anulación, mostrando el reembolso pendiente. Para repetirlos se inicia PostgreSQL local, se aplican migraciones, se preparan cuentas de proyecto y se abre la aplicación como indica el manual. En cada recorrido se comprueba que la tarea tiene entrada visible, mensaje de resultado y salida trazable. La prueba local de 20,000 productos registra el tiempo de búsqueda HTTP por separado; no se presenta como tiempo de interacción humana.

## Conclusión

La interfaz implementa navegación por rol, captura mínima, prevención de errores monetarios y recuperación mediante borradores. La evaluación interna documenta propiedades observables del sistema en desarrollo y separa las pruebas automáticas de la experiencia subjetiva, que aún no se midió con el personal de la empresa. ISO 9241 orienta el análisis; no se presenta una certificación ni una aceptación operativa final antes del despliegue.

## Referencias

International Organization for Standardization. (2018). *Ergonomics of human-system interaction—Part 11: Usability: Definitions and concepts* (ISO 9241-11:2018). <https://www.iso.org/standard/63500.html>

International Organization for Standardization. (2019). *Ergonomics of human-system interaction—Part 210: Human-centred design for interactive systems* (ISO 9241-210:2019). <https://committee.iso.org/standard/77520.html?browse=tc>

## Evidencia de implementación

Implementación: `base.html`, `sale.html`, `forms.py`, `views.py` y `tests.py`. Evidencia final en `docs/03_evidencias/2026-10-11/`: `pruebas-usuario-ux-roles.md` y `regresion-completa.md`.

---

# Capítulo 10: Programación Segura

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
DD-MREC-001 v1.0  
**Versión:** 1.1  
**Etapa:** Desarrollo y pruebas internas de seguridad


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha de actualización:** 11 de octubre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Tercer informe de la segunda entrega – Ingeniería de Software 1**  
Continuación de la línea base de análisis y diseño


## Marco correcto y alcance

ISO/IEC 27001:2022 establece requisitos para un sistema de gestión de seguridad de la información (International Organization for Standardization \[ISO\], 2022); no es por sí sola una norma de codificación segura. Para seguridad de aplicaciones se emplean como orientación ISO/IEC 27034-1:2011, que presenta conceptos y procesos, e ISO/IEC 27034-3:2018, sobre el proceso de gestión de seguridad de aplicaciones. Las páginas oficiales de ISO/IEC 27034-1 y 27034-3 se utilizan como orientación pública (ISO, 2011, 2018). Este trabajo adapta sus enfoques al alcance de una demostración; no afirma certificación ni conformidad integral con textos normativos no auditados.

El activo principal es la integridad de inventario, ventas, pagos, clientes y auditoría. Los perfiles de Vendedor, Bodega, Administración y Gerencia representan funciones reales de la empresa; en esta etapa la interfaz se prueba localmente por el equipo de desarrollo. Se analizan amenazas plausibles de acceso sin permiso, sesión robada, manipulación de formulario, carrera de stock, borrado de historial, pérdida de base y filtración de secretos. La evaluación de seguridad se concentra en código, configuración y pruebas internas previas al despliegue.

## Análisis de amenazas y controles

| Amenaza | Control implementado | Evidencia y límite |
|:---|:---|:---|
| Acceso sin permiso | Decoradores y validación de permiso dentro del servicio; roles sincronizados por `setup_roles`. | Pruebas de acceso directo HTTP 403 y rechazo del caso de uso. Falta revisión formal de toda la matriz RBAC. |
| Fuerza bruta y cuenta compartida | Bloqueo temporal tras cinco fallos, cuenta individual, cambio de contraseña validado y auditoría de sesión. | Pruebas de éxito, fallo, bloqueo y desactivación. |
| Falsificación de solicitud | CSRF de Django, formularios POST para cambios de estado, cookies SameSite y HttpOnly. | Inspección de configuración, formularios y vistas. |
| Manipulación de precio o total | El servidor recalcula cantidades, vigencia, tasa, descuento y suma de pagos; no acepta total del cliente. | Prueba de pago manipulado; el navegador solo presenta una estimación. |
| Autorización indebida | Separación solicitante/aprobador en ajustes, excesos, devoluciones, garantías, anulaciones y descuentos excepcionales. | Pruebas de autoaprobación denegada. |
| Carrera de inventario | Transacciones, actualización condicional de saldo y restricciones de base. | Dos ventas por última unidad y carga local de 500 ventas con cuatro operadores. |
| Pérdida o manipulación histórica | Facturas, Kardex y relaciones protegidas; anulación compensatoria, nunca borrado de número. | Pruebas de conservación y rollback. Bitácora no tiene sellado criptográfico externo. |
| Exposición de datos | Cliente opcional y mínimo; contactos no incluidos en detalles de auditoría; secretos por variables de entorno. | Inspección y prueba de ausencia de contacto en auditoría. Falta política de retención. |
| Pérdida de respaldo | `pg_dump`, manifiesto SHA-256, verificación de seis copias y restauración temporal. | Una factura ficticia fue recuperada sin alterar la base principal. |

## Controles de implementación

### Autenticación y sesiones

Django almacena contraseñas mediante su infraestructura de hash y sal, sin texto claro en modelos de negocio. La autenticación rechaza cuenta inactiva y registra resultado sin contraseña. La sesión expira tras 30 minutos de inactividad. La configuración exige una clave secreta externa si `DEBUG=0`; en desarrollo se mantiene un valor explícitamente inseguro que impide afirmar seguridad productiva. Las cookies seguras se activan con `DEBUG=0`; HTTPS real depende del servidor o proxy de destino.

### Entradas, transacciones y salida

Los formularios validan tipos, rangos, longitudes y referencias. Los servicios vuelven a validar permisos y reglas antes de escribir. `Decimal` evita cálculos monetarios binarios; la venta guarda snapshots de precio y tasas. Las operaciones sensibles usan `transaction.atomic` y bloqueo/actualización condicional. Las plantillas de Django escapan texto por defecto; no se introducen consultas SQL construidas con datos del usuario para búsquedas de catálogo. La exportación de catálogo está restringida y excluye costos cuando corresponde.

### Auditoría y trazabilidad

Cada solicitud HTTP incorpora identificador de correlación y los eventos de negocio conservan actor, entidad, acción y fecha. Las políticas de tasas, descuentos y cambios de precio dejan motivo. Las anulaciones conservan deuda de reembolso y movimientos compensatorios. No se registran contraseñas ni secretos en los detalles de auditoría. La tabla de auditoría está protegida frente a edición por roles de negocio, pero un administrador de base con privilegios plenos podría alterarla; no hay almacenamiento WORM.

## Verificación y riesgos residuales

La regresión PostgreSQL de cierre terminó con **120 pruebas**, cero fallos y cero errores; `manage.py check` no reportó errores. La auditoría LAN verificó que con `MREC_DEBUG=0` una clave de desarrollo sea rechazada, y que la configuración para proxy TLS habilite cookies seguras y restrinja hosts y orígenes CSRF. El respaldo se verifica por SHA-256; una copia externa en unidad BitLocker también fue comprobada. Estas son evidencias de controles y reglas seleccionadas, no una certificación externa ni una exposición pública del prototipo.

| Límite del prototipo | Decisión aplicada | Interpretación |
|:---|:---|:---|
| Servidor local HTTP | Enlace a `127.0.0.1`; no exposición pública. | Adecuado para demostración local, no equivalente a HTTPS empresarial. |
| Copia en el mismo equipo | SHA-256, catálogo y ensayo de restauración temporal. | Protege la verificabilidad académica, no la pérdida física del equipo. |
| Auditoría en PostgreSQL | Roles de negocio sin edición directa y eventos transaccionales. | Un administrador total de la base conserva capacidad técnica de modificación. |
| Revisión de seguridad interna | Casos de permiso, CSRF, stock y secretos. | Se documentan controles implementados, no una certificación externa. |

## Conclusión

Se aplicaron controles de codificación, autorización, integridad transaccional, respaldo verificable y trazabilidad apropiados para la etapa de desarrollo y pruebas internas. ISO/IEC 27034 orienta el análisis de seguridad de aplicación; ISO/IEC 27001 se cita como marco de gestión, no como certificado. El informe describe controles validados antes del despliegue, sin afirmar una certificación de seguridad ni una operación productiva ya implantada.

## Referencias

International Organization for Standardization. (2011). *Information technology—Security techniques—Application security—Part 1: Overview and concepts* (ISO/IEC 27034-1:2011). <https://www.iso.org/standard/44378.html>

International Organization for Standardization. (2018). *Information technology—Application security—Part 3: Application security management process* (ISO/IEC 27034-3:2018). <https://www.iso.org/standard/55583.html>

International Organization for Standardization. (2022). *Information security, cybersecurity and privacy protection—Information security management systems—Requirements* (ISO/IEC 27001:2022). <https://www.iso.org/standard/27001>

## Evidencia de implementación

Implementación: configuración, autenticación, servicios de negocio y respaldo. Evidencia final en `docs/03_evidencias/2026-10-11/`: `despliegue-lan.md`, `respaldo-usb.md` y `regresion-completa.md`.

---

# Capítulo 11: Pruebas de Software

UNIVERSIDAD NACIONAL DE INGENIERÍA
Dirección de Área de Conocimiento DACTIC
Asignatura: Ingeniería de Software 1
PRUEBAS DE
SOFTWARE
Plan, ejecución y resultados de verificación
Caso de estudio: Distribuidora Comercial “Moto Repuestos El Centenario”
Líneas base rectoras
REQ-MREC-001 v1.0
DA-MREC-001 v1.0
DD-MREC-001 v1.0
Versión: 1.1
Etapa: Pruebas internas de integración, regre-
sión y rendimiento
Docente: Ing. Roberto Alfaro
Carrera: Ingeniería en Computación
Grupo: 4S1-COM-S
Fecha de actualización: 11 de octubre de
2026
Ubicación: Managua, Nicaragua
Equipo de trabajo
Integrante
Carnet
No. Persona
Ángel Antonio Alonso Suárez
2021-0087U
6B763BC6
Noel Isaac Alemán Carballo
2022-0376U
6B76CA80
Mendell Noé Parrales Molina
2020-1014U
6AAB3C24
Cuarto informe de la segunda entrega – Ingeniería de Software 1
Continuación de la línea base de análisis y diseño

---

Índice
1. Alcance y marco de pruebas
2
2. Estrategia por nivel y riesgo
3
3. Matriz de casos críticos
4
4. Ejecución y resultados
6
5. Interpretación del resultado académico
7
6. Criterio de salida y conclusión
8
Referencias
9
Evidencia de implementación
10
1

---

## Alcance y marco de pruebas

1.
Alcance y marco de pruebas
El objetivo es documentar cómo se verificó el sistema académico frente a sus requisitos
comerciales y técnicos. Como referencia de organización se usa la serie ISO/IEC/IEEE 29119:
la parte 1:2022 presenta conceptos generales; la parte 2:2021 describe procesos de prueba; la
parte 3:2021 describe documentación. Las páginas oficiales de ISO/IEC/IEEE 29119 sustentan
esta organización de la evidencia (International Organization for Standardization [ISO], 2021a,
2021b, 2022). Se aplican sus ideas de planificación, caso, resultado y trazabilidad sin declarar
certificación.
La base objetivo de la ejecución fue PostgreSQL 18.4 aislado en 127.0.0.1:55432. Django
crea una base temporal con usuario de pruebas separado y la elimina al terminar. No se usó la
base principal para pruebas destructivas. Las pruebas se distribuyen entre commerce/tests.py,
otros módulos commerce/tests_*.py y tests/. La regresión de cierre terminó con 120 pruebas,
cero fallos y cero errores, en 289,28 s. manage.py check no reportó problemas ni se detectaron
migraciones nuevas sin generar.
2

---

## Estrategia por nivel y riesgo

2.
Estrategia por nivel y riesgo
Nivel
Casos representativos
Riesgo mitigado
Regla pura
PricingTests: centavos, cantida-
des inválidas, redondeo.
Total monetario incorrecto o de-
cimal binario.
Servicio
Compra, venta, caja, cotización,
devolución, garantía, anulación y
política de precios.
Estado parcial, salto de autori-
zación y cálculo desde cliente.
Base/transacción
Restricciones, rollback, dos ven-
tas por última unidad, importación
atómica.
Stock negativo, registros huér-
fanos y datos incoherentes.
Integración
HTTP
Formularios, redirecciones, CSRF
del framework, permisos 403, co-
pia de factura, reportes.
Acceso directo no autorizado o
error visible en flujo.
Regresión
Batería completa después de ca-
da incremento mayor.
Cambio nuevo que rompe com-
portamiento previo.
3

---

## Matriz de casos críticos

3.
Matriz de casos críticos
ID
Condición y resultado espe-
rado
Evidencia automática
Resultado
P-SW-01
Dos ventas compiten por úl-
tima unidad; solo una confir-
ma.
PostgreSQLConcurrencyTests Aprobado.
P-SW-02
Pago
enviado
no
coincide
con total de servidor; venta y
Kardex no se crean.
SalePricingPolicyTests
Aprobado.
P-SW-03
Descuento vencido, fuera de
límite o sin motivo se recha-
za.
SalePricingPolicyTests
Aprobado.
P-SW-04
Excepción no puede auto-
aprobarse y queda vinculada
al borrador.
SalePricingPolicyTests
Aprobado.
P-SW-05
Garantía
requiere
decisión
separada; reparación no toca
caja/stock.
WarrantyWorkflowTests
Aprobado.
P-SW-06
Anulación deja deuda por pa-
go; error de turno revierte to-
do.
CancellationWorkflowTests
Aprobado.
P-SW-07
Devolución parcial no excede
venta y usa importe histórico.
CommerceFlowTests,
SalePricingPolicyTests
Aprobado.
P-SW-08
Cuenta
bloquea-
da/desactivada no accede.
AuthenticationSecurityTestsAprobado.
P-SW-09
CSV inválido no altera catá-
logo; 10,000 filas válidas en-
tran atómicamente.
ProductCsvTests
Aprobado.
4

---

ID
Condición y resultado espe-
rado
Evidencia automática
Resultado
P-SW-10
Rol sin permiso recibe 403
por URL directa.
Varias pruebas web de roles.
Aprobado.
P-SW-11
Cotización cancelada conser-
va versión/auditoría y no se
convierte; cambio solo por
POST motivado.
CommerceFlowTests
Aprobado.
5

---

## Ejecución y resultados

4.
Ejecución y resultados
Comando reproducible en la raíz: .\scripts\manage-postgres.ps1 test –noinput. El
lanzador toma credenciales de variables de entorno y usa la cuenta separada mrec_test_runner.
La regresión final reportó Ran 120 tests ... OK en 289,28 s. La importación de 10 000 productos
finalizó en 56,36 s. Como ensayos separados se ejecutaron 50 búsquedas HTTP sobre 20 000
productos (P95 0,029 s), 500 ventas HTTP de veinte líneas con cuatro operadores (P95 1,142
s) y diez sesiones simultáneas de informes (máximo 0,648 s). Estas cifras son locales y no se
extrapolan a una red empresarial. No se calcula porcentaje de cobertura de líneas porque no se
ejecutó un medidor de cobertura.
Los defectos detectados durante el incremento se corrigieron antes de la regresión: falta-
ba un permiso específico para aprobar descuentos excepcionales; se añadió a la definición del
modelo y se sincronizaron los grupos. La anulación se amplió para mostrar deuda por pago y
costo de piezas no recuperadas. Cada corrección conservó un caso de regresión. El historial Git
y docs/03_evidencias/ permiten rastrear el cambio; no se afirma un sistema formal de gestión
de defectos separado.
6

---

## Interpretación del resultado académico

5.
Interpretación del resultado académico
Las pruebas automatizadas cubren reglas críticas de autorización, cálculo, concurrencia,
integridad y flujos HTTP. Los ensayos de rendimiento citados crean datos y operadores en bases
temporales; por ello constituyen evidencia reproducible del sistema en los equipos de desarrollo.
No sustituyen una medición con terminales físicos ni una evaluación de satisfacción de personas.
La empresa y su distribución son reales, pero el despliegue operativo y la prueba piloto con su
personal corresponden a una etapa posterior.
7

---

## Criterio de salida y conclusión

6.
Criterio de salida y conclusión
Para la etapa actual de desarrollo, el criterio de salida de pruebas es que migraciones,
configuración y regresión terminen sin fallos, el sistema abra en navegador local y los escenarios
principales sean reproducibles con cuentas por rol. La evidencia obtenida satisface el criterio
interno de pruebas. Antes de la operación productiva se realizará el despliegue en la empresa y
una prueba piloto con sus usuarios.
8

---

## Referencias

Referencias
International Organization for Standardization. (2021a). Software and systems engineering—Software
testing—Part 2: Test processes (ISO/IEC/IEEE 29119-2:2021). https://www.iso.org/
standard/79428.html
International Organization for Standardization. (2021b). Software and systems engineering—Software
testing—Part 3: Test documentation (ISO/IEC/IEEE 29119-3:2021). https://www.iso.org/
standard/79429.html
International Organization for Standardization. (2022). Software and systems engineering—Software
testing—Part 1: General concepts (ISO/IEC/IEEE 29119-1:2022). https://www.iso.org/
standard/81291.html
9

---

## Evidencia de implementación

Evidencia de implementación
Implementación: commerce/tests.py. Trazabilidad: MATRIZ_FINAL_TRAZABILIDAD.md. Evi-
dencia final en docs/03_evidencias/2026-10-11/: regresion-completa.md y pruebas-usuario-ux-roles.md.
10

---

# Capítulo 12: Pruebas de Base de Datos

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
DD-MREC-001 v1.0  
**Versión:** 1.1  
**Etapa:** Pruebas internas de base de datos, respaldo y recuperación


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha de actualización:** 11 de octubre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Quinto informe de la segunda entrega – Ingeniería de Software 1**  
Continuación de la línea base de análisis y diseño


## Objeto y entorno

Se prueba el esquema relacional que amplía la base conceptual original de ocho tablas. El objetivo no es demostrar que PostgreSQL “funciona”, sino que las restricciones y transacciones propias de la aplicación preservan ventas, existencias, pagos y referencias históricas. La instancia objetivo es PostgreSQL 18.4 aislada en `127.0.0.1:55432`; `mrec_app` no es superusuario ni puede crear bases. `mrec_test_runner` se usa solo para bases temporales de prueba. Las credenciales se reciben mediante variables de entorno, no se almacenan en el repositorio.

Las migraciones Django se aplicaron en la base local y la verificación final no detectó migraciones pendientes de generar. Las 120 pruebas de la regresión completa usan una base temporal creada y eliminada por Django, con cero fallos y cero errores. La importación final de 10 000 productos completó en 56,36 s. Este informe toma como referencia los criterios de integridad y trazabilidad del SRS (Alonso Suárez et al., 2026) y la organización de evidencia de la serie ISO/IEC/IEEE 29119 (International Organization for Standardization, 2021). La empresa es real; la base se valida en la etapa de desarrollo antes de su despliegue operativo.

## Modelo y mecanismos bajo prueba

Las entidades principales son producto, compatibilidad, proveedor, orden y recepción, saldo y Kardex, cotización y versión, cliente, venta/línea/pago, caja, devolución, garantía, anulación, políticas de precio y auditoría. Las relaciones históricas críticas usan `PROTECT` para impedir borrado casual de una factura o referencia confirmada. Los importes se guardan como `NUMERIC`; las cantidades son enteros positivos y los rangos se validan con `CHECK`. Las tasas y precio de lista/efectivo se capturan en la línea de venta para que cambios posteriores del catálogo no reescriban la historia.

| Invariante | Mecanismo | Prueba o inspección |
|:---|:---|:---|
| Código de producto y número de factura únicos | Restricciones `UNIQUE`; número derivado de identificador de venta persistido. | Casos de duplicado y transacciones concurrentes. |
| Cantidad y precio válidos | Validadores de formulario/servicio y restricciones `CHECK`. | Pruebas de cero, negativo y líneas inválidas. |
| Stock no negativo en venta | Actualización condicional `quantity__gte` dentro de transacción. | Dos ventas simultáneas por última unidad. |
| Kardex conciliado | Cada entrada/salida confirmada genera movimiento inmutable; comando `check_inventory`. | Conciliación de muestra y fallo inducido. |
| Pagos igual a total | `Decimal`, recálculo de servidor y transacción única. | Pago manipulado rechazado sin factura huérfana. |
| Devolución no excede venta | Suma de devoluciones pendientes y resueltas por línea bajo bloqueo de venta. | Múltiples solicitudes por misma línea. |
| Anulación trazable | Factura conserva número, estado, líneas compensadas y deuda por pago. | Reembolso pendiente/inmediato y rollback. |
| Garantía histórica | Plazo copiado del producto al vender; expediente vinculado a línea. | Cambio posterior del producto no altera factura. |

## Pruebas transaccionales y concurrentes

La confirmación de venta se implementa con `transaction.atomic`: crea factura, líneas, pagos, salidas de Kardex y auditoría como unidad. Si el stock es insuficiente o la suma pagada no coincide con el total recalculado, no se confirma ninguno de esos efectos. La anulación también es atómica: si se marca un reintegro en efectivo y no existe turno propio abierto o saldo esperado suficiente, se revierten la decisión, los movimientos y la creación de deuda/stock de esa aprobación. La prueba concurrente PostgreSQL muestra una sola venta confirmada cuando dos hilos compiten por la última unidad; saldo final cero y una salida.

La recepción parcial de compra y el exceso autorizado producen entrada y costo histórico dentro de la misma transacción. Los conteos registran fecha de corte y solo generan ajuste aprobado por otra persona. El importador CSV valida filas antes de aplicar y revierte completamente ante error. En la última regresión se importaron 10 000 filas en 52,08 s, con producto, saldo y evento de auditoría por fila; esa medición individual no representa una meta P95.

## Respaldo, restauración y límites

`backup_database` crea una copia con `pg_dump`, comprueba que `pg_restore --list` la lea y registra tamaño/SHA-256 en manifiesto. Las pruebas incluyeron respaldos locales y una copia en unidad externa cifrada con BitLocker, cuya integridad fue comprobada con `verify_backups`. Los simulacros de restauración se ejecutaron en una base temporal distinta, verificaron 46 migraciones y no alteraron la base principal, con resultados entre 3,29 s y 7,27 s según el escenario. El modo Recuperación suspende HTTP durante una intervención. Esta evidencia valida el procedimiento técnico previo al despliegue; la operación periódica en la infraestructura de la empresa se verificará en la etapa de implantación.

## Resultados de la verificación local

| Aspecto | Estado | Justificación |
|:---|:---|:---|
| Integridad relacional y monetaria | Verificada en casos críticos | Migraciones y 120 pruebas aprobadas sobre reglas de venta, inventario y pagos. |
| Concurrencia de última unidad | Verificada en PostgreSQL | Dos intentos, un éxito, sin saldo negativo. |
| Conciliación de Kardex | Verificada en datos de prueba | `check_inventory` detecta diferencia inducida. |
| Importación atómica | Verificada localmente | 10,000 filas y rollback ante fallo. |
| Restauración del escenario actual | Verificada localmente | 46 migraciones, seis cuentas y una venta en base temporal eliminada al finalizar. |
| Alcance de recuperación | Demostración local | SHA-256 y tamaño verificados; respaldo externo BitLocker y modo HTTP 503 comprobados; no se atribuye un RPO/RTO empresarial. |

## Conclusión

La ejecución sobre PostgreSQL demuestra integridad transaccional, concurrencia por la última unidad, importación atómica y restauración controlada. La conclusión corresponde a la etapa de desarrollo y pruebas internas: respalda la preparación técnica del sistema para una empresa real, sin sustituir la validación de la operación periódica tras la implantación.

## Referencias

Alonso Suárez, Á. A., Alemán Carballo, N. I., & Parrales Molina, M. N. (2026). *Requerimientos StRS, SyRS y SRS de Moto Repuestos El Centenario* \[Documento académico no publicado\]. Universidad Nacional de Ingeniería.

International Organization for Standardization. (2021). *Software and systems engineering—Software testing—Part 3: Test documentation* (ISO/IEC/IEEE 29119-3:2021). <https://www.iso.org/standard/79429.html>

## Evidencia de implementación

Implementación: modelos, migraciones, pruebas, conciliación de inventario y respaldo. Evidencia final en `docs/03_evidencias/2026-10-11/`: `regresion-completa.md` y `respaldo-usb.md`.

---

# Capítulo 13: Escenario Técnico del Sistema

**UNIVERSIDAD NACIONAL DE INGENIERÍA**

------------------------------------------------------------------------

------------------------------------------------------------------------


**Líneas base rectoras**  
REQ-MREC-001 v1.0  
DA-MREC-001 v1.0  
DD-MREC-001 v1.0  
**Versión:** 1.2  
**Etapa:** Desarrollo final y preparación de despliegue en empresa real


**Docente:** Ing. Roberto Alfaro  
**Carrera:** Ingeniería en Computación  
**Grupo:** 4S1-COM-S  
**Fecha de actualización:** 11 de octubre de 2026  
**Ubicación:** Managua, Nicaragua


**Equipo de trabajo**  

| **Integrante**              | **Carnet** | **No. Persona** |
|:----------------------------|:-----------|:----------------|
| Ángel Antonio Alonso Suárez | 2021-0087U | 6B763BC6        |
| Noel Isaac Alemán Carballo  | 2022-0376U | 6B76CA80        |
| Mendell Noé Parrales Molina | 2020-1014U | 6AAB3C24        |

**Sexto informe de la segunda entrega – Ingeniería de Software 1**  
Continuación de la línea base de análisis y diseño


## Escenario y límites

El sistema implementa un monolito modular de Django con PostgreSQL, derivado de la línea base arquitectónica y del diseño (Alonso Suárez et al., 2026a, 2026b). La empresa y la distribución de sus áreas son reales. En la etapa actual, el software se ejecuta y prueba localmente en equipos Windows del equipo de desarrollo, en `127.0.0.1`; el despliegue operativo en la empresa todavía está pendiente. DA-MREC-001, vista V-05, y DD-MREC-001, modelo M-DEP-01, piden representar servidor local, terminales, periféricos, energía y copias. Este informe documenta la arquitectura física real y el plan de implantación para cuatro puestos POS y hasta diez sesiones concurrentes, distinguiendo la infraestructura definida de lo ya ejecutado en los equipos de desarrollo.

## Arquitectura implementada

| Capa | Artefacto | Función y frontera |
|:---|:---|:---|
| Presentación | `templates/`, `static/`, `commerce/views.py` | Pantallas, formularios, navegación por rol, mensajes y adaptación HTTP. No fija el total monetario definitivo. |
| Aplicación | `services.py`, `pricing_services.py`, `warranty_services.py`, `cancellation_services.py` | Casos de uso, permisos, transacciones y eventos auditables. |
| Dominio/datos | `commerce/models.py`, `pricing.py`, `catalog_queries.py` | Entidades, restricciones, cálculo monetario puro y consultas. |
| Persistencia | PostgreSQL 18.4, migraciones Django | Datos relacionales, bloqueo/actualización condicional, `NUMERIC`, FK, `CHECK` y `UNIQUE`. |
| Operación | `scripts/`, comandos de gestión, `README.md` | Inicio local, roles, conciliación, copia y diagnóstico. |

Las transacciones confirmadas no se eliminan: la anulación conserva factura y número, crea movimiento compensatorio solo por pieza apta y deuda de reembolso por pago. La venta conserva precios, tasas y garantía al momento de confirmar. Las seis fuentes oficiales de la primera entrega están copiadas sin modificación en `docs/01_linea_base/`; la implementación no limita el esquema a las ocho tablas del documento original.

## Dimensionamiento y criterios de propiedad

La vista V-05 de DA-MREC-001 prevé hasta cuatro estaciones POS, diez usuarios concurrentes, servidor local, impresora de comprobantes, lector tipo teclado, UPS y copia protegida. Para reflejar los puestos reales de la empresa se definen cuatro terminales de mostrador, una de bodega, una de Administración, una de Gerencia y una de la Propietaria: ocho equipos cliente en total. Las cuatro POS son capacidad física, no cuatro cuentas compartidas; cada empleado inicia sesión con su identidad. El servidor se dimensiona para diez sesiones simultáneas, que incluyen puestos presentes y crecimiento de dos sesiones, sin afirmar una certificación de capacidad en red física.

El único equipo cuya disponibilidad fue declarada por el equipo del proyecto es una impresora multifunción Canon imageCLASS MF445dw. Se propone incorporarla como **PRN1**, conectada por Ethernet, para facturas de demostración, reportes y documentos tamaño carta. Canon especifica impresión láser monocromática, dúplex automático, hasta 40 páginas por minuto en carta, interfaz 10/100/1000Base-T y Wi-Fi 802.11b/g/n (Canon Latin America, s. f.). No se presupone que el equipo ya esté configurado, que su tóner sea nuevo ni que tenga garantía vigente: antes de usarlo se revisarán placa eléctrica, contador, consumibles y conectividad. El comprobante del software es una página imprimible desde el navegador; *no* se afirma compatibilidad ensayada con una impresora térmica de 80 mm ni emisión fiscal autorizada.

## Inventario físico

| ID / área | Cant. | Perfil que lo utiliza | Especificación mínima propuesta |
|:---|:---|:---|:---|
| POS01–04, mostrador | 4 | Vendedores y cajeros, con inicio de sesión individual por turno. | PC de cuatro núcleos, 8 GB RAM, SSD 256 GB, monitor 1920x1080, teclado, ratón y Ethernet 1 Gb/s; lector USB-HID y cajón físico en cada puesto. |
| BOD01, bodega | 1 | Encargado de bodega. | PC de cuatro núcleos, 8 GB RAM, SSD 256 GB, Ethernet 1 Gb/s y lector USB-HID para códigos. |
| ADM01, oficina | 1 | Administrador del sistema y de operaciones. | PC de cuatro núcleos, 8 GB RAM, SSD 256 GB, monitor 1920x1080 y Ethernet 1 Gb/s. |
| GER01, gerencia | 1 | Gerente. | Portátil de cuatro núcleos, 8 GB RAM, SSD 256 GB, pantalla y teclado integrados; Wi-Fi de personal o adaptador Ethernet. |
| PROP01, gerencia | 1 | Propietaria o propietario. | Portátil de cuatro núcleos, 8 GB RAM, SSD 256 GB; Ethernet o Wi-Fi de personal. |

Todos los clientes necesitan navegador actualizado y sistema operativo con parches. El acceso a costos, aprobaciones y auditoría depende de la cuenta, no del puesto ni de la dirección IP. La aplicación no exige instalar una base de datos en los equipos cliente. Un lector USB-HID actúa como teclado: introduce el código en el campo enfocado; no requiere acceso directo al servidor ni un servicio de escaneo independiente. Estos mínimos son propuesta de compra/reutilización, no especificaciones de equipos ya inspeccionados.

El inventario fija seis estaciones de escritorio (cuatro POS, BOD01 y ADM01) y dos portátiles (GER01 y PROP01). Por tanto se cuentan seis monitores, seis teclados y seis ratones externos; los dos portátiles incorporan pantalla y teclado y conservan sus dos cargadores. SRV1 se administra de forma remota desde ADM01 y no necesita un monitor permanente. Si se decide cablear los dos portátiles, se requieren dos adaptadores o bases Ethernet y dos tomas adicionales.

## Lista de infraestructura y adquisiciones

| ID | Cant. | Estado | Especificación y función |
|:---|:---|:---|:---|
| SRV1 | 1 | Adquirir/reutilizar | Servidor local: CPU de ocho núcleos, 32 GB RAM preferiblemente ECC, dos SSD de 1 TB en espejo, NIC 1 Gb/s y fuente protegida. Aloja aplicación, PostgreSQL, registros y tareas; el espejo mejora continuidad, pero no sustituye la copia. |
| R1 | 1 | Adquirir/reutilizar | Enrutador/cortafuegos con VLAN, listas de control, DHCP por segmento y registro. La LAN debe seguir operativa si se interrumpe Internet. |
| SW1 | 1 | Adquirir/reutilizar | Conmutador administrable de 24 puertos Gigabit, VLAN 802.1Q y al menos un puerto PoE para AP1. Once enlaces activos de base y dos opcionales para portátiles dejan reserva de puertos. |
| AP1 | 1 | Adquirir/reutilizar | Punto de acceso de personal, enlace cableado y SSID separado; WPA2-AES o WPA3 según los clientes. Los POS y el servidor permanecen cableados. |
| NAS1 | 1 | Adquirir/reutilizar | Almacenamiento de dos bahías con dos discos de 2 TB en espejo y acceso restringido para copias diarias verificables; una unidad USB cifrada adicional se rota fuera del rack. |
| UPS1 | 1 | Adquirir/reutilizar | UPS line-interactive de referencia de al menos 1500 VA/900 W para SRV1, R1, SW1 y NAS1; autonomía real y voltaje se calculan con la carga medida antes de adquirir. |
| PRN1 | 1 | Aportada | Canon imageCLASS MF445dw; impresora láser multifunción monocromática compartida por Ethernet. Ubicación propuesta: oficina contigua al mostrador. |
| LAP01–02 | 2 | Aportada | Computadoras portátiles con CPU de cuatro núcleos, 8 GB RAM, SSD 256 GB, pantalla y periféricos integrados; facilitan el acceso gerencial a la plataforma web mediante Wi-Fi o Ethernet. |
| LCT01–05 | 5 | Adquirir/reutilizar | Lectores de código USB-HID, cuatro en POS y uno en bodega; compatibles con la codificación del catálogo. |
| CAJ01–04 | 4 | Adquirir/reutilizar | Cajones de dinero bajo control físico de cada POS y turno; el software registra arqueos, no abre el cajón por hardware. |
| PC01–06 | 6 | Adquirir/reutilizar | Computadoras de escritorio con CPU de cuatro núcleos, 8 GB RAM, SSD 256 GB y red Ethernet 1 Gb/s; ejecutan las sesiones operativas fijas de mostrador, bodega y administración. |
| MON01–06 | 6 | Adquirir/reutilizar | Monitores 1920x1080 para las seis estaciones de escritorio; soporte ajustable y conexión compatible con cada PC. |
| TEC01–06 | 6 | Adquirir/reutilizar | Teclados externos para las seis estaciones de escritorio, preferiblemente resistentes a uso intensivo de mostrador. |
| RAT01–06 | 6 | Adquirir/reutilizar | Ratones externos para las seis estaciones de escritorio; los portátiles usan panel táctil integrado. |
| ADP01–02 | 2 opc. | Solo si cableados | Adaptadores o bases Ethernet 1 Gb/s para los dos portátiles cuando se prefiera red cableada. |
| BKP-USB1 | 1 | Adquirir/reutilizar | Unidad externa cifrable de al menos 2 TB para rotación fuera del rack; no reemplaza NAS1 ni la prueba de restauración. |
| PDU1 | 1 | Adquirir/reutilizar | Regleta de distribución para rack compatible con UPS1, capacidad y conectores verificados contra la carga real. |
| RACK1 | 1 | Adquirir/reutilizar | Gabinete cerrado ventilado, patch panel de al menos 24 puertos, organizadores y latiguillos etiquetados para SRV1, red y UPS. |
| CBL | 8+2 opc. | Adquirir/instalar | Ocho tendidos permanentes Cat 6: cuatro POS, BOD01, ADM01, PRN1 y AP1; dos adicionales si se cablean los portátiles. Tres latiguillos cortos enlazan R1, SRV1 y NAS1 con SW1 dentro del rack; dos latiguillos por toma remota y repuestos etiquetados. |
| ELEC | 16 tomas | Obra propuesta | Tomas con tierra: doce para seis PC y seis monitores, dos para cargadores de portátiles, una para UPS1/PDU1 y una protegida independiente para PRN1. El circuito, la capacidad y la puesta a tierra se verificarían por personal competente. |
| MOB | 8 puestos | Adquirir/reutilizar | Cuatro superficies de mostrador, un banco de bodega, un escritorio administrativo y dos superficies de gerencia; ocho sillas o apoyos apropiados al puesto. |
| SUM-PRN | 1 lote inicial | Adquirir | Papel tamaño carta y tóner compatible con PRN1; consumibles periódicos, no periféricos adicionales. |

El presupuesto de compra es una *lista de cantidades y mínimos*, no una cotización: ocho estaciones cliente, un servidor, seis conjuntos de monitor/teclado/ratón, cinco lectores, cuatro cajones, red central, almacenamiento, unidad externa, UPS, rack, cableado, mobiliario de puesto y alimentación. PRN1 se reutiliza; por ello no se incluye una impresora nueva como compra obligatoria. Una impresora térmica podría evaluarse en otra iteración, pero requeriría diseño y prueba del formato de 80 mm antes de aprobar su adquisición. Tampoco se recomienda conectar PRN1 al UPS1: Canon indica un consumo máximo aproximado de 1330 W, mayor que la potencia de salida de referencia del UPS propuesto; PRN1 tendría toma protegida independiente (Canon Latin America, s. f.). Los 16 puntos eléctricos son una estimación funcional, no un diseño eléctrico certificado.

## Diagramas de composición y especificaciones físicas

Las fichas siguientes complementan el plano y la topología de red. La cantidad figura en cada bloque; las especificaciones son mínimos de selección, salvo la impresora aportada. Las siglas son las mismas del inventario, lo que permite seguir cada activo hasta su ubicación y conexión.

<figure>

<figcaption>Equipos de cómputo del escenario: un servidor y ocho clientes. Ninguno se declara ya adquirido o inspeccionado.</figcaption>
</figure>

<figure>

<figcaption>Red, respaldo y periféricos del escenario; PRN1 es el único equipo declarado disponible. El equipo restante se adquiriría o reutilizaría tras verificar su estado.</figcaption>
</figure>

## Plano funcional de las áreas de la empresa

<figure>

<figcaption>Distribución funcional propuesta; no es un plano arquitectónico a escala ni una instalación realizada.</figcaption>
</figure>

Las canalizaciones llevan cada toma de red al patch panel de RACK1; no se conectan puestos en cadena. El rack se ubica fuera del acceso del público, con cierre, ventilación y protección eléctrica. La impresora puede moverse dentro del área de mostrador/Administración sin cambiar el direccionamiento lógico. La ubicación definitiva de tomas, potencia y rutas de cable se confirmará durante la instalación física en el local real.

## Diagrama de red y direccionamiento

<figure>

<figcaption>Topología LAN en estrella. LCT01–05 son USB en sus estaciones; UPS1 alimenta SRV1, R1, SW1 y NAS1, sin transportar datos.</figcaption>
</figure>

| VLAN | Subred propuesta | Equipos / direcciones de ejemplo | Tráfico permitido |
|:---|:---|:---|:---|
| 10 Servidores | 10.20.10.0/24 | R1 .1; SRV1 .10; NAS1 .20 | HTTPS hacia SRV1 desde personal; respaldo SRV1 hacia NAS1. PostgreSQL solo local al servidor. |
| 20 POS | 10.20.20.0/24 | POS01–04 por DHCP reservado | HTTPS a SRV1 e impresión a PRN1; sin acceso administrativo a red. |
| 30 Oficinas | 10.20.30.0/24 | ADM01, GER01, PROP01; Wi-Fi de personal | HTTPS a SRV1; gestión de infraestructura solo desde ADM01 autorizada. |
| 40 Bodega | 10.20.40.0/24 | BOD01 por DHCP reservado | HTTPS a SRV1 e impresión a PRN1 si se autoriza. |
| 50 Impresión | 10.20.50.0/24 | PRN1 .10 | Acepta trabajos desde VLAN 20/30/40; no inicia acceso a la base. |
| 99 Gestión | 10.20.99.0/24 | SW1 .2; AP1 .3 | Acceso administrativo restringido; ningún cliente general. |

R1 es la puerta de enlace .1 en cada segmento y aplica denegación entre VLAN salvo los flujos descritos. El puerto de PostgreSQL no se publica a los clientes; navegador y servidor se comunican por HTTPS dentro de la LAN planificada. La pérdida de WAN no detiene ventas locales, aunque servicios bancarios externos, actualizaciones y copias fuera del local sí podrían depender de conectividad. Este direccionamiento es una propuesta documental, no una configuración aplicada en los dispositivos.

## Entorno reproducible de clase

Requisitos observados: Python 3.13, Django 5.2.17, `psycopg` 3.3.6 y PostgreSQL 18.4 en puerto local 55432. El repositorio fija las dependencias Python en `requirements.txt`. El gestor de base es una instancia aislada de otra instalación del equipo; la cuenta de aplicación no es superusuario y la de pruebas solo crea bases temporales. La configuración se toma de `MREC_DB_ENGINE`, `MREC_DB_NAME`, `MREC_DB_USER`, `MREC_DB_HOST`, `MREC_DB_PORT` y `MREC_DB_PASSWORD`. La clave de Django debe venir de `MREC_SECRET_KEY` cuando `DEBUG=0`. Nunca debe agregarse al Git.

Secuencia local en PowerShell, desde la raíz del repositorio:

1.  Crear entorno: `py -3.13 -m venv .venv` e instalar `requirements.txt`.

2.  Iniciar instancia aislada: `.\scripts\start-postgres.ps1`. Configurar previamente variables de entorno de la base según `README.md`.

3.  Ejecutar `.\scripts\manage-postgres.ps1 migrate` y `setup_roles`.

4.  Preparar los seis perfiles académicos con `provision_project_users`; conservar las claves fuera del repositorio. En una instalación nueva también se pueden crear cuentas individuales desde Administración.

5.  Iniciar `runserver 127.0.0.1:8000` y abrir <http://127.0.0.1:8000/>. El servidor de desarrollo solo es para clase.

6.  Ejecutar `test --noinput`, `check` y `check_inventory`; registrar resultados y versión del commit.

El servidor local respondió HTTP 200 en la pantalla de ingreso y la configuración pasó `manage.py check`. La comprobación de modelos no detectó migraciones nuevas sin generar. La regresión PostgreSQL de cierre terminó con **120 pruebas aprobadas**, cero fallos y cero errores. La auditoría de despliegue LAN comprobó guardas para `DEBUG=0`, clave externa, hosts y orígenes CSRF restringidos, cookies seguras y proxy TLS. El directorio de informes contiene una fuente LaTeX independiente por documento.

## Flujos demostrables

| Rol/flujo | Demostración sugerida |
|:---|:---|
| Administración | Crear producto, proveedor y política de descuento; registrar impuesto de simulación explícito; revisar solicitudes. |
| Bodega | Recibir compra y verificar saldo/Kardex; crear conteo y solicitar aprobación de diferencia. |
| Vendedor | Buscar compatibilidad, emitir cotización, abrir caja, crear borrador, cobrar venta con dos pagos y mostrar comprobante. |
| Gerencia/Administración | Aprobar excepción de descuento de otro usuario, decidir garantía/devolución/anulación, revisar deudas y auditoría. |
| Equipo técnico | Ejecutar pruebas, diagnóstico local, conciliación, copia y lectura de manifiesto. |

## Operación, copia e incidente

El sistema cuenta con bloqueo temporal de ingreso, sesión de treinta minutos de inactividad, CSRF, permisos de servidor y eventos con ID de correlación. El comando `backup_database` genera una copia PostgreSQL y manifiesto SHA-256; `verify_backups` comprobó respaldos locales y una copia en unidad externa cifrada con BitLocker. Los simulacros de `verify_restore` restauraron la copia en una base temporal separada, verificaron 46 migraciones y no alteraron la base principal, con resultados entre 3,29 s y 7,27 s según el escenario. Para una intervención, `MREC_RECOVERY_MODE=1` suspende las solicitudes web con HTTP 503 hasta que el operador lo retire tras la verificación. Estas pruebas validan el procedimiento de respaldo antes de su operación programada en la empresa.

## Adquisición, instalación y comprobación física

La empresa y sus áreas son reales; este informe define *qué se debe disponer e instalar* para el despliegue, sin inventar facturas de compra ni atribuir al local equipos no inspeccionados. PRN1 es el único equipo declarado disponible; sus características se toman de la ficha del modelo y su estado concreto se comprobará. Para los demás renglones de la lista se revisará primero si el proyecto dispone de equipo reutilizable que cumpla el mínimo; de lo contrario se adquirirá. La identidad de cada activo, número de serie, ubicación y responsable se completará en el inventario al recibirlo.

| Fase | Actividades y evidencia esperada |
|:---|:---|
| 1\. Preparación | Confirmar plano, tomas eléctricas, ventilación, distancias de cable y disponibilidad de las ocho estaciones. Verificar el estado, consumibles y puerto Ethernet de PRN1. Levantar cotizaciones conforme a los mínimos de la lista; no asignar precios no comprobados. |
| 2\. Núcleo local | Instalar RACK1, energía protegida, R1, SW1, SRV1 y NAS1. Etiquetar puertos y cables Cat 6, medir continuidad y registrar números de serie. Conectar PRN1 a toma protegida independiente, fuera de UPS1. |
| 3\. Red y seguridad | Configurar VLAN, direcciones reservadas, reglas de R1, Wi-Fi de personal, DNS local y certificado HTTPS para un nombre interno. Mantener PostgreSQL accesible solo desde SRV1 y restringir gestión de R1/SW1/AP1. |
| 4\. Puestos | Incorporar POS01–04, BOD01, ADM01, GER01 y PROP01; instalar navegadores y controladores de PRN1; conectar lectores USB. Validar que cada empleado use cuenta propia y que los cuatro cajones tengan custodia física por turno. |
| 5\. Aceptación | Probar acceso simultáneo desde cuatro POS y seis sesiones adicionales, impresión de comprobante en PRN1, lectura de cinco lectores, corte de WAN sin perder ventas LAN, apagado ordenado por UPS y restauración desde copia en medio separado. Guardar acta con fecha, responsable y resultado de cada prueba. |

Las fases describen el plan de implantación de una infraestructura real, cuya ejecución física está pendiente. La evidencia final comprueba el guion de despliegue LAN y la cadena de respaldo en los equipos de desarrollo: la restauración temporal del escenario tomó entre 3,29 s y 7,27 s, y una copia externa cifrada con BitLocker superó la verificación SHA-256. La capacidad de diez sesiones y los objetivos RPO/RTO se medirán durante la instalación en SRV1, UPS1 y la LAN de la empresa. Tampoco se afirma cumplimiento ISO certificado ni autorización tributaria: la tasa de impuesto sigue siendo un parámetro de simulación y el comprobante lo advierte.

## Criterios de entrega y conclusión

El paquete de desarrollo reúne una aplicación reproducible y un diseño físico coherente con la empresa real: ocho puestos cliente para empleados, gerencia y propiedad; SRV1 local; PRN1 aportada; lectoras, cajones, red segmentada, almacenamiento y alimentación protegida. El plano funcional y el diagrama LAN explicitan dónde se ubicará cada activo y cómo se comunicará. Las tablas permiten comprobar qué se tiene declarado, qué se comprará o reutilizará y qué especificación mínima debe cumplir.

La aplicación ofrece flujos comerciales en navegador local durante la etapa de desarrollo; las pruebas registran comportamiento transaccional, permisos, rendimiento local, restauración temporal, configuración de proxy TLS y respaldo programado. La infraestructura descrita corresponde a una empresa real y su instalación operativa constituye la siguiente etapa del proyecto. Así, el equipo puede distinguir entre controles ya verificados internamente y validaciones que se completarán durante la implantación.

## Referencias

Alonso Suárez, Á. A., Alemán Carballo, N. I., & Parrales Molina, M. N. (2026a). *Descripción de la arquitectura de software de Moto Repuestos El Centenario* \[Documento académico no publicado\]. Universidad Nacional de Ingeniería.

Alonso Suárez, Á. A., Alemán Carballo, N. I., & Parrales Molina, M. N. (2026b). *Documentación de diseño del sistema Moto Repuestos El Centenario* \[Documento académico no publicado\]. Universidad Nacional de Ingeniería.

Canon Latin America. (s. f.). *imageCLASS MF445dw: especificaciones*. <https://www.cla.canon.com/en/p/imageclass-mf445dw>

## Evidencia de implementación

Fuentes: `README.md`, `requirements.txt`, `docs/01_linea_base/` y `MATRIZ_FINAL_TRAZABILIDAD.md`. Evidencia final en `docs/03_evidencias/2026-10-11/`: `despliegue-lan.md`, `entorno-fisico-perifericos.md`, `respaldo-programado-politica.md` y `respaldo-usb.md`.

---

# Capítulo 14: Proforma e Informe de Infraestructura Tecnológica

UNIVERSIDAD NACIONAL DE INGENIERÍA
Dirección de Área de Conocimiento DACTIC
Asignatura: Ingeniería de Software 1
PROFORMA E INFORME DE
INFRAESTRUCTURA TECNOLÓGICA
Auditoría de Activos Preexistentes, Levantamiento Ex-Works y Régimen de
Importación DGA
Caso de estudio: Distribuidora Comercial “Moto Repuestos El Centenario, S.A.”
Líneas base rectoras
REQ-MREC-001 v1.0
DA-MREC-001 v1.0
DD-MREC-001 v1.0
Versión: 2.0 Definitiva
Etapa: Presupuestación, Activos
e Importación de Equipamiento
Docente: Ing. Roberto Alfaro
Carrera: Ingeniería en Computación
Grupo: 4S1-COM-S
Fecha de actualización:
Noviembre de 2026
Ubicación: Managua, Nicaragua
Equipo de trabajo
Integrante
Carnet
No. Persona
Ángel Antonio Alonso Suárez
2021-0087U
6B763BC6
Noel Isaac Alemán Carballo
2022-0376U
6B76CA80
Mendell Noé Parrales Molina
2020-1014U
6AAB3C24
Informe Técnico y Financiero Complementario – Ingeniería de Software 1
Estudio de prefactibilidad de adquisiciones, patrimonio tecnológico y régimen aduanero

---

Índice
1
Contextualización del Entorno Operativo y Estrategia de Adquisición
2
2
Inventario, Auditoría y Valoración del Hardware Antiguo (Activos Preexistentes)
3
2.1
Detalle Técnico de Activos Preexistentes y Destino Operativo . . . . . . . . . . . . . . .
3
2.2
Comparativa Energética: Parque Antiguo vs. Parque Nuevo Proyectado . . . . . . . . .
4
3
Análisis y Dimensionamiento del Núcleo de Procesamiento Central (Servidor)
5
4
Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
7
4.1
Resumen de Capacidad de Almacenamiento a 5 Años . . . . . . . . . . . . . . . . . . .
7
5
Almacenamiento en Red y Arquitectura de Respaldo 3-2-1 (NAS)
9
6
Topología de Red, Conmutación y Enrutamiento Perimetral
11
7
Dimensionamiento de Estaciones de Trabajo y Dispositivos de Interfaz Operativa
12
8
Continuidad Operativa y Acondicionamiento Energético
13
9
Análisis de Costo Total de Propiedad (TCO) para Consumibles de Impresión
14
9.1
Aclaración y Unificación de Precios de Consumibles
. . . . . . . . . . . . . . . . . . . .
14
10 Modelado Financiero y Proforma Estructural Consolidada (Mercado Origen)
16
11 Fase de Internalización, Logística y Régimen Aduanero en Nicaragua
18
11.1 Vectores Logísticos: Carga Marítima vs. Carga Aérea Express . . . . . . . . . . . . . . .
18
11.2 Modelado Tributario Aduanero (CIF, DAI e IVA)
. . . . . . . . . . . . . . . . . . . . . . .
18
12 Dualidad Presupuestaria y Patrimonio Total de TI
20
13 Conclusiones Integrales del Proyecto Físico
21
1

---

## Contextualización del Entorno Operativo y Estrategia de Adquisición

1
Contextualización del Entorno Operativo y Estrategia de Adquisi-
ción
La transición de un entorno de desarrollo local hacia un despliegue operativo en un entorno co-
mercial real exige una reevaluación profunda de la infraestructura subyacente. El sistema diseñado
para la empresa Distribuidora Comercial Moto Repuestos El Centenario, S.A., ubicada en el Distrito
III de Managua (Corredor Pista Suburbana – El Zumen), fundamentado en una arquitectura de mo-
nolito modular utilizando el marco de trabajo Django 5.x y un motor de base de datos relacional
PostgreSQL 18.4, ha operado en un entorno de pruebas restringido a la dirección de bucle local
(127.0.0.1). El paso hacia la operación en piso de ventas requiere la implementación de un ecosis-
tema de hardware físico compuesto por un servidor central, topología de red conmutada, sistemas
de almacenamiento para copias de seguridad, protección eléctrica de grado informático y un to-
tal de ocho estaciones cliente distribuidas en las áreas de mostrador, bodega, administración y
gerencia.
La formulación de un presupuesto preciso para esta infraestructura presenta desafíos lo-
gísticos y comerciales significativos cuando se depende exclusivamente del mercado local nicara-
güense, donde la disponibilidad de equipos de grado corporativo es intermitente y la fijación de
precios a menudo carece de transparencia pública. En consecuencia, la estrategia de adquisición
más eficiente y predecible consiste en realizar un levantamiento de costos basado en la plataforma
de Amazon en los Estados Unidos. Esta metodología permite establecer una línea base de profor-
ma estructurada, estandarizada y auditable, a la cual posteriormente se le aplican los modelos
matemáticos de importación, fletes y aranceles aduaneros correspondientes a la legislación de Ni-
caragua. El presente informe detalla la especificación técnica de cada componente, la auditoría y
valoración del hardware preexistente, la dualidad patrimonial entre inversión de caja y valor de
parque tecnológico, los costos en origen y la modelización tributaria aduanera de nacionalización.
2

---

## Inventario, Auditoría y Valoración del Hardware Antiguo (Activos Preexistentes)
### Detalle Técnico de Activos Preexistentes y Destino Operativo

2
Inventario, Auditoría y Valoración del Hardware Antiguo (Activos
Preexistentes)
Antes del inicio del proyecto de ingeniería, el local operaba bajo un esquema informal con equipos
domésticos y obsoletos que presentaban graves riesgos de continuidad operativa. Conforme a
las normativas de valuación y amortización de la Ley No. 822 (Ley de Concertación Tributaria de
Nicaragua, Arts. 44 y 45), se efectuó el levantamiento físico y contable de los activos encontrados
en las instalaciones:
2.1
Detalle Técnico de Activos Preexistentes y Destino Operativo
1. Impresora Multifunción Láser Canon imageCLASS MF445dw (PRN1): Adquirida en mayo de
2025 (1.5 años de antigüedad). Costo histórico de compra: $350.00 USD (C$ 12,880.00 NIO). Vida
útil contable y fiscal: 5 años (20% anual = $70.00 USD/año). Depreciación acumulada: $105.00
USD (C$ 3,864.00 NIO). Valor neto actual en libros: $245.00 USD (C$ 9,016.00 NIO). Dispone
de interfaz Gigabit Ethernet, Wi-Fi 802.11b/g/n, escáner dúplex y soporte para cartuchos de alto
rendimiento Canon 057H (10,000 páginas). Estado físico: Excelente (8/10). Destino: Reutiliza-
ción al 100% integrada en la VLAN 50 (Servicios de Impresión) con IP estática 10.20.50.10/24
y conectada a toma protegida independiente (fuera del UPS1 por su pico térmico de fusor de
1,330 W). Su retención representa un ahorro directo de $350.00 a $450.00 USD netos en el
flujo de caja inicial al no requerir la compra de un dispositivo nuevo similar.
2. Computadoras Antiguas de Mostrador (2 Unidades Clones Core 2 Duo): Procesadores Intel
Core 2 Duo E7500/E8400, 4 GB RAM DDR2/DDR3, discos mecánicos HDD SATA de 250 GB y 320
GB con sectores dañados. Costo original conjunto: $600.00 USD ($300 c/u). Antigüedad: más
de 6 años (100% amortizadas; valor en libros = $0.00 USD). Valor residual de salvamento:
$80.00 USD conjunto ($40 c/u). Destino: La Unidad 1 se reasigna como terminal pasiva offline
en banco de trabajo de taller (aislada de red, solo manuales en PDF); la Unidad 2 se da de baja
para desguace.
3. Módem / Cable-Router Residencial del ISP: Suministrado por la empresa proveedora de In-
ternet bajo comodato ($0.00 USD en libros). Destino: Reutilizado en Modo Puente (Bridge
3

---

### Comparativa Energética: Parque Antiguo vs. Parque Nuevo Proyectado

Mode) conectado al puerto WAN1 del router empresarial TP-Link ER605, delegando en este úl-
timo la seguridad perimetral.
4. Regletas Eléctricas Domésticas: 3 regletas en cascada ($0.00 USD en libros). Destino: Baja y
desecho inmediato por alto riesgo de sobrecargas y cortocircuitos. Sustituidas por el gabinete
mural 12U, la PDU profesional y el UPS CyberPower CP1500PFCLCD.
Cuadro 1: Inventario Físico y Contable de Activos Preexistentes
Activo Preexistente
Costo
Histórico
Deprec.
Acum.
Valor
Libros
Destino en el
Proyecto
Impresora Canon
MF445dw (PRN1)
$350.00
USD
-$105.00
USD
$245.00
USD
Reutilizada 100%
(VLAN 50)
2x PCs Clones Core 2
Duo
$600.00
USD
-$600.00
USD
$80.00
USD*
1x Taller offline / 1x
Baja
Módem Residencial ISP
$0.00 USD
$0.00 USD
$0.00 USD
Modo Puente a
Router ER605
Regletas Eléctricas en
cascada
$45.00 USD
-$45.00 USD
$0.00 USD
Desecho (Riesgo
crítico)
TOTAL PREEXISTENTE
$995.00
USD
-$750.00
USD
$325.00
USD
*Valor residual
conjunto
2.2
Comparativa Energética: Parque Antiguo vs. Parque Nuevo Proyectado
Bajo la tarifa comercial T-B de Disnorte-Dissur en Managua ($0.195 USD/kWh ≈C$ 7.176 NIO/kWh):
- Parque Antiguo (2 PCs + Módem + Impresora): Demanda diurna: 269 W =⇒92.46 kWh/mes =
$18.03 USD/mes (C$ 663.50 NIO/mes). Consumo específico:
269 W
2 puestos = 134.5 W por estación.
- Parque Nuevo (Rack 24/7 + 8 Estaciones + Impresora): Demanda continua de Rack 24/7 (152
W) + puestos clientes en jornada comercial (346 W) = 498 W pico
=⇒
200.58 kWh/mes =
$39.11 USD/mes (C$ 1,439.25 NIO/mes), ajustándose con exactitud al presupuesto de $40.00
USD/mes de energía en OPEX.
- Mejora en Eficiencia: Consumo por puesto integral:
498 W
8 puestos + Infra = 62.25 W por estación. La
eficiencia energética por puesto mejora en un 53.7%.
4

---

## Análisis y Dimensionamiento del Núcleo de Procesamiento Central (Servidor)

3
Análisis y Dimensionamiento del Núcleo de Procesamiento Central
(Servidor)
El eje fundamental de la arquitectura de la aplicación es el servidor local, designado en el plano
funcional como SRV1, el cual alojará la lógica de negocio de Django, las rutinas de persistencia
de PostgreSQL y las tareas de conciliación programadas. La base de datos requiere capacidades
transaccionales robustas que incluyen actualizaciones condicionales, restricciones de integridad
y tipos de datos numéricos exactos (NUMERIC) para el cálculo monetario puro. Para satisfacer es-
tas demandas de procesamiento concurrente, estimadas en un crecimiento de hasta diez sesiones
simultáneas intensivas, la especificación demanda un procesador de ocho núcleos, 32 GB de me-
moria RAM y almacenamiento redundante de estado sólido.
El escrutinio del mercado estadounidense señala al servidor Dell PowerEdge T150 como
la plataforma de factor de forma de torre más idónea para este caso de estudio. Este equipo es-
tá concebido para pequeñas y medianas empresas que carecen de un centro de datos tradicional,
ofreciendo dimensiones compactas de 360 mm de altura, 175 mm de ancho y 453.8 mm de profun-
didad. Su peso máximo, incluso cuando todas las bahías de discos están pobladas, se mantiene en
un nivel manejable de 11.68 kg (25.74 lb), lo que facilita su instalación y manipulación en el cuarto
técnico cerrado de la empresa.
Desde el punto de vista del rendimiento, el PowerEdge T150 soporta procesadores de la
familia Intel Xeon E, garantizando el ancho de banda computacional necesario para las consultas
complejas sobre el catálogo y el Kardex. El componente más crítico para la estabilidad de Post-
greSQL es la memoria RAM; este servidor admite módulos UDIMM con Código de Corrección de
Errores (ECC) operando a velocidades de hasta 3200 MT/s. La incorporación de 32 GB de RAM ECC
previene la corrupción silenciosa de datos causada por inversiones de bits en la memoria volátil, un
riesgo inaceptable cuando se procesan eventos auditables, garantías y cancelaciones monetarias.
Para el almacenamiento primario, el chasis admite hasta cuatro unidades cableadas, lo que permi-
te configurar perfectamente los dos discos de estado sólido (SSD) de 1 TB requeridos en un arreglo
de espejo (RAID 1), garantizando la continuidad del servicio ante un fallo mecánico o electrónico
de una unidad individual.
La eficiencia térmica y acústica del servidor también incide en los costos operativos indirec-
5

---

tos. El T150 está diseñado con un único ventilador central que optimiza el flujo de aire sobre los
componentes críticos. Emplea una fuente de alimentación de clase Bronze de 300 W o Platinum de
400 W, que operan con una disipación de calor máxima de 1024 BTU/hora y 1365 BTU/hora respec-
tivamente. Estas cifras confirman que el equipo no sobrecargará la capacidad térmica del cuarto
de telecomunicaciones, eliminando la necesidad de invertir en sistemas de aire acondicionado de
precisión.
Adicionalmente, la línea PowerEdge integra el Controlador de Acceso Remoto de Dell
(iDRAC9), una herramienta fundamental para la administración sin agentes. A través de iDRAC9,
el administrador del sistema puede acceder a telemetría en tiempo real, redirección de consola
virtual, gestión de perfiles de configuración y bloqueos de seguridad desde su terminal (ADM01).
Esta capacidad remota reduce drásticamente los tiempos de intervención física y permite la in-
tegración con API RESTful mediante Redfish para futuras automatizaciones. Las cotizaciones en
Amazon para configuraciones a medida de este equipo sitúan la proyección presupuestaria en
aproximadamente $1,600.00 USD.
Cuadro 2: Especificaciones Técnicas del Servidor Central (SRV1)
Especificación
Atributo Técnico y Componente de Mercado
Modelo Base
Dell PowerEdge T150 (Factor de forma en torre 4U)
Procesamiento (CPU)
Intel Xeon E-series (ej. E-2378 de 8 núcleos a 2.60 GHz)
Memoria (RAM)
32 GB (2x 16 GB) DDR4 ECC UDIMM a 3200 MT/s
Almacenamiento (SSD)
2x 1 TB SSD SATA 6Gbps configurados en espejo (RAID
1)
Fuente de Alimentación
300 W Bronze (100–240 VAC, autoajustable, disipación
1024 BTU/hr)
Gestión Remota
iDRAC9 (Telemetría, API RESTful, Bloqueo de sistema,
Consola virtual)
Dimensiones y Peso
453.8 mm (profundidad) x 175 mm (ancho) x 360 mm
(altura); 11.68 kg
Precio Estimado
$1,600.00 USD (Configuración a medida en Amazon US)
6

---

## Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
### Resumen de Capacidad de Almacenamiento a 5 Años

4
Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
Para asegurar la estabilidad, predictibilidad y costo cero de licenciamiento ($0.00 USD en licen-
cias), el servidor central SRV1 opera bajo una arquitectura 100% Software Libre y de Código Abierto
(FOSS):
Cuadro 3: Matriz Técnica del Software Instalado en el Servidor Central (SRV1)
Software /
Servicio
Versión
Función en la Arquitectura
Licencia
Costo
Debian GNU/Linux
12.x LTS
Minimal
Sistema Operativo Host base
(Kernel 6.1 LTS)
GPL/FOSS
$0.00
Nginx
1.22+
Reverse Proxy, TLS 1.3
offloader, caché estáticos
BSD
$0.00
Gunicorn
22.0+
WSGI Application Server (5 a
17 workers)
MIT
$0.00
Python Runtime
3.12+
Intérprete y entorno virtual
aislado (venv)
PSF
$0.00
Django Framework
5.0+ LTS
Framework web ERP y lógica
de negocio
BSD
$0.00
PostgreSQL
18.4
Motor de base de datos
relacional ACID
PostgreSQL
$0.00
nftables / UFW
1.0+
Firewall de host perimetral
(puertos 80/443/22)
GPLv2
$0.00
Fail2Ban
1.0+
Prevención de intrusiones y
bloqueo IP reactivo
GPLv2
$0.00
smartmontools
7.3+
Telemetría S.M.A.R.T. de
desgaste físico SSD
GPLv2
$0.00
pgBackRest
2.50+
Motor de respaldo continuo y
streaming WAL
MIT
$0.00
TOTAL LICENCIAS
–
Stack Tecnológico
Empresarial 100% FOSS
–
$0.00 USD
4.1
Resumen de Capacidad de Almacenamiento a 5 Años
El análisis dinámico de capacidad demuestra que a lo largo de un quinquenio comercial (84,146
facturas acumuladas con 15% de crecimiento interanual):
- Consumo de Disco a 5 Años: La totalidad de los datos (base de datos relacional 1.8 GB, índices
2.2 GB, WAL logs 4.0 GB, facturas PDF 8.0 GB, sistema operativo Debian y librerías 7.2 GB, trazas
de logs 7.8 GB, respaldos diarios temporales 15.0 GB y contingencia 12.0 GB) demandará 58.00
7

---

GB de espacio útil.
- Espacio Remanente: Frente al arreglo RAID 1 de 1,000 GB útiles, la ocupación es de apenas el
5.80%, quedando más de 942 GB libres (94.20%).
- Caché en Memoria RAM: Al ser la base de datos de 4.0 GB a 5 años y tener asignados 8.0 GB a
shared_buffers, el 100% de la base de datos reside en la RAM, con tasa de aciertos superior
al 99.8% y latencias menores a 5 ms.
- Desgaste de SSDs: Las escrituras diarias de 25 GB físicos acumulan 45.63 TBW en 5 años, re-
presentando apenas el 7.60% del límite de 600 TBW de las unidades de estado sólido.
8

---

## Almacenamiento en Red y Arquitectura de Respaldo 3-2-1 (NAS)

5
Almacenamiento en Red y Arquitectura de Respaldo 3-2-1 (NAS)
La preservación de la base de datos transaccional y los registros de auditoría recae sobre un diseño
de respaldo estructurado y físicamente aislado. Las líneas base del proyecto exigen la generación
de copias de seguridad locales y su verificación criptográfica mediante hashes SHA-256. Para al-
bergar estas copias diarias de forma segura y automatizada en la red local (VLAN 10), se requiere
un dispositivo de Almacenamiento Conectado a la Red (NAS1), además de un disco externo para
rotación fuera del sitio (BKP-USB1).
La evaluación de soluciones de almacenamiento centralizado posiciona al Synology DiskS-
tation DS224+ como la pieza de hardware ideal para este entorno. Se trata de un NAS de dos bahías
gestionado por el sistema operativo DiskStation Manager (DSM), impulsado por un procesador In-
tel Celeron J4125 de cuatro núcleos y equipado con 2 GB de memoria RAM nativa. Sus dimensiones
son de 165 mm de altura, 108 mm de ancho y 232.2 mm de profundidad, con un peso en vacío
de 1.3 kg, lo que permite su integración sencilla en el bastidor de red. Consume 14.69 W durante
operaciones de lectura/escritura y 4.41 W en hibernación. En Amazon, el dispositivo sin discos se
comercializa en $361.19 USD.
Para popular el dispositivo NAS, se seleccionan dos discos Seagate IronWolf de 2 TB (modelo
ST2000VN004). Estos discos operan a 5900 RPM, poseen 64 MB de memoria caché y se comunican
mediante interfaz SATA de 6.0 Gb/s. El factor tecnológico más determinante es el uso de Grabación
Magnética Convencional (CMR), en lugar de Grabación Magnética Superpuesta (SMR). Los discos
SMR experimentan caídas drásticas de rendimiento durante la reconstrucción de arreglos RAID,
comprometiendo la integridad de los datos. La tecnología CMR asegura un rendimiento sostenido
y predecible. El costo unitario de estos discos asciende a $174.99 USD ($349.98 USD por el par).
Finalmente, para cumplir con la política de copias en frío extraíbles bajo el estándar 3-2-1, se con-
templa un disco duro externo USB de 2 TB rugerizado y cifrado con LUKS2 / BitLocker (BKP-USB1),
tasado en $80.00 USD.
Topología de Continuidad 3-2-1: Copia 1 en caliente (SRV1 RAID 1 hardware), Copia 2 en red
local aislada (NAS Synology DS224+ en VLAN 10 con snapshots Btrfs inmutables anti-ransomware
y verificación SHA-256) y Copia 3 fuera de sitio (Disco USB de 2 TB LUKS2 en caja fuerte gerencial).
Métricas operativas: RPO ≤15 min y RTO ≤2 horas.
9

---

Cuadro 4: Desglose del Subsistema de Almacenamiento y Respaldo (NAS1 y BKP-USB1)
Componente
Especificaciones Técnicas
Costo (USD)
Gabinete NAS (DS224+)
2 Bahías, Celeron J4125, 2GB RAM, 2x RJ45
1GbE
$361.19
Discos NAS (x2)
Seagate IronWolf 2TB ST2000VN004, 5900
RPM, CMR
$349.98
Disco Externo
(BKP-USB1)
2 TB USB 3.0, Cifrado militar LUKS2 / AES-256
$80.00
Total Subsistema
Capacidad bruta 4TB, redundancia RAID 1
de 2TB
$791.17
10

---

## Topología de Red, Conmutación y Enrutamiento Perimetral

6
Topología de Red, Conmutación y Enrutamiento Perimetral
La integridad de las transacciones comerciales depende de un aislamiento estricto del tráfico, dicta-
do por el diseño de redes virtuales (VLAN). La topología planeada establece segmentos separados:
VLAN 10 para infraestructura (servidor y NAS), VLAN 20 para los puntos de venta (mostrador), VLAN
30 para las áreas administrativas (oficinas y gerencia), VLAN 40 para la gestión de bodega, VLAN
50 para servicios de impresión y VLAN 99 para la gestión nativa de los dispositivos de red. Esta
compartimentación mitiga el movimiento lateral; si un equipo de punto de venta es comprometi-
do, los protocolos de capa de red le impedirán alcanzar las interfaces administrativas del servidor
o acceder a internet abierto si no está explícitamente permitido en las Listas de Control de Acceso
(ACL).
El gobierno del tráfico inter-VLAN se delega al enrutador y cortafuegos R1. El modelo TP-
Link ER605 (Omada SDN) cumple a cabalidad con estas exigencias. Soporta conectividad de múl-
tiples redes WAN (Multi-WAN), VPN y servidores DHCP vinculados a las respectivas VLAN, con un
costo de $60.00 USD en Amazon.
La distribución física de los datos requiere un conmutador principal (SW1) de altas presta-
ciones: el TP-Link JetStream TL-SG2428P. Este conmutador administrable aloja 24 puertos RJ45
Gigabit y 4 ranuras SFP, ofreciendo una capacidad de conmutación de 56 Gbps y una tasa de re-
envío de 41.7 Mpps, con una tabla de direcciones MAC de hasta 8,000 entradas. Incorpora alimen-
tación PoE+ (estándar IEEE 802.3at/af) con un presupuesto total de 250 W, consumiendo hasta
308.6 W de la red eléctrica y emitiendo 1,052.94 BTU/hr de calor. Su costo de adquisición ronda
los $220.00 USD. Para el punto de acceso inalámbrico (AP1) de gerencia, se selecciona el TP-Link
Omada EAP610 ($100.00 USD), alimentado por PoE+ desde el SW1.
11

---

## Dimensionamiento de Estaciones de Trabajo y Dispositivos de Interfaz Operativa

7
Dimensionamiento de Estaciones de Trabajo y Dispositivos de In-
terfaz Operativa
El acceso del personal a la plataforma comercial se materializa a través de navegadores web en
los equipos cliente. El inventario exige dotar de estaciones a cuatro operadores de punto de venta
(POS01–04, VLAN 20 10.20.20.0/24), un encargado de bodega (BOD01, VLAN 40 10.20.40.0/24),
un administrador (ADM01, VLAN 30 10.20.30.0/24), además de proporcionar portátiles para el
gerente y la propietaria/supervisión (GER01 y PROP01 / LAP01–02, VLAN 30 10.20.30.0/24). La
premisa de diseño establece que el monolito de Django ejecutará los cálculos del lado del servi-
dor, por lo que los terminales no requieren procesadores de gama extrema, pero sí demandan un
desempeño fluido para renderizar el DOM del navegador. Las especificaciones mínimas para estos
ocho clientes son procesadores de cuatro núcleos, 8 GB de RAM y SSD de 256 GB.
Para las seis posiciones estacionarias (PC01–06), las computadoras de formato compacto
o Micro (ej. Dell OptiPlex) se cotizan en $350.00 USD por unidad ($2,100.00 USD subtotal). Las ne-
cesidades de movilidad de la gerencia se solventan con dos portátiles corporativas (LAP01–02, ej.
Lenovo ThinkPad) cotizadas en $450.00 USD cada una ($900.00 USD subtotal). Como las portátiles
modernas carecen de puerto Ethernet RJ45 nativo, se incluyen dos adaptadores Anker PowerEx-
pand USB-C a Gigabit Ethernet (ADP01–02) de $25.99 USD cada uno ($51.98 USD).
La interacción física con el software se complementa con:
- Lectores de Códigos de Barras (LCT01–05): Cinco lectores ópticos USB-HID ($40.00 USD c/u,
subtotal $200.00 USD) que emulan pulsaciones de teclado e inyectan el código directamente en
los formularios web de Django sin requerir controladores propietarios.
- Cajones Portamonedas (CAJ01–04): Cuatro cajones metálicos Volcora de 16 pulgadas ($60.00
USD c/u, subtotal $240.00 USD) con compartimentos para 5 billetes y 8 monedas, bajo custodia
física por turno.
- Monitores y Periféricos: Seis monitores LED de 24” Full HD 1920x1080 (MON01–06, $100.00
USD c/u, subtotal $600.00 USD) y seis juegos de teclado y ratón alámbrico USB (PER01–06, $20.00
USD c/u, subtotal $120.00 USD).
12

---

## Continuidad Operativa y Acondicionamiento Energético

8
Continuidad Operativa y Acondicionamiento Energético
Para resguardar el cuarto técnico ante fallos en el suministro eléctrico, se especifica el Sistema de
Alimentación Ininterrumpida UPS1: el CyberPower CP1500PFCLCD (1500 VA / 1000 W). Este mode-
lo fue seleccionado por suministrar una onda sinusoidal pura (Pure Sine Wave) durante el modo
batería. Los servidores modernos con fuentes con Corrección de Factor de Potencia Activo (Acti-
ve PFC) rechazan las ondas sinusoidales simuladas de los UPS económicos, provocando apagados
repentinos. El CP1500PFCLCD evita esta incompatibilidad y se cotiza en $239.95 USD.
La carga combinada del rack se calcula en:
1. Servidor Dell T150: ≈150 W bajo carga transaccional.
2. Conmutador TL-SG2428P + AP1 PoE: ≈50 W.
3. NAS Synology DS224+ con discos: ≈15 W.
4. Enrutador ER605 y cableado: ≈15 W.
La carga total suma entre 230 W y 250 W. Bajo esta demanda, el UPS ofrece una autonomía de 10
a 15 minutos, tiempo suficiente para que el servidor ejecute la rutina de apagado automático con-
trolado mediante señal USB, guardando los datos en disco sin corromper PostgreSQL. Se agregan
un gabinete de pared de 12U (RACK1, $150.00 USD), una regleta PDU de 8 tomas (PDU1, $40.00
USD) y un lote de cableado UTP Cat 6, patch panel y conectores (CBL, $150.00 USD).
13

---

## Análisis de Costo Total de Propiedad (TCO) para Consumibles de Impresión
### Aclaración y Unificación de Precios de Consumibles

9
Análisis de Costo Total de Propiedad (TCO) para Consumibles de Im-
presión
La empresa dispone de una impresora multifunción láser corporativa Canon imageCLASS
MF445dw (PRN1), debidamente auditada y reutilizada. Por tanto, el análisis financiero en es-
te rubro concierne exclusivamente a los consumibles recurrentes: cartuchos de tóner y papel
bond carta.
9.1
Aclaración y Unificación de Precios de Consumibles
Para solventar cualquier aparente discordancia numérica previa:
1. La partida presupuestaria inicial SUM-PRN cotizada en proforma por $206.99 USD corresponde
estrictamente al lote de aprovisionamiento de arranque: un cartucho original estándar Canon
057 ($166.99 USD) más una caja de 5,000 hojas de papel bond ($40.00 USD)
=⇒
$166.99 +
$40.00 = $206.99 USD.
2. El cartucho de alto rendimiento original Canon 057H (10,000 páginas) tiene un costo de catá-
logo en origen de $348.65 USD ($0.0348/página).
3. Los cartuchos compatibles certificados de terceros de alto rendimiento rinden 10,000 páginas
a un precio unitario de $38.95 USD ($0.0039/página).
4. La demanda mensual de impresión (1,040 facturas + 300 hojas de cierres y kardex) es de 1,340
páginas/mes. El consumo de papel representa exactamente $10.72 USD/mes (1, 340×$0.0080).
5. Sustentación del OPEX de $45.00 USD/mes: Este rubro mensual cubre holgadamente el pa-
pel ($10.72/mes) y asigna $34.28/mes para amortizar tóner institucional. Con tóner compatible
($5.22/mes de tóner + $10.72 de papel = $15.94/mes), el excedente de $29.06/mes se acumula
como fondo de mantenimiento preventivo para reemplazo de rodillos de arrastre y kit de fijación
de la Canon MF445dw.
14

---

Cuadro 5: Comparativa Cuantitativa de Costo por Página para la Impresora Canon MF445dw
Opciones de Consumible
Rendimiento
Precio (USD)
Costo / Pág.
Duración
Canon 057 (Original Estándar)
3,100 págs.
$166.99
$0.0538 USD
2.3 meses
Canon 057H (Original Alto
Rendimiento)
10,000 págs.
$348.65
$0.0348 USD
7.5 meses
Compatible 057 (Terceros
Estándar)
3,100 págs.
$33.95
$0.0109 USD
2.3 meses
Compatible 057H (Terceros
Alto Rendimiento)
10,000 págs.
$38.95
$0.0039 USD
7.5 meses
Papel Bond Carta (Caja 5,000
hojas)
5,000 hojas
$40.00
$0.0080 USD
3.7 meses
15

---

## Modelado Financiero y Proforma Estructural Consolidada (Mercado Origen)

10
Modelado Financiero y Proforma Estructural Consolidada (Merca-
do Origen)
La siguiente tabla detalla la proforma consolidada de adquisición en la plataforma Amazon EE. UU.
(valores Ex-Works antes de fletes e impuestos de importación):
Cuadro 6: Proforma de Equipamiento e Infraestructura
Tecnológica (Precios Amazon US)
ID / Ref.
Descripción Técnica del Componente
Cant.
Unit. (USD)
Subtotal (USD)
SRV1
Servidor Dell PowerEdge T150 (8 Cores,
32GB ECC, 2x 1TB SSD)
1
$1,600.00
$1,600.00
NAS1
Synology DiskStation DS224+ (NAS 2
Bahías, Diskless)
1
$361.19
$361.19
NAS-HDD
Disco Seagate IronWolf 2TB
ST2000VN004 (SATA CMR)
2
$174.99
$349.98
BKP-
USB1
Disco Duro Externo USB 3.0 de 2 TB
(Cifrado LUKS / BitLocker)
1
$80.00
$80.00
PC01–06
PC Micro / SFF (Core i5, 8GB RAM,
256GB SSD) para POS/Adm.
6
$350.00
$2,100.00
LAP01–02
Portátiles corporativas (Core i5, 8GB
RAM, 256GB SSD) gerencia
2
$450.00
$900.00
MON01–
06
Monitor LED 24” Full HD 1920x1080
6
$100.00
$600.00
PER01–06
Conjunto de teclado y ratón alámbrico
USB
6
$20.00
$120.00
LCT01–05
Lector de código de barras óptico
USB-HID
5
$40.00
$200.00
CAJ01–04
Cajón de dinero Volcora 16” metálico
RJ11 / 24V
4
$60.00
$240.00
ADP01–
02
Adaptador Anker USB-C a Gigabit
Ethernet
2
$25.99
$51.98
R1
Enrutador / Cortafuegos TP-Link ER605
Multi-WAN
1
$60.00
$60.00
SW1
Conmutador TP-Link TL-SG2428P 24P
GbE PoE+ 250W
1
$220.00
$220.00
AP1
Punto de acceso TP-Link Omada
EAP610 PoE
1
$100.00
$100.00
UPS1
UPS CyberPower CP1500PFCLCD
1500VA/1000W Onda Pura
1
$239.95
$239.95
RACK1
Gabinete cerrado ventilado de pared
12U
1
$150.00
$150.00
CBL
Bobina Cat 6, Patch Panel 24P y
conectores RJ45
1
$150.00
$150.00
16

---

Cuadro 6: Proforma de Equipamiento e Infraestructura
Tecnológica (Precios Amazon US)
ID / Ref.
Descripción Técnica del Componente
Cant.
Unit. (USD)
Subtotal (USD)
PDU1
Regleta PDU de rack 1U con 8
tomacorrientes
1
$40.00
$40.00
SUM-PRN
Lote inicial: Tóner Canon 057 Original +
Papel 5,000 hojas
1
$206.99
$206.99
INVERSIÓN SUB-TOTAL EX-WORKS (EE. UU.)
$7,770.09
17

---

## Fase de Internalización, Logística y Régimen Aduanero en Nicaragua
### Vectores Logísticos: Carga Marítima vs. Carga Aérea Express
### Modelado Tributario Aduanero (CIF, DAI e IVA)

11
Fase de Internalización, Logística y Régimen Aduanero en Nica-
ragua
El costo final de los equipos puestos en Managua debe incorporar los gastos de transporte in-
ternacional y la liquidación de impuestos de importación ante la Dirección General de Servicios
Aduaneros (DGA) de Nicaragua.
11.1
Vectores Logísticos: Carga Marítima vs. Carga Aérea Express
Los envíos aéreos express ($7.00–$7.50 USD/lb) resultan inviables para el paquete completo debido
al alto peso del servidor, monitores y gabinete, y a las restricciones aéreas de transporte de baterías
de plomo-ácido como la del UPS CyberPower. Por tanto, se selecciona la vía marítima consolidada,
con tarifas de $2.75 a $3.50 USD/lb y un tiempo de tránsito de 15 a 20 días hábiles. Para un peso
total estimado de 250 a 300 lb, el flete marítimo se calcula en $800.00 USD.
11.2
Modelado Tributario Aduanero (CIF, DAI e IVA)
Para mercancías con valor superior a $200.00 USD, los impuestos se calculan sobre el valor CIF
(Cost, Insurance, and Freight):
Valor CIF = Costo Ex-Works + Flete Marítimo + Seguro (1.5%)
(1)
El cálculo arancelario se desglosa según las normas de la DGA:
1. Costo Ex-Works: $7,770.09 USD.
2. Flete Marítimo (250–300 lb): $800.00 USD.
3. Seguro de Tránsito (1.5%): $116.55 USD.
4. Valor CIF Consolidado: $8,686.64 USD.
5. DAI (Derechos Arancelarios a la Importación): Se estiman $150.00 USD (0% para computado-
ras bajo SAC 8471.30/41, y 5–15% para accesorios y partes misceláneas).
6. Base Imponible para IVA: Valor CIF + DAI = $8, 836.64 USD.
7. IVA (15% en cascada): 15% × $8, 836.64 = $1, 325.50 USD.
18

---

Cuadro 7: Proyección Monetaria Total de Importación y Nacionalización
Concepto Tributario / Logístico
Monto Proyectado (USD)
Costo Base de Hardware (Ex-Works Amazon US)
$7,770.09
Flete Marítimo Internacional (Consolidado)
$800.00
Seguro de Tránsito Internacional (1.5%)
$116.55
Valor CIF Consolidado (Base Imponible Aduanera)
$8,686.64
Derechos Arancelarios a la Importación (DAI estima-
do)
$150.00
Base para Cálculo del IVA (CIF + DAI)
$8,836.64
Impuesto al Valor Agregado (IVA 15%)
$1,325.50
Costo Total Proyectado Nacionalizado
$10,162.14
El proceso de importación incrementa el costo base en un 30.8%, situando el presupuesto
global del equipamiento de hardware puesto en Managua en $10,162.14 USD (C$ 373,966.75 NIO).
19

---

## Dualidad Presupuestaria y Patrimonio Total de TI

12
Dualidad Presupuestaria y Patrimonio Total de TI
Para evitar cualquier confusión contable, se sintetiza la dualidad entre el valor de los activos que
operan físicamente en el local y los flujos financieros de desembolso:
1. Patrimonio Tecnológico Integral en Operación ($13,987.14 USD / C$ 514,726.75 NIO): Re-
presenta el valor total de los activos tecnológicos tangibles e intangibles del negocio:
Patrimonio Total = $325.00 (HW Libros) + $10, 162.14 (HW Nuevo)
+ $2, 700.00 (Software) + $800.00 (Instalación) = $13, 987.14 USD
(2)
(A valor histórico de adquisición, el parque tecnológico totaliza $14,612.14 USD).
2. Flujo de Inversión Inicial en Efectivo Desembolsado (I0 = $13, 662.14 USD / C$ 502,766.75
NIO): Representa el capital líquido efectivamente pagado en el Año 0:
I0 = $10, 162.14 (HW Nacionalizado) + $2, 700.00 (Software COCOMO II)
+ $800.00 (Instalación) = $13, 662.14 USD
(3)
3. Ahorro por Reutilización de Impresora: La integración de la Canon imageCLASS MF445dw
evitó un desembolso adicional de $350.00 a $450.00 USD en la proforma de compras.
20

---

## Conclusiones Integrales del Proyecto Físico

13
Conclusiones Integrales del Proyecto Físico
El análisis minucioso de la infraestructura y el desglose de su logística de adquisición ratifican que
el salto a producción del sistema comercial para Distribuidora Comercial Moto Repuestos El Cente-
nario, S.A. requiere una inversión integral bien calculada en hardware, redes, protección energética
y logística de importación.
La estrategia de centralizar el procesamiento intensivo en el servidor Dell PowerEdge T150
(con 32 GB de RAM ECC y RAID 1) permite mantener costos eficientes en los puestos cliente me-
diante microordenadores convencionales. El aislamiento del tráfico a través del conmutador ad-
ministrable TL-SG2428P y el enrutador ER605 garantiza la seguridad transaccional por VLANs. El
subsistema NAS Synology DS224+ con discos Seagate IronWolf CMR satisface la política de copias
de seguridad auditadas con comprobación SHA-256 e inmutabilidad anti-ransomware. Finalmente,
el respaldo eléctrico con onda sinusoidal pura del CyberPower CP1500PFCLCD protege la integri-
dad de los datos en PostgreSQL ante eventuales interrupciones del fluido eléctrico en el local.
21

---

# Capítulo 15: Informe Financiero y de Viabilidad Cuantitativa

UNIVERSIDAD NACIONAL DE INGENIERÍA
Dirección de Área de Conocimiento DACTIC
Asignatura: Ingeniería de Software 1
INFORME FINANCIERO Y
DE VIABILIDAD CUANTITATIVA
Costos de Desarrollo (COCOMO II), Proforma de Infraestructura, TCO de
Consumibles, Flujo de Capital (Años 0 a 5) y Marco Contractual
Caso de estudio: Distribuidora Comercial Moto Repuestos El Centenario, S.A.
Docente: Ing. Roberto Alfaro
Carrera: Ingeniería en Computación
Grupo: 4S1-COM-S
Fecha de emisión: Noviembre de 2026
Ubicación: Managua, Nicaragua
Tipo de Cambio O
cial (BCN): C$ 36.8000
NIO/USD
Equipo de Consultoría y Desarrollo
Integrante
Carnet
No. Persona
Ángel Antonio Alonso Suárez
2021-0087U
6B763BC6
Noel Isaac Alemán Carballo
2022-0376U
6B76CA80
Mendell Noé Parrales Molina
2020-1014U
6AAB3C24

---

Índice
1. Introducción y Per
l del Caso de Estudio Emulado
3
1.1. Per
l Comercial y Entorno de Negocio en Managua . . . . . . . . . . . . . . . . . . . . .
3
1.2. Modelo Matemático de Facturación y Ticket Promedio . . . . . . . . . . . . . . . . . . .
3
2. Justi
cación Matemática y Operativa de Clientes (Doble Enfoque)
5
2.1. Enfoque Comercial: Teoría de Colas (M/M/c) y Pérdidas por Abandono . . . . . . . . .
5
2.2. Proyección Quinquenal de Escalabilidad Comercial (Años 0 a 5) . . . . . . . . . . . . . .
5
2.3. Enfoque Técnico y de Red: Estaciones Cliente y Carga sobre el Servidor . . . . . . . . .
6
3. Estimación del Costo de Desarrollo (Modelo COCOMO II  Enfoque Post-Architecture)
7
3.1. De
nición Directa del Enfoque Metodológico Adoptado . . . . . . . . . . . . . . . . . . .
7
3.2. Justi
cación de Factores de Escala (B = 1.00) y Multiplicadores (EAF = 0.35) . . . . .
7
3.3. Cálculo Monetario del Desarrollo . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
8
4. Inventario y Valoración del Hardware Antiguo (Activos Preexistentes)
9
4.1. Detalle de Activos Preexistentes y Destino Operativo . . . . . . . . . . . . . . . . . . . .
9
4.2. Comparativa de Consumo y E
ciencia Eléctrica . . . . . . . . . . . . . . . . . . . . . . .
9
5. Proforma de Infraestructura Tecnológica y Logística DGA
10
5.1. Modelo Tributario y Liquidación Aduanera (DGA) . . . . . . . . . . . . . . . . . . . . .
10
6. Presupuesto Total de Inversión y Dualidad Patrimonial
12
6.1. Dualidad entre Patrimonio Tecnológico y Desembolso de Caja . . . . . . . . . . . . . . .
12
6.2. Depreciación Fiscal y Escudo Tributario (Ley No. 822 LCT) . . . . . . . . . . . . . . . .
12
7. Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
13
7.1. Stack de Software y A
nación de PostgreSQL para 32 GB RAM ECC
. . . . . . . . . .
13
7.2. Análisis Dinámico de Capacidad a 5 Años . . . . . . . . . . . . . . . . . . . . . . . . . .
13
8. Estrategia de Respaldo 3-2-1 y Continuidad Operativa
15
9. Análisis de Consumibles y Comparación Cuantitativa de Gastos
16
9.1. Uni
cación y Corrección de Consumibles (TCO Tóner y Papel) . . . . . . . . . . . . . .
16
9.2. Comparación Cuantitativa de Gastos (Antes vs. Después)
. . . . . . . . . . . . . . . . .
16
10.Gastos Fijos Operativos (OPEX), Mantenimiento y Evolución de Software
17
10.1. Desglose Técnico y Comprobación de Gastos Fijos (OPEX = $200.00 USD/mes)
. . . .
17
10.2. Plan de Mantenimiento (ISO/IEC 14764) y Desarrollo de Nuevas Funciones (Evolutivo)
18

---

11.Análisis del Flujo de Capital (Años 0 a 5) e Indicadores Financieros
19
11.1. Cálculo Detallado de Métricas Financieras . . . . . . . . . . . . . . . . . . . . . . . . . .
19
12.Análisis de Sensibilidad y Escenarios de Riesgo
20
13.Marco Jurídico en Nicaragua y Contrato de Software
21
13.1. Normativa Legal Vigente de la República de Nicaragua . . . . . . . . . . . . . . . . . . .
21
13.2. Estructura Contractual Esencial (Cláusulas I a XII)
. . . . . . . . . . . . . . . . . . . .
21
14.Conclusiones Integrales del Dictamen
23
15.Referencias y Fuentes Normativas
24

---

## Introducción y Perfil del Caso de Estudio Emulado
### Perfil Comercial y Entorno de Negocio en Managua
### Modelo Matemático de Facturación y Ticket Promedio

1.
Introducción y Per
l del Caso de Estudio Emulado
El presente informe constituye el dictamen técnico-
nanciero y jurídico de
nitivo para la transformación
digital e implantación de infraestructura tecnológica de la empresa comercial Distribuidora Comercial
Moto Repuestos El Centenario, S.A., ubicada en el Corredor Comercial Pista Suburbana  El
Zumen, Distrito III del Municipio de Managua, República de Nicaragua.
1.1.
Per
l Comercial y Entorno de Negocio en Managua
La empresa se especializa en la importación, distribución mayorista y comercialización al detalle de
repuestos mecánicos, sistemas de tracción, componentes eléctricos y lubricantes para motocicletas de
trabajo utilitario y mototaxis (caponeras) que dominan el parque vehicular de la capital (marcas Génesis
HJ-125/GXT-200, Pulsar/Bajaj NS 200/Discover 125/Torito RE, Honda GL 150/CB125F, Yamaha
YBR 125 y Serpento).
Régimen de Operación Semanal: Lunes a sábado de 8:00 AM a 5:30 PM (9.5 horas continuas
diarias). Cierre dominical para inventario y mantenimiento.
Jornada Mensual Laborable: 26 días hábiles exactos (6 días/semana × 4.333 semanas/mes =
26 días).
Horas Operativas Mensuales: 9.5 horas/día × 26 días = 247.0 horas/mes.
A
uencia Diaria en Mostrador: 120 a 150 clientes/día (media ponderada de 135 consultas y
cotizaciones diarias).
Volumen Transaccional Facturado: 40 transacciones/día de venta concretadas (rango de disper-
sión: 35 a 45 ventas diarias).
Tasa de Conversión en Mostrador (CR): CR =
40
135 × 100 % ≈29.63 % (≈30 %).
1.2.
Modelo Matemático de Facturación y Ticket Promedio
A partir del levantamiento auditado y la tasa de cambio o
cial del Banco Central de Nicaragua (TC =
36.80 NIO/USD), la facturación se modela con rigor paramétrico:
Volumen Transaccional Mensual (NV M): 40 ventas/día × 26 días = 1, 040 facturas/mes.
Ventas Brutas Mensuales (VM): Exactamente C$ 250,000.00 NIO/mes, equivalente a:
VM,USD =
C$250, 000.00
36.80 NIO/USD = $6, 793.48 USD/mes
(1)
Ticket Promedio Global (TP ):
TP =
C$250, 000.00
1, 040 transacciones = C$240.38 NIO
($6.53 USD)
(2)
Facturación Bruta Anualizada: $6, 793.48×12 = $81, 521.74 USD/año (≈$81, 516.00 USD/año =
C$3, 000, 000.00 NIO/año).

---

Cuadro 1: Desglose Ponderado de Facturación Mensual por Mezcla de Productos (Ticket Mix)
Segmento de Repuestos
Mix ( %)
Ventas/Mes
Ticket (NIO)
Total (NIO)
Total (USD)
A: Consumibles y Menores (bujías,
cables,
ltros)
75.0 %
780
C$ 110.00
C$ 85,800.00
$2,331.52
B: Partes Medianas (fricciones, kit
tracción, baterías)
20.0 %
208
C$ 550.00
C$ 114,400.00
$3,108.70
C: Motor y Mayoristas (cilindros, ci-
güeñales, carbu.)
5.0 %
52
C$ 957.69
C$ 49,800.00
$1,353.26
TOTAL
CONSOLIDADO
MENSUAL
100.0 %
1,040
C$ 240.38
C$ 250,000.00
$6,793.48

---

## Justificación Matemática y Operativa de Clientes (Doble Enfoque)
### Enfoque Comercial: Teoría de Colas (M/M/c) y Pérdidas por Abandono
### Proyección Quinquenal de Escalabilidad Comercial (Años 0 a 5)

2.
Justi
cación Matemática y Operativa de Clientes (Doble Enfoque)
Uno de los requerimientos metodológicos fundamentales consiste en fundamentar la necesidad del sistema
y la dotación de equipamiento mediante un doble enfoque: el enfoque comercial (comportamiento de
colas y pérdidas en mostrador) y el enfoque técnico/red (clientes de red y concurrencia sobre el servidor).
2.1.
Enfoque Comercial: Teoría de Colas (M/M/c) y Pérdidas por Abandono
La interacción en mostrador comprende dos per
les operativos: atención rápida de despacho (70 % del
ujo, ts,R = 2.5 min) y asesoría técnica con despiece y veri
cación física de compatibilidad (30 % del
ujo, ts,C = 10.0 min). El tiempo medio ponderado de atención por cliente es:
¯ts = (0.70 × 2.5) + (0.30 × 10.0) = 4.75 minutos/cliente =⇒µ = 60
4.75 = 12.63 clientes/hora por caja
(3)
Durante las franjas pico del negocio (9:30 AM12:30 PM y 2:30 PM4:30 PM, total 5.0 horas/día que
concentran el 81.5 % de las transacciones), la tasa media de llegada combinada (consultas y compradores)
es de λ = 22.0 cl/h, con picos críticos de hasta λmax = 24.0 cl/h.
Situación Previa con 2 Cajas Obsoletas (c = 2):
 Capacidad de servicio: 2 × 12.63 = 25.26 cl/h. Factor de utilización: ρ =
24.0
25.26 = 95.0 %.
 En un sistema M/M/2 al 95 % de saturación, la cola matemática arroja:
Wq ≈22.8 minutos de espera
y
Lq ≈9.1 clientes en
la
(4)
 Pérdida por Abandono de Mostrador: Una espera de casi 23 minutos en un mostrador
congestionado inducía un abandono comprobado del 6.5 % de los compradores:
Ventas Perdidas = 40×0.065 = 2.6 ventas/día =⇒Pérdida = 2.6×26×C$240.38 = C$16, 249.69 NIO/mes ($
(5)
En un año operativo, la carencia de cajas provocaba pérdidas por $5,298.84 USD/año.
Situación con Proyecto mediante 4 Terminales POS (c = 4):
 Capacidad de servicio: 4 × 12.63 = 50.52 cl/h. Factor de utilización: ρ =
24.0
50.52 = 47.5 %.
 Longitud de cola esperada: Lq = 0.137 clientes en espera.
 Tiempo medio de espera en cola:
Wq = Lq
λ = 0.137
24.0 = 0.0057 horas = 0.34 minutos (≈20.6 segundos)
(6)
 Conclusión: Se elimina el 100 % del abandono por colas, recuperando ventas efectivas por C$
155,997.78 NIO/año ($4,239.07 USD/año).
2.2.
Proyección Quinquenal de Escalabilidad Comercial (Años 0 a 5)
Con una Tasa de Crecimiento Anual Compuesta (CAGR) proyectada del g = 12.5 % anual en el mercado
de motocicletas:
Año 0 (Base 2026): 40.0 ventas/día →1,040 ventas/mes →C$ 250,000 NIO/mes ($6,793.48 USD)
→4 POS al 47.5 % de uso.
Año 1 (2027): 45.0 ventas/día →1,170 ventas/mes →C$ 281,250 NIO/mes ($7,642.66 USD) →4
POS al 53.4 % de uso.

---

### Enfoque Técnico y de Red: Estaciones Cliente y Carga sobre el Servidor

Año 2 (2028): 50.6 ventas/día →1,316 ventas/mes →C$ 316,406 NIO/mes ($8,597.99 USD) →4
POS al 60.1 % de uso.
Año 3 (2029): 57.0 ventas/día →1,481 ventas/mes →C$ 355,957 NIO/mes ($9,672.74 USD) →4
POS al 67.6 % de uso.
Año 4 (2030): 64.1 ventas/día →1,666 ventas/mes →C$ 400,452 NIO/mes ($10,881.84 USD) →
4 POS al 76.0 % de uso.
Año 5 (2031): 72.1 ventas/día →1,875 ventas/mes →C$ 450,508 NIO/mes ($12,242.07 USD)
→4 POS al 85.5 % de uso (Wq ≈3.4 min).
2.3.
Enfoque Técnico y de Red: Estaciones Cliente y Carga sobre el Servidor
El despliegue informático requiere 8 estaciones clientes interconectadas mediante el switch administrable
TP-Link TL-SG2428P sobre cableado Cat 6 y enlace Wi-Fi empresarial:
Cuadro 2: Mapeo Integral de Estaciones Clientes y Asignación de Roles
Host
Rol Operativo Primario
Ubicación
VLAN Asignada
IP Estátic
POS01
Caja y Facturación Mostrador 1
Mostrador Frontal
VLAN 20 (POS)
10.20.20.11
POS02
Caja y Facturación Mostrador 2
Mostrador Frontal
VLAN 20 (POS)
10.20.20.12
POS03
Caja y Facturación Mostrador 3
Mostrador Frontal
VLAN 20 (POS)
10.20.20.13
POS04
Caja y Facturación Mostrador 4
Mostrador Frontal
VLAN 20 (POS)
10.20.20.14
BOD01
Recepción y Despacho Inventario
Bodega Posterior
VLAN 40 (Bodega)
10.20.40.10
ADM01
Contabilidad, Precios y Administración
O
cina Administrativa
VLAN 30 / VLAN 99
10.20.30.10
GER01 (LAP01)
Gerencia General y Reportes Ejecutivos
Gerencia / Móvil
VLAN 30 (O
cinas)
10.20.30.21
PROP01 (LAP02)
Propietaria, Supervisión y Auditoría
Gerencia / Móvil
VLAN 30 (O
cinas)
10.20.30.22
Análisis de Concurrencia y Workers Gunicorn en SRV1: Durante el cierre diario (5:155:30 PM)
convergen simultáneamente 4 cajas en arqueo, 1 terminal de bodega ingresando remisiones, 1 terminal
administrativa en kardex, 2 laptops gerenciales generando PDFs y 2 procesos en segundo plano (respaldo
a NAS y hash SHA-256), alcanzando un pico estricto de 10 sesiones concurrentes. Aplicando la
fórmula de dimensionamiento WSGI para el procesador Intel Xeon de 8 núcleos físicos:
Nworkers = (2 × Ncores) + 1 = (2 × 8) + 1 = 17 workers sincronos concurrentes
(7)
Dado que 17 > 10, ninguna petición HTTP entra en cola, manteniendo la latencia LAN por debajo de
45 ms.

---

## Estimación del Costo de Desarrollo (Modelo COCOMO II – Enfoque Post-Architecture)
### Definición Directa del Enfoque Metodológico Adoptado

3.
Estimación del Costo de Desarrollo (Modelo COCOMO II  Enfo-
que Mixto Cuanti-Cualitativo)
3.1.
Naturaleza Metodológica del Análisis: Enfoque Mixto (Cuantitativo y Cuali-
tativo)
Para fundamentar con rigor metodológico la estimación de costos ante la cátedra de Ingeniería de
Software 1, se establece de forma categórica que el análisis aplicado mediante COCOMO II Post-
Architecture es de naturaleza MIXTA (Híbrida: Cuantitativa y Cualitativa):
1. Dimensión Cuantitativa (Algorítmica y Paramétrica):
Métrica física de tamaño medida de forma objetiva con la herramienta de auditoría automatizada
CLOC v1.98 sobre el árbol del repositorio: exactamente 8,757 líneas de código fuente efectivas
(8.757 KLOC) en 126 archivos únicos.
Formulación matemática no lineal exponencial E = A × (Size)B × EAF calibrada empíricamente
por Barry Boehm con la constante A = 2.94.
Conversión monetaria aritmética a moneda de curso legal: 9.0 PM×$300.00/mes = $2, 700.00 USD
(C$99, 360.00 NIO a tasa o
cial BCN de 36.8000).
2. Dimensión Cualitativa (Evaluación Heurística de Atributos):
Juicio de expertos y valoración ordinal de los 5 Factores de Escala (SFj): evaluación cualitativa
de la cohesión del equipo de trabajo (TEAM Muy Alta), experiencia previa en sistemas similares
(PREC Alta) y madurez de procesos (PMAT Nominal).
Ponderación cualitativa de los 17 Conductores de Costo (Cost Drivers / Multiplicadores
de Esfuerzo EMi): evaluación de las capacidades humanas de los analistas (ACAP) y progra-
madores (PCAP), la experiencia en el lenguaje Python y framework Django (PLEX), el soporte de
herramientas CASE modernas (TOOL) y la estabilidad de la plataforma tecnológica.
3. Submodelo Especí
co Seleccionado: Post-Architecture (Post-Arquitectura). Se fundamen-
ta en que el proyecto dispone de arquitectura formal documentada en 4 capas (DA-MREC-001) y código
fuente completado.
4. Modo de Desarrollo: Modo Orgánico / Semiacoplado Ajustado por Reutilización Inten-
siva de Framework.
Figura 1: Evidencia de auditoría CLOC v1.98 sobre los 126 archivos del repositorio (8.757 KLOC).

---

### Justificación de Factores de Escala (B = 1.00) y Multiplicadores (EAF = 0.35)
### Cálculo Monetario del Desarrollo

3.2.
Justi
cación de Factores de Escala (B = 1.00) y Multiplicadores (EAF = 0.35)
La ecuación fundamental del modelo COCOMO II Post-Architecture viene dada por:
E = A × (Size)B ×
17
Y
i=1
EMi = A × (KLOC)B × EAF
(8)
Constante de Calibración Nominal (A = 2.94): Valor estándar de COCOMO II en Personas-Mes
por KLOC.
Exponente de Escala (B = 1.00): Calculado mediante la fórmula o
cial B = 0.91+0.01 P5
j=1 SFj:
 Precedencia (PREC Alta = 2.48), Flexibilidad (FLEX Alta = 2.03), Resolución de Arquitectu-
ra/Riesgo (RESL Muy Alta por línea base previa = 1.41), Cohesión del Equipo de 3 integrantes
(TEAM Muy Alta = 1.10) y Madurez del Proceso (PMAT Nominal = 1.98).
 Suma de factores: P SFj = 2.48 + 2.03 + 1.41 + 1.10 + 1.98 = 9.00 =⇒B = 0.91 + 0.01(9.00) =
1.00 (rendimiento lineal sin deseconomías de escala).
Factor de Ajuste de Esfuerzo (EAF = 0.35): Producto de los Cost Drivers (Q EMi = 0.35)
derivado del apalancamiento del framework Django 5.x (ORM transaccional, motor de migraciones,
protección nativa CSRF/SQLi, sesiones y plantillas), herramientas CASE modernas (TOOL = 0.72),
experiencia en la plataforma (PLEX = 0.85), capacidad de los analistas/programadores (ACAP = 0.85,
PCAP = 0.76) y trabajo colocalizado (SITE = 0.98).
E = 2.94 × (8.757)1.00 × 0.35 = 9.0 Personas-Mes (PM)
(9)
Con los 3 desarrolladores trabajando en paralelo a tiempo completo:
T =
E
Desarrolladores =
9.0 PM
3 ingenieros = 3.0 meses calendario
(10)
3.3.
Cálculo Monetario del Desarrollo
Aplicando la tarifa salarial de referencia en Managua para desarrolladores junior / pasantes bajo esquema
de proyecto llave en mano ($300.00 USD/mes por persona):
Costo del Software = 9.0 PM × $300.00 USD/mes = $2, 700.00 USD
(C$99, 360.00 NIO)
(11)

---

## Inventario y Valoración del Hardware Antiguo (Activos Preexistentes)
### Detalle de Activos Preexistentes y Destino Operativo
### Comparativa de Consumo y Eficiencia Eléctrica

4.
Inventario y Valoración del Hardware Antiguo (Activos Preexisten-
tes)
Antes del presente proyecto, el establecimiento operaba con activos preexistentes y equipos domésti-
cos que representaban graves riesgos operativos. A continuación, se presenta la auditoría física y su
conciliación contable según la Ley No. 822 (Ley de Concertación Tributaria de Nicaragua):
4.1.
Detalle de Activos Preexistentes y Destino Operativo
1. Impresora Multifunción Láser Canon imageCLASS MF445dw (PRN1): Adquirida en mayo
de 2025 (1.5 años de antigüedad). Costo histórico: $350.00 USD. Vida útil
scal: 5 años ($70.00
USD/año). Depreciación acumulada: $105.00 USD. Valor actual en libros: $245.00 USD (C$
9,016.00 NIO). Estado físico excelente (8/10), puerto Gigabit Ethernet y soporte para tóner 057H de
10,000 págs. Destino: Reutilización al 100 % en la VLAN 50 (IP: 10.20.50.10) en toma protegida
independiente (debido a su pico de fusor de 1,330 W).
2. Computadoras Antiguas de Mostrador (2 Unidades Clones Core 2 Duo): Más de 6 años de
uso, 4 GB RAM, discos mecánicos con sectores reasignados. Costo original: $600.00 USD ($300 c/u).
Depreciación acumulada: 100 % ($0.00 USD en libros). Valor residual de salvamento: $80.00
USD conjunto ($40 c/u). Destino: Unidad 1 reasignada como terminal pasiva oine en taller;
Unidad 2 dada de baja para reciclaje.
3. Módem Residencial del Proveedor ISP: Costo $0.00 USD (comodato de Claro/Tigo). Destino:
Reutilizado en Modo Puente (Bridge) conectado al puerto WAN1 del router TP-Link ER605.
4. Regletas Eléctricas Domésticas: Costo original $45.00 USD (depreciadas al 100 %). Destino:
Baja y desecho inmediato por alto riesgo de incendio y microcortes; reemplazadas por Rack 12U,
PDU1 y UPS CyberPower CP1500PFCLCD.
Cuadro 3: Tabla de Activos Preexistentes y Valoración Contable
Activo Preexistente
Costo Hist.
Deprec. Acum.
Valor Libros
Consumo
Destino en el Proyect
Impresora
Canon
MF445dw
(PRN1)
$350.00
-$105.00
$245.00
22 W
Reutilizada 100 % (VLAN
2x PCs Clones Core 2 Duo (vie-
jas)
$600.00
-$600.00
$80.00*
220 W
1x Taller oine / 1x Baj
Módem Residencial ISP
$0.00
$0.00
$0.00
12 W
Modo Puente a Router E
Regletas Domésticas en cascada
$45.00
-$45.00
$0.00
5 W
Desechadas (Riesgo crític
TOTALES PREEXISTEN-
TES
$995.00
-$750.00
$325.00
259 W
*Valor residual conjunto
4.2.
Comparativa de Consumo y E
ciencia Eléctrica
Bajo la tarifa comercial T-B de Managua ($0.195 USD/kWh ≈C$ 7.176 NIO/kWh):
Sistema Antiguo: 269 W en jornada laboral =⇒92.46 kWh/mes = $18.03 USD/mes (C$ 663.50
NIO/mes). Consumo especí
co:
269 W
2 puestos = 134.5 W/estación.
Sistema Nuevo Proyectado: Rack 24/7 (152 W) + 8 estaciones en jornada comercial (346 W)
= 498 W pico
=⇒
200.58 kWh/mes = $39.11 USD/mes (C$ 1,439.25 NIO/mes), cuadrando
exactamente con el presupuesto OPEX de $40.00 USD/mes de energía.
E
ciencia Energética: Consumo por puesto integral:
498 W
8 puestos + Infra = 62.25 W/estación. La e
-
ciencia energética por puesto mejora en un 53.7 %.

---

## Proforma de Infraestructura Tecnológica y Logística DGA
### Modelo Tributario y Liquidación Aduanera (DGA)

5.
Proforma de Infraestructura Tecnológica y Logística DGA
La adquisición del equipamiento de hardware nuevo se estructura a través de la plataforma Amazon EE.
UU. (valores Ex-Works) y su posterior nacionalización ante la Dirección General de Servicios Aduaneros
(DGA) de Nicaragua:
Ref.
Descripción Técnica del Componente
Cant.
Unit. (USD)
Subtotal (USD)
SRV1
Servidor Dell PowerEdge T150 (8 Cores,
32GB ECC, 2x 1TB SSD)
1
$1,600.00
$1,600.00
NAS1
Synology
DiskStation
DS224+
(NAS
2
Bahías, Diskless)
1
$361.19
$361.19
NAS-HDD
Disco Seagate IronWolf 2TB ST2000VN004
(SATA CMR)
2
$174.99
$349.98
BKP-
USB1
Disco Duro Externo USB 3.0 de 2 TB (Cifra-
do BitLocker / LUKS)
1
$80.00
$80.00
PC0106
PC Micro / SFF (Core i5, 8GB RAM, 256GB
SSD) para POS/Adm.
6
$350.00
$2,100.00
LAP0102
Portátiles corporativas (Core i5, 8GB RAM,
256GB SSD) gerencia
2
$450.00
$900.00
MON01
06
Monitor LED 24 Full HD 1920x1080
6
$100.00
$600.00
PER0106
Conjunto de teclado y ratón alámbrico USB
6
$20.00
$120.00
LCT0105
Lector de código de barras óptico USB-HID
5
$40.00
$200.00
CAJ0104
Cajón de dinero Volcora 16 metálico RJ11 /
24V
4
$60.00
$240.00
ADP0102
Adaptador Anker USB-C a Gigabit Ethernet
2
$25.99
$51.98
R1
Enrutador / Cortafuegos TP-Link ER605
Multi-WAN
1
$60.00
$60.00
SW1
Conmutador TP-Link TL-SG2428P 24P GbE
PoE+ 250W
1
$220.00
$220.00
AP1
Punto de acceso TP-Link Omada EAP610
PoE
1
$100.00
$100.00
UPS1
UPS
CyberPower
CP1500PFCLCD
1500VA/1000W Onda Pura
1
$239.95
$239.95
RACK1
Gabinete cerrado ventilado de pared 12U
1
$150.00
$150.00
CBL
Bobina Cat 6, Patch Panel 24P y conectores
RJ45
1
$150.00
$150.00
PDU1
Regleta PDU de rack 1U con 8 tomacorrientes
1
$40.00
$40.00
SUM-
PRN
Lote inicial: Tóner Canon 057 Original + Pa-
pel 5,000 hojas
1
$206.99
$206.99
TOTAL PROFORMA HARDWARE NUEVO EX-WORKS (EE. UU.)
$7,770.09
5.1.
Modelo Tributario y Liquidación Aduanera (DGA)
Se descarta la vía aérea ($7.50/lb) por el peso consolidado (250300 lb) y la restricción IATA sobre la
batería de plomo-ácido del UPS. Se adopta la vía marítima consolidada:
1. Costo Ex-Works: $7,770.09 USD.

---

2. Flete Marítimo Internacional: $800.00 USD.
3. Seguro de Transporte Internacional (1.5 %): $116.55 USD.
4. Valor CIF (Base Imponible Aduanera): $8,686.64 USD.
5. Derechos Arancelarios a la Importación (DAI estimado): $150.00 USD (0 % computadoras SAC 8471,
515 % accesorios).
6. Base de Cálculo del IVA (CIF + DAI): $8,836.64 USD.
7. IVA Aduanero (15 %): $1,325.50 USD.
8. Costo Total Nacionalizado Puesto en Managua: $10,162.14 USD (C$ 373,966.75 NIO).

---

## Presupuesto Total de Inversión y Dualidad Patrimonial
### Dualidad entre Patrimonio Tecnológico y Desembolso de Caja
### Depreciación Fiscal y Escudo Tributario (Ley No. 822 LCT)

6.
Presupuesto Total de Inversión y Dualidad Patrimonial
Para una rigurosa comprensión
nanciera, se establece la distinción entre el patrimonio tecnológico total
puesto en operación y el desembolso inicial de caja:
6.1.
Dualidad entre Patrimonio Tecnológico y Desembolso de Caja
A. Valor Integral del Parque Tecnológico en Operación (Patrimonio Total de TI):
Patrimonio Total = Activos Preexistentes (Libros) + HW Nuevo Nacionalizado + Software + Instalación
= $325.00 + $10, 162.14 + $2, 700.00 + $800.00 = $13, 987.14 USD (C$514, 726.75 NIO)
(12)
(A valor histórico de adquisición, el parque asciende a $14,612.14 USD).
B. Inversión Incremental en Efectivo (CAPEX Desembolsado / Flujo Saliente I0):
I0 = Hardware Nuevo Nacionalizado + Desarrollo de Software + Instalación Especializada
= $10, 162.14 + $2, 700.00 + $800.00 = $13, 662.14 USD (C$502, 766.75 NIO)
(13)
C. Demostración del Ahorro por Reutilización de Impresora: La retención de la multifun-
ción láser Canon MF445dw evitó comprar una máquina corporativa nueva equivalente ($350$450
USD Ex-Works, o $457.80$588.60 nacionalizada), generando un ahorro directo en efectivo de
$350.00 a $450.00 USD netos.
Cuadro 5: Consolidación del Presupuesto de Inversión Inicial (I0)
Componente de Inversión
Monto (USD)
Monto (NIO)
Hardware y Equipamiento de Red Ex-Works (Amazon EE. UU.)
$7,770.09
C$ 285,939.31
Costos Logísticos, Seguro, DAI e IVA de Importación DGA
$2,392.05
C$ 88,027.44
Desarrollo de Software a Medida (Modelo COCOMO II)
$2,700.00
C$ 99,360.00
Instalación, Cableado Estructurado, VLANs y Puesta en Marcha
$800.00
C$ 29,440.00
TOTAL INVERSIÓN INICIAL EN EFECTIVO (I0)
$13,662.14
C$ 502,766.75
6.2.
Depreciación Fiscal y Escudo Tributario (Ley No. 822 LCT)
Conforme a los Artículos 44 (numeral 3) y 45 de la Ley de Concertación Tributaria (LCT), los equipos
de cómputo y el software se amortizan al 20 % anual en línea recta (5 años):
Hardware nuevo: $10, 162.14 × 20 % = $2, 032.43 USD/año (C$ 74,793.42 NIO).
Software a la medida: $2, 700.00 × 20 % = $540.00 USD/año (C$ 19,872.00 NIO).
Depreciación Anual Deducible del Proyecto: $2, 572.43 USD/año (C$ 94,665.42 NIO/año).
Escudo Fiscal Corporativo (30 % IR en Nicaragua):
Ahorro Tributario Anual = $2, 572.43 × 30 % = $771.73 USD/año
(C$28, 399.66 NIO/año)
(14)

---

## Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
### Stack de Software y Afinación de PostgreSQL para 32 GB RAM ECC
### Análisis Dinámico de Capacidad a 5 Años

7.
Software Instalado en Servidor (SRV1) y Capacidad a 5 Años
El servidor central SRV1 (Dell PowerEdge T150) opera bajo una arquitectura de alto rendimiento
con costo cero de licenciamiento ($0.00 USD en licencias) sustentada enteramente en Software Libre y
de Código Abierto (FOSS).
7.1.
Stack de Software y A
nación de PostgreSQL para 32 GB RAM ECC
El sistema prescinde de entornos grá
cos, ejecutando Debian GNU/Linux 12 LTS Bookworm Minimal
en modo Runlevel 3.
Cuadro 6: Matriz del Stack de Software Instalado en el Servidor Central (SRV1)
Software / Servicio
Versión
Función en la Arquitectura
Licencia
Costo
Debian GNU/Linux
12.x LTS
Sistema Operativo Host base (Kernel
6.1 LTS)
GPL/FOSS
$0.00
Nginx
1.22+
Reverse Proxy, TLS 1.3 ooader, caché
estáticos
2-Clause BSD
$0.00
Gunicorn
22.0+
WSGI Server (5-17 workers pre-fork
gthread)
MIT
$0.00
Python Virtualenv
3.12+
Runtime
aislado
de
aplicación
(/opt/sistema/venv)
PSF
$0.00
Django Framework
5.0+ LTS
Framework web ERP y lógica de nego-
cio
3-Clause BSD
$0.00
PostgreSQL
18.4
Motor relacional transaccional ACID
PostgreSQL
$0.00
nftables / UFW
1.0+
Firewall de host perimetral (puertos
80/443/22)
GPLv2
$0.00
Fail2Ban
1.0+
Prevención de intrusiones y bloqueo IP
dinámico
GPLv2
$0.00
smartmontools
7.3+
Telemetría S.M.A.R.T. continua de des-
gaste SSD
GPLv2
$0.00
pgBackRest
2.50+
Motor de respaldo PITR y streaming
WAL
MIT
$0.00
TOTAL SOFTWA-
RE SRV1

Stack Tecnológico 100 % Empresa-
rial FOSS

$0.00 USD
Parámetros de Tuning en postgresql.conf (32 GB ECC RAM):
shared_buffers = 8GB (25 % de RAM asignada al buer pool del motor).
effective_cache_size = 24GB (75 % de RAM disponible en Page Cache de Linux).
work_mem = 64MB, maintenance_work_mem = 2GB, checkpoint_completion_target = 0.9.
random_page_cost = 1.1 (calibrado para latencias mínimas de SSD SATA).
7.2.
Análisis Dinámico de Capacidad a 5 Años
Evaluación de recursos a 5 años (84,146 facturas acumuladas, con crecimiento anual del 15 %):
1. Almacenamiento (1,000 GB útiles en RAID 1): Ocupación total al Año 5 de 58.00 GB
(5.80 % del SSD), quedando más de 942 GB libres (94.20 %). Desglose: Base de datos 1.80 GB,
Índices B-Tree 2.20 GB, WAL logs 4.00 GB, Facturas PDF 8.00 GB, Sistema Debian y paquetes 7.20
GB, Logs rotados 7.80 GB, Respaldos temporales 15.00 GB, Margen de contingencia 12.00 GB.

---

2. Memoria RAM (32 GB ECC): Al ser el volumen acumulado de la base de datos (tablas +
índices) de apenas 4.0 GB, el 100 % de la base de datos completa de 5 años vive en la
memoria RAM (shared_buffers = 8GB). Esto garantiza una tasa de aciertos (Buer Cache Hit
Ratio) superior al 99.8 % y tiempos de respuesta de consulta de caja de menos de 3 a 5 ms.
3. CPU (Intel Xeon 8 Cores): Carga promedio estimada en jornada activa menor al 12 %, con un
margen de reserva superior al 88 %.
4. Desgaste de SSDs (TBW): Escritura física proyectada con factor de ampli
cación WAF 2.5:
25.0 GB/día × 1, 825 días = 45.63 TBW. Frente al límite garantizado de 600 TBW, el desgaste a 5
años es de apenas el 7.60 %, conservando más del 92 % de vida útil remanente.

---

## Estrategia de Respaldo 3-2-1 y Continuidad Operativa

8.
Estrategia de Respaldo 3-2-1 y Continuidad Operativa
Para garantizar la disponibilidad ininterrumpida frente a siniestros, fallas de hardware, errores humanos
o ataques de ransomware, se implementa la regla formal de respaldo 3-2-1:
Copia 1 (Producción en Caliente): Servidor Central Dell T150 (SRV1). Arreglo redundante
RAID 1 por hardware (Dell PERC H355) con 2 discos SSD Enterprise de 1 TB. Ante la avería
súbita de un SSD, la operación continúa sin interrupciones (RTO = 0, RPO = 0).
Copia 2 (Red Local Aislada): NAS Synology DiskStation DS224+ en la VLAN 10. Arreglo
RAID 1 con 2 discos Seagate IronWolf de 2 TB CMR con sistema de archivos Btrfs. Mecanismos:
 WAL Archiving en tiempo real: PostgreSQL transmite segmentos WAL cada 15 minutos vía SSH.
 Backup diario automático (23:00 hrs): Volcado comprimido con zstd nivel 6 vía pgBackRest.
 Veri
cación criptográ
ca: Comprobación automatizada de sumas SHA-256 en ambos extremos.
 Inmutabilidad WORM anti-ransomware: Snapshots Btrfs inmutables de solo lectura.
 Política de retención GFS: 7 copias diarias, 4 semanales, 12 mensuales y 5 anuales de
nitivas.
Copia 3 (Fuera de Sitio / Air-Gapped en Frío): Dos discos duros externos rugerizados de 2 TB
USB 3.0 rotados semanalmente (Disco A / Disco B). Cifrado de bloque completo militar LUKS2
(AES-256-XTS). Se conectan los viernes a las 18:30 hrs para sincronización diferencial rsync, se
desmontan, se cierran criptográ
camente y se custodian en una caja fuerte ignífuga externa bajo
control de Gerencia General.
Cuadro 7: Métricas Objetivo de Continuidad de Negocio (RPO y RTO)
Escenario de Falla / Contingencia
RPO (Pérdida Máx. Tolerable)
RTO (Tiempo de Recuperación)
Falla de 1 SSD en Servidor SRV1
0 segundos (Cero datos)
0 minutos (En caliente transparente)
Corrupción lógica / Error humano en tabla
≤15 minutos (Vía WAL)
≤30 minutos (PITR Point-In-Time)
Caída total de Sistema Operativo SRV1
≤15 minutos (Vía NAS)
≤60 minutos (Reinstalación automatizad
Siniestro Catastró
co / Robo de SRV1
≤24 horas (NAS / Disco USB)
≤120 minutos (2 horas en nuevo hardwa
Simulacro Semestral de Desastre: Por protocolo de auditoría interna, cada 6 meses (junio y di-
ciembre) se ejecuta obligatoriamente un simulacro de recuperación en máquina virtual aislada con
comprobación criptográ
ca SHA-256 y veri
cación de consistencia en Kardex.

---

## Análisis de Consumibles y Comparación Cuantitativa de Gastos
### Unificación y Corrección de Consumibles (TCO Tóner y Papel)
### Comparación Cuantitativa de Gastos (Antes vs. Después)

9.
Análisis de Consumibles y Comparación Cuantitativa de Gastos
9.1.
Uni
cación y Corrección de Consumibles (TCO Tóner y Papel)
En etapas previas del anteproyecto surgió una discrepancia entre la cifra de  $200 USD y la cotización
de $348.65 USD del cartucho Canon 057H.
Aclaración Técnica: La partida presupuestaria inicial SUM-PRN de $206.99 USD correspondía al
lote de arranque: un cartucho original Canon 057 estándar ($166.99 USD) más una caja de 5,000
hojas de papel bond ($40.00 USD). La mención de $200 fue un redondeo empírico informal de
dicha partida de arranque.
Costos de Catálogo Real:
 Canon 057 Original Estándar (3,100 págs.): $166.99 USD =⇒$0.0538 / pág. (dura 2.3 meses).
 Canon 057H Original Alto Rendimiento (10,000 págs.): $348.65 USD =⇒$0.0348 / pág. (dura
7.5 meses).
 Compatible 057H Certi
cado (10,000 págs.): $38.95 USD =⇒$0.0039 / pág. (dura 7.5 meses).
 Papel bond carta (5,000 hojas a $40.00): $0.0080 / hoja =⇒Demanda de 1,340 págs./mes =
$10.72 USD/mes.
Sustentación del Rubro OPEX de Consumibles ($45.00 USD/mes): El presupuesto mensual
de $45.00 USD permite cubrir el papel ($10.72) y disponer de $34.28/mes para amortizar tóner
institucional de alto rendimiento. Con tóner compatible ($5.22/mes) y papel ($10.72/mes), el gasto
real es de $15.94/mes, reservándose $29.06/mes como fondo preventivo para rodillos y fotoconductor.
Si se utiliza tóner 100 % original Canon 057H ($57.44/mes total), la diferencia de $12.44 es absorbida
por el rubro de soporte técnico ($65/mes), manteniendo el OPEX global
rmemente acotado en
$200.00 USD/mes.
9.2.
Comparación Cuantitativa de Gastos (Antes vs. Después)
A partir de la facturación base auditada ($81,516.00 USD/año), la comparación demuestra con exactitud
de centavos los +$10,400.00 USD/año de bene
cio bruto:
Cuadro 8: Matriz Cuantitativa Comparativa Consolidada (Situación Actual vs. Proyecto)
Rubro Evaluado
Actual (USD)
Proyecto (USD)
Bene
cio (USD)
Bene
cio (NIO)
Pérdidas por Merma de Inventa-
rio (4 % vs 0.5 %)
$3,260.64
$407.58
+$2,853.06
+C$ 104,992.61
Ventas Perdidas por Abandono
en Cola (6.5 % vs 1.3 %)
$5,298.84
$1,059.77
+$4,239.07
+C$ 155,997.78
Errores de Precios, Descuentos y
Reprocesos
$4,500.00
$1,192.13
+$3,307.87
+C$ 121,729.62
BENEFICIO BRUTO TO-
TAL ANUAL
$13,059.48
$2,659.48
+$10,400.00
+C$ 382,720.00
Comprobación matemática: $2, 853.06+$4, 239.07+$3, 307.87 = $10, 400.00 USD/año
(+$866.67 USD/mes)

---

## Gastos Fijos Operativos (OPEX), Mantenimiento y Evolución de Software
### Desglose Técnico y Comprobación de Gastos Fijos (OPEX = $200.00 USD/mes)

10.
Gastos Fijos Operativos (OPEX), Mantenimiento y Evolución de
Software
Para garantizar la sostenibilidad operativa del proyecto durante los 5 años de evaluación, se auditaron
todos los costos
jos recurrentes que rodean la operación física e informática del local en Managua:
10.1.
Desglose Técnico y Comprobación de Gastos Fijos (OPEX = $200.00 USD/mes)
1. Energía Eléctrica del Parque Informático ($40.00 USD/mes = C$ 1,472.00 NIO/mes):
Calculada sobre el pliego tarifario comercial de baja tensión (Tarifa T-B de Disnorte-Dissur /
INE Managua a $0.195 USD/kWh ≈C$ 7.176 NIO/kWh):
Carga Continua 24/7 (Rack 12U, 720 h/mes): Servidor Dell T150 (SRV1, 110 W nominales) +
Switch PoE+ SW1 y AP1 (22 W) + NAS Synology NAS1 (12 W) + Router R1 y control UPS1 (8
W) = 152 W × 720 h = 109.44 kWh/mes.
Carga Diurna en Jornada Comercial (9.5 h/día × 26 días = 247 h/mes): 6 PCs SFF con monitores
LED 24 (6 × 52 W = 312 W) + 2 Laptops gerenciales (2 × 17 W = 34 W) + Impresora láser
Canon MF445dw promedio ponderado (23 W) = 369 W × 247 h = 91.14 kWh/mes.
Total Consumo Mensual: 109.44 + 91.14 = 200.58 kWh/mes × $0.195/kWh = $39.11 USD/mes
(C$ 1,439.25 NIO/mes), presupuestado en $40.00 USD/mes ($480.00 USD/año).
2. Telecomunicaciones / Internet Corporativo Fijo ($50.00 USD/mes = C$ 1,840.00 NIO/mes):
Enlace empresarial de
bra óptica simétrica de 100 Mbps (Claro Empresas / Tigo Business en Pista
Suburbana, $43.48 + 15 % IVA = $50.00 USD/mes). Cabe destacar que al residir SRV1 localmente en
la VLAN 10 (On-Premises), la facturación e inventario operan al 100 % en LAN incluso ante cortes
externos del proveedor ISP.
3. Consumibles Fijos de Impresión y Papelería ($45.00 USD/mes = C$ 1,656.00 NIO/mes):
Cubre las 1,340 páginas mensuales (1,040 facturas + 300 páginas de cierres de caja y Kardex):
$10.72/mes en papel bond carta, $5.22/mes en tóner de alto rendimiento 057H (10,000 págs.) y
$29.06/mes de reserva técnica para rodillos y unidad de imagen de la impresora PRN1.
4. Póliza de Soporte Técnico y Mantenimiento de Software/Hardware ($65.00 USD/mes
= C$ 2,392.00 NIO/mes): Cubre el mantenimiento integral post-garantía conforme a la norma
ISO/IEC 14764.
Cuadro 9: Desglose Auditado de Gastos Fijos Operativos Mensuales y Anuales (OPEX)
Rubro de Gasto Fijo
Base de Cálculo y Referencia
Mensual (USD)
Mensual (NIO)
Anual (USD
Energía Eléctrica TI
200.58 kWh/mes @ $0.195/kWh
(Tarifa T-B)
$40.00
C$ 1,472.00
$480.0
Internet Fibra Corporativo
100 Mbps Simétrico ISP (Cla-
ro/Tigo + IVA)
$50.00
C$ 1,840.00
$600.0
Consumibles Impresión
1,340 págs./mes (Papel + Tóner
057H + Kit)
$45.00
C$ 1,656.00
$540.0
Mantenimiento y Soporte
Póliza ISO/IEC 14764 (BD, Red,
Parches, SLA)
$65.00
C$ 2,392.00
$780.0
TOTAL
GASTOS
FIJOS
(OPEX)
Presupuesto Operativo Con-
solidado
$200.00
C$ 7,360.00
$2,400.0

---

### Plan de Mantenimiento (ISO/IEC 14764) y Desarrollo de Nuevas Funciones (Evolutivo)

10.2.
Plan de Mantenimiento (ISO/IEC 14764) y Desarrollo de Nuevas Funciones
(Evolutivo)
Para responder con rigor ingenieril a las necesidades de mantenimiento y crecimiento funcional del
software a lo largo de los 5 años, se establece un esquema en tres niveles:
1. Nivel 1  Garantía Técnica Inicial (Meses 1 al 3: Costo $0.00 USD): Estipulada en la
Cláusula VI del Contrato por 90 días naturales a partir del Acta de Recepción. Cubre sin costo
toda corrección de defectos de código (bugs) en los módulos de ventas, caja, compras o Kardex
Promedio Ponderado.
2. Nivel 2  Mantenimiento Operativo Recurrente (Incluido en OPEX por $65.00 USD/mes
= $780.00 USD/año):
Mantenimiento Preventivo ($20/mes): Limpieza física bimensual de gabinete y estaciones, revi-
sión de telemetría S.M.A.R.T. en SRV1, ejecución programada de VACUUM ANALYZE y REINDEX en
PostgreSQL 18.4, y simulacro semestral de restauración de respaldos 3-2-1 desde NAS y disco
USB LUKS2.
Mantenimiento Correctivo y Soporte SLA ($25/mes): Atención garantizada bajo Acuerdo de Nivel
de Servicio (Nivel 1 Crítico ≤4 h, Nivel 2 Medio ≤8 h, Nivel 3 Leve ≤24 h).
Mantenimiento Adaptativo Menor ($20/mes): Aplicación de parches de seguridad en Debian 12
LTS, Nginx, Python 3.12 y Django 5.x LTS, así como ajustes paramétricos en plantillas de recibos
o tasas tributarias (DGI/ALMA).
3. Nivel 3  Mantenimiento Perfectivo y Desarrollo de Nuevas Funciones (Modelo CO-
COMO II de Mantenimiento ACT): Gracias a que la arquitectura fue construida aplicando los
Principios SOLID (01_Informe_SOLID), especí
camente el Principio Abierto/Cerrado (OCP)
y un Monolito Modular en 4 Capas (03_Descripcion_Arquitectura), el sistema está abierto
a la extensión de nuevas funciones sin modi
car ni arriesgar el núcleo transaccional existente. Para
cotizar de forma transparente cualquier módulo nuevo solicitado por la empresa en los Años 2 a 5,
se aplica la fórmula o
cial de COCOMO II para Trá
co de Cambio Anual (Annual Change
Tra
c  ACT):
Eevolutivo = ACT × Ebase × EAFM,
donde ACT = SLOC Añadidas + SLOC Modi
cadas
8, 757 SLOC Base
(15)
Cuadro 10: Catálogo Costeado de Nuevas Funciones Evolutivas (COCOMO II ACT @ $300/PM)
Nueva Función / Módulo Evo-
lutivo Propuesto
Tamaño Est.
Factor ACT
Esfuerzo
Costo Llave en Mano
1. Portal Web B2B de Pedidos para
Talleres A
liados
+650 SLOC
7.42 %
0.67 PM
$200.00 USD (C$ 7,360)
2. Facturación Electrónica DGI /
Pasarela Bancaria POS
+950 SLOC
10.85 %
0.98 PM
$295.00 USD (C$ 10,856)
3. App Móvil PWA de Conteo en Bo-
dega y Alertas Telegram
+550 SLOC
6.28 %
0.57 PM
$170.00 USD (C$ 6,256)
4.
Dashboard
BI
Predictivo
de
Reabastecimiento por Marca
+480 SLOC
5.48 %
0.49 PM
$148.00 USD (C$ 5,446)
Flujo de Caja Operativo Neto Anual (FC):
FC = Bene
cios Brutos Anuales −OPEX Anual = $10, 400.00 −$2, 400.00 = +$8, 000.00 USD/año
(16)
En moneda nacional: C$382, 720.00 −C$88, 320.00 = +C$294, 400.00 NIO/año (+$666.67 USD/mes).

---

## Análisis del Flujo de Capital (Años 0 a 5) e Indicadores Financieros
### Cálculo Detallado de Métricas Financieras

11.
Análisis del Flujo de Capital (Años 0 a 5) e Indicadores Financie-
ros
Bajo un horizonte quinquenal y una Tasa Mínima Aceptable de Rendimiento (TMAR) del 12.00 %
anual:
Cuadro 11: Tabla Maestra de Flujo de Fondos Proyectado (Años 0 al 5)
Período
Año 0
Año 1
Año 2
Año 3
Año 4
Año
Inversión Inicial (I0)
-$13,662.14
$0.00
$0.00
$0.00
$0.00
$0
Bene
cios Brutos
$0.00
+$10,400.00
+$10,400.00
+$10,400.00
+$10,400.00
+$10,400
Gastos Operativos (OPEX)
$0.00
-$2,400.00
-$2,400.00
-$2,400.00
-$2,400.00
-$2,400
Flujo Neto de Caja (FCt)
-$13,662.14
+$8,000.00
+$8,000.00
+$8,000.00
+$8,000.00
+$8,000.
Depreciación Fiscal (Ley 822)

-$2,572.43
-$2,572.43
-$2,572.43
-$2,572.43
-$2,572
Utilidad Contable antes IR

+$5,427.57
+$5,427.57
+$5,427.57
+$5,427.57
+$5,427
Factor de Descuento (12 %)
1.000000
0.892857
0.797194
0.711780
0.635518
0.5674
Flujo Descontado (FDt)
-$13,662.14
+$7,142.86
+$6,377.55
+$5,694.24
+$5,084.14
+$4,539.
Flujo Acumulado Simple
-$13,662.14
-$5,662.14
+$2,337.86
+$10,337.86
+$18,337.86
+$26,337.
Flujo Acumulado Descontado
-$13,662.14
-$6,519.28
-$141.73
+$5,552.51
+$10,636.65
+$15,176.
11.1.
Cálculo Detallado de Métricas Financieras
1. Valor Actual Neto (VAN): Factor de anualidad a5|0.12 = 3.604776 (≈3.6048).
VAN = ($8, 000.00×3.6048)−$13, 662.14 = $28, 838.40−$13, 662.14 = +$15, 176.26 USD
(+C$558, 486.37 NI
(17)
*(Precisión continua: VAN = $15, 176.07 USD). Dado que VAN > 0, el proyecto genera riqueza neta
sustancial.*
2. Tasa Interna de Retorno (TIR): Tasa que anula el VAN:
0 =
5
X
t=1
8, 000
(1 + TIR)t −13, 662.14 =⇒TIR = 50.84 %
(18)
Supera la TMAR (12.00 %) en 38.84 puntos porcentuales.
3. Retorno sobre la Inversión (ROI):
ROI =
($8, 000.00 × 5) −$13, 662.14
$13, 662.14

× 100 % = $26, 337.86
$13, 662.14 × 100 % = 192.78 %
(19)
Por cada $1.00 USD invertido se recupera el dólar y se obtienen $1.93 USD de ganancia líquida.
4. Relación Bene
cio / Costo (B/C):
B/C = VP de Flujos Positivos
I0
= $28, 838.21
$13, 662.14 = 2.11
(20)
5. Período de Recuperación (Payback):
Payback Simple: $13,662.14
$8,000.00 = 1.71 años (1 año, 8 meses y 15 días).
Payback Descontado: Al
nalizar el Año 2 resta recuperar $141.73 USD descontados. Con el
ujo del Año 3 ($5,694.24), la fracción es de 0.0249 años (9 días), logrando el retorno dinámico
en 2.08 años (2 años y 1 mes).

---

## Análisis de Sensibilidad y Escenarios de Riesgo

12.
Análisis de Sensibilidad y Escenarios de Riesgo
Para comprobar la resiliencia
nanciera ante variaciones macroeconómicas o del sector automotriz en
Nicaragua, se evaluaron tres escenarios:
Cuadro 12: Evaluación de Sensibilidad Financiera por Escenarios
Métrica / Parámetro
Pesimista (Contracción)
Base (Proyectado)
Optimista (Expansión)
Ventas / Clientes diarios
30 clientes/día
40 clientes/día
6575 clientes/día
Bene
cio Bruto Anual
$7,400.00 USD
$10,400.00 USD
$13,000.00 USD
OPEX Anual Mantenido
-$2,400.00 USD
-$2,400.00 USD
-$2,400.00 USD
Flujo Neto de Caja (FC)
+$5,000.00 USD
+$8,000.00 USD
+$10,600.00 USD
Inversión Inicial (I0)
-$13,662.14 USD
-$13,662.14 USD
-$13,662.14 USD
Valor Actual Neto (VAN 12 %)
+$4,361.86 USD
+$15,176.26 USD
+$24,548.74 USD
Tasa Interna de Retorno (TIR)
24.23 %
50.84 %
72.51 %
Retorno de Inversión (ROI)
82.99 %
192.78 %
287.93 %
Período de Recuperación
2.73 años
1.71 años
1.29 años
Dictamen de Riesgo: Incluso en el escenario más pesimista, el VAN se mantiene positivo en $4,361.86
USD y la TIR (24.23 %) duplica la TMAR (12.00 %), lo que demuestra un riesgo tecnológico y económico
excepcionalmente bajo.

---

## Marco Jurídico en Nicaragua y Contrato de Software
### Normativa Legal Vigente de la República de Nicaragua
### Estructura Contractual Esencial (Cláusulas I a XII)

13.
Marco Jurídico en Nicaragua y Contrato de Software
13.1.
Normativa Legal Vigente de la República de Nicaragua
1. Ley No. 312 y Reforma Ley No. 577 (Derechos de Autor y Conexos): El software se
protege bajo el régimen de obras literarias (Art. 13). La protección es automática por la creación sin
exigencia de registro. Distinción sustantiva:
Derechos Morales (Arts. 1317): Inalienables, imprescriptibles e irrenunciables. Pertenecen per-
manentemente a los desarrolladores (Ángel Alonso, Noel Alemán y Mendell Parrales).
Derechos Patrimoniales (Arts. 2128): Se trans
ere únicamente una Licencia de Uso Perpe-
tua, No Exclusiva e Intransferible circunscrita al servidor local SRV1 de Managua. Prohibida
la reventa, sublicencia o explotación SaaS. Se autoriza por ley una única copia de respaldo (bac-
kup).
2. Código Civil (Art. 2448) y Código de Comercio (Art. 112): Validez del consentimiento,
capacidad de las partes, objeto lícito y fuerza obligatoria vinculante (Pacta Sunt Servanda).
3. Ley No. 787 y Decreto 36-2012 (Protección de Datos Personales): La Distribuidora actúa
como Responsable del Fichero y los desarrolladores como Encargados del Tratamiento. Bases de
datos aisladas en 127.0.0.1, contraseñas encriptadas en Argon2/bcrypt y deber de secreto inde
nido
(NDA).
4. Ley No. 822 (LCT): Retención en la fuente del 10 % a cuenta del IR por servicios profesionales
(Arts. 87 y 88). Amortización
scal del 20 % anual en 5 años (Art. 44 y 45).
5. Plan de Arbitrios de Managua (Decreto No. 10-91): Retención del 1 % en concepto de
Impuesto Municipal sobre Ingresos (IMI) ante la Alcaldía de Managua (Art. 11).
13.2.
Estructura Contractual Esencial (Cláusulas I a XII)
El instrumento legal suscrito entre las partes consolida los siguientes pactos:
Cláusula I (De
niciones): Software Django/PostgreSQL, Servidor SRV1, Bugs Críticos y Horario
Laboral de Soporte.
Cláusula II (Objeto y Alcance): Concesión de Licencia Perpetua y servicios de parametrización,
despliegue en SRV1, con
guración RBAC, capacitación presencial (24 hrs) y pruebas ACID.
Cláusula III (Modalidad de Licencia): Perpetua, no exclusiva, intransferible y de uso local
exclusivo en el SRV1 de Managua. Prohibición expresa de reventa y SaaS.
Cláusula IV (Propiedad Intelectual y Código Fuente): Autoría moral inalienable. Despliegue
de código local auditable; prohibición de comercialización ajena.
Cláusula V (Precio y Régimen Fiscal): Valor total convenido de servicios profesionales de
$3,500.00 USD (C$ 128,800.00 NIO: $2,700.00 USD de software y licencia según COCOMO II
+ $800.00 USD de instalación y puesta en marcha; dentro del CAPEX llave en mano de $13,662.14
USD), pagaderos en tres hitos (40 % anticipo $1,400, 30 % integración $1,050, 30 % recepción
nal
$1,050). Aplicación de retención del 10 % IR (DGI) y 1 % IMI (Alcaldía de Managua).
Cláusula VI (Garantía Limitada): Vigencia de 90 días naturales contra bugs originales de
programación y cálculo de Kardex. Exclusión de mantenimiento gratuito perpetuo.
Cláusula VII (SLA de Soporte en Garantía):
 Nivel 1 Crítico (Bloqueante): Respuesta ≤4 h, resolución ≤12 h.
 Nivel 2 Medio (Degradación Parcial): Respuesta ≤8 h, resolución ≤2436 h.
 Nivel 3 Leve (Cosmético): Respuesta ≤24 h, resolución ≤4872 h.
Cláusula VIII (Con
dencialidad y NDA): Secreto inde
nido sobre precios, clientes, márgenes
y proveedores (Ley 787).
Cláusula IX (Límite de Responsabilidad): Exclusión por fallas eléctricas externas no absorbidas

---

por el UPS, manipulación indebida de base de datos u omisión de backups. Indemnización máxima
topada al 50 % del valor efectivamente pagado.

---

## Conclusiones Integrales del Dictamen

14.
Conclusiones Integrales del Dictamen
1. Viabilidad Económica Sobresaliente: Con un VAN de $15,176.26 USD, una TIR del
50.84 %, un ROI del 192.78 % y un período de recuperación de 1.71 años (simple) / 2.08
años (descontado), la inversión inicial incremental de $13,662.14 USD es plenamente recupera-
ble y dota a la empresa de una rentabilidad operativa robusta.
2. Coherencia y Blindaje Operativo: La adición de 4 cajas POS reduce las colas de 22.8 minutos
a 20.6 segundos, suprimiendo las pérdidas por abandono ($5,298.84 USD/año) y garantizando el
ujo de caja neto recurrente de +$8,000.00 USD/año sobre un OPEX contenido de $2,400.00
USD/año.
3. Aprovechamiento Patrimonial: La reutilización de la impresora láser Canon imageCLASS MF445dw
representa un ahorro directo de $350.00 a $450.00 USD en el
ujo de caja inicial, elevando el valor
total del parque tecnológico en operación a $13,987.14 USD.
4. Arquitectura Tecnológica Robusta y Cero Costo de Licencias: El servidor Dell PowerEdge
T150 ejecutando Debian 12, Nginx, Gunicorn y PostgreSQL 18.4 a
nado para 32 GB ECC operará a
un costo de licencias de $0.00 USD, utilizando apenas el 5.8 % del almacenamiento a 5 años y menos
del 7.6 % de desgaste físico de los SSDs.
5. Blindaje de Continuidad y Seguridad Jurídica: La estrategia de respaldo 3-2-1 con copias en
caliente (SRV1 RAID 1), copias locales aisladas e inmutables (NAS Synology RAID 1 en VLAN 10) y
copias en frío fuera de sitio (Disco USB LUKS2 en caja fuerte gerencial) garantiza un RPO ≤15 min
y un RTO ≤2 h. A su vez, el contrato de software bajo las Leyes 312, 577, 787 y 822 de Nicaragua
blinda formalmente la titularidad moral de los autores y con
ere a la empresa una licencia de uso
perpetua e intransferible.

---

## Referencias y Fuentes Normativas

15.
Referencias y Fuentes Normativas
Banco Central de Nicaragua (BCN): Tipo de Cambio O
cial del Córdoba frente al Dólar de
los Estados Unidos de América (TC = 36.8000 NIO/USD).
Asamblea Nacional de Nicaragua: Ley No. 312 (Ley de Derechos de Autor y Derechos Conexos)
y Ley No. 577 (Reformas y Adiciones a la Ley No. 312).
Asamblea Nacional de Nicaragua: Ley No. 822 (Ley de Concertación Tributaria de la República
de Nicaragua) y sus reformas.
Asamblea Nacional de Nicaragua: Ley No. 787 (Ley de Protección de Datos Personales) y
Decreto Ejecutivo No. 36-2012.
Presidencia de la República de Nicaragua: Decreto No. 10-91 (Plan de Arbitrios del Municipio
de Managua).
Dirección General de Servicios Aduaneros (DGA): Sistema Arancelario Centroamericano
(SAC) y aranceles a la importación.
Disnorte-Dissur: Pliego Tarifario del Servicio Eléctrico de Distribución en Baja Tensión Monofásica
Comercial (Tarifa T-B).

---

# Capítulo 16: Contrato Mercantil de Licencia de Uso de Software

REPÚBLICA DE NICARAGUA
Departamento de Managua · Municipio de Managua
Contratación Mercantil y Propiedad Intelectual Informática
CONTRATO MERCANTIL DE
LICENCIA DE USO PERPETUO Y
SERVICIOS DE DESARROLLO DE
SOFTWARE
Instrumento Jurídico de Suministro Tecnológico, Garantía y Nivel de Servicio
Caso de estudio: Distribuidora Comercial Moto Repuestos El Centenario,
S.A.
Jurisdicción: Managua, Nicaragua
Marco Legal Rector:
· Ley No. 312 y Ley No. 577 (Derechos de Autor)
· Ley No. 787 (Protección de Datos Personales)
· Ley No. 822 (Concertación Tributaria)
· Plan de Arbitrios de Managua (Dec. 10-91)
Modalidad: Licencia Perpetua e Intransferible
Servidor
Asignado:
Local
SRV1
(On-
Premises)
Plazo de Garantía: 90 Días Naturales
Fecha de Vigencia: Ciclo Operativo 2026
Ubicación: Managua, Nicaragua
Comparecientes Contractuales
Equipo Desarrollador / Licenciantes
Empresa Cliente / Licenciataria
Ángel Antonio Alonso Suárez (2021-0087U)
Distribuidora Comercial Moto Repues-
tos
Noel Isaac Alemán Carballo (2022-0376U)
El Centenario, S.A.
Mendell Noé Parrales Molina (2020-1014U)
RUC: J0310000123456 · Managua

---

Índice
1. Dictamen Jurídico Preliminar y Fundamentación Legal
2
1.1. Ley No. 312 y Ley No. 577 (Ley de Derechos de Autor y Derechos Conexos) . . . . .
2
1.2. Código Civil y Código de Comercio de Nicaragua . . . . . . . . . . . . . . . . . . . .
2
1.3. Ley No. 787 y Decreto No. 36-2012 (Protección de Datos Personales) . . . . . . . . .
2
1.4. Ley No. 822 (Ley de Concertación Tributaria) y Plan de Arbitrios de Managua . . .
2
2. Texto Íntegro del Contrato de Licencia y Servicios de Software
4
Anexo I: Acta Formal de Entrega y Recepción De
nitiva
8
1

---

## Dictamen Jurídico Preliminar y Fundamentación Legal
### Ley No. 312 y Ley No. 577 (Ley de Derechos de Autor y Derechos Conexos)
### Código Civil y Código de Comercio de Nicaragua
### Ley No. 787 y Decreto No. 36-2012 (Protección de Datos Personales)
### Ley No. 822 (Ley de Concertación Tributaria) y Plan de Arbitrios de Managua

1.
Dictamen Jurídico Preliminar y Fundamentación Legal
El presente instrumento se celebra en el Municipio de Managua, Departamento de Managua, Re-
pública de Nicaragua, y se somete formalmente al marco normativo vigente aplicable a bienes
informáticos, intangibles y obligaciones mercantiles:
1.1.
Ley No. 312 y Ley No. 577 (Ley de Derechos de Autor y Derechos Conexos)
De acuerdo con el Artículo 13 de la Ley No. 312, los programas de ordenador (software) se
protegen como obras literarias, abarcando el código fuente, código binario compilado, documentación
técnica y manuales de usuario.
Derechos Morales (Artículos 13, 14, 15, 16 y 17): Son inalienables, imprescriptibles,
irrenunciables e inembargables. La paternidad intelectual e integridad del sistema pertenecen
perpetuamente a los desarrolladores Ángel Alonso, Noel Alemán y Mendell Parrales.
Derechos Patrimoniales (Artículos 21 al 28): Los autores conceden mediante este acto
una Licencia de Uso Perpetuo, Exclusiva para el local comercial e Intransferible. Se
prohíbe de manera expresa la reventa, el sublicenciamiento o la explotación bajo la modalidad
de Software como Servicio (SaaS) a terceros.
1.2.
Código Civil y Código de Comercio de Nicaragua
El contrato reúne plenamente los requisitos esenciales del Artículo 2448 del Código Civil (con-
sentimiento libre de vicios, capacidad jurídica de los otorgantes, objeto lícito y causa lícita) y
adquiere fuerza obligatoria vinculante entre las partes conforme al principio pacta sunt servanda
(Artículo 1836 C.) y las normas de contratación mercantil (Artículos 112 y siguientes del Código de
Comercio).
1.3.
Ley No. 787 y Decreto No. 36-2012 (Protección de Datos Personales)
El sistema almacena datos comerciales y de clientes en el motor local PostgreSQL. Conforme a la
Ley No. 787, la Licenciataria funge como Responsable de la Base de Datos y el Equipo Desa-
rrollador actúa como Encargado del Tratamiento temporal durante el despliegue. Se garantiza
el aislamiento de red en la dirección local 127.0.0.1, autenticación por roles (RBAC) y cifrado
unidireccional de contraseñas.
1.4.
Ley No. 822 (Ley de Concertación Tributaria) y Plan de Arbitrios de Ma-
nagua
Retenciones Fiscales Nacionales (DGI): La Licenciataria retendrá el 10 % a cuenta del
Impuesto sobre la Renta (IR) por servicios profesionales y técnicos (Artículos 87 y 88 LCT).
Retención Municipal de Managua (ALMA): Se aplicará la retención del 1 % en concep-
to de Impuesto Municipal sobre Ingresos (IMI) en cumplimiento del Artículo 11 del
Decreto No. 10-91 (Plan de Arbitrios de Managua).
Depreciación y Amortización Fiscal: El hardware del servidor SRV1 se deprecia
scalmente
al 20 % anual en 5 años (Art. 44 LCT) y el intangible de software se amortiza al 20 % anual
2

---

(Art. 45 LCT).
3

---

## Texto Íntegro del Contrato de Licencia y Servicios de Software

2.
Texto Íntegro del Contrato de Licencia y Servicios de Software
Nosotros:
1. ÁNGEL ANTONIO ALONSO SUÁREZ, mayor de edad, soltero, Ingeniero de Software,
carnet universitario 2021-0087U (No. Persona 6B763BC6) y cédula de identidad 001-150801-
1002A;
2. NOEL ISAAC ALEMÁN CARBALLO, mayor de edad, soltero, Ingeniero de Software,
carnet universitario 2022-0376U (No. Persona 6B76CA80) y cédula de identidad 001-220400-
1005K; y
3. MENDELL NOÉ PARRALES MOLINA, mayor de edad, soltero, Ingeniero de Software,
carnet universitario 2020-1014U (No. Persona 6AAB3C24) y cédula de identidad 001-091100-
1008P;
Todos con domicilio en el Municipio de Managua, Departamento de Managua, actuando conjunta-
mente como autores y cotitulares originarios, denominados en adelante LOS LICENCIANTES;
y por otra parte:
DISTRIBUIDORA MOTO REPUESTOS EL CENTENARIO, S.A., entidad mercantil
con RUC J0310000123456 y domicilio comercial en Pista Suburbana  El Zumen, Managua, repre-
sentada por su Gerente General CARLOS ALBERTO MENDOZA GUIDO, con facultades
plenas acreditadas notarialmente, denominada en adelante LA LICENCIATARIA; convenimos
en celebrar el presente contrato sujeto a las siguientes cláusulas:
CLÁUSULA PRIMERA: ANTECEDENTES Y DEFINICIONES
LA LICENCIATARIA requiere sistematizar sus operaciones comerciales de venta de repuestos
de motocicletas, control de Kardex y mostrador. LOS LICENCIANTES han desarrollado una
plataforma modular en Python/Django con motor PostgreSQL y control de inventarios bajo el
método del Promedio Ponderado. Se de
ne como Servidor SRV1 al equipo físico Dell PowerEdge
T150 instalado en el local de Managua.
CLÁUSULA SEGUNDA: OBJETO Y ALCANCE
LOS LICENCIANTES otorgan a LA LICENCIATARIA una Licencia de Uso Perpetua,
No Exclusiva e Intransferible sobre el software comercial, incluyendo instalación en el servidor
local SRV1, con
guración de la base de datos en PostgreSQL, parametrización de roles (RBAC) y
veinticuatro (24) horas de capacitación presencial al personal operativo.
CLÁUSULA TERCERA: LIMITACIONES Y RESTRICCIONES DE LA LI-
CENCIA
La licencia autoriza el uso exclusivamente en el servidor físico local SRV1 de la sede de Managua. Se
prohíbe taxativamente la reventa, sublicenciamiento, cesión a terceros, duplicación para sucursales
no autorizadas o la explotación en nubes públicas bajo el modelo de Software como Servicio (SaaS).
4

---

CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL Y DERECHOS MORA-
LES
En estricta observancia de las Leyes No. 312 y 577 de Nicaragua, los derechos morales de
autoría pertenecen a perpetuidad a LOS LICENCIANTES. La entrega de binarios y código
fuente desplegado en el servidor no trans
ere la propiedad intelectual de la obra base.
CLÁUSULA QUINTA: PRECIO, FORMA DE PAGO Y RETENCIONES
El precio total pactado por los servicios profesionales es de $3,500.00 USD (tres mil quinientos
dólares netos, equivalentes a C$ 128,800.00 NIO a la tasa o
cial del BCN de 36.8000 NIO/USD),
desglosado en $2,700.00 USD (C$ 99,360.00 NIO) por el Desarrollo y Licencia Perpetua de Uso
del Software (estimado mediante COCOMO II para 8.757 KLOC y 9.0 personas-mes) más $800.00
USD (C$ 29,440.00 NIO) por Servicios de Instalación, Con
guración de Red/Servidor y Puesta
en Marcha (adicionales al suministro de hardware nacionalizado de $10,162.14 USD que conforma
el CAPEX total llave en mano de $13,662.14 USD). El pago se distribuirá en tres hitos: 40 % de
anticipo ($1,400.00 USD), 30 % al aprobar las pruebas integrales ($1,050.00 USD) y 30 % contra
rma del Acta de Entrega De
nitiva ($1,050.00 USD). La Licenciataria aplicará la retención en
la fuente del 10 % a cuenta del IR (DGI, Art. 87 Ley No. 822) y la retención del 1 % del
IMI (Alcaldía de Managua, Art. 11 Decreto No. 10-91).
CLÁUSULA SEXTA: GARANTÍA TÉCNICA, MANTENIMIENTO (ISO/IEC
14764) Y NUEVAS FUNCIONES
Se otorga una garantía inicial de noventa (90) días naturales sin costo a partir de la
rma
del Acta de Entrega, cubriendo la corrección de errores de código (bugs) atribuibles al desarrollo
original. Vencido este plazo, LA LICENCIATARIA contará con la póliza de mantenimiento
operativo presupuestada en OPEX por $65.00 USD/mes (C$ 2,392.00 NIO/mes), que cubre
mantenimiento preventivo (optimización PostgreSQL VACUUM ANALYZE, telemetría S.M.A.R.T. y
simulacros de respaldo 3-2-1), correctivo bajo SLA y adaptativo menor (parches de seguridad Debian
12 / Django LTS). Todo desarrollo de nuevas funciones o módulos evolutivos fuera del alcance
base (REQ-MREC-001) se cotizará por separado mediante Orden de Cambio Evolutiva bajo la métrica
de Trá
co de Cambio Anual de COCOMO II (ACT) a la tarifa preferencial de $300.00 USD
por Persona-Mes (ej. Portal B2B Talleres $200 USD; Facturación Electrónica DGI $295 USD;
App Móvil Bodega $170 USD), aprovechando el diseño modular abierto/cerrado (SOLID OCP) del
sistema.
CLÁUSULA SÉPTIMA: ACUERDO DE NIVEL DE SERVICIO (SLA)
Durante la garantía, el tiempo de respuesta para incidentes Críticos (Nivel 1) será de máximo 4
horas (resolución en ≤12 h); para incidentes Medios (Nivel 2), respuesta en ≤8 horas; y para
incidentes Leves (Nivel 3), respuesta en ≤24 horas.
5

---

CLÁUSULA OCTAVA: CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS
(NDA)
En virtud de la Ley No. 787, los desarrolladores guardarán estricto secreto profesional respecto a
listas de precios, márgenes y datos de clientes. Toda la información reside localmente en el servidor
sin réplicas en repositorios externos no autorizados.
CLÁUSULA NOVENA: EXCLUSIÓN Y LÍMITE DE RESPONSABILIDAD
Los licenciantes no responderán por daños derivados de variaciones eléctricas externas que superen
la capacidad del UPS, alteración de con
guraciones por personal no autorizado o virus introducidos
mediante memorias USB en las estaciones cliente. La responsabilidad máxima indemnizatoria se
limita al 50 % del valor pagado.
CLÁUSULA DÉCIMA: ACTA DE ENTREGA Y CONFORMIDAD
La culminación de los servicios se formalizará mediante la suscripción del Acta de Entrega y
Recepción De
nitiva a Satisfacción, que dará inicio al cómputo de los 90 días de garantía
técnica.
CLÁUSULA DÉCIMA PRIMERA: RESOLUCIÓN CONTRACTUAL
El contrato podrá rescindirse por mora en pagos superior a quince (15) días, violación del régimen
de propiedad intelectual o abandono injusti
cado del soporte técnico en garantía.
CLÁUSULA DÉCIMA SEGUNDA: JURISDICCIÓN Y MEDIACIÓN DIRAC
Las partes acuerdan someter cualquier diferendo a un trámite de mediación previa obligatoria ante
la Dirección de Resolución Alterna de Con
ictos (DIRAC) de Managua. De persistir el
desacuerdo, se someten a los Juzgados de Distrito de lo Civil de Managua, Nicaragua.
En fe de lo acordado, se
rman cuatro ejemplares de igual tenor en Managua, Nicaragua, a los
días del mes de
del año 2026.
6

---

Ángel Antonio Alonso Suárez
Noel Isaac Alemán Carballo
Licenciante / Co-Autor (2021-0087U)
Licenciante / Co-Autor (2022-0376U)
Mendell Noé Parrales Molina
Carlos Alberto Mendoza Guido
Licenciante / Co-Autor (2020-1014U)
Por: Moto Repuestos El Centenario, S.A.
7

---

## Anexo I: Acta Formal de Entrega y Recepción Definitiva

Anexo I: Acta Formal de Entrega y Recepción De
nitiva
En la ciudad de Managua, Departamento de Managua, República de Nicaragua, a las
horas del día
de
del año 2026.
Reunidos en las instalaciones de DISTRIBUIDORA MOTO REPUESTOS EL CENTENA-
RIO, S.A., comparecen el Equipo Desarrollador y el Representante Legal de la empresa para hacer
constar que:
1. Entregables Técnicos Recibidos:
Servidor Central SRV1 desplegado con Debian GNU/Linux 12 LTS y PostgreSQL 18.4 opti-
mizado.
Módulos de Facturación, Inventario Kardex Promedio Ponderado, Compras y Caja veri
cados
y operativos.
Segmentación por VLANs (10, 20, 30, 40, 50, 99) y agentes de respaldo automatizado hacia
NAS y disco externo.
Capacitación operativa presencial de 24 horas reloj impartida satisfactoriamente al personal.
2. Cómputo de Garantía: A partir de la fecha de suscripción de la presente acta, inicia el período
de noventa (90) días naturales de garantía técnica limitada estipulada en la Cláusula Sexta.
3. Aceptación De
nitiva: La Licenciataria mani
esta su total conformidad y autoriza la liqui-
dación del pago
nal acordado.
Por el Equipo Desarrollador
Por la Licenciataria
Ángel Alonso · Noel Alemán · Mendell Parrales
Carlos Alberto Mendoza Guido · Gerente General
8

---

# Capítulo 17: Ficha Técnica del Modelo Financiero Automatizado (Excel de 9 Hojas)

**IV Entrega Oficial — Unificación y Parametrización del Modelo Cuantitativo**

## 17.1. Arquitectura del Libro Financiero Parametrizado (Excel Interactivo)

El modelo financiero cuantitativo del proyecto se implementa en el libro `03_Modelo_Financiero_mrec.xlsx` (y su copia sincronizada en la presentación web `Modelo_Financiero_MotoRepuestos_Centenario.xlsx`), estructurado en **9 hojas** dinámicas enlazadas mediante fórmulas activas sin valores quemados:

1. **Resumen:** Tablero ejecutivo consolidado de VAN, TIR, ROI (3 y 5 años), recuperación simple y descontada, relación B/C y parámetros globales de inversión, operación y COCOMO II.
2. **Supuestos:** Parámetros generales (tipo de cambio C$ 36.8000/USD, TMAR 12.00%, horizonte de 5 años, costo por persona-mes `$300.00 USD`) y variables por escenario (Pesimista, Base, Optimista).
3. **COCOMO:** Estimación Post-Architecture sobre 8.757 KLOC (`ΣSF = 9.00`, `E = 1.00`, `EAF = 0.35`, esfuerzo 9.0 PM, duración 3.0 meses, costo de desarrollo `$2,700.00 USD` + `$800.00 USD` de instalación = `$3,500.00 USD` conforme a Cláusula V del Contrato).
4. **Infraestructura:** Proforma de 19 componentes hardware y red (Ex-Works `$7,770.09 USD`, flete `$800.00`, seguro `$116.55`, CIF `$8,686.64`, DAI `$150.00`, impuesto aduanero de importación `$1,325.50` -> Total Nacionalizado `$10,162.14 USD`) más presupuesto OPEX de `$2,400.00 USD/año` (`$200.00 USD/mes`).
5. **Riesgos:** Matriz cuantitativa de contingencias técnicas y operativas (reserva económica total `$707.09 USD`; reserva de desembolso `$200.48 USD`).
6. **Inversion:** Dualidad patrimonial entre Patrimonio Tecnológico en Operación (`$13,987.14 USD`, que incluye `$325.00 USD` en activos preexistentes) y Desembolso Inicial de Caja (`I0 = $13,662.14 USD`), además de depreciación fiscal Ley 822 (`$2,572.43 USD/año`) y escudo tributario.
7. **Beneficios:** Cuantificación anual por escenario: Pesimista `$7,400.00 USD`, Base **`$10,400.00 USD`** (reducción de merma `+$2,853.06`, supresión de abandono `+$4,239.07` y reducción de errores `+$3,307.87`) y Optimista `$13,000.00 USD`.
8. **Flujos:** Flujos de caja proyectados (Años 0 a 5) para los 3 escenarios bajo las perspectivas de Costo Económico Total y Desembolso Centenario, con cálculo dinámico de VAN, TIR, ROI, Payback simple/descontado y relación B/C.
9. **Capacidades:** Dimensionamiento operativo a 5 años para PostgreSQL 18.4 (40 facturas/día, 1,040 facturas/mes, 84,146 facturas acumuladas y consumo de `58.00 GB` sobre `1,000 GB` RAID 1 = `5.80%`).

## 17.2. Resumen Ejecutivo de Métricas de Rentabilidad y Retorno (Años 0 a 5)

| Indicador Financiero Cuantitativo | Valor Oficial (Base) | Criterio de Decisión / Dictamen |
| :--- | :--- | :--- |
| Inversión Inicial Desembolsada (`I0` / CAPEX) | `$13,662.14 USD` | HW nacionalizado (`$10,162.14`) + SW (`$3,500.00`) |
| Patrimonio Tecnológico en Operación | `$13,987.14 USD` | Incluye `$325.00 USD` en activos preexistentes |
| Costo Operativo Anual (OPEX) | `$2,400.00 USD/año` | `$200.00 USD/mes` (Energía, Internet, Tóner/Papel, Soporte) |
| Beneficio Bruto / Flujo Neto Anual | `$10,400.00` / `+$8,000.00 USD` | Flujo neto recurrente positivo desde el Año 1 |
| Tasa Mínima Aceptable de Rendimiento (TMAR) | `12.00%` | Tasa de oportunidad PyME comercial en Nicaragua |
| Valor Actual Neto (VAN a 5 años) | `$15,176.26 USD` | Factor `a_{5|0.12} = 3.6048` (precisión continua: `$15,176.07 USD`) |
| Tasa Interna de Retorno (TIR) | `50.84%` | Supera la TMAR en +38.84 pp (cálculo continuo IRR: `51.13%`) |
| Período de Recuperación (Payback) | `1.71 años` (simple) / `2.08 años` (desc.) | Retorno dinámico exacto: `2.0249 años` (~2 años y 1 mes) |
| Índice Beneficio / Costo (B/C) y ROI 5 años | `2.11` | `192.78%` — Por cada `$1.00` invertido se obtienen `$2.11` en valor presente |

| Análisis de Sensibilidad | Pesimista | Base (Proyectado) | Optimista |
| :--- | ---: | ---: | ---: |
| Flujo Neto de Caja Anual (`FC_t`) | `+$5,000.00 USD` | `+$8,000.00 USD` | `+$10,600.00 USD` |
| Valor Actual Neto (VAN al 12.00%) | `+$4,361.86 USD` | `+$15,176.26 USD` | `+$24,548.74 USD` |
| Tasa Interna de Retorno (TIR) | `24.23%` | `50.84%` | `72.51%` |
| Payback Simple | `2.73 años` | `1.71 años` | `1.29 años` |

## 17.3. Integración con el Visor Web Interactivo Institucional

Para facilitar la inspección docente directamente en navegador sin depender de suites ofimáticas ni librerías externas de lectura binaria de Excel, el componente `Presentación/Presentacion/visor-excel.html` incrusta los datos recalculados de las **9 hojas** mediante el objeto JSON estático `workbookData`, sincronizado celda por celda con `03_Modelo_Financiero_mrec.xlsx` y estilizado mediante Tailwind CSS y Lucide Icons.

---

# Capítulo 18: Matriz de Trazabilidad Integral de Requisitos

**IV Entrega Oficial — Trazabilidad Bidireccional: Requisitos ISO 29148, Arquitectura, Código y Pruebas**

La siguiente matriz establece la trazabilidad verificable entre las **15 reglas de negocio** (`RN-01..RN-15`), los **16 requisitos de partes interesadas** (`ST-REQ-001..016`), los **30 requisitos funcionales de sistema** (`SYS-FN-001..030`) y **72 requisitos de software** (`SRS-*`) definidos en el Documento Integral de Requisitos (Cap. 03), las **12 capacidades funcionales** (`RF-01..RF-12`) y **12 atributos de calidad** (`RNF-01..RNF-12`) de la Descripción de Arquitectura (Cap. 04), los módulos implementados en Django/PostgreSQL 18.4 (`commerce/`) y la suite de verificación de **120 pruebas** (Cap. 11 y Cap. 12).

| Cap. Arq. | Requisitos SRS / SyRS / RN | Descripción Funcional / Calidad | Módulos / Modelos Django | Verificación (Suite 120) | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RF-01` | `SYS-FN-001/002`, `SRS-AUT-001..003`, `RN-11` | Identidad, autenticación segura, bloqueo por intentos y RBAC | `authentication.py`, `auth_security.py`, `LoginThrottle` | Pruebas RBAC, bloqueo y sesión 30 min | 100% OK |
| `RF-02` | `SYS-FN-003..005`, `SRS-CAT-001..004`, `RN-03/04` | Catálogo técnico, marca/modelo/año de moto y compatibilidad | `catalog_queries.py`, `Product`, `VehicleModel` | Pruebas catálogo y compatibilidad | 100% OK |
| `RF-03` | `SYS-FN-006..008`, `SRS-PRV-001`, `SRS-COM-001..003` | Proveedores, órdenes de compra, recepciones parciales y excesos | `supplier_io.py`, `PurchaseOrder`, `PurchaseReceipt` | Pruebas compras y recepciones | 100% OK |
| `RF-04` | `SYS-FN-009..012`, `SRS-INV-001..005`, `RN-01/02` | Kardex de solo anexado, stock no negativo y conteos ciegos | `inventory_services.py`, `StockBalance`, `StockMovement` | Pruebas Kardex y stock >= 0 | 100% OK |
| `RF-05` | `SYS-FN-013`, `SRS-COT-001/002`, `RN-06` | Cotizaciones versionadas con vigencia y conversión a venta | `services.py`, `Quote`, `QuoteVersion` | Pruebas de cotización y versión | 100% OK |
| `RF-06` | `SYS-FN-014..018`, `SRS-VNT-001..008`, `RN-05/07/08` | Venta POS atómica, pagos divididos e impuestos configurables (`TaxPolicy`) | `sales_services.py`, `pricing_services.py`, `Sale`, `TaxPolicy` | Pruebas POS, pagos y políticas | 100% OK |
| `RF-07` | `SYS-FN-019/020`, `SRS-DEV-001/002`, `RN-13` | Devoluciones vinculadas a factura, garantías y anulaciones | `return_services.py`, `cancellation_services.py` | Pruebas devolución y garantía | 100% OK |
| `RF-08` | `SYS-FN-021/022`, `SRS-CAJ-001..003`, `RN-12` | Turnos de caja, fondo inicial, movimientos y cierre ciego | `cash_services.py`, `CashShift`, `CashMovement` | Pruebas apertura y cierre de caja | 100% OK |
| `RF-09` | `SYS-FN-023`, `SRS-AUD-001/002`, `RN-09/10` | Auditoría inmutable de eventos sensibles y `correlation_id` | `AuditEvent`, `middleware.py`, `request_context.py` | Pruebas trazabilidad y correlación | 100% OK |
| `RF-10` | `SYS-FN-024`, `SRS-REP-001..003` | Reportes operativos, márgenes, rotación y conciliación | `list_queries.py`, `performance_sales.py` | Pruebas de reportes y margen | 100% OK |
| `RF-11` | `SYS-FN-025/026`, `SRS-IMP-001/002`, `SRS-EXP-001` | Importación/exportación CSV UTF-8 versionada y PDF | `catalog_io.py`, `supplier_io.py` | Prueba importación 10,000 productos | 100% OK |
| `RF-12` | `SYS-FN-027..030`, `SRS-BKP-001..003`, `SRS-LOG-001`, `RN-14` | Respaldos 3-2-1, verificación SHA-256 y recuperación | `backup_integrity.py`, `recovery_mode.py` | Pruebas respaldo, USB y HTTP 503 | 100% OK |
| `RNF-01 / 02` | `ST-REQ-001`, `SRS-PR-001..005`, `SRS-DB-001..006` | Búsqueda `P95 <= 3 s`, venta `P95 <= 5 s`, 20,000 prod., 4 POS | Índices PostgreSQL 18.4, `performance_catalog.py` | Ensayos P95 (0.029 s / 1.142 s) | 100% OK |
| `RNF-03 / 04` | `SRS-BKP-001..003`, `RN-14` | Disponibilidad 99.5%, RPO <= 15 min / RTO <= 2 h en LAN | Comandos `backup_database`, `verify_restore` | Pruebas restauración y modo 503 | 100% OK |
| `RNF-05 / 06` | `SYS-SC-001..010`, `SRS-DS-001..005`, `RN-01/07/15` | Seguridad OWASP (CSRF, XSS, SQLi, sal) e integridad ACID | `transaction.atomic`, `quantity__gte`, `PROTECT`, `CHECK` | Regresión 120 pruebas + concurrencia | 100% OK |
| `RNF-07 a 12` | `SRS-US-001..005`, `SRS-AT-001..007` | Usabilidad <= 4 pantallas, LAN offline, 4 capas SOLID, viabilidad | Templates POS, `commerce/` en 4 capas, Debian 12 | Pruebas UX, roles y despliegue | 100% OK |

## 18.1. Resumen de Conformidad de Verificación y Esquema Relacional

- **Cobertura de Requisitos:** 15 Reglas de Negocio (`RN-01..15`), 16 Requisitos de Partes Interesadas (`ST-REQ-001..016`), 30 Requisitos Funcionales de Sistema (`SYS-FN-001..030`), 72 Requisitos `SRS-*` y 24 Capacidades/Calidades Arquitectónicas (`RF-01..12` y `RNF-01..12`).
- **Suite de Verificación Oficial:** **120 pruebas** automatizadas ejecutadas sobre PostgreSQL 18.4 (`Ran 120 tests ... OK en 289,28 s`, cero fallos y cero errores), complementadas por las pruebas de carga sobre 20,000 productos y 500 ventas concurrentes.
- **Evolución del Esquema de Base de Datos:** Parte de las **8 tablas físicas** diseñadas en el informe SABD (`categorias`, `proveedores`, `clientes`, `empleados`, `productos`, `facturas`, `detalle_facturas`, `compras_proveedores`) y se amplía en la implementación Django + PostgreSQL 18.4 a **38 modelos de dominio** gestionados mediante **46 migraciones** totales (**28 migraciones** de `commerce`), garantizando integridad referencial estricta con `transaction.atomic`, actualizaciones condicionales `quantity__gte`, tipos `NUMERIC`, restricciones `CHECK`, `UNIQUE` y `PROTECT`.

---

# Capítulo 19: Conclusiones Integrales y Dictamen Final del Proyecto

**Síntesis Global de Ingeniería, Viabilidad Multidimensional y Cierre de Proyecto**

## 19.1. Conclusión Técnica y Arquitectónica

Se diseñó e implementó la arquitectura del sistema para *Distribuidora Comercial Moto Repuestos El Centenario, S.A.*, sustentada en el estándar ISO/IEC/IEEE 42010:2022, vistas C4, UML 2.5.1 selectivo y principios de diseño modular SOLID en cuatro capas sobre Django/Python y PostgreSQL 18.4. Se superó la gestión manual en bitácoras ampliando la base conceptual original de 8 tablas físicas hacia un esquema normalizado en 3FN gestionado por 46 migraciones Django, con atomicidad ACID (`transaction.atomic`, actualizaciones condicionales `quantity__gte` y borrado protegido `PROTECT`).

## 19.2. Conclusión de Calidad, UX y Verificación de Software

La calidad del producto se validó mediante una suite automatizada de **120 pruebas** de software y base de datos sobre PostgreSQL 18.4 con 100% de éxito (cero fallos y cero errores en 289.28 segundos), alcanzando tiempos empíricos de búsqueda `P95 = 0.029 s` (muy por debajo del umbral `P95 <= 3 s`) y 500 ventas concurrentes en `1.142 s` (cumpliendo `P95 <= 5 s`). El diseño UX simplificó el flujo de venta en mostrador en hasta 4 pantallas con navegación por teclado.

## 19.3. Conclusión de Seguridad y Mitigación de Riesgos

El sistema incorpora controles proactivos alineados con buenas prácticas de programación segura: consultas ORM parametrizadas sin SQL dinámico inseguro, protección CSRF, escape automático contra XSS, control de acceso basado en roles (RBAC) con separación de funciones, bloqueo temporal por intentos fallidos (`LoginThrottle`), sesiones de 30 minutos y auditoría inmutable correlacionable en `AuditEvent`.

## 19.4. Conclusión Financiera, Rentabilidad y Viabilidad Económica

El análisis financiero quinquenal (alineado en `02_Informe_Financiero_mrec.pdf` y `03_Modelo_Financiero_mrec.xlsx`) demuestra sólida viabilidad económica sobre una inversión inicial desembolsada de **`$13,662.14 USD`** (Patrimonio Tecnológico total de **`$13,987.14 USD`**) y un OPEX anual contenido de **`$2,400.00 USD`** (`$200.00 USD/mes`): a una TMAR del **`12.00%`**, se obtiene un **VAN de `$15,176.26 USD`** (precisión continua `$15,176.07 USD`), una **TIR del `50.84%`** (`51.13%` continua), un **ROI a 5 años del `192.78%`**, una relación **B/C de `2.11`** y un período de recuperación de **`1.71 años`** (simple) / **`2.08 años`** (descontado). La supresión de pérdidas por abandono en hora pico (`$5,298.84 USD/año`) y la reducción de mermas y errores garantizan un flujo de caja neto anual de **`+$8,000.00 USD`**.

## 19.5. Conclusión Legal y Transferencia Tecnológica

El Contrato Mercantil de Licencia de Software (Cláusulas I a XII) resguarda los derechos morales de autoría conforme a la Ley No. 312 y Ley No. 577 de la República de Nicaragua, otorgando a *Moto Repuestos El Centenario, S.A.* una licencia perpetua e intransferible, garantía técnica de 90 días y Acuerdos de Nivel de Servicio (SLA) para continuidad operativa.

## Dictamen Final de Ingeniería y Acta de Culminación

**Universidad Nacional de Ingeniería (UNI) — DACTIC — Ingeniería de Software 1**

> **DICTAMEN ACADÉMICO FAVORABLE DE LA CONSULTORÍA:** El equipo de consultoría y desarrollo certifica que la documentación integral y la solución tecnológica diseñadas para la empresa **Distribuidora Comercial "Moto Repuestos El Centenario, S.A."** cumplen con los estándares de requisitos, arquitectura, diseño, seguridad, pruebas, infraestructura, viabilidad financiera y marco contractual pactados en las Entregas I, II, III y IV.

| Dimensión Auditada | Estado Oficial Verificado |
| :--- | :--- |
| Línea Base de Requisitos | 100% Especificada (ISO/IEC/IEEE 29148: `RN-01..15`, `ST-REQ-001..016`, `SYS-FN-001..030`, `SRS-*`) |
| Verificación y Pruebas | Suite automatizada de **120 pruebas** aprobadas (0 fallos, 0 errores en PostgreSQL 18.4) |
| Arquitectura de Datos | Base conceptual de **8 tablas físicas** SABD ampliada mediante **46 migraciones** Django (38 modelos) |
| Viabilidad Financiera (Base) | CAPEX `$13,662.14 USD` (Patrimonio `$13,987.14`), OPEX `$2,400.00/año`, TMAR `12.00%`, **VAN `$15,176.26 USD`**, **TIR `50.84%`**, Payback `1.71` (simple) / `2.08 años` (desc.), B/C `2.11` |
| Documentación Unificada | Entregas I, II, III y IV compiladas íntegramente (PDF y Markdown) junto al anexo evolutivo post-implantación |

- **Ángel Antonio Alonso Suárez** — Carnet: `2021-0087U` — Líder de Arquitectura / Backend
- **Noel Isaac Alemán Carballo** — Carnet: `2022-0376U` — Especialista BD / Pruebas
- **Mendell Noé Parrales Molina** — Carnet: `2020-1014U` — Ingeniero UX / Metodología
- **Recepción Institucional:** Ing. Roberto Alfaro — Docente Titular, Ingeniería de Software 1, DACTIC — UNI.
- **Lugar y Fecha:** Recinto Universitario Simón Bolívar (RUSB), Managua, 17 de noviembre de 2026.

---

# Capítulo 20: Operación Evolutiva, Sostenibilidad y Capacidades Post-Implantación

**IV Entrega Oficial — Proyección Práctica de Mantenimiento y Evolución en Producción Real**

Una vez puesto en producción el sistema de *Moto Repuestos El Centenario, S.A.* sobre su infraestructura oficial (servidor `SRV1` Dell PowerEdge T150 con Debian 12, Nginx TLS 1.3, Gunicorn, Django y PostgreSQL 18.4, 4 cajas POS en LAN, respaldo 3-2-1 con NAS Synology DS224+ y disco USB LUKS2, bajo presupuesto OPEX de soporte preventivo de `$65.00 USD/mes` y SLA contractual Nivel 1 `<= 4 h`, Nivel 2 `<= 8 h`, Nivel 3 `<= 24 h`), la sostenibilidad a mediano y largo plazo depende de cuatro capacidades prácticas de ingeniería de software:

## 20.1. Resolución de Incidentes Críticos (Frameworks y Herramientas)

Ante fallos graves en horario comercial (p. ej., detención de facturación en mostrador, bloqueos transaccionales en PostgreSQL o degradación de almacenamiento), el equipo adopta una respuesta estructurada combinando tres marcos: **ITIL 4** (separando la restauración rápida del servicio en Gestión de Incidentes del análisis profundo en Gestión de Problemas, mapeado a prioridades P1 `<= 4 h`, P2 `<= 8 h`, P3 `<= 24 h`), **Google SRE** (*Runbooks* operativos, objetivos SLO `>= 99.5%` de disponibilidad y *Blameless Postmortems*) e **ISO/IEC 27035** para incidentes de seguridad auditados en `AuditEvent`.

| Categoría | Herramienta Sugerida | Uso Práctico en el Entorno MREC |
| :--- | :--- | :--- |
| Gestión de incidentes y SLA | **Zammad** / **GLPI** o **Jira Service Management** | Registro de tickets por caja POS, control de tiempos SLA contractuales y escalamiento. |
| Alertamiento y monitoreo | **Prometheus** + **Grafana** + **Alertmanager** / **PagerDuty** | Métricas de SRV1 (RAM ECC, SSD, PostgreSQL 18.4), latencia P95 y alertas tempranas. |
| Trazabilidad y diagnóstico | **Sentry**, `journalctl`, `pg_stat_activity`, `MREC_RECOVERY_MODE=1` | Captura de excepciones Django con `correlation_id`, suspensión segura HTTP 503 y validación con `verify_restore`. |

El protocolo operativo se ejecuta en cuatro fases: (1) triaje por impacto en ventas y contabilidad; (2) mitigación inmediata mediante `MREC_RECOVERY_MODE=1`, *rollback* de despliegue o restauración verificada SHA-256 desde el respaldo 3-2-1 (`RPO <= 15 min`, `RTO <= 2 h`); (3) análisis de causa raíz (*5 Porqués* / Ishikawa); y (4) *post-mortem* documentado con incorporación de nuevas pruebas automatizadas a la suite de 120 pruebas.

## 20.2. Negociación de Deuda Técnica con Clientes Reales

Para evitar que la acumulación de deuda técnica degrade el rendimiento al crecer el catálogo hacia 20,000 productos o encarezca futuros cambios, el equipo utiliza el **Cuadrante de Deuda Técnica de Martin Fowler** e **ISO/IEC 25010** junto con el **Método SQALE** para cuantificar el costo de remediación, apoyado en herramientas de análisis estático (**SonarQube**, **Ruff**, **Mypy**, **Coverage.py**) y priorización mediante **WSJF / Cost of Delay** y matriz **Valor vs. Riesgo** en tableros Kanban (**Jira / GitHub Projects**).

En la negociación con la Gerencia de Moto Repuestos El Centenario se aplica un protocolo de cuatro pasos: (1) medir objetivamente los puntos críticos; (2) traducir el problema técnico a consecuencias comprensibles de negocio (tiempo en mostrador, riesgo de errores de cobro o sobrecosto de cambios futuros); (3) proponer tres alternativas concretas (amortización del 15–20% por iteración, sprint focalizado de alto retorno o aceptación documentada del riesgo temporal); y (4) formalizar el acuerdo bajo la Cláusula de Mantenimiento Evolutivo con métricas verificables de mejora.

## 20.3. Interoperabilidad con Tecnologías Emergentes

Aunque la v1.0 opera aislada en LAN (`RNF-08`), su arquitectura en cuatro capas facilita futuras integraciones con facturación electrónica fiscal, catálogos de proveedores, pasarelas de pago, predicción de demanda mediante IA/ML sobre el historial de Kardex o lectores IoT/RFID en bodega, aplicando **Arquitectura Hexagonal (Puertos y Adaptadores)**, **Capa Anticorrupción (ACL)**, versionado de APIs (`/api/v1/`) y desacoplamiento asíncrono (*patrón Outbox*) para no comprometer la latencia de caja (`P95 <= 5 s`).

Como herramientas de interoperabilidad se recomiendan: **Django REST Framework (DRF)** con **drf-spectacular (OpenAPI 3.1 / Swagger)** sobre **JSON (UTF-8)** y **XML**, seguridad mediante **TLS 1.3**, **OAuth 2.0 / JWT** y firmas **HMAC-SHA256** para webhooks, colas **Celery + Redis** para procesamiento en segundo plano, contenedores **Docker / FastAPI** para microservicios de IA/analítica y pruebas de contrato con **Schemathesis / Pact**.

## 20.4. Adaptabilidad ante Requerimientos Cambiantes

Siguiendo el enfoque de **Ian Sommerville**, los cambios futuros (nuevas reglas tributarias configurables vía `TaxPolicy`, sucursales adicionales o acceso móvil en bodega) deben someterse a un flujo formal de **Gestión y Análisis de Impacto** antes de aprobarse, manteniendo las prácticas que favorecen la evolución sostenible: desarrollo iterativo e incremental, trazabilidad bidireccional (`ST-REQ -> SYS-FN -> SRS -> RF/RNF`), priorización **MoSCoW** con usuarios reales, diseño SOLID con pruebas automatizadas y refactorización continua.

| Recomendación Accionable | Práctica Concreta del Equipo | Criterio de Verificación |
| :--- | :--- | :--- |
| 1. Control formal de cambios (Sommerville) | Evaluar impacto en BD, módulos `commerce/`, RNF y costo antes de aceptar cambios. | Ficha de impacto aprobada por Gerencia y Líder Técnico. |
| 2. Cero regresiones y migraciones limpias | Ejecutar las 120+ pruebas en PostgreSQL 18.4 y `makemigrations --check` en cada entrega. | 100% pruebas aprobadas y cero migraciones pendientes. |
| 3. Parametrización dinámica | Mantener impuestos (`TaxPolicy`), descuentos y garantías configurables sin código duro. | Cero tasas fijas quemadas en servicios. |
| 4. Capacidad reservada a deuda técnica | Asignar 15–20% del esfuerzo evolutivo a deuda priorizada por WSJF/SQALE. | Tendencia estable o decreciente en SonarQube. |
| 5. Integración segura y asíncrona | Aislar APIs emergentes (OpenAPI/DRF) tras adaptadores y colas Celery fuera de caja POS. | Latencia de venta `P95 <= 5 s` preservada. |
| 6. Simulacros de respaldo 3-2-1 | Ejecutar `verify_backups` mensual y restauración real (`verify_restore`) trimestral. | Cumplimiento verificado `RPO <= 15 min`, `RTO <= 2 h`. |
