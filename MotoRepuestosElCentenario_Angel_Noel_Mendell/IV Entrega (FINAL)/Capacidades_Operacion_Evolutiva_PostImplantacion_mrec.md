# Capacidades Prácticas de Operación Evolutiva, Soporte y Sostenibilidad Post-Implantación

**Universidad Nacional de Ingeniería (UNI)**  
**Dirección de Área de Conocimiento DACTIC — Departamento de Lenguajes y Sistemas Informáticos**  
**Asignatura:** Ingeniería de Software 1 | **Período Lectivo:** 2026  
**Caso de Estudio:** Distribuidora Comercial "Moto Repuestos El Centenario, S.A." (Managua, Nicaragua)  
**Código:** `MREC-IS1-E4-EVO-01` | **Versión:** 1.0 (Noviembre de 2026)  
**Docente Titular:** Ing. Roberto Alfaro | **Grupo:** 4S1-COM-S

| Integrante | Carnet UNI | Rol en el Proyecto |
| :--- | :--- | :--- |
| Ángel Antonio Alonso Suárez | 2021-0087U | Líder de Arquitectura / Backend |
| Noel Isaac Alemán Carballo | 2022-0376U | Especialista en BD / Pruebas |
| Mendell Noé Parrales Molina | 2020-1014U | Ingeniero UX / Metodología |

---

## Índice

1. [Marco Contextual de Operación Post-Implantación](#1-marco-contextual-de-operación-post-implantación)
2. [Resolución de Incidentes Críticos en Operación Real](#2-resolución-de-incidentes-críticos-en-operación-real)
3. [Negociación de Deuda Técnica con Clientes Reales](#3-negociación-de-deuda-técnica-con-clientes-reales)
4. [Interoperabilidad con Tecnologías Emergentes](#4-interoperabilidad-con-tecnologías-emergentes)
5. [Adaptabilidad ante Requerimientos Cambiantes](#5-adaptabilidad-ante-requerimientos-cambiantes)
6. [Síntesis de Cierre](#6-síntesis-de-cierre)

> **Nota de Alcance Prospectivo:** El presente documento proyecta las capacidades prácticas de ingeniería de software requeridas por el equipo técnico y la distribuidora *Moto Repuestos El Centenario, S.A.* una vez que el sistema se encuentra implantado en producción local sobre la infraestructura definida en las Entregas II y III (servidor `SRV1` con Debian 12, Nginx, Gunicorn, Django, PostgreSQL 18.4, 4 terminales POS en red LAN, esquema de respaldo 3-2-1 y presupuesto OPEX de soporte preventivo de `$65.00 USD/mes` bajo la Cláusula de Mantenimiento del Contrato de Licencia).

---

## 1. Marco Contextual de Operación Post-Implantación

Una vez completada la implantación del Sistema de Gestión de Inventario, Facturación y Punto de Venta (POS) en *Moto Repuestos El Centenario, S.A.*, la ingeniería de software deja de centrarse únicamente en la construcción inicial para enfocarse en la **operación continua, la evolución controlada y la resiliencia del servicio en condiciones comerciales reales**.

La línea base heredada de las Entregas I, II y III sobre la cual operan estas capacidades futuras comprende:

- **Arquitectura y código en producción:** Monolito modular en Django/Python estructurado en cuatro capas (Presentación, Aplicación, Dominio e Infraestructura), con 38 modelos de dominio en `commerce/models.py` (que amplían las 8 tablas físicas conceptuales del diseño SABD mediante 28 migraciones de dominio y 46 migraciones totales en Django), respaldado por una suite automatizada de 120 pruebas de regresión.
- **Infraestructura física y continuidad:** Servidor local Dell PowerEdge T150 (`SRV1`, 32 GB RAM ECC, RAID 1) ejecutando Debian 12, Nginx con TLS 1.3, Gunicorn y PostgreSQL 18.4 en LAN comercial sin dependencia de Internet público, acompañado de NAS Synology DS224+ (RAID 1, VLAN 10) y disco USB cifrado con LUKS2 bajo la estrategia de respaldo 3-2-1 (`RPO <= 15 min`, `RTO <= 2 h`).
- **Marco contractual y financiero:** Presupuesto OPEX operativo de `$2,400.00 USD/año` (`$200.00 USD/mes`), dentro del cual `$65.00 USD/mes` (`$780.00 USD/año`) corresponden al soporte técnico preventivo conforme a ISO/IEC 14764, junto con la garantía de 90 días y los Acuerdos de Nivel de Servicio (SLA) estipulados en el Contrato de Licencia: Nivel 1 (crítico) `<= 4 h`, Nivel 2 (medio) `<= 8 h` y Nivel 3 (leve) `<= 24 h`.

---

## 2. Resolución de Incidentes Críticos en Operación Real

En un entorno de venta al detalle de repuestos con 4 cajas POS atendiendo flujos de hasta 40 transacciones diarias y picos en horario comercial (9:30 a. m. – 12:30 p. m. y 2:30 p. m. – 4:30 p. m.), un incidente crítico es cualquier evento que interrumpa la facturación en mostrador, comprometa la atomicidad de inventario/Kardex o exponga la integridad de la base de datos PostgreSQL 18.4.

### 2.1. Frameworks y metodologías recomendadas

1. **ITIL 4 (Gestión de Incidentes y Gestión de Problemas):** Separa la *restauración rápida del servicio* (Incidente) de la *eliminación de la causa raíz* (Problema). Define matrices de severidad por impacto comercial y urgencia alineadas con el SLA contractual de Moto Repuestos El Centenario (P1/Crítico `<= 4 h`, P2/Alto `<= 8 h`, P3/Leve `<= 24 h`).
2. **Google SRE (Site Reliability Engineering):** Aporta *Runbooks* (manuales operativos paso a paso para cada falla conocida), objetivos de nivel de servicio (SLO: disponibilidad `>= 99.5%` y latencia `P95 <= 3 s` en búsqueda / `<= 5 s` en venta) y *Blameless Postmortems* (análisis sin culpas orientados a corregir fallos sistémicos).
3. **ISO/IEC 27035 e ISO/IEC 27001 (Gestión de Incidentes de Seguridad):** Proporciona el protocolo de contención, preservación de evidencia en `AuditEvent` con `correlation_id` y notificación cuando el incidente involucra accesos no autorizados o intentos de alteración de precios/caja.

### 2.2. Herramientas de gestión de incidentes y observabilidad técnica

| Categoría | Herramienta Sugerida | Función en el Stack MREC (Debian / Django / PostgreSQL) |
| :--- | :--- | :--- |
| Mesa de ayuda y tickets SLA | **Zammad** o **GLPI** (auto-alojado) / **Jira Service Management** | Registro centralizado de tickets por caja POS, conteo automático de tiempos SLA (4 h / 8 h / 24 h) y escalamiento a consultores. |
| Alertamiento y rotación on-call | **Alertmanager** + **PagerDuty** o bots Telegram/Webhook | Notificación inmediata al responsable técnico cuando cae Gunicorn, se llena el RAID 1 o falla el respaldo nocturno. |
| Monitoreo de métricas y tableros | **Prometheus** + **Grafana** (`node_exporter`, `postgres_exporter`) | Supervisión de CPU/RAM ECC en SRV1, conexiones activas en PostgreSQL 18.4, latencia P95 de Nginx/Gunicorn y desgaste SSD. |
| Captura de excepciones | **Sentry** (o GlitchTip local en LAN) | Recolección de trazas completas de errores HTTP 500 en Django vinculados al `correlation_id` y usuario autenticado. |
| Diagnóstico en servidor y BD | `journalctl`, `pg_stat_activity`, `MREC_RECOVERY_MODE=1` | Inspección de bloqueos SQL en `StockBalance`, suspensión controlada con HTTP 503 durante restauración y validación con `verify_restore`. |

### 2.3. Protocolo operativo de respuesta en 4 fases

- **Fase 1 — Detección y triaje por impacto:** Clasificar en P1 si se detienen las 4 terminales POS o existe riesgo de pérdida contable; P2 si falla una estación o impresora auxiliar (operando las otras 3); P3 si afecta reportes históricos no urgentes.
- **Fase 2 — Mitigación inmediata (contención):** Activar `MREC_RECOVERY_MODE=1` para evitar escrituras parciales (HTTP 503 seguro), ejecutar *rollback* de la última versión vía Git/systemd si la falla proviene de un despliegue reciente, o restaurar la instantánea más reciente desde el NAS/USB 3-2-1 verificando integridad SHA-256 mediante `verify_backups` y `verify_restore` (`RPO <= 15 min`, `RTO <= 2 h`).
- **Fase 3 — Diagnóstico de causa raíz:** Correlacionar bitácoras de Nginx, `journalctl -u gunicorn`, eventos de `Sentry` y bloqueos en PostgreSQL (`pg_stat_activity`) aplicando técnica de los *5 Porqués* o diagrama de Ishikawa.
- **Fase 4 — Documentación y prevención (Post-mortem):** Redactar informe post-incidente dentro de las 48 horas posteriores, incorporando una nueva prueba automatizada en la suite de regresión (ampliando las 120 pruebas base) y actualizando el *Runbook* del equipo.

---

## 3. Negociación de Deuda Técnica con Clientes Reales

La deuda técnica comprende las concesiones de diseño, pruebas pendientes, acoplamientos o soluciones rápidas acumuladas durante la entrega inicial o la operación urgente (por ejemplo, scripts administrativos sin cobertura de pruebas, consultas de reportes sin índices compuestos ante crecimiento del catálogo hacia 20,000 productos o lógica condicional rígida en formularios). En un negocio comercial como Moto Repuestos El Centenario, negociarla con la Gerencia requiere **traducir métricas técnicas en impacto financiero y continuidad de caja**.

### 3.1. Marco de referencia, técnicas y herramientas sugeridas

| Dimensión | Marco / Técnica / Herramienta | Aplicación Concreta en Moto Repuestos El Centenario |
| :--- | :--- | :--- |
| Marco conceptual de clasificación | **Cuadrante de Deuda Técnica de Martin Fowler** y estándar **ISO/IEC 25010** (Mantenibilidad) | Distingue deuda prudente/deliberada (p. ej., postergar integración fiscal externa en v1.0) de deuda imprudente que pone en riesgo el inventario. |
| Cuantificación objetiva | **Método SQALE** (*Software Quality Assessment based on Lifecycle Expectations*) | Estima el costo de remediación en horas-desarrollador y lo contrasta con el costo de no corregir (caídas o lentitud en ventas). |
| Análisis estático y cobertura | **SonarQube** (perfil Python/JS), **Ruff**, **Mypy**, **Coverage.py** | Detecta complejidad ciclomática elevada en `services.py`, duplicación de consultas ORM y módulos con baja cobertura respecto a la meta de regresión. |
| Técnica de priorización y negociación | **WSJF** (*Weighted Shortest Job First*) / **Cost of Delay** y **Matriz Valor vs. Riesgo** | Ordena refactorizaciones comparando el riesgo de falla en hora pico frente al esfuerzo de implementación en el presupuesto de mantenimiento. |
| Herramienta de gestión y acuerdos | Tablero Kanban (**GitHub Projects / Jira / Linear**) con etiqueta `deuda-tecnica` | Hace visible al cliente la asignación fija del 15–20% de capacidad por ciclo evolutivo y las actas de aceptación de riesgo temporal. |

### 3.2. Estrategia de negociación efectiva en 4 pasos

1. **Identificar y medir:** Generar un reporte trimestral con **SonarQube** y **Coverage.py** antes de cada reunión de revisión de mantenimiento ISO/IEC 14764, clasificando ítems por módulo (`sales_services`, `inventory_services`, `catalog_queries`).
2. **Traducir a consecuencias de negocio:** Evitar tecnicismos aislados. En lugar de expresar "hay acoplamiento en las vistas", explicar: "sin optimizar la consulta de compatibilidad de modelos al superar los 15,000 repuestos, la búsqueda superará el límite de 3 segundos en mostrador y volverán a formarse colas de espera".
3. **Presentar tres alternativas accionables al cliente:**
   - *Opción A (Amortización gradual):* Reservar 20% de cada incremento evolutivo (regla del *Boy Scout*) dentro del mantenimiento ordinario sin detener nuevas funciones.
   - *Opción B (Intervención focalizada):* Invertir un sprint corto en refactorizar exclusivamente el módulo crítico de mayor impacto en ingresos (p. ej., cierre de caja o Kardex), demostrando que las siguientes mejoras reducirán su costo y tiempo de prueba.
   - *Opción C (Aceptación explícita de riesgo temporal):* Diferir deuda cosmética o de bajo riesgo en reportes administrativos secundarios documentando el acuerdo con la Gerencia.
4. **Formalizar alcance, costo y beneficios verificables:** Registrar el acuerdo como orden de servicio vinculada al Contrato de Licencia (Cláusula de Mantenimiento Evolutivo), estableciendo métricas antes/después (p. ej., tiempo P95 de búsqueda o reducción de incidentes por turno).

---

## 4. Interoperabilidad con Tecnologías Emergentes

Aunque en su versión inicial el sistema opera deliberadamente aislado en red LAN sin dependencia de Internet público (`RNF-08`), su arquitectura en cuatro capas permite proyectar integraciones futuras de alto valor comercial sin reescribir la lógica central del negocio: facturación electrónica tributaria (DGI), sincronización de catálogos de proveedores mayoristas, pasarelas de pago locales, analítica de predicción de demanda mediante inteligencia artificial (IA/ML) sobre el historial de Kardex, lectores inalámbricos IoT/RFID en bodega y notificaciones automáticas por WhatsApp/SMS.

### 4.1. Estrategias de adaptabilidad arquitectónica

- **Arquitectura Hexagonal (Puertos y Adaptadores):** El dominio central en Django (`sales_services.py`, `inventory_services.py`, `pricing_services.py`) define interfaces/contratos internos (*puertos*), mientras cada tecnología emergente se conecta mediante un *adaptador* intercambiable en la capa de Infraestructura.
- **Capa Anticorrupción (Anti-Corruption Layer — ACL):** Traduce los esquemas externos (JSON/XML de terceros) al modelo de dominio propio de Moto Repuestos El Centenario, evitando que cambios en APIs externas corrompan `Sale`, `StockMovement` o `TaxPolicy`.
- **Desacoplamiento asíncrono y tolerancia a fallos:** Toda integración externa debe ejecutarse fuera de la transacción síncrona de caja para preservar el compromiso de latencia de confirmación POS (`P95 <= 5 s`) y garantizar operación continua aun si falla el enlace de Internet (*patrón Outbox* y reintentos con *backoff* exponencial).
- **Versionado estricto de APIs y contratos:** Exponer recursos bajo rutas versionadas (`/api/v1/...`) con compatibilidad retroactiva durante las transiciones entre versiones.

### 4.2. Estándares y herramientas tecnológicas para integración

| Componente | Estándar / Herramienta | Propósito en Escenarios Futuros de MREC |
| :--- | :--- | :--- |
| Contratos API y documentación | **Django REST Framework (DRF)** + **drf-spectacular** (**OpenAPI 3.1** / Swagger) | Publica endpoints JSON estandarizados y contratos auto-documentados para apps móviles de bodega o portales B2B. |
| Formatos de intercambio | **JSON (UTF-8)** y **XML** (esquemas XSD) | JSON para microservicios IA, webhooks y clientes modernos; XML firmado digitalmente para futura facturación fiscal electrónica. |
| Seguridad entre sistemas | **TLS 1.3**, **OAuth 2.0 / JWT** (`SimpleJWT`) y firmas **HMAC-SHA256** | Autenticación delegada con tokens de corta duración para integraciones y validación criptográfica de webhooks entrantes. |
| Procesamiento asíncrono | **Celery** + **Redis** (o **Django-Q2** sobre PostgreSQL) | Despacha tareas de sincronización con proveedores, notificaciones y cálculo de pronósticos sin bloquear la caja POS. |
| Servicios IA / IoT en contenedores | **Docker / Docker Compose** + **FastAPI / scikit-learn** | Aísla un servicio auxiliar de predicción de demanda de repuestos por modelo de moto consumiendo vistas de solo lectura vía API. |
| Pruebas de contrato | **Schemathesis** / **Pact** | Verifica automáticamente en CI que las actualizaciones no rompan el esquema OpenAPI acordado con consumidores externos. |

---

## 5. Adaptabilidad ante Requerimientos Cambiantes

Las reglas comerciales, fiscales, tecnológicas y operativas de una distribuidora de repuestos evolucionan constantemente: incorporación de nuevas líneas de motocicletas, cambios en tasas impositivas o políticas de descuento, apertura de una segunda sucursal o solicitudes de operación desde dispositivos móviles en bodega. Como destaca **Ian Sommerville**, la adaptabilidad sostenible no consiste en aceptar cambios de forma improvisada, sino en **gestionar formalmente cada solicitud mediante análisis de impacto técnico, financiero y de calidad antes de aprobar su implementación**.

### 5.1. Estrategias de adaptabilidad para el ciclo de vida futuro

1. **Comité formal de Control de Cambios (CCB ligero):** Todo nuevo requerimiento post-implantación pasa por una ficha de solicitud de cambio que evalúa: (a) impacto en la matriz de trazabilidad (`ST-REQ -> SYS-FN -> SRS -> RF/RNF`), (b) impacto en esquema PostgreSQL/migraciones, (c) esfuerzo COCOMO II / horas-hombre y (d) riesgo sobre la operación de ventas.
2. **Evolución incremental y parametrización:** Continuar con ciclos cortos incrementales (coherente con la metodología seleccionada en el Cap. 05), privilegiando la configuración dinámica ya prevista en el diseño —como `TaxPolicy` y `DiscountPolicy` sin valores quemados— para absorber cambios regulatorios mediante datos y no mediante parches de código.
3. **Diseño modular SOLID y pruebas automatizadas como red de seguridad:** Mantener la regla de que ninguna funcionalidad cambiada pasa a producción sin conservar o ampliar la suite de regresión (actualmente 120 pruebas) y validar `makemigrations --check`.
4. **Priorización basada en valor y riesgo:** Emplear **MoSCoW** junto con las sesiones de revisión mensual con usuarios reales (cajeros, bodegueros, administración y gerencia) para evitar la expansión descontrolada del alcance (*scope creep*).
5. **Estrategia progresiva ante cambios de plataforma (ej. movilidad):** Si la empresa solicita acceso móvil para conteo físico en bodega, adaptar primero las vistas responsivas o exponer endpoints DRF con permisos restringidos RBAC antes de construir una aplicación nativa completa, protegiendo el presupuesto y los tiempos de respuesta.

### 5.2. Recomendaciones accionables para el equipo de ingeniería

| Recomendación | Acción Concreta del Equipo | Frecuencia / Gatillo | Criterio de Verificación |
| :--- | :--- | :--- | :--- |
| 1. Análisis de impacto obligatorio (Sommerville) | Documentar impacto en BD, módulos `commerce/`, RNF y costo antes de aprobar cambios de alcance. | Por cada solicitud de cambio | Ficha de cambio firmada por Líder Técnico y Gerencia. |
| 2. Regla de cero regresiones y migraciones limpias | Ejecutar suite completa (120+ pruebas), `check --deploy` y verificación de migraciones en PostgreSQL 18.4 de prueba. | En cada Pull Request / entrega | 100% pruebas en verde y cero migraciones huérfanas. |
| 3. Parametrización antes que código duro | Mantener tasas de impuestos (`TaxPolicy`), descuentos y garantías editables por administración autorizada con auditoría. | Continuo | Cero constantes fiscales quemadas en servicios. |
| 4. Presupuesto reservado de refactorización | Destinar 15–20% de cada ciclo evolutivo a saldar deuda técnica priorizada mediante WSJF/SQALE. | Mensual / por iteración | Tendencia decreciente o estable de deuda en SonarQube. |
| 5. Contratos OpenAPI y adaptadores aislados | Encapsular toda nueva integración externa detrás de puertos/adaptadores y colas asíncronas fuera del flujo POS. | Ante cada integración nueva | Latencia POS `P95 <= 5 s` sin degradación por red externa. |
| 6. Ensayos periódicos de respaldo y simulacros | Ejecutar `verify_backups` y prueba real de restauración (`verify_restore`) desde NAS y USB LUKS2. | Mensual (respaldo) / Trimestral (simulacro) | Cumplimiento verificado de `RPO <= 15 min` y `RTO <= 2 h`. |

---

## 6. Síntesis de Cierre

La combinación de un protocolo estructurado de respuesta ante incidentes críticos (ITIL 4 + SRE + Prometheus/Grafana/Sentry), un esquema transparente de negociación de deuda técnica (SQALE + SonarQube + WSJF), una estrategia de interoperabilidad desacoplada (Puertos y Adaptadores + OpenAPI/DRF + Celery/Redis) y una gestión formal de requerimientos cambiantes basada en Sommerville garantiza que el sistema de *Moto Repuestos El Centenario, S.A.* mantenga su fiabilidad operativa, su seguridad jurídica y su viabilidad financiera durante todo su ciclo de vida útil post-implantación.
