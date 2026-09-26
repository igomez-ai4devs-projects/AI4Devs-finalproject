b> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o los de corrección o adición de funcionalidades que consideres más relevantes. Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras

## Índice

0. [Preparación skills](#0-preparación-skills)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Preparación skills

**Prompt 1 (meta-prompt):**

Agent: Chat GPT‑5.5 de OpenAI

### Request:

Quiero que me crees un prompt para Claude en donde le diga que: es un experto en el negocio relacionado con el producto 'Service Desk', al que le iré haciendo preguntas sobre dicho negocio.

### Response:

Actúa como un experto senior en el negocio de Service Desk y en la gestión de servicios de TI (ITSM). Posees un conocimiento profundo de procesos, operaciones, roles, métricas, modelos organizativos, herramientas, mejores prácticas y marcos de referencia utilizados en entornos empresariales.

Tu objetivo es responder a mis preguntas desde una perspectiva de negocio, funcional y operativa, explicando cómo funciona un Service Desk dentro de una organización y cómo aporta valor a usuarios, clientes y áreas de tecnología.

Cuando respondas:

Prioriza la visión de negocio y funcional antes que los detalles técnicos. Explica conceptos de forma clara, estructurada y práctica. Utiliza ejemplos reales o escenarios empresariales cuando sea útil. Diferencia claramente entre procesos, roles, responsabilidades, herramientas y métricas. Si existen varias formas de abordar un tema, describe las alternativas y sus ventajas e inconvenientes. Relaciona tus respuestas con buenas prácticas de ITSM y Service Desk cuando corresponda. Si una pregunta es ambigua, solicita aclaraciones antes de responder. No inventes información; cuando una respuesta dependa del contexto de la organización, indícalo explícitamente.

Asume que estoy analizando, diseñando o mejorando un producto Service Desk, por lo que necesito comprender en profundidad los procesos de negocio, las necesidades de los usuarios, los flujos operativos, los indicadores clave (KPIs), los acuerdos de nivel de servicio (SLAs), la gestión de incidencias, solicitudes, problemas, cambios, conocimiento y cualquier otro proceso relacionado.

A partir de este momento responderás como consultor experto en negocio Service Desk. Espera mis preguntas y responde con el nivel de detalle necesario para comprender el dominio funcional y operativo del producto.

</br>

**Prompt 2:**

Agent: Chat GPT‑5.5 de OpenAI

### Request:

¿Me puedes generar un skill para Claude y que pueda guardarlo y llamarlo desde la consola de VS Code? Debe generarse en un inglés técnico con términos adecuados al negocio de Service Desk.

### Response:

Generado documento SKILL.md que se ha guardado en la ruta: '.claude/skills/service-desk-expert'

Esta versión está escrita con terminología que encontrarás en productos como ServiceNow, Jira Service Management, BMC Helix ITSM o ManageEngine ServiceDesk Plus, y está orientada a que Claude responda como un Product Architect/Business Consultant especializado en Service Desk empresarial.

</br>

**Prompt 3:**

Agent: Claude Code - Sonnet 4.6

### Request:

@.claude/skills/service-desk-expert/ guarda en tu skill que tienes que escribir todo en inglés técnico del sector de Service Desk.

¿cambiarías algo del skill @.claude/skills/service-desk-expert/ si dicho service-desk fuese expresamente para una aplicación que gestiona competiciones de tipo torneo, liga o grupos? Tienes la información exacta del objetivo de la aplicación en el readme.md (sección '0.3. Descripción breve del proyecto')

### Response:

Claude ha mejorad el skill @.claude/skills/service-desk-expert/, varios apartados en los que concreta su Alcance y Contexto concreto dentro de la aplicación de Gestión de Ligas y Torneos.

---

## 1. Descripción general del producto

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

@.claude/skills/service-desk-expert/ Necesito que rellenes para un producto Service Desk y, en el documento 'readme.md' que se encuentra en la raíz del proyecto, los siguientes campos:

- 1. Descripción general del producto/1.1. Objetivo
- 1. Descripción general del producto/1.2. Características y funcionalidades principales

### Response:

Añadido en el readme.md: '1.1. Objetivo' y '1.2. Características y funcionalidades principales'.

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-product-owner** para redactar las secciónes "1. Product" (Qué es el producto en 3 líneas - Sport ITSM: plataforma ITSM que soporta el SCMS) y "4. Specifications & OpenSpec Workflow (Puntero a que las specs viven en openspec/ y a cómo trabajar con changes)" el CLAUDE.md (raíz del repo). Va a contener:

Usa el agente **sport-itsm-architect** para redactar las sección "2. Technology Stack" y "3. Code Conventions, Folder Structure, Commands & Style Rules (Convenciones de código, estructura de carpetas, comandos (build/test/lint), reglas de estilo, qué NO hacer.)" dentro de CLAUDE.md. Distingue entre Backend y Frontend.

Sin requisitos funcionales aquí: es contexto operativo para el agente. (OpenSpec también usa AGENTS.md; puedes mantener CLAUDE.md como el archivo de Claude Code y que apunte a openspec/.)

### Response:

Añadido el CLAUDE.md.

</br>

**Prompt 3:**

Agent: Claude Code - Sonnet 4.6

### Request:

Quiero que creees un PRD con ayuda del agente sport-itsm-product-owner

### Response:

Añadido PRD.

</br>

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Añade al agente "sport-itsm-architect" el skill feature-docs

### Response:

El skill feature-docs ha sido añadido al agente "sport-itsm-architect"

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-architect** para generar el "Diagrama de arquitectura" de la aplicación, ayudándote del PRD si es necesario. Empieza desde lo más general hacia lo más concreto, distinguiendo entre backend y frontend cuando lo creas necesario.

### Response:

Se ha creado el documento docs/ARCHITECTURE.md

</br>

**Prompt 3:**

Agent: Claude Code - Sonnet 4.6

### Request:

Rellena el apartado "2.1. Diagrama de arquitectura" del readme.md y revisa que se hayan cumplido todos los requisitos.

### Response:

Apartado "2.1. Diagrama de arquitectura" del readme.md rellenado.

</br>

### **2.2. Descripción de componentes principales:**

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-architect** para generar la "Descripción de componentes principales" de la aplicación, ayudándote del documento PRD.md y el ARCHITECTURE.md si es necesario. Describe los componentes más importantes, incluyendo la tecnología utilizada. Llamalo COMPONENTS.md y, añade la información también en la sección 2.2 del readme.md.

### Response:

Creado documento COMPONENTS.md y rellenado apartado "2.2. Descripción de componentes principales" del readme.md.

</br>

**Prompt 2:**

**Prompt 3:**

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-architect** para generar la "Descripción de alto nivel del proyecto y estructura de ficheros" de la aplicación. Representa la estructura del proyecto y explica brevemente el propósito de las carpetas principales, así como si obedece a algún patrón o arquitectura específica. El documento que generes añadelo dentro de la carpeta docs y rellena la sección 2.3 del readme.md.

### Response:

Creado documento PROJECT-STRUCTURE.md y rellenado apartado "2.3. Descripción de alto nivel del proyecto y estructura de ficheros" del readme.md.

</br>

**Prompt 2:**

**Prompt 3:**

### **2.4. Infraestructura y despliegue**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

### **2.5. Seguridad**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

### **2.6. Tests**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 3. Modelo de Datos

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-architect** para generar la "3.1. Diagrama del modelo de datos" de la aplicación. En la carpeta docs genera un documento único para todo el Modelo de Datos, y rellena la sección 3.1 del readme.md.

### Response:

Creado documento DATA-MODEL.md y rellenado apartado "3.1. Diagrama del modelo de datos" del readme.md.

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Usa el agente **sport-itsm-architect** para generar la "3.2. Descripción de entidades principales" de la aplicación. Recuerda incluir el máximo detalle de cada entidad, como el nombre y tipo de cada atributo, descripción breve si procede, claves primarias y foráneas, relaciones y tipo de relación, restricciones (unique, not null…), etc. Añade todo al fichero creado anteriormente DATA-MODEL.md, y rellena la sección 3.2 del readme.md.

### Response:

Añdadido a DATA-MODEL.md este nuevo apartado y rellenado "3.2. Descripción de entidades principales" del readme.md.

</br>

**Prompt 3:**

---

### 4. Especificación de la API

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 5. Historias de Usuario

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Utiliza el agente sport-itsm-product-owner. Carga el skill epic-mapper y ejecútalo entero para producir el epic map de Sport IT Service Management.

Devuelve el contenido completo de epic-map.md en inglés, siguiendo el formato de salida del skill.

### Response:

Añdadido epic-map.md

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como Business Analyst para UNA sola épica: C10 — Identity & Access Management. Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject El producto es Sport ITSM.

Carga el skill `business-analyst` (Skill, skill="business-analyst") y ejecútalo entero para la clave de épica C10. Entregable: escribe `docs/backlog/C10/user-stories.md` siguiendo exactamente la plantilla de salida del skill.

IMPORTANTE: el documento resultante se escribe EN INGLÉS, con terminología estándar de Service Desk / ITSM. Este prompt está en español, el entregable no: las historias y los criterios de aceptación Given/When/Then alimentan los ficheros `.feature` y el estándar de lenguaje del proyecto obliga a inglés técnico.

#### Arranque — lee en este orden, con estas correcciones de ruta

1. `docs/backlog/epic-map.md`, apartado "### `C10` · Identity & Access Management". Ese documento es el dueño de la clave, de la lista de requisitos y de los estados de construcción. NO los vuelvas a derivar.
2. `docs/product/PRD.md` §7.10 únicamente (el nombre del fichero va en mayúsculas), más §4 para las personas. No leas el PRD entero.
3. El paso 3 del skill ("leer el código") ES UNA OPERACIÓN VACÍA — mira más abajo.
4. Lee `CLAUDE.md` §3 y `docs/product/ARCHITECTURE.md` §5 para conocer los límites entre capas, de modo que los criterios de aceptación sean expresables en esta arquitectura.

#### Greenfield — esto cambia la forma de todas las historias

Sport ITSM no tiene NADA de código: no hay `package.json`, ni `apps/`, ni `libs/`. Los 7 requisitos están en estado 🔴 Not built.

- Por tanto TODAS las historias son de forma **greenfield**. En esta épica no hay historias de tipo gap ni de tipo defect. La guía del skill sobre historias de gap ("nombra lo que ya funciona") no aplica y no debe simularse.
- `ReadTheCode()` es una operación vacía: ningún requisito está en 🟡 / ⚫ / 🔍, así que no hay nada que inspeccionar. No busques código, no informes de discrepancias entre el epic map y el código, y no incluyas la línea "Today:" en ninguna historia — ese campo es exclusivo de las historias de gap y de defect.
- Ningún requisito está 🟢 Built, así que no se descarta ninguno: los 7 generan historias.

#### Personas — el PRD no tiene identificadores `PER-`

Los apartados §4.1 y §4.2 nombran las personas en tablas, sin IDs. Traza cada historia a su persona usando su nombre exacto del PRD (por ejemplo "Service Desk Agent (L1)", "System Administrator", "Tournament Organizer / Admin"). NO inventes `PER-1`, `PER-2`…: inventar IDs del PRD está prohibido por las propias restricciones del skill. Deja constancia de esa ausencia una sola vez, en el apartado de Findings.

#### Alcance de esta épica — léelo con atención

Los 7 requisitos son FR-IAM-01 … FR-IAM-07. El "login" es solo una porción de la épica (FR-IAM-01 autenticación, FR-IAM-06 caducidad de sesión y reautenticación step-up); cubre LOS SIETE, no solo el inicio de sesión: FR-IAM-01 M autenticar a todo usuario antes de cualquier función — sin superficie anónima FR-IAM-02 M RBAC alineado con las personas, mínimo privilegio FR-IAM-03 M visibilidad de registros acotada al requester + concesiones acotadas por competición para Tournament Organizer / Admin y League Administrator FR-IAM-04 S IdentityProviderPort como capa anticorrupción para el SSO de SCMS FR-IAM-05 M asignación y revocación de roles auditada FR-IAM-06 S cierre de sesión por inactividad + reautenticación step-up FR-IAM-07 C registro de autorizaciones denegadas en operaciones privilegiadas

El epic map imputa a C10 toda la cimentación del workspace (arranque de Nx, las 4 aplicaciones, `libs/shared/{contracts,domain,ui,util}`, el esquema base de PostgreSQL y la cadena de migraciones). Eso es **trabajo técnico habilitador, no historias de usuario**: no escribas historias de usuario para el andamiaje. Recógelo en Findings como trabajo que esta épica arrastra y que corresponde a tickets, no a historias.

#### Restricciones

- IDs de historia `US-C10-01`, `US-C10-02`, … con dos dígitos, y solo con este prefijo.
- No renumeres ni inventes IDs `FR-` / `NFR-`.
- Cada historia traza a ≥1 requisito FR-, a un nombre de persona y a la épica C10.
- Criterios de aceptación en Given/When/Then, en inglés, lo bastante concretos como para poder estimarse con granularidad ≤3 h sin tener que releer nada.
- No escribas historias de ninguna otra épica. En particular, los FR-AUD-\* pertenecen a C18, aunque FR-IAM-05 dependa de ellos (hallazgo F5 del epic map: C10 y C18 son mutuamente dependientes y se entregan juntas en la fase 0). Declara la dependencia; no escribas historias de C18.
- No escribas tickets, estimaciones ni planes de prueba: en este repositorio no existe `architect-tech-lead`, así que párate en las historias.
- Escribe únicamente `docs/backlog/C10/user-stories.md`. No modifiques ningún otro fichero.

#### Traslada estos hallazgos del epic map a tu apartado de Findings

- F5: FR-IAM-05 ("fully audited") necesita C18, mientras que FR-AUD-02 (identidad del actor) necesita C10. Se entregan juntas como un único incremento de fase 0.
- F9: FR-IAM-04, FR-IAM-06 y FR-IAM-07 no están asignados a ninguna fase en el §14 del PRD, pese a que FR-IAM-06 es un control de seguridad.

Informa al terminar: número de historias por forma, requisitos cubiertos y cualquier hallazgo nuevo.

### Response:

Añdadido docs/backlog/C10/user-stories.md

</br>

**Prompt 3:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como Business Analyst para UNA sola épica: C18 — Audit Trail & Activity History. Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject El producto es Sport ITSM.

Carga el skill `business-analyst` (Skill, skill="business-analyst") y ejecútalo entero para la clave de épica C18. Entregable: escribe `docs/backlog/C18/user-stories.md` siguiendo exactamente la plantilla de salida del skill.

IMPORTANTE: el documento resultante se escribe EN INGLÉS, con terminología estándar de Service Desk / ITSM. Este prompt está en español, el entregable no: las historias y los criterios de aceptación Given/When/Then alimentan los ficheros `.feature` y el estándar de lenguaje del proyecto obliga a inglés técnico.

#### Arranque — lee en este orden, con estas correcciones de ruta

1. `docs/backlog/epic-map.md`, apartado "### `C18` · Audit Trail & Activity History". Ese documento es el dueño de la clave, de la lista de requisitos y de los estados de construcción. NO los vuelvas a derivar.
2. `docs/product/PRD.md` §7.17 únicamente (el nombre del fichero va en mayúsculas), más §4 para las personas. No leas el PRD entero.
3. El paso 3 del skill ("leer el código") ES UNA OPERACIÓN VACÍA — mira más abajo.
4. Lee `CLAUDE.md` §3 y `docs/product/ARCHITECTURE.md` §4.3 y §5, además de **ADR-008**, que es el que decide cómo se hace cierta la inmutabilidad de esta épica.

#### Greenfield — esto cambia la forma de todas las historias

Sport ITSM no tiene NADA de código: no hay `package.json`, ni `apps/`, ni `libs/`. Los 6 requisitos están en estado 🔴 Not built.

- Por tanto TODAS las historias son de forma **greenfield**. No hay historias de gap ni de defect. La guía del skill sobre historias de gap no aplica y no debe simularse.
- `ReadTheCode()` es una operación vacía: nada está en 🟡 / ⚫ / 🔍. No busques código, no informes de discrepancias entre el epic map y el código, y no incluyas la línea "Today:" en ninguna historia.
- Nada está 🟢 Built, así que los 6 requisitos generan historias.

#### Personas — el PRD no tiene identificadores `PER-`

Los apartados §4.1 y §4.2 nombran las personas en tablas, sin IDs. Traza cada historia a su persona usando su nombre exacto del PRD (por ejemplo "System Administrator", "Service Owner / Service Manager", "Service Desk Agent (L1)", "Player / Competitor"). NO inventes `PER-1`, `PER-2`…: inventar IDs del PRD está prohibido por las propias restricciones del skill.

#### LÍMITE DE ALCANCE CRÍTICO — no confundas FR-AUD-_ con NFR-AUD-_

Tu alcance son ÚNICAMENTE los 6 requisitos funcionales FR-AUD-01 … FR-AUD-06 del §7.17. El PRD tiene además un apartado §8.4 "Auditability & compliance" con requisitos NFR-AUD-01 … NFR-AUD-04, de nombre casi idéntico: esos pertenecen a la épica `NFR`, NO a C18, y no debes escribir ninguna historia para ellos. Si un NFR-AUD-_ restringe una de tus historias, cítalo como restricción en los criterios de aceptación, pero la trazabilidad de la historia va contra el FR-AUD-_ correspondiente.

Los 6 requisitos de tu alcance: FR-AUD-01 M cobertura del registro de auditoría FR-AUD-02 M `AuditEntry` append-only con actor, marca de tiempo, referencia del registro, acción, valor anterior y valor nuevo FR-AUD-03 M inmutable para todos los roles, incluido el System Administrator FR-AUD-04 M vista de activity history con separación entre lo visible por el requester y lo interno FR-AUD-05 M cobertura de los cambios de configuración administrativa FR-AUD-06 S suelo de retención configurable

#### Dos restricciones estructurales que deben moldear los criterios de aceptación

- **FR-AUD-03 se cumple por construcción, no por permisos.** Según `ARCHITECTURE.md` §4.3 y ADR-008, los contextos publican eventos de dominio y `audit` se suscribe después del commit: ningún contexto recibe jamás un manejador con el que mutar la auditoría. Los criterios de aceptación deben hacer falsable esa inmutabilidad, incluido el caso negativo explícito de que un System Administrator no puede modificar ni borrar una entrada, y que no existe ruta de escritura desde ningún otro contexto.
- **Esta épica no tiene librerías `feature` ni `data-access`.** Crea 4 librerías en el contexto `audit` (`domain`, `application`, `infrastructure`, `ui`): el activity history de FR-AUD-04 no es una pantalla propia, se renderiza **dentro de las vistas de otros contextos** mediante un componente `type:ui`. Escribe esa historia como componente reutilizable consumido por terceros, no como sección independiente de la aplicación.

#### Restricciones

- IDs de historia `US-C18-01`, `US-C18-02`, … con dos dígitos, y solo con este prefijo.
- No renumeres ni inventes IDs `FR-` / `NFR-`.
- Cada historia traza a ≥1 requisito FR-AUD-, a un nombre de persona y a la épica C18.
- Criterios de aceptación en Given/When/Then, en inglés, lo bastante concretos como para poder estimarse con granularidad ≤3 h.
- No escribas historias de ninguna otra épica. El coste de que cada contexto emita sus propios eventos de dominio pertenece a esas épicas, no a esta: C18 entrega el consumidor, no los emisores. Declara esa frontera explícitamente en el documento.
- No escribas tickets, estimaciones ni planes de prueba: en este repositorio no existe `architect-tech-lead`, así que párate en las historias.
- Escribe únicamente `docs/backlog/C18/user-stories.md`. No modifiques ningún otro fichero.

#### Traslada estos hallazgos del epic map a tu apartado de Findings

- F5: C10 y C18 son mutuamente dependientes — FR-IAM-05 exige que la asignación de roles quede auditada, y FR-AUD-02 exige la identidad del actor. Se **co-entregan** como un único incremento de fase 0; C18 no es sucesora de C10, es un carril paralelo. Indica qué historias de C18 pueden empezar sin que C10 esté terminada (las que solo necesitan el agregado append-only) y cuáles no (las que necesitan actor).
- F6: esta épica NO es atómica por fases. El §14.2 del PRD sitúa FR-AUD-01→04 en la fase 0 y el §14.3 sitúa FR-AUD-05 en la fase 1. Marca esa frontera en las historias; no la resuelvas tú.
- F9: FR-AUD-06 (retención) no está asignado a ninguna fase en el §14.

Informa al terminar: número de historias por forma, requisitos cubiertos y cualquier hallazgo nuevo.

### Response:

Añdadido docs/backlog/C18/user-stories.md

</br>

**Prompt 4:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como Business Analyst para UNA sola épica: C1 — Incident Management. Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject El producto es Sport ITSM.

Carga el skill `business-analyst` (Skill, skill="business-analyst") y ejecútalo entero para la clave de épica C1. Entregable: escribe `docs/backlog/C1/user-stories.md` siguiendo exactamente la plantilla de salida del skill.

IMPORTANTE: el documento resultante se escribe EN INGLÉS, con terminología estándar de Service Desk / ITSM. Este prompt está en español, el entregable no: las historias y los criterios de aceptación Given/When/Then alimentan los ficheros `.feature` y el estándar de lenguaje del proyecto obliga a inglés técnico.

#### Arranque — lee en este orden, con estas correcciones de ruta

1. `docs/backlog/epic-map.md`, apartado "### `C1` · Incident Management". Ese documento es el dueño de la clave, de la lista de requisitos y de los estados de construcción. NO los vuelvas a derivar.
2. `docs/product/PRD.md` §7.1 únicamente (el nombre del fichero va en mayúsculas), más §4 para las personas. No leas el PRD entero.
3. El paso 3 del skill ("leer el código") ES UNA OPERACIÓN VACÍA — mira más abajo.
4. Lee `CLAUDE.md` §3 y `docs/product/ARCHITECTURE.md` §5 para conocer los límites entre capas.

#### Greenfield — esto cambia la forma de todas las historias

Sport ITSM no tiene NADA de código: no hay `package.json`, ni `apps/`, ni `libs/`. Los 18 requisitos están en estado 🔴 Not built.

- Por tanto TODAS las historias son de forma **greenfield**. No hay historias de gap ni de defect. La guía del skill sobre historias de gap no aplica y no debe simularse.
- `ReadTheCode()` es una operación vacía: nada está en 🟡 / ⚫ / 🔍. No busques código, no informes de discrepancias entre el epic map y el código, y no incluyas la línea "Today:" en ninguna historia.
- Nada está 🟢 Built, así que los 18 requisitos generan historias.

#### Personas — el PRD no tiene identificadores `PER-`

Los apartados §4.1 y §4.2 nombran las personas en tablas, sin IDs. Traza cada historia a su persona usando su nombre exacto del PRD (por ejemplo "Player / Competitor", "Service Desk Agent (L1)", "Application Support Analyst (L2/L3)", "Referee / Match Official"). NO inventes `PER-1`, `PER-2`…: inventar IDs del PRD está prohibido por las propias restricciones del skill.

#### LÍMITE DE ALCANCE CRÍTICO — el §7.1 contiene una segunda épica

El §7.1 del PRD tiene un subapartado anidado `#### 7.1.1 C13 — Major Incident Management`, cuyos requisitos `FR-MIM-*` son una épica DISTINTA (C13), con su propia clave y su propio drill futuro. Tu alcance son ÚNICAMENTE FR-INC-01 … FR-INC-18. No escribas ninguna historia para un requisito FR-MIM-\*, aunque cuelgue del mismo encabezado §7.1.

También quedan fuera de alcance, pese a que FR-INC-10 los referencia (enlaces): los Configuration Items pertenecen a C6 y los Problems a C3, ambas de fase 2. Escribe la historia de enlazado solo desde el lado del Incident y deja constancia del aplazamiento.

#### Da a estos dos requisitos la precisión que merecen

- **FR-INC-05** es el comportamiento distintivo del producto y el requisito que peor se suele leer del PRD. El flag de "competición en curso" lo activa, lo cambia y lo limpia ÚNICAMENTE una acción explícita del agente — nunca de forma automática, nunca el requester —, exige una justificación obligatoria, eleva el Impact evaluado en una cantidad configurable, vuelve a derivar la Priority a través de la matriz Impact × Urgency, y todo cambio queda auditado. Sus criterios de aceptación deben hacer falsables esos cinco puntos, incluidos los casos negativos (intento del requester rechazado; ningún disparo automático desde un calendario o cualquier fuente de eventos).
- **FR-INC-04** deriva la Priority de una matriz Impact × Urgency configurable, y el override por parte del agente solo se permite con una justificación obligatoria registrada en el audit trail. El frontend no deriva nada (NFR-SEC-02): la Priority es una decisión del servidor.

#### Restricciones

- IDs de historia `US-C1-01`, `US-C1-02`, … con dos dígitos, y solo con este prefijo.
- No renumeres ni inventes IDs `FR-` / `NFR-`.
- Cada historia traza a ≥1 requisito FR-, a un nombre de persona y a la épica C1.
- Criterios de aceptación en Given/When/Then, en inglés, lo bastante concretos como para poder estimarse con granularidad ≤3 h.
- No escribas tickets, estimaciones ni planes de prueba: en este repositorio no existe `architect-tech-lead`, así que párate en las historias.
- Escribe únicamente `docs/backlog/C1/user-stories.md`. No modifiques ningún otro fichero.

#### Traslada estos hallazgos del epic map a tu apartado de Findings

- F6: esta épica NO es atómica por fases. El §14.2 del PRD sitúa FR-INC-01/02/03 (registro base del ticket, numeración de referencia, taxonomía de categorización) en la fase 0, mientras que el §14.3 lista FR-INC-01→13 y 18 en el MVP de la fase 1: ambas listas se solapan sin declarar dónde está la frontera. Marca qué historias caen en esa porción en disputa; no resuelvas tú el corte.
- F9: FR-INC-15 y FR-INC-16 no están asignados a ninguna fase en el §14, pese a que FR-INC-15 (aplicación de la regla de alcance en el intake) es la mitigación declarada del riesgo R1, la fuga de alcance hacia la operación deportiva.

Informa al terminar: número de historias por forma, requisitos cubiertos y cualquier hallazgo nuevo.

### Response:

Añdadido docs/backlog/C1/user-stories.md

</br>

---

### 6. Tickets de Trabajo

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como Architect / Tech Lead para UNA sola épica: C10 — Identity & Access Management. Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject El producto es Sport ITSM.

Carga el skill architect-tech-lead (Skill, skill="architect-tech-lead") y ejecútalo entero en DRILL MODE para la clave de épica C10.

Entregables:

- docs/backlog/C10/tickets/T-C10-nn.md — un fichero por ticket
- docs/backlog/C10/tickets/README.md — índice de tickets en orden de implementación
- docs/backlog/C10/test-plan.md — el test plan de la épica

IMPORTANTE: todo se escribe EN INGLÉS, con terminología estándar de Service Desk / ITSM. Este prompt está en español, los entregables no: los criterios Given/When/Then alimentan los ficheros .feature y el estándar de lenguaje del proyecto obliga a inglés técnico.

#### Arranque — lee en este orden

1. docs/backlog/C10/user-stories.md — las 16 historias US-C10-01 … US-C10-16. Ese documento es el dueño de los IDs de historia y de su trazabilidad a FR-IAM-\*. NO lo edites, NO renumeres una US-, NO inventes historias nuevas. Lee también su apartado de Findings: condiciona tres de las historias.
2. docs/backlog/epic-map.md — el apartado "### C10 · Identity & Access Management" Y el apartado "## Foundation ownership (priced once)". El segundo es el origen que deben citar tus tickets de cimentación.
3. CLAUDE.md §3 y docs/product/ARCHITECTURE.md §5 (estructura Nx, esquema de tags de tres ejes, matriz de constraints de boundaries) y §9 (colocación de auth, autorización, eventos de dominio, ClockPort). De ahí sale el campo `layer:` de cada ticket.
4. El paso de "leer el código" ES UNA OPERACIÓN VACÍA: no hay package.json, ni apps/, ni libs/, ni un solo test. No busques código y no informes de discrepancias con él.

#### Greenfield — afecta a la forma de TODOS los tickets

Las 16 historias son greenfield y ninguna lleva línea "Today:". Ningún ticket es de gap ni de defect: ninguno debe declarar "lo que ya funciona", porque no funciona nada. Todos llevan `shape: greenfield`.

#### Cimentación

Esta épica arrastra toda la cimentación del workspace, imputada a C10 y solo a C10 ("priced once" en el epic map): arranque de Nx con pnpm, ESLint 9 flat config con @nx/enforce-module-boundaries, Prettier, el esquema de tags de tres ejes, las 4 aplicaciones (api, api-e2e, web, web-e2e), libs/shared/{contracts,domain,ui,util} incluido el design system in-house, y el esquema base de PostgreSQL con su cadena de migraciones TypeORM.

El Business Analyst hizo bien en NO escribir historias para eso (hallazgo F14: no hay persona ni comportamiento observable). Emítelo como tickets de cimentación según la regla de la skill: `story: —`, `foundation: true`, y el origen citado en `## Context` — el apartado "Foundation ownership (priced once)" del epic map y el hallazgo F14 de user-stories.md.

Sus `## Acceptance criteria` son verificaciones mecánicas, no escenarios de usuario: el comando que debe pasar (`pnpm nx lint`, `pnpm nx graph` sin dependencias ilegales, la migración base corre y revierte), el tag que debe estar puesto, el boundary que debe romper la build si se viola.

#### Orden — es parte del entregable

Los tickets van numerados EN ORDEN DE IMPLEMENTACIÓN: T-C10-01 es lo primero que se construye. El orden lo manda la dependencia técnica real, no el número de la historia. Esqueleto de bloques; refínalo si la dependencia lo exige y explica por qué:

1. Cimentación: Nx + pnpm + lint/boundaries/tags → las 4 apps → libs/shared/{domain,contracts,util} → libs/shared/ui (design system) → PostgreSQL + migración base y cadena de migraciones.
2. Núcleo de identidad: librerías del contexto identity-access (domain, application, infrastructure, feature, data-access — NO lleva `ui` propio), IdentityProviderPort + adapter local (US-09), autenticación (US-01), guard global sin superficie anónima (US-02), sign-out (US-03).
3. RBAC: catálogo de roles de §4.3 del PRD (US-04), enforcement de mínimo privilegio en los casos de uso (US-05).
4. Visibilidad de registros: requester-scoped (US-06), competición para Organizer (US-07), liga para League Administrator (US-08).
5. Administración de roles: asignar (US-11), revocar con efecto inmediato (US-12), emitir eventos auditables (US-13).
6. Sesión: caducidad por inactividad (US-14), reautenticación step-up (US-15).
7. Registro de autorizaciones denegadas (US-16).
8. SSO de SCMS detrás del ACL (US-10).

El README.md del directorio lista los tickets en ese orden, agrupados por bloque, una línea por ticket (id, título, capa, agente, estimación) y el total de horas por bloque y de la épica.

#### Restricciones

- IDs T-C10-01, T-C10-02, … con dos dígitos y solo con este prefijo.
- No renumeres ni inventes IDs US- / FR- / NFR-.
- Máximo 3h por ticket. Si superas el cap, escribe la razón en `## Context`.
- El campo `agent:` solo admite `backend-engineer` o `frontend-engineer`, los únicos que existen en .claude/agents/. NO existen ci-cd-expert ni testing-implementer: para el tooling del workspace, Docker y despliegues, y para el código de test E2E / API-E2E, nombra la capa y la plataforma en las que cae el trabajo, no un agente inexistente.
- No escribas tickets de ninguna otra épica. En particular NO escribas tickets de C18: el hallazgo F5 dice que C10 y C18 se co-entregan en fase 0, pero US-C10-13 llega hasta publicar el evento de dominio; persistirlo y renderizarlo como AuditEntry es de C18. Declara la dependencia en el ticket, no la implementes.
- No escribas código, ni tests, ni migraciones: te paras en los tickets y el test plan.
- Escribe únicamente bajo docs/backlog/C10/. No modifiques user-stories.md ni epic-map.md.

#### Preguntas abiertas que NO debes resolver tú

Dos decisiones siguen pendientes de Product Owner o de arquitectura. No las inventes: entrega la parte no bloqueada y marca el resto como bloqueante.

- F16 — nadie ha enumerado qué operaciones son "privilegiadas". US-C10-15 propone un conjunto (asignación y revocación de roles, más la configuración de catálogo, taxonomía, políticas de SLA, workflows y plantillas de notificación) como ASUNCIÓN pendiente de confirmar. Afecta a US-C10-15 y a US-C10-16.
- F17 — no está decidido dónde se registra una autorización denegada: una entrada de auditoría de C18 no encaja (no tiene valor anterior ni valor nuevo ni referencia natural de registro), y la alternativa es un log de seguridad propio. Afecta a US-C10-16.

Marca esos tickets con `blocked_by: F16` / `blocked_by: F17` en el frontmatter y explica en `## Context` qué decisión falta y quién debe tomarla.

#### Fases

Las historias de C10 no llevan campo Phase. La fase sale del PRD §14 y del epic map: FR-IAM-01, 02, 03 y 05 son fase 0; FR-IAM-04, 06 y 07 no están asignados a ninguna fase (hallazgo F9), pese a que FR-IAM-06 es un control de seguridad. Refleja la fase en cada ticket con un campo `phase:` de valor `0` o `unphased (F9)`. No decidas tú la fase de los que no la tienen.

#### Informa al terminar

Número de tickets, desglose por bloque, horas totales y por bloque, cuántos son de cimentación sin historia, qué historias han quedado bloqueadas por F16/F17, y cualquier historia demasiado vaga para estimar — di cuál y por qué, sin reescribirla.

### Response:

Añdadido tickets en la carpeta docs/backlog/C10/tickets/

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como Architect / Tech Lead para UNA sola épica: C1 — Incident Management. Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject El producto es Sport ITSM.

Carga el skill architect-tech-lead (Skill, skill="architect-tech-lead") y ejecútalo entero en DRILL MODE para la clave de épica C1.

Entregables:

- docs/backlog/C1/tickets/T-C1-nn.md — un fichero por ticket
- docs/backlog/C1/tickets/README.md — índice de tickets en orden de implementación
- docs/backlog/C1/test-plan.md — el test plan de la épica

IMPORTANTE: todo se escribe EN INGLÉS, con terminología estándar de Service Desk / ITSM. Este prompt está en español, los entregables no: los criterios Given/When/Then alimentan los ficheros .feature y el estándar de lenguaje del proyecto obliga a inglés técnico.

#### Arranque — lee en este orden

1. docs/backlog/C1/user-stories.md — las 32 historias US-C1-01 … US-C1-32. Ese documento es el dueño de los IDs de historia, de su trazabilidad a FR-INC-\*, de su fase y de sus fronteras de alcance. NO lo edites, NO renumeres una US-, NO inventes historias. Lee entero su apartado "Scope boundary", su tabla "Phase boundary" y sus 10 Findings: condicionan un tercio de los tickets.
2. docs/backlog/epic-map.md — el apartado "### C1 · Incident Management" (dependencias declaradas e inferidas) Y el apartado "## Foundation ownership (priced once)", que te dice lo que esta épica NO paga.
3. docs/backlog/C10/tickets/ — los 67 tickets ya emitidos de C10. NO los repitas: son el precedente de formato y la prueba de qué cimentación ya está pagada.
4. CLAUDE.md §3 y docs/product/ARCHITECTURE.md §5 (estructura Nx, tags de tres ejes, matriz de boundaries), §8 (reglas de aislamiento entre contextos) y §9 (autorización, eventos de dominio, ClockPort). De ahí sale el campo `layer:` de cada ticket.
5. El paso de "leer el código" ES UNA OPERACIÓN VACÍA: no hay package.json, ni apps/, ni libs/, ni un solo test. No busques código y no informes de discrepancias con él.

#### Greenfield

Las 32 historias son greenfield y ninguna lleva línea "Today:". Ningún ticket es de gap ni de defect: ninguno declara "lo que ya funciona". Todos llevan `shape: greenfield`.

#### Cimentación — lee esto con cuidado, C1 no es C10

La cimentación del WORKSPACE está imputada a C10 y solo a C10 ("priced once"): Nx, pnpm, lint/boundaries/tags, las 4 aplicaciones, libs/shared/{contracts,domain,ui,util}, el design system y el esquema base de PostgreSQL con su cadena de migraciones. **NO emitas ni un solo ticket para nada de eso.** Volver a pagarlo es exactamente lo que la regla "priced once" existe para impedir, y sus tickets ya están escritos en docs/backlog/C10/tickets/.

Lo que SÍ es cimentación de C1: levantar las **seis librerías del contexto `incident`** (domain, application, infrastructure, feature, ui, data-access) con sus tres tags correctos, vía generadores Nx. Ninguna historia lo respalda y el Business Analyst hizo bien en no escribirla. Emítelo como tickets de cimentación según la regla de la skill: `story: —`, `foundation: true`, y el origen citado en `## Context` — ARCHITECTURE.md §5.1 (que lista las seis librerías del contexto) y el párrafo "What actually remains" de C1 en el epic map.

Sus `## Acceptance criteria` son verificaciones mecánicas, no escenarios de usuario: la librería existe con los tres tags, `pnpm nx lint` pasa, y `pnpm nx graph` no muestra ninguna dependencia que la matriz de §5.3 prohíba.

#### Fronteras de contexto — el error más caro de esta épica

C1 depende de nueve épicas y casi ninguna existe. Para cada costura, entrega SOLO el lado del Incident, declara la dependencia en `## Context` y NO implementes la mitad ajena:

- US-C1-17 — `incident` NUNCA importa `sla`. Publica señales de pausa/reanudación; el SlaPolicyAdapter en apps/api es el único objeto que conoce ambos (ARCHITECTURE.md §8). El cálculo del reloj es de C7.
- US-C1-15 — el modelo de estados se realiza con el primitivo `StateModel` de libs/shared/domain (creado por C10, configurado por C12). No construyas un motor de workflow.
- US-C1-20 — enlazar al Major Incident padre es lado Incident; declarar, coordinar y cerrar el Major Incident es C13. No escribas tickets de FR-MIM-\*.
- US-C1-21 — Problem (C3), Change (C4), Release (C5) y CI (C6) son fase 2 y no existen. Entrega la referencia tipada y su degradación explícita, nada del lado destino.
- US-C1-24/25/26 — los Resolver Groups son de C14: se referencian, no se definen. El disparo automático de escalado por umbral de SLA lo levantan FR-SLA-07 y FR-WFL-05 (C7/C12); C1 ejecuta la ACCIÓN de escalado al recibir el evento.
- US-C1-27 — la conversión necesita el lado Service Request de C2. Solo lado Incident.
- US-C1-29/30 — la búsqueda de conocimiento, el ranking y el modelo de artículo son de C9. C1 llama a un puerto y registra la deflexión.
- Notificaciones (C16) y entradas de auditoría (C18) se consumen vía eventos de dominio publicados post-commit: C1 publica, ellas registran.

#### FR-INC-05 — no aplanes el comportamiento distintivo del producto

Las historias US-C1-11, 12, 13 y 14 hacen falsables cinco propiedades del flag de "competición en curso". Los tickets deben conservarlas, no resumirlas en "implementar el flag": justificación obligatoria forzada en el dominio; elevación configurable del Impact que RE-DERIVA la Priority por la matriz y nunca escribe una Priority directamente; set, cambio y limpieza auditados con la cadena causal en un solo evento; y sobre todo **US-C1-12**, cuyos casos negativos son el ticket más importante de la épica: el campo se rechaza en servidor en toda vía de entrada, NO existe ninguna ruta de escritura automatizada (ni calendario, ni feed de fixtures de SCMS, ni regla temporal, ni evento de umbral de SLA, ni importación), y un test unitario afirma que invocar la escritura con un actor de sistema es rechazado.

#### Orden — es parte del entregable

Los tickets van numerados EN ORDEN DE IMPLEMENTACIÓN: T-C1-01 es lo primero que se construye. El orden lo manda la dependencia técnica real, no el número de la historia. Esqueleto de bloques; refínalo si la dependencia lo exige y explica por qué en el README:

1.  Cimentación del contexto: las 6 librerías `incident` con tags.
2.  Registro base e intake: numeración de referencia (US-05), intake de requester (US-01), intake de agente en un solo flujo (US-02), sujeto e instancia de competición (US-03), adjuntos (US-04).
3.  Categorización: taxonomía configurable (US-06), puerta de salida de `New` (US-07).
4.  Priorización: configuración de la matriz (US-09), derivación en servidor (US-08), override con justificación (US-10).
5.  Flag de competición en curso: uplift configurable (US-14), activación (US-11), solo-agente y nunca automático (US-12), cambio y limpieza (US-13).
6.  Ciclo de vida: modelo de estados (US-15), puerta de resolución (US-16), señales de parada/reanudación del reloj (US-17).
7.  Cierre: confirmación o rechazo del requester (US-18), auto-cierre (US-19).
8.  Colaboración: comentario público vs work note interna (US-22), vista del requester (US-23).
9.  Asignación y escalado: reasignación con historial (US-24), escalado funcional (US-25), jerárquico y automático (US-26).
10. First Contact Resolution (US-32) — depende del historial de asignación de US-24.
11. Enlazado: Incidents y Major Incident padre (US-20), contextos diferidos (US-21).
12. Regla de alcance en el intake (US-28).
13. Conocimiento: sugerencias (US-29), registro de deflexión (US-30).
14. Fase 3: conversión Incident ↔ Service Request (US-27), detección de duplicados (US-31).

El README.md lista los tickets en ese orden, agrupados por bloque, una línea por ticket (id, título, historia, capa, agente, estimación) y el total de horas por bloque y de la épica.

#### Fases — léelas, no las derives

A diferencia de C10, CADA historia de C1 lleva ya un campo `- **Phase:**`. Cópialo al campo `phase:` del ticket tal cual. Hay cuatro valores en uso: `disputed 0/1 (F6)` (US-01…07), `1 (MVP)` (la mayoría), `3 (§14.5)` (US-27, US-31) y `unphased (F9)` (US-28, 29, 30).

**NO resuelvas el corte de fase 0/1 del hallazgo F6.** El §14.2 del PRD sitúa FR-INC-01/02/03 en fase 0 y el §14.3 sitúa FR-INC-01→13 y 18 en el MVP de fase 1, solapándose sin declarar la frontera. Esa decisión es del Product Owner. Los tickets de US-01…07 conservan `disputed 0/1`.

#### Preguntas abiertas que NO debes resolver tú

Seis hallazgos bloquean o condicionan ocho historias. No inventes ninguna de estas decisiones: entrega la parte no bloqueada, marca el ticket con `blocked_by: Fnn` en el frontmatter y explica en `## Context` qué decisión falta y quién debe tomarla.

- **F24** → US-C1-11. La elevación del Impact no está definida en el techo de la escala: si el Incident ya está en el Impact máximo, nadie ha dicho si se satura o si se rechaza el flag. El ticket exige comportamiento determinista y prohíbe el no-op silencioso, pero NO elige.
- **F25** → US-C1-28. FR-INC-15 dice "reject **or** flag" sin decidirlo, y no dice dónde viven las reglas de detección. La historia asume que son datos de configuración y que rechazar-vs-marcar también se configura: es asunción pendiente de confirmar.
- **F27** → US-C1-22. Nadie ha dicho si el tipo de una entrada (comentario público / work note interna) puede cambiarse después de creada. Es una divulgación en un sentido y una retractación en el otro. Recomendación de la historia: inmutable, corrección por entrada nueva.
- **F28** → US-C1-32. "La primera interacción" no está definida, así que FCR no tiene definición testable. Entrega lo inequívoco (historial de asignación y tier resolutor); la frontera de interacción queda bloqueada.
- **F29** → US-C1-01 y US-C1-03. FR-INC-01 es ambiguo sobre si un requester puede fijar el sujeto de competición estructurado. La lectura de las historias es: requester en texto libre, agente fija la referencia estructurada. Si se confirma lo contrario cambian el formulario y los permisos.
- **F30** → US-C1-10 y US-C1-13. El override de Priority (FR-INC-04) y la re-derivación por el flag (FR-INC-05) pueden contradecirse y el PRD no dice cuál gana. Las historias asumen que el override se mantiene hasta que un agente vuelve explícitamente al valor derivado, y exigen un test explícito. Dos implementaciones razonables dan recuentos de P1 distintos.

Los hallazgos **F23** (la mitigación del riesgo R1 está sin fase mientras el intake que protege es fase 1) y **F26** (el registro de deflexión de FR-INC-16 choca con FR-KNW-06, que es fase 3) son de fasing, no bloquean la implementación: recógelos en el README como riesgos de secuencia.

#### Restricciones

- IDs T-C1-01, T-C1-02, … con dos dígitos y solo con este prefijo.
- No renumeres ni inventes IDs US- / FR- / NFR-.
- Máximo 3h por ticket. Si superas el cap, escribe la razón en `## Context`.
- El campo `agent:` solo admite `backend-engineer` o `frontend-engineer`, los únicos que existen en .claude/agents/. NO existen ci-cd-expert ni testing-implementer: para el código de test E2E / API-E2E nombra la capa y la plataforma, no un agente inexistente.
- No escribas tickets de ninguna otra épica, ni de FR-MIM-\* (C13), ni de los lados destino de C2, C3, C4, C5, C6, C7, C9, C12, C14, C16 o C18.
- No escribas código, ni tests, ni migraciones: te paras en los tickets y el test plan.
- Escribe únicamente bajo docs/backlog/C1/. No modifiques user-stories.md ni epic-map.md, ni nada bajo docs/backlog/C10/.

#### Informa al terminar

Número de tickets, desglose por bloque, horas totales y por bloque, cuántos son de cimentación del contexto, qué historias han quedado bloqueadas y por qué hallazgo, y cualquier historia demasiado vaga para estimar — di cuál y por qué, sin reescribirla.

### Response:

Añdadido tickets en la carpeta docs/backlog/C1/tickets/

</br>

**Prompt 3:**

---

### 7. Pull Requests

**Prompt 1:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como sport-itsm-architect e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-01.md · Bootstrap the Nx workspace with pnpm and strict TypeScript Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### El ticket es el contrato

Lee docs/backlog/C10/tickets/T-C10-01.md entero. Su `## Scope` es exhaustivo y su lista de "Out of scope" es vinculante. Lee también CLAUDE.md §2 (versiones pinneadas: Node 20 LTS, Nx 21.6, TypeScript 5.9, pnpm como único gestor) y §3 (comandos y estructura de carpetas). No leas el resto del backlog: el ticket es autocontenido.

#### Lo que NO debes hacer — es el riesgo real de este ticket

Vas a arrancar un workspace Nx y la tentación de dejarlo "completo y usable" es enorme. No lo hagas:

- **ESLint 9 flat config y Prettier 3 son T-C10-02.** No los configures.
- **El esquema de tags de tres ejes y la matriz de boundaries son T-C10-03.** No los configures.
- **Ninguna aplicación y ninguna librería.** Ni `apps/api`, ni `apps/web`, ni nada bajo `libs/`. El criterio de aceptación exige explícitamente que `pnpm nx graph` reporte CERO proyectos.

Adelantarte convierte tickets greenfield en tickets de gap dentro de un proyecto que todavía no tiene una línea de código, y el backlog entero deja de reflejar la realidad. Haz exactamente el Scope, ni un paso más. Si crees que algo del Scope es imposible sin invadir otro ticket, para y dilo en vez de resolverlo por tu cuenta.

#### Precaución con el directorio

El repositorio NO está vacío: contiene CLAUDE.md, readme.md, prompts.md, skills-lock.json, docs/ y .claude/. `create-nx-workspace` espera normalmente un directorio limpio. Bajo ninguna circunstancia borres, muevas, sobrescribas ni renombres nada de lo existente. Si el generador se niega a operar sobre un directorio no vacío, para y dime el error exacto y la orden que has usado — no improvises una salida que toque los ficheros que ya están.

#### Verificación — ejecútala, no la afirmes

Los cuatro criterios de aceptación son comprobaciones mecánicas. Ejecuta cada comando de verdad y pega su salida:

1. `pnpm install` completa sin error y produce SOLO `pnpm-lock.yaml` — ni `package-lock.json` ni `yarn.lock` en ningún punto del árbol.
2. `pnpm nx report` imprime Nx 21.6, TypeScript 5.9 y Node 20.x.
3. `tsconfig.base.json` tiene `compilerOptions.strict: true`, además de `noImplicitOverride`, `noUnusedLocals` y `noFallthroughCasesInSwitch`.
4. `pnpm nx graph --file=tmp/graph.json` funciona y reporta cero proyectos.

Si alguno falla, dilo con su salida completa. Un criterio que no has ejecutado se reporta como no ejecutado, nunca como pasado.

#### Restricciones

- No modifiques nada bajo docs/ ni bajo .claude/. El ticket no se edita ni se marca como hecho.
- No instales dependencias que el Scope no pida.
- No hagas commit ni push salvo que te lo pida explícitamente.
- Si necesitas red y no la tienes, para y dilo.

#### Informa al terminar

Qué ficheros has creado, la salida de las cuatro verificaciones, y cualquier decisión que hayas tomado que el ticket no cubría — en particular si has elegido entre preset integrado y package-based, o cómo has resuelto la colisión con el directorio no vacío.

### Response:

Implementado ticket T-C10-01

</br>

**Prompt 2:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como sport-itsm-architect e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-02.md · ESLint 9 flat config, Prettier 3 y el esquema de tags Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Precondición

T-C10-01 debe estar hecho. Compruébalo antes de tocar nada:

    ls package.json nx.json tsconfig.base.json && pnpm nx report

Si no existe el workspace, PARA y dilo: este ticket no lo crea.

#### El ticket es el contrato

Lee docs/backlog/C10/tickets/T-C10-02.md entero. Su `## Scope` es exhaustivo y su "Out of scope" es vinculante. Lee además:

- CLAUDE.md §3, apartados "Style rules" y "What NOT to do" — de ahí salen las reglas de Prettier (comillas simples, punto y coma) y la prohibición de reglas ESLint estilísticas que entren en conflicto con Prettier.
- docs/product/ARCHITECTURE.md §5.2 — el esquema de tags que este ticket declara.
- docs/product/ARCHITECTURE.md §4.1 — la tabla de bounded contexts, fuente autoritativa de los valores de `scope:`.

#### El vocabulario de tags — los tres ejes, completos

`scope:` son **15** valores: los 14 contextos de ARCHITECTURE.md §4.1 más `shared`.

    incident, service-request, sla, service-catalog, knowledge, identity-access,
    approval, notification, audit, reporting, problem, change, release, asset-config, shared

Los cuatro genéricos de soporte —`approval`, `notification`, `audit`, `reporting`— vienen de ADR-001 y son tan obligatorios como los demás: si faltan, las épicas C15, C16, C17 y C18 no podrán taggear sus librerías y el fallo aparecerá meses después.

`platform:` ∈ {backend, frontend, shared}.

`type:` ∈ {domain, application, infrastructure, feature, ui, data-access, contracts, util, app, e2e} — `app` y `e2e` incluidos, por ADR-002.

#### Lo que NO debes hacer — el riesgo real de este ticket

**La matriz `depConstraints` es T-C10-03, no este ticket.** Es la trampa evidente: cualquiera que configure `@nx/enforce-module-boundaries` escribe la matriz a continuación por inercia. Aquí solo se declara el VOCABULARIO de tags —qué valores existen en cada eje— y se deja la regla que los consume para el siguiente ticket, que tiene su propia verificación.

Tampoco crees ningún proyecto: sigue sin haber aplicaciones ni librerías, y este ticket no las añade.

#### Verificación

Tres de los cuatro criterios son ejecutables. Córrelos de verdad y pega la salida:

1. `pnpm nx run-many -t lint` termina con código de salida 0.
2. `pnpm prettier --check .` no reporta ninguna diferencia de formato.
3. `eslint.config.mjs` es flat config (exporta un array), no queda ningún `.eslintrc` ni fallback a él, y los tres ejes de tags con sus valores permitidos están enumerados **en un solo sitio** del fichero.

El cuarto criterio ("el vocabulario declarado aquí es el conjunto que validará la regla de T-C10-03") no es ejecutable hoy: es estructural. Confírmalo señalando la constante o bloque exacto que T-C10-03 va a consumir, y comprueba que no está duplicado en otro punto del fichero.

Ojo con el criterio 1: con cero proyectos en el workspace, `run-many -t lint` puede salir 0 sin haber ejecutado nada. Dilo si es el caso —"0 proyectos, nada que lintar"— en vez de presentarlo como prueba de que la config funciona. Para demostrar que carga de verdad, ejecuta también `pnpm eslint --print-config eslint.config.mjs` o equivalente y pega la salida.

Si algún criterio falla, dilo con su salida completa. Un criterio no ejecutado se reporta como no ejecutado, nunca como pasado.

#### Restricciones

- No modifiques nada bajo docs/ ni bajo .claude/. El ticket no se edita ni se marca como hecho.
- No instales dependencias que el Scope no pida.
- No introduzcas un segundo gestor de paquetes: pnpm es el único soportado.
- No hagas commit ni push salvo que te lo pida explícitamente.

#### Informa al terminar

Qué ficheros has creado o modificado, la salida de las verificaciones, cuántos valores has declarado en cada eje de tags, y cualquier decisión que el ticket no cubriera — en particular si has tenido que elegir entre configurar `angular-eslint` ahora o dejarlo para cuando exista `apps/web` (T-C10-05).

### Response:

Implementado ticket T-C10-02

</br>

**Prompt 3:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como sport-itsm-architect e implementa UN SOLO ticket:
docs/backlog/C10/tickets/T-C10-03.md · Encode the type constraint matrix and the scope/platform rules
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Precondición

T-C10-01 y T-C10-02 deben estar hechos. Compruébalo antes de tocar nada:

    ls package.json nx.json eslint.config.mjs && pnpm nx report

`eslint.config.mjs` debe existir ya, en flat config, con el vocabulario de tags de tres ejes
declarado en un solo sitio. Si no está, PARA y dilo: este ticket lo consume, no lo crea.

#### Por qué este ticket importa más que los demás

Su propio Context lo dice citando ARCHITECTURE.md §5.4: es "the single most important
structural rule in this document". Las diecinueve épicas están dimensionadas asumiendo que un
import ilegal **rompe la build**, no que lo caza alguien en revisión. Si esta configuración
queda mal, el error no se manifiesta aquí: se manifiesta dentro de seis meses como un grafo de
dependencias corrupto que ya nadie puede desenredar.

#### El ticket es el contrato

Lee docs/backlog/C10/tickets/T-C10-03.md entero, y con él:

- docs/product/ARCHITECTURE.md §5.3 — la matriz de diez filas, la regla de `scope:` y la de
  `platform:`. Es la fuente literal de lo que hay que codificar; transcríbela, no la deduzcas.
- docs/product/ARCHITECTURE.md §5.2 — "exactamente tres tags, sin excepciones".
- docs/product/ARCHITECTURE.md §5.4 — el grafo permitido, para contrastar.
- CLAUDE.md §3, "What NOT to do" — la prohibición de relajar la regla para que compile un
  import ilegal.

Consume el vocabulario de tags que T-C10-02 dejó declarado en un único punto de
`eslint.config.mjs`. **No lo redeclares ni lo dupliques**: si acabas con dos listas de tags en
el fichero, has roto el cuarto criterio de aceptación de T-C10-02.

Tres detalles de la matriz que se fallan con frecuencia:

- `type:app` puede depender de todos los tipos de su plataforma más `shared`, y es el ÚNICO
  que cruza contextos, porque es la raíz de composición y su scope es `scope:shared`.
- `type:e2e` solo puede depender de `type:contracts` y `type:util`. Nada más.
- **Ninguna** librería puede depender de un `type:app`. Esa fila no existe en la matriz: es una
  prohibición explícita que hay que codificar.

#### El problema de verificación — resuélvelo así, no lo ignores

Cinco de los seis criterios de aceptación exigen sondas sobre proyectos: import de `type:domain`
a `type:infrastructure`, de `platform:frontend` a `platform:backend`, de un `scope:` a otro, y
un proyecto declarado con dos tags. **En este punto el workspace tiene cero proyectos**: las
aplicaciones son T-C10-04→06 y las librerías de `identity-access` son T-C10-18.

No puedes verificarlos sin proyectos, y no puedes crear los proyectos de verdad. La salida es
**andamiaje desechable**:

1. Genera librerías temporales mínimas, con nombres inequívocamente de sonda
   (`libs/__probe/a`, `libs/__probe/b`, …) y los tags que cada criterio necesita. NO uses los
   nombres reales de contextos ni de aplicaciones: `scope:identity-access` es de T-C10-18 y no
   debe aparecer aquí ni siquiera de forma temporal.
2. Introduce el import ilegal correspondiente.
3. Ejecuta `pnpm nx lint <proyecto>` y comprueba que **falla**, y que el mensaje nombra la regla
   y los dos tags implicados. Pega la salida del error: un criterio de este ticket se demuestra
   con el fallo, no con el éxito.
4. Repite para los cinco casos, incluido el proyecto con dos tags en vez de tres.
5. **Borra todo el andamiaje** y demuestra con `git status` y `pnpm nx show projects` que el
   workspace vuelve a tener cero proyectos y ningún residuo.

Si crees que hay una forma mejor de verificarlo, dila antes de ejecutarla. Lo que NO es
aceptable es declarar pasado un criterio que no has ejecutado.

#### Lo que NO debes hacer

- **No crees ningún proyecto real.** `apps/api`, `apps/web`, `apps/api-e2e`, `apps/web-e2e` y
  cualquier `libs/shared/*` o `libs/<contexto>/*` pertenecen a tickets posteriores. El único
  andamiaje permitido es el desechable de la sección anterior, y se borra antes de cerrar.
- **No relajes ninguna regla para que algo pase.** Si una sonda no falla cuando debería, el fallo
  está en tu configuración, no en la regla: arréglala. Añadir una excepción, un `allow` o un
  `ignoredCircularDependencies` para salir del paso es exactamente lo que CLAUDE.md §3 prohíbe.
- No toques el vocabulario de tags de T-C10-02 salvo que esté objetivamente mal; si lo está,
  dilo en el informe en lugar de corregirlo en silencio.

#### Verificación final

Además de las cinco sondas, con el andamiaje ya borrado:

- `pnpm nx run-many -t lint` pasa sobre el workspace vacío.
- `pnpm nx graph --file=tmp/graph.json` se genera sin aristas prohibidas (trivial con cero
  proyectos: dilo así, no lo presentes como prueba de nada).
- `git status` limpio de sondas y de proyectos temporales.

#### Restricciones

- No modifiques nada bajo docs/ ni bajo .claude/. El ticket no se edita ni se marca como hecho.
- No instales dependencias que el Scope no pida.
- No hagas commit ni push salvo que te lo pida explícitamente.

#### Informa al terminar

La configuración `depConstraints` resultante, la salida de las cinco sondas (con el mensaje de
error de cada una), la confirmación de que el andamiaje quedó borrado, y cualquier fila de la
matriz de §5.3 que no hayas podido expresar en `@nx/enforce-module-boundaries` — si la hay, es
un hallazgo de arquitectura, no un detalle de implementación: dilo claramente.

### Response:

Implementado ticket T-C10-03

</br>

**Prompt 4:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-04.md · Scaffold `apps/api` — NestJS 11 composition root with validated configuration
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Precondición
T-C10-01, T-C10-02 y T-C10-03 deben estar hechos. Compruébalo antes de tocar nada:

    ls package.json nx.json eslint.config.mjs tools/boundary-probes/verify.mjs
    pnpm nx report
    pnpm verify:boundaries

`verify:boundaries` debe salir 0 con las 9 sondas en verde. Si falla, PARA: la regla de fronteras
está rota y este ticket crea el primer proyecto que la va a pisar de verdad.

#### El ticket es el contrato
Lee docs/backlog/C10/tickets/T-C10-04.md entero. Su `## Scope` es exhaustivo y su lista de
"Out of scope" es vinculante — remite a tres tickets distintos, no los invadas. Lee además:

- CLAUDE.md §2 (versiones pinneadas) y §3, apartados "Backend idioms" y "What NOT to do":
  de ahí salen la prohibición de `process.env` en código de feature, el `ValidationPipe` global,
  el prefijo `/api` sin health endpoints dentro, y la prohibición de `console.log`.
- docs/product/ARCHITECTURE.md §5.4 y §6.3 — qué es la raíz de composición y por qué `apps/api`
  es el único proyecto backend autorizado a cruzar contextos.
- ADR-002 (`type:app`) y ADR-003 (puertos resueltos en la raíz de composición).

#### Express 5, no Express 4 — el Scope del ticket está desactualizado
El `## Scope` del ticket dice "NestJS 11 on **Express 4** (pin intentional, `CLAUDE.md` §2)".
Esa línea ya no es correcta y **CLAUDE.md §2 la reemplaza**: `@nestjs/platform-express@11` incluye
Express 5 desde su versión `11.0.0`, así que NestJS 11 nunca ha ido sobre Express 4. El pin era
inalcanzable, no obsoleto. CLAUDE.md, ARCHITECTURE.md y COMPONENTS.md ya están corregidos; el
ticket no, porque los tickets no se editan.

En consecuencia:
- Instala NestJS 11 tal cual y deja que llegue Express 5.
- **No añadas un override de pnpm** ni ninguna otra maniobra para forzar Express 4.
- Verifica con `pnpm why express` qué versión ha quedado y pega la salida en el informe.
- Ten en cuenta que Express 5 cambia el emparejado de rutas (`path-to-regexp@8`): los comodines
  tipo `*` ya no valen como en Express 4. Si defines exclusiones de ruta para el prefijo `/api`,
  compruébalas de verdad en vez de asumir la sintaxis antigua.

#### Lo que NO debes hacer — el riesgo real de este ticket
Es el primer proyecto real del monorepo y el generador de Nx quiere darte una aplicación
"completa". No la aceptes tal cual:

- **No generes `apps/api-e2e`.** El generador de Nx crea el proyecto e2e por defecto; es T-C10-06,
  y además ese ticket lo quiere con Cypress + Cucumber, no con lo que ponga el generador.
  Pásale `--e2eTestRunner=none` y verifica después que solo existe UN proyecto.
- **Ni logging estructurado (pino), ni health probes (`/health/live`, `/health/ready`), ni Swagger.**
  Son del slice de observabilidad (T-C10-28). Este ticket SOLO reserva las exclusiones de ruta que
  esos endpoints usarán, para que la lista de exenciones de T-C10-28 no cambie después. Reservar
  la exclusión no es implementar el endpoint: no crees controladores de health.
- **Ni conexión a base de datos, ni TypeORM, ni `data-source.ts`, ni migraciones** (T-C10-16).
- **Ni `apps/web`** (T-C10-05), **ni ninguna librería bajo `libs/`** (T-C10-07 en adelante).
- **No toques `eslint.config.mjs`.** El vocabulario de tags y la matriz `depConstraints` son de
  T-C10-02 y T-C10-03. Si el generador de Nx intenta escribir un `.eslintrc` o modificar la config
  raíz, deshazlo: la flat config es la única fuente.
- **pnpm es el único gestor.** Si algún generador invoca npm y aparece un `package-lock.json`,
  párate y dilo.

Adelantarte convierte tickets greenfield en tickets de gap. Haz exactamente el Scope.

#### Verificación — ejecútala, no la afirmes
Los cinco criterios de aceptación son mecánicos. Ejecuta cada uno de verdad y pega su salida:

1. `pnpm nx build api` termina con éxito.
2. `pnpm nx serve api` arranca y **responde en el puerto configurado**. No basta con ver el log de
   arranque: levanta el proceso en segundo plano, haz una petición HTTP real, pega la respuesta y
   mata el proceso. Si lo dejas colgado, dilo.
3. Quita una clave de configuración obligatoria del entorno y arranca: debe **fallar rápido** con un
   mensaje que **nombre la clave que falta**. Pega el mensaje literal. Un arranque con `undefined`
   es un fallo del criterio, no un detalle.
4. Los tags del proyecto son exactamente `platform:backend`, `scope:shared`, `type:app` — ni uno más
   ni uno menos — y `pnpm nx lint api` pasa la regla de fronteras de T-C10-03.
5. `grep -rn "process.env" apps/api/src` devuelve coincidencias ÚNICAMENTE dentro del módulo de
   configuración. Pega la salida completa del grep, no un resumen.

Y dos comprobaciones más, porque este ticket cambia el estado del workspace:

6. `pnpm verify:boundaries` sigue en verde ahora que existe un proyecto real.
7. `pnpm nx show projects` devuelve exactamente `api` y nada más (en particular, ningún `api-e2e`).

Si algún criterio falla, dilo con su salida completa. Un criterio que no has ejecutado se reporta
como no ejecutado, nunca como pasado.

#### Restricciones
- No modifiques nada bajo `docs/` ni bajo `.claude/`. El ticket no se edita ni se marca como hecho.
- No instales dependencias que el Scope no pida.
- No hagas commit ni push salvo que te lo pida explícitamente.
- Si necesitas red y no la tienes, para y dilo.

#### Informa al terminar
- Qué ficheros has creado o modificado, y qué dependencias has añadido con su versión exacta.
- La salida de las siete verificaciones.
- La salida de `pnpm why express`, confirmando Express 5 y que no hay ningún override.
- Qué te ha generado Nx que hayas tenido que quitar o recortar por estar fuera de Scope.
- Cualquier nota de estado que este ticket deje obsoleta en `readme.md` §2.3.6 o en
  `docs/product/ARCHITECTURE.md` §12.3: **repórtala, no la corrijas** — yo decido si se actualiza.

### Response:

Implementado ticket T-C10-04

</br>

**Prompt 5:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como frontend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-05.md · Scaffold `apps/web` — Angular 20 standalone shell
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Precondición
T-C10-01, T-C10-02, T-C10-03 y T-C10-04 deben estar hechos. Compruébalo antes de tocar nada:

    ls package.json nx.json eslint.config.mjs tools/boundary-probes/verify.mjs apps/api/project.json
    node -v                    # debe ser v22.x
    pnpm nx show projects      # debe devolver EXACTAMENTE: api
    pnpm verify:boundaries     # 9 sondas en verde, exit 0
    pnpm nx build api          # exit 0

`verify:boundaries` debe salir 0. Si falla, PARA: la regla de fronteras está rota y este ticket
crea el primer proyecto frontend, que es justo el que la va a poner a prueba en el eje `platform:`.

#### El ticket es el contrato
Lee docs/backlog/C10/tickets/T-C10-05.md entero. Su `## Scope` es exhaustivo y su lista de
"Out of scope" es vinculante — remite a cuatro tickets distintos, no los invadas. Lee además:

- CLAUDE.md §2 (Angular 20.3 pinneado, Jest, SCSS) y §3, apartados "Frontend idioms" y
  "What NOT to do": de ahí salen la prohibición de `NgModule`, la de `*ngIf`/`*ngFor` legacy,
  `OnPush` obligatorio, signals sobre RxJS, `inject()` sobre DI por constructor, interceptores
  funcionales, y la prohibición TAJANTE de cualquier librería de componentes de terceros.
- docs/product/ARCHITECTURE.md §5.1, §7.1, §7.2 y §7.3 — qué es el shell y qué NO le corresponde.
- ADR-002 (`type:app`) y ADR-010 (`libs/shared/ui` es `platform:frontend`, no `platform:shared`).
- docs/product/PROJECT-STRUCTURE.md, el árbol de `apps/web`: `main.ts`, `app.config.ts`,
  `app.routes.ts`, `styles.scss`. Ese es el destino; genera solo la parte que este ticket pide.

#### Trampas del generador ya verificadas en T-C10-04 — no las redescubras
El generador de Nx quiere darte una aplicación "completa". No la aceptes tal cual:

- **Argumento posicional.** `@nx/nest:app api` falló con "Schema does not support positional
  arguments". Usa `--name=web --directory=apps/web`, no `@nx/angular:app web`.
- **`--e2eTestRunner=none`.** El generador crea `apps/web-e2e` por defecto; es T-C10-06, y ese
  ticket lo quiere con Cypress + Cucumber, no con lo que ponga el generador. Verifica después
  que `pnpm nx show projects` devuelve exactamente `api` y `web`.
- **`--useProjectJson=true`.** Sin esto Nx 21 puede inlinear la config en un `package.json` por
  proyecto, y `eslint.config.mjs` tiene `banTransitiveDependencies: true`, que se activa
  precisamente cuando un proyecto gana su propio `package.json`. Queremos `apps/web/project.json`.
- **`--unitTestRunner=jest`.** Nx 21 puede ofrecerte Vitest; CLAUDE.md §2 pinea **Jest**.
- **El generador instaló Jest 30 en T-C10-04 y CLAUDE.md §2 pinea Jest 29.** Si vuelve a hacerlo,
  devuélvelo a 29 — es restaurar el pin, no un cambio.
- **El generador escribe rangos `^`.** Todo el `package.json` usa versiones exactas: convierte a
  pin exacto lo que añadas.
- **Comprueba que ha entrado Angular 20.3 y no 21.** Si entra 21, PARA y dilo: es un bump de major
  sin aprobar.
- **Sin SSR** (`--ssr=false`). `PROJECT-STRUCTURE.md` no contempla `main.server.ts` ni `server.ts`;
  `main.ts` es `bootstrapApplication(AppComponent, appConfig)` y nada más.
- **`.vscode/`.** En T-C10-04 el generador escribió un `launch.json` fuera de Scope. Si aparece, quítalo.
- **No toques `eslint.config.mjs`.** Ya enruta `angular-eslint` a `apps/web/**/*.ts` y
  `apps/web/**/*.html`; las reglas de Angular deben activarse solas. Si el generador intenta
  escribir un `.eslintrc` o modificar la config raíz, deshazlo: la flat config es la única fuente.
- **pnpm es el único gestor.** Si algún generador invoca npm y aparece un `package-lock.json`,
  párate y dilo.

#### Lo que NO debes hacer
- **Ni el componente `NxWelcome`.** El generador mete una plantilla de marketing enorme. Fuera.
  Pero ojo: a diferencia de `apps/api`, aquí el AC2 exige que el shell **renderice** y que la ruta
  por defecto resuelva, así que sí necesitas un componente raíz real y mínimo, con `OnPush`.
- **Ni un solo interceptor.** `provideHttpClient(withInterceptors([]))` con el array VACÍO. Las
  implementaciones son T-C10-30.
- **Ni tokens de diseño ni tema.** Crea solo el punto de entrada SCSS global que más adelante
  importará la capa de tokens; la capa en sí es T-C10-12. Nada de colores ni espaciados hardcodeados.
- **Ni Transloco** (slice de i18n del épico NFR). Declara la dependencia si procede, no la montes.
- **Ni una librería bajo `libs/`** (T-C10-07 en adelante), **ni `apps/web-e2e`** (T-C10-06).
- **Ni Angular Material, CDK, PrimeNG, Nebular, Bootstrap o Tailwind.** Prohibición expresa de
  CLAUDE.md §3. Todo componente es de fabricación propia.
- **Ojo con las rutas lazy:** el ticket pide slots `loadChildren` pero **no existe ninguna feature
  lib todavía**, así que un `loadChildren` apuntando a la nada no compila. Resuélvelo de forma que
  el fichero compile Y la ruta por defecto resuelva de verdad, y explica en el informe qué criterio
  has seguido. No inventes una feature lib para rellenar el hueco.

Adelantarte convierte tickets greenfield en tickets de gap. Haz exactamente el Scope.

#### Verificación — ejecútala, no la afirmes
Los cinco criterios son mecánicos. Ejecuta cada uno de verdad y pega su salida:

1. `pnpm nx build web` termina con éxito.
2. `pnpm nx serve web` arranca y **el shell renderiza con la ruta por defecto resuelta**. No basta
   con el log de arranque: levanta el proceso en segundo plano, haz una petición HTTP real, pega la
   respuesta (que el HTML servido contenga el marcado del shell, no solo un 200) y mata el proceso.
   Comprueba además que el puerto queda liberado: en T-C10-04, matar el wrapper de `nx` dejó vivo
   el proceso hijo de node. Si lo dejas colgado, dilo.
3. `grep -rn "NgModule" apps/web/src` no devuelve ninguna coincidencia. Pega la salida completa.
4. Los tags son exactamente `platform:frontend`, `scope:shared`, `type:app` — ni uno más ni uno
   menos — y `pnpm nx lint web` pasa. Como `web` todavía no importa ningún otro proyecto, un lint
   verde no prueba por sí solo que la regla de fronteras esté activa: confírmalo también con
   `pnpm eslint --print-config apps/web/src/main.ts` y comprueba que
   `@nx/enforce-module-boundaries` aparece en severidad `error` y que las reglas de `angular-eslint`
   SÍ están presentes aquí (en `apps/api` deben seguir ausentes).
5. La sonda del AC5: introduce un import en `apps/web` desde un proyecto `platform:backend`,
   comprueba que `pnpm nx lint web` falla, y **revierte la sonda antes de cerrar**.

   **Matiz importante que el ticket no puede prever:** hoy el único proyecto backend es `apps/api`,
   que es `type:app`. Un import desde él viola DOS reglas a la vez — la de plataforma
   (`frontend` no puede depender de `backend`) y la del matriz de tipos (nada puede depender de un
   `type:app`; la raíz de composición es un sumidero). Así que el fallo es seguro pero **no aísla
   la regla de plataforma**. Pega el mensaje literal de ESLint y di con honestidad qué restricción
   ha disparado. Si quieres el aislamiento limpio, la sonda `p2` de `pnpm verify:boundaries` ya
   prueba `frontend → backend` por separado: cítala, no dupliques su trabajo.

Y tres comprobaciones más, porque este ticket cambia el estado del workspace:

6. `pnpm verify:boundaries` sigue en verde (9/9) ahora que existe un proyecto frontend.
7. `pnpm nx show projects` devuelve exactamente `api` y `web`, y nada más (ningún `web-e2e`).
8. `pnpm prettier --check .` pasa, y `pnpm install` NO emite `WARN Unsupported engine`
   (el workspace está en Node 22 desde hace poco; si reaparece, algo ha tocado `engines`).

Si algún criterio falla, dilo con su salida completa. Un criterio que no has ejecutado se reporta
como no ejecutado, nunca como pasado.

#### Restricciones
- No modifiques nada bajo `docs/` ni bajo `.claude/`. El ticket no se edita ni se marca como hecho.
- No toques `apps/api` ni nada de T-C10-04.
- No instales dependencias que el Scope no pida.
- No hagas commit ni push salvo que te lo pida explícitamente.
- Si necesitas red y no la tienes, para y dilo.

#### Informa al terminar
- Qué ficheros has creado o modificado, y qué dependencias has añadido con su versión exacta.
- La versión de Angular que ha quedado instalada, confirmando que es 20.3.
- La salida de las ocho verificaciones.
- Qué criterio has seguido para las rutas lazy sin feature libs.
- Qué te ha generado Nx que hayas tenido que quitar o recortar por estar fuera de Scope.
- Cualquier nota de estado que este ticket deje obsoleta en `readme.md` §2.3.6 o en
  `docs/product/ARCHITECTURE.md` §12.3: **repórtala, no la corrijas** — yo decido si se actualiza.

### Response:

Implementado ticket T-C10-05

</br>

**Prompt 6:**

Agent: Claude Code - Sonnet 4.6

### Request:

Implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-06.md · Scaffold `apps/api-e2e` y
`apps/web-e2e` — arneses Cypress 15.20 + Cucumber
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
El ticket lleva `agent: —` a propósito: no es de `backend-engineer` ni de `frontend-engineer`.
Trabaja en el hilo principal aplicando las skills `sport-itsm-workflow`, `sport-itsm-architecture`
y `ci-cd` (project.json, targets, configuración del gestor de paquetes). Si delegas, el reparto
honesto es: `ci-cd-expert` para el cableado del arnés y `testing-implementer` SOLO para los dos
`.feature` de humo y sus step definitions. No delegues el diseño de los targets.

#### Precondición
T-C10-01 … T-C10-05 deben estar hechos. Compruébalo antes de tocar nada:

    ls package.json nx.json eslint.config.mjs pnpm-workspace.yaml tools/boundary-probes/verify.mjs
    ls apps/api/project.json apps/web/project.json
    node -v                    # v22.x
    pnpm nx show projects      # EXACTAMENTE: api, web
    pnpm verify:boundaries     # 9/9 en verde, exit 0
    pnpm nx build api          # exit 0
    pnpm nx build web          # exit 0
    pnpm prettier --check .    # exit 0

Si `verify:boundaries` falla, PARA: este ticket crea los dos primeros proyectos `type:e2e`, que son
justamente los que ponen a prueba la fila `e2e` de la matriz de tipos.

#### El ticket es el contrato
Lee docs/backlog/C10/tickets/T-C10-06.md entero: su `## Scope` es exhaustivo y su lista de
"Out of scope" es vinculante. Lee además, y no de memoria:

- **ADR-011** (docs/product/ARCHITECTURE.md, "The E2E harness drives Cypress directly"). Explica por
  qué `@nx/cypress` NO se instala y por qué el target `e2e` es `nx:run-commands`. No lo reabras.
- **ADR-002** (`type:app` y `type:e2e`) y ARCHITECTURE.md §5.2/§5.3 — la fila `e2e` de la matriz:
  `type:e2e` solo puede depender de `type:contracts` y `type:util`.
- CLAUDE.md §2, tabla Backend, fila Testing: los pins exactos del arnés y el suelo de Cypress 15.18.0.
- docs/product/PROJECT-STRUCTURE.md, el árbol de `apps/api-e2e` y `apps/web-e2e`
  (`src/features/*.feature`, `src/step-definitions/*.steps.ts`, `src/support/`, `cypress.config.ts`,
  `project.json`) y la fila "Tests" de su tabla de convenciones. Ese es el destino.
- docs/backlog/C10/test-plan.md §"Test stack" — para saber qué NO es de este ticket.

#### Pins y dependencias — todas exactas, todas en devDependencies de la raíz
`package.json` no tiene un solo rango `^`: mantenlo así.

- `cypress` **15.20.x** (el preprocesador exige ≥ 15.18.0; por debajo no arranca).
- `@badeball/cypress-cucumber-preprocessor` **28.0.x**
- `@bahmutov/cypress-esbuild-preprocessor` **2.2.x**
- `esbuild` como dependencia **directa**, porque el bundler lo declara como peer y pnpm no lo iza a
  la raíz. Fíjalo en la versión que **ya resuelve `@angular/build`** para no duplicar el binario
  nativo: hoy `node_modules/.pnpm` contiene `esbuild@0.28.1` (y un `esbuild@0.25.5` transitivo
  previo). Ejecuta `pnpm why esbuild` ANTES y DESPUÉS y pega ambas salidas: si tu pin añade una
  tercera copia, has elegido mal la versión.
- Ni una dependencia más. En particular: **nada de `@nx/cypress`** (ADR-011), nada de `cross-env`,
  nada de `supertest`, nada de `start-server-and-test` salvo que justifiques por escrito por qué
  `nx:run-commands` no basta — y entonces repórtalo como ampliación de Scope, no lo cueles.

#### La enmienda al gestor de paquetes — es parte del Scope, no un detalle
Cypress descarga su binario en un `postinstall` y **pnpm 10 bloquea los build scripts por defecto**.
Hoy no existe ninguna lista de permitidos: `grep -n "onlyBuiltDependencies" pnpm-workspace.yaml
package.json` no devuelve nada, y `.npmrc` no existe. Sin la enmienda, `cypress run` falla con
`No version of Cypress is installed`.

- Añade el permitido donde ya viven los ajustes de pnpm de este workspace: `pnpm-workspace.yaml`
  (que ya contiene `autoInstallPeers` y `strictPeerDependencies`). **No crees un `.npmrc`** y no
  desactives scripts globalmente ni uses `--ignore-scripts`/`--unsafe-perm`.
- No uses `pnpm approve-builds` interactivo: la lista debe quedar **declarada en el repositorio**,
  porque CI corre `pnpm install --frozen-lockfile` sin humano delante.
- Verifica el resultado de verdad: `pnpm exec cypress version` debe imprimir 15.20.x, y
  `pnpm install` no debe emitir el aviso de "Ignored build scripts" para `cypress`.
- `pnpm-lock.yaml` cambiará. Es correcto y está en `.prettierignore`; no lo edites a mano.

#### El problema real de este ticket: el proceso vivo y el entorno
Aquí está el 80% del trabajo de diseño. Léelo entero antes de escribir el primer `project.json`.

- El AC1 exige que el arnés de `api-e2e` **alcance un proceso API vivo**. Un `dependsOn` sobre
  `api:build` compila, **no arranca nada**. El ticket escribe literalmente `build` para `api` y
  `serve` para `web`: reconcilia esa letra con el AC y **explica en el informe qué has hecho**.
- El AC2 exige que arranque **sin `.env`**. `.env` está en `.gitignore`, y
  `apps/api/src/config/env.validation.ts` declara `NODE_ENV` y `PORT` obligatorias **sin default en
  código**: si faltan, el boot aborta. Así que el target debe suministrarlas él mismo.
  `nx:run-commands` acepta `options.env` — esa es la vía nativa, sin `cross-env` ni `dotenv`.
  Ojo si tiras de `api:serve`: usa el ejecutor `@nx/js:node`, que **no** tiene opción `env`.
- Nx 21 tiene tareas continuas: `api:serve` y `web:serve` ya están declaradas `"continuous": true`,
  y un `dependsOn` sobre una tarea continua la levanta, espera y la derriba. Es la herramienta
  natural para `web-e2e`. Decide para `api-e2e` entre esa forma y arrancar el artefacto construido
  (`node dist/apps/api/main.js`) desde el propio target con su `env`, y justifica la elección.
- **Windows:** en T-C10-04/05 matar el envoltorio de `nx` dejó vivo el proceso hijo de node.
  Comprueba al terminar que los puertos (3300 de la API, 4200 del web) quedan libres. Si algo queda
  colgado, dilo; no lo escondas.

#### Los dos `.feature` de humo — qué pueden afirmar y qué no
- **api-e2e:** `apps/api` no declara ningún controlador hasta T-C10-28, y `main.ts` monta el prefijo
  global `/api` con `/health/live` y `/health/ready` exentos pero **no implementados**. Es decir:
  todo responde 404. El humo prueba que el proceso está arriba y habla HTTP por el puerto
  configurado — `cy.request({ failOnStatusCode: false })` y aserción sobre el status/cuerpo.
  **Prohibido añadir una ruta para ponerlo más verde**: eso es T-C10-28.
- **web-e2e:** el shell no renderiza copy de usuario (Transloco es del épico NFR). Afirma el landmark
  `main#main-content` de `apps/web/src/app/app.component.ts` y que la ruta por defecto ha resuelto;
  **nada de texto visible**.
- Un `.feature` por proyecto, mínimo. Los escenarios de aceptación del épico están catalogados en
  docs/backlog/C10/test-plan.md y **no son de este ticket**.

#### Cableado Cucumber — una sola convención para los dos proyectos
- `specPattern` sobre `**/*.feature`; `setupNodeEvents` con `addCucumberPreprocessorPlugin` +
  `createBundler({ plugins: [createEsbuildPlugin(config)] })`, y **devuelve `config`** (olvidarlo es
  el fallo silencioso clásico).
- La configuración del preprocesador (glob de step definitions) se resuelve relativa al `cwd` con el
  que corre Cypress. El ticket quiere **una convención compartida**: decide si eso significa un
  fichero de configuración por proyecto con la misma forma o uno en la raíz, **compruébalo
  ejecutando** — no lo deduzcas del README del paquete — y explica en el informe qué resolvió el
  preprocesador de verdad.
- Cada proyecto necesita su propio `tsconfig.json` extendiendo `../../tsconfig.base.json` con los
  `types` de Cypress y Node. La base es `strict` + `noUnusedLocals`: no la relajes por proyecto.
  **No añadas `paths` a `tsconfig.base.json`** — sigue en `{}` y así debe quedar (no hay `libs/`).

#### Lo que NO debes tocar
- **`eslint.config.mjs`.** Ya prevé este ticket: enruta `angular-eslint` a `apps/web-e2e/**/*.ts` y
  ya tiene un bloque de reglas para `**/*.cy.ts` y `**/*.steps.ts`. Si una regla te molesta, el
  arreglo está en el `tsconfig` del proyecto e2e o en tu código, **nunca** en relajar la config raíz.
- **`nx.json`.** Ya trae `targetDefaults.e2e` (cache + `dependsOn: ["^build"]`) y ya excluye
  `cypress/**`, `cypress.config.*` y `**/*.cy.*` del namedInput `production`. Si crees que necesitas
  cambiarlo, párate, explícalo y pide confirmación antes.
- **`apps/api` y `apps/web`.** Ni una línea. Ni ruta, ni controlador, ni health endpoint.
- **`.github/workflows/deploy-stage.yml`.** Declara explícitamente que no corre `nx e2e`. No lo
  cambies. Pero ojo: CI ejecuta `pnpm nx run-many -t lint test build`, así que los dos proyectos
  nuevos entran ahí — su `lint` inferido debe pasar. **No** les des target `build`, y **no** les
  pongas un `jest.config.ts` (el plugin `@nx/jest` inferiría un `test` que no les corresponde).
- Nada bajo `libs/` (T-C10-07 en adelante), nada de component testing de Cypress, nada de Docker.

#### Verificación — ejecútala, no la afirmes
Los cinco AC son mecánicos. Ejecuta cada comprobación de verdad y pega su salida:

1. `pnpm install` sin aviso de build scripts ignorados para `cypress`; `pnpm exec cypress version`
   imprime 15.20.x; `pnpm why esbuild` antes/después.
2. **AC2 literal:** aparta el `.env` local (renómbralo) y con el checkout SIN `.env` ejecuta
   `pnpm nx e2e api-e2e`. Debe pasar. Restaura el `.env` después y dilo.
3. `pnpm nx e2e web-e2e` pasa contra el shell servido, con la aserción del landmark.
4. Tags: `pnpm nx show project api-e2e --json` y `... web-e2e --json` — exactamente tres tags cada
   uno, con el `platform:` de la aplicación bajo prueba.
5. **Sonda del AC4.** `type:e2e` solo puede depender de `contracts` y `util`. Hazla sobre un
   proyecto e2e **real**: crea una librería desechable etiquetada `type:domain` con un alias
   temporal en `tsconfig.base.json` — exactamente el patrón de `tools/boundary-probes/verify.mjs` —
   impórtala desde `apps/api-e2e`, comprueba que `pnpm nx lint api-e2e` **falla**, pega el mensaje
   literal de ESLint y **revierte la sonda entera** (librería, alias e import) antes de cerrar.
   No importes desde `apps/api`: eso choca antes con la regla del sumidero `type:app` (ADR-002) y no
   prueba nada sobre la fila `e2e`.
   Matiz que debes reportar con honestidad: la sonda `p6` de `verify:boundaries` **ya** prueba
   `e2e → infrastructure` de forma aislada sobre un proyecto sintético; cítala, no la dupliques. Lo
   que tu sonda añade es que la regla muerde sobre el proyecto real. Y di también que la dirección
   *permitida* (`e2e → contracts/util`) todavía no se puede probar porque no existe ninguna librería.
6. `pnpm nx show projects` devuelve exactamente `api`, `api-e2e`, `web`, `web-e2e` y nada más.
7. `pnpm verify:boundaries` sigue en 9/9, exit 0, y deja `tsconfig.base.json` idéntico
   (`git diff --stat tsconfig.base.json` vacío).
8. `pnpm nx run-many -t lint test build` en verde — es lo que corre CI.
9. `pnpm prettier --check .` pasa y `pnpm install` no emite `WARN Unsupported engine`.
10. Puertos 3300 y 4200 liberados, sin procesos node huérfanos.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado. Si alguno falla,
pega la salida completa.

#### Restricciones
- No modifiques nada bajo `docs/` ni bajo `.claude/`. El ticket no se edita ni se marca como hecho.
- No instales dependencias que el Scope no pida.
- No hagas commit ni push salvo que te lo pida explícitamente.
- Si necesitas red (Cypress descarga ~200 MB) y no la tienes, para y dilo.

#### Informa al terminar
- Ficheros creados o modificados y dependencias añadidas con su versión exacta.
- **Cómo resolviste el proceso vivo y el entorno sin `.env`**, y por qué esa forma honra a la vez la
  letra del ticket (`dependsOn: build` para api) y el AC1.
- Dónde acabó la configuración del preprocesador Cucumber y qué resolvió realmente al ejecutar.
- La salida de las diez verificaciones, incluido el mensaje literal de ESLint de la sonda.
- Qué notas de estado quedan obsoletas — readme.md §2.3.6, docs/product/ARCHITECTURE.md §12.3 y la
  nota de estado final de docs/product/PROJECT-STRUCTURE.md ("no existe ninguna de las dos suites de
  aceptación"): **repórtalas, no las corrijas**.
- Si crees que `deploy-stage.yml` debería ganar un job de e2e: dilo como recomendación, no lo hagas.

### Response:

Implementado ticket T-C10-06

</br>

**Prompt 7:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-07.md ·
`libs/shared/util` — librería de helpers puros
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
El ticket lleva `agent: backend-engineer`, pero **aquí no se escribe una línea de NestJS**: es
`platform:shared` y framework-free. La skill que manda es `sport-itsm-engineering-principles`
(SOLID, KISS, YAGNI, errores tipados, funciones pequeñas), con `sport-itsm-architecture` para la
fila `util` de la matriz y `sport-itsm-workflow` para el ciclo de cierre. No apliques idiomas de
`sport-itsm-backend` a este código.

#### Precondición
T-C10-01 … T-C10-06 deben estar hechos. Compruébalo antes de tocar nada:

    node -v                                  # v22.x
    ls libs                                  # NO debe existir: esta es la primera librería
    pnpm nx show projects                    # EXACTAMENTE: api, api-e2e, web, web-e2e
    pnpm verify:boundaries                   # 9/9 en verde, exit 0
    node -e "console.log(JSON.stringify(require('./tsconfig.base.json').compilerOptions.paths))"
                                             # debe imprimir {} — este ticket escribe el PRIMER alias
    git status --porcelain                   # limpio antes de empezar

Si `verify:boundaries` falla, PARA: este ticket crea el primer proyecto `type:util` real, que es
justo la fila más restrictiva de la matriz (`util` solo puede depender de `util`).

#### El ticket es el contrato
Lee docs/backlog/C10/tickets/T-C10-07.md entero: su `## Scope` es exhaustivo y su "Out of scope"
es vinculante. Lee además, y no de memoria:

- ARCHITECTURE.md §5.5 — el comando generador EXACTO para `shared-util` (no lo inventes).
- ARCHITECTURE.md §5.2/§5.3 — la fila `util` de la matriz de tipos y la regla de plataforma:
  `platform:shared` solo puede depender de `platform:shared` (§5.4). Es el tipo más restringido
  del workspace y por eso va primero entre las librerías compartidas.
- ARCHITECTURE.md §369 — `scope:shared` NO implica `platform:shared`; aquí sí coinciden, y la
  razón (código sin framework que ambas plataformas importan) es justamente lo que debes proteger.
- PROJECT-STRUCTURE.md — la fila `libs/shared/util` ("pure, dependency-free helpers") y la
  convención de **Public API**: un único barrel `src/index.ts` y el alias `@sport-itsm/*`.
- CLAUDE.md §2 (Jest **29.7**, TypeScript 5.9 strict) y §3 ("What NOT to do", primera viñeta:
  ningún framework dentro de `type:domain` / `type:application` — con más razón en `type:util`).

### Response:

Implementado ticket T-C10-07

</br>

**Prompt 8:**

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-08.md ·
`libs/shared/domain` — primitivas de identidad y de ticket del kernel compartido
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, pero igual que en T-C10-07 **aquí no se escribe una línea de NestJS**:
es `platform:shared`, `type:domain`, código puro. Manda `sport-itsm-engineering-principles`
(inmutabilidad, errores tipados, hacer irrepresentables los estados ilegales, YAGNI), con
`sport-itsm-architecture` para la fila `domain` de la matriz y `sport-itsm-workflow` para el cierre.
No apliques idiomas de `sport-itsm-backend`.

#### Precondición
T-C10-01 … T-C10-07 deben estar hechos. Compruébalo antes de tocar nada:

    node -v                                  # v22.x
    pnpm nx show projects                    # EXACTAMENTE: shared-util, api-e2e, web-e2e, api, web
    pnpm nx test shared-util                 # 3 suites, 19 tests, exit 0
    node -e "console.log(Object.keys(require('./tsconfig.base.json').compilerOptions.paths))"
                                             # exactamente ['@sport-itsm/shared-util']
    pnpm verify:boundaries                   # 10/10, exit 0
    git status --porcelain                   # limpio antes de empezar

**El arnés de sondas es de un solo proceso a la vez.** `libs/__boundary-probe` funciona como lock:
si ves el mensaje "another run is in flight", **espera** — no borres el directorio, hay otra
ejecución viva y borrarlo le destruye el andamiaje y deja `tsconfig.base.json` contaminado.

#### El ticket es el contrato
Lee docs/backlog/C10/tickets/T-C10-08.md entero: su `## Scope` es exhaustivo y su "Out of scope"
es vinculante. Lee además, y no de memoria:

- **`ARCHITECTURE.md` §5.5** — el comando exacto (ya está transcrito en el Scope del ticket) **y
  los dos pasos que el generador no sabe hacer**: poner `"types": []` en `tsconfig.lib.json` y
  borrar la unidad de ejemplo. Ambos son obligatorios antes de dar la librería por andamiada.
- **`ARCHITECTURE.md` §5.3** — fila `domain`: solo puede depender de `domain` y `util`. Y §5.4,
  la regla de plataforma: `platform:shared` solo alcanza `platform:shared`.
- **`DATA-MODEL.md` §3.1** (tabla de value objects inline) y **§3.1.1** — de ahí salen la forma y
  las reglas de tres de las seis primitivas. No las deduzcas del nombre.
- **`PRD.md` FR-INC-04, FR-INC-05 y NFR-CFG-01** — para entender qué **no** es de esta librería.
- `libs/shared/util/src/index.ts` — lo que ya existe y puedes usar.

#### Dónde vive la verdad de cada primitiva — y dónde NO está
Esto es el 70% del riesgo del ticket. Tres de las seis se pueden implementar "razonablemente" y
quedar mal, porque su regla está escrita en otro documento.

- **`Identity` NO genera identificadores.** `DATA-MODEL.md` §3.1 es explícito: UUID **v7**, generado
  por el **puerto de repositorio** (`nextIdentity()`), no por la base de datos y no por el value
  object — para que el agregado esté completo y válido en código de dominio puro antes de cualquier
  I/O (ADR-005). Un `Identity.generate()` con `crypto.randomUUID()` rompe eso, y además no compila
  con `"types": []`, que es exactamente la señal que esa política existe para dar. El VO **valida y
  envuelve**. Decide y justifica si además exige la **versión 7** o acepta cualquier UUID: §3.1.1
  argumenta por qué hasta la red de seguridad de la base de datos es v7, y ese argumento aplica
  aquí igual. Ninguna de las dos respuestas es obviamente errónea; la que no argumentes, sí.
- **`TicketReference` NO genera referencias.** Formato real, de `DATA-MODEL.md`: `INC0000123`,
  `SRQ0000045` — `varchar(20)`, único, **nunca reutilizado**, servido por una `SEQUENCE` de
  PostgreSQL que lee el adaptador de repositorio (`nextReference()`). El VO valida el formato y
  nada más. No inventes un contador, ni un prefijo que no esté en el documento.
- **`Priority` NO deriva de nada.** FR-INC-04 exige que la Prioridad salga de una matriz
  **Impacto × Urgencia configurable**, y NFR-CFG-01 exige que un administrador pueda cambiarla sin
  release; el esquema llega a tener columna `priority_matrix_id`. Codificar aquí una matriz 5×5
  congelaría en el kernel una regla que es configuración, y además metería vocabulario de
  `incident` en `shared`. `Priority` es un valor validado — **P1…P4**, según `DATA-MODEL.md` — y la
  derivación es de otro ticket y de otro contexto. Si te parece que el ticket debería incluirla,
  **repórtalo, no la escribas**.
- **`ImpactLevel` y `UrgencyLevel`**: escala **1–5** (`impact_enum`/`urgency_enum`). Son los únicos
  valores legales; cualquier otro es un error de construcción.
- **`DateTimeRange` no conoce el reloj.** Nada de `new Date()` como valor por defecto ni como
  validación contra "ahora": `ClockPort` es **T-C10-09** y el AC2 prohíbe `new Date()` en el
  código fuente. El rango recibe sus dos instantes y valida su relación (inicio ≤ fin, y decide y
  documenta si el fin es inclusivo). Su uso conocido es la ventana de calendario de SLA.

#### Errores: se lanzan, no se devuelven
El AC3 es literal: construir con entrada inválida **lanza un error tipado de dominio** y nunca
devuelve una instancia a medio construir. Sé que `@sport-itsm/shared-util` exporta `Result`/`ok`/
`err` desde T-C10-07 y la tentación de "mejorar" el AC devolviendo un `Result` es real: **no lo
hagas**. `Result` es para fallos esperados que el llamante debe tratar; una invariante de value
object rota es un error de programación en el borde. Si crees que el AC está mal, es un hallazgo
que se reporta, no se reinterpreta mientras implementas.

Diseña la jerarquía de errores con criterio: una clase base de error de dominio con nombre propio y
subtipos por invariante, o un tipo discriminado — lo que elijas, que permita a un llamante
distinguir **qué** invariante falló sin parsear el mensaje. Preserva el contexto (valor ofensivo).

#### Esta es la primera arista del grafo — si la hay
Hoy `pnpm nx graph` tiene 5 nodos y **cero aristas**: `shared-util` existe pero nadie la importa.
`ARCHITECTURE.md` §12.3 dice que la inspección del grafo se vuelve una comprobación real con el
primer ticket que **consuma** una librería. Este puede serlo: el AC2 permite explícitamente que
`shared-domain` importe `libs/shared/util` y nada más.

- Si `assertNever` te sirve de verdad para un `switch` exhaustivo sobre una escala cerrada, o
  `isNonEmptyString` para una validación, **úsalos por el barrel** `@sport-itsm/shared-util` —
  nunca por ruta profunda — y entonces verifica la arista: `pnpm nx graph --file=tmp/graph.json` debe
  mostrar `shared-domain -> shared-util` **y ninguna otra**, y `pnpm nx lint shared-domain` debe
  pasar (es la dirección legal de la matriz, hoy sin probar sobre proyectos reales).
- **Si ninguno encaja, no fuerces un import para dibujar la arista.** Un helper usado por decoración
  es peor que un grafo vacío. Dilo en el informe y ya está.

#### Trampas ya pagadas — no las redescubras
- **`--name=` como flag.** El comando del Scope ya lo lleva. Con el posicional, el proyecto se
  llamaría `domain` y el AC1 (`pnpm nx test shared-domain`) fallaría contra un proyecto inexistente.
- **Jest 30.** Tras generar, `git diff package.json`: si el generador ha tocado `jest`, `ts-jest`,
  `@types/jest` o `jest-environment-node`, restaura los pines (29.7.0 / 29.4.12 / 29.5.14) y
  reinstala. Lo ideal es que `git diff package.json pnpm-lock.yaml` quede **vacío**: esta librería
  no añade ni una dependencia.
- **`tsconfig.base.json`** pasa de una entrada a exactamente **dos**. Ni una más, y no toques nada
  más del fichero.
- **`jest.config.ts`** con `displayName: 'shared-domain'`, `preset` y `coverageDirectory` a tres
  niveles. **No declares un target `test` en `project.json`** (lo infiere `@nx/jest`) y **no pongas
  `passWithNoTests`**.
- **`eslint.config.mjs` de proyecto**: las dos líneas que reexportan el raíz, igual que en
  `shared-util` y `apps/api`. Ni una regla añadida ni relajada.
- **Prettier en Windows.** `pnpm prettier --check .` marca ~50 ficheros que no has tocado: es
  `core.autocrlf=true` dejando CRLF en el árbol, condición preexistente que CI no ve. Comprueba
  **solo lo tuyo**: `pnpm prettier --check libs/shared/domain tsconfig.base.json`. No reformatees
  el repositorio.

#### Lo que NO debes tocar
- **`libs/shared/util`.** Si necesitas un helper que no existe, **no lo añadas ahí**: ese es otro
  ticket y otro Scope. Resuélvelo dentro de `shared-domain` o repórtalo.
- **`DomainEvent`, `EventPublisherPort`, `ClockPort`** (T-C10-09) y **`StateModel`** (T-C10-10).
  Están en el "Out of scope" del ticket con nombre y número. Ni un esqueleto, ni un `TODO`.
- **Cualquier agregado de contexto** (`Incident`, `User`, `Session`…), **`libs/shared/contracts`**
  (T-C10-11) y cualquier otra librería.
- **`eslint.config.mjs` raíz, `nx.json`, `tools/boundary-probes/`, `.github/workflows/`, `CLAUDE.md`
  y todo `docs/`.** El ticket no se edita ni se marca como hecho.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — `pnpm nx test shared-domain`: pega el resumen de Jest con el número de specs. Cada
   primitiva con sus cuatro casos del Scope: construcción válida, rechazo de entrada inválida,
   igualdad e inmutabilidad. Un "No tests found" no cumple.
2. **AC2 — pureza.** Pega la salida de
   `grep -rnE "from '(@nestjs|@angular|typeorm|rxjs|express|node:|fs|path|crypto)|new Date\(" libs/shared/domain/src`
   — debe estar vacía. Confirma que el único import externo, si lo hay, es
   `@sport-itsm/shared-util`. Y enseña `libs/shared/domain/tsconfig.lib.json` con `"types": []`.
3. **AC3** — demuestra con un test por primitiva que la construcción inválida **lanza**, y que el
   error es distinguible por tipo, no por mensaje.
4. **AC4 — tags y lint.** `pnpm nx show project shared-domain --json`: exactamente tres tags,
   `projectType: library`, targets `lint` y `test` (sin `build`: `--bundler=none`). Y
   `pnpm nx lint shared-domain` en verde.
5. **El grafo.** `pnpm nx graph --file=tmp/graph.json`, inspecciona nodos y aristas, borra el
   fichero, y di si este ticket ha dibujado la primera arista del workspace o si el grafo sigue
   vacío y por qué.
6. `pnpm nx show projects` → exactamente `shared-domain`, `shared-util`, `api-e2e`, `web-e2e`,
   `api`, `web`.
7. `pnpm verify:boundaries` → **10/10**, exit 0, y después `git diff tsconfig.base.json` muestra
   solo los dos alias. Ejecútalo **solo**, sin otro proceso corriéndolo a la vez.
8. `pnpm nx run-many -t lint test build` en verde — es lo que corre CI — con `shared-domain` en
   `lint` y en `test`.
9. `pnpm prettier --check libs/shared/domain tsconfig.base.json` pasa.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Si no cabe en la estimación
El ticket dice 3h para seis value objects con sus invariantes. Si al llegar al final ves que no
cabe, **no recortes los tests**: entrega las primitivas completas que quepan, di exactamente cuáles
faltan y por qué, y déjalo como hallazgo de estimación. Media docena de VOs sin cobertura de
invariantes es peor que cuatro bien cerrados.

#### Restricciones
- No modifiques nada bajo `docs/` ni `.claude/`. No instales dependencias. No hagas commit ni push.

#### Informa al terminar
- Ficheros creados y el comando generador exacto; qué borraste de la salida del generador.
- **Cada value object con su decisión de diseño**: cómo garantizas la inmutabilidad (`readonly`,
  constructor privado + factoría estática, `Object.freeze`… y por qué esa), cómo implementas
  `equals`, y las dos decisiones que el ticket deja abiertas — si `Identity` exige v7, y si el fin
  de `DateTimeRange` es inclusivo.
- Si usaste algo de `@sport-itsm/shared-util` y, si no, por qué no encajaba.
- La salida de las nueve verificaciones.
- Qué notas de estado quedan obsoletas (`ARCHITECTURE.md` §12.3 sobre el grafo y las suites,
  `readme.md` §2.3.6, la nota final de `PROJECT-STRUCTURE.md`): **repórtalas, no las corrijas**.
- Cualquier regla que hayas necesitado y no estuviera en PRD, DATA-MODEL ni ARCHITECTURE: dila como
  hallazgo para el Product Owner o el arquitecto, no la inventes dentro del código.

### Response:

Implementado ticket T-C10-08

</br>

**Prompt 9:**

Agent: Claude Code - Opus 5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-09.md ·
`libs/shared/domain` — `DomainEvent`, `EventPublisherPort` y `ClockPort`
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, y de nuevo **sin una línea de NestJS**: `platform:shared`, `type:domain`,
código puro. Manda `sport-itsm-engineering-principles` (inmutabilidad, ISP — puertos pequeños y
específicos, YAGNI), con `sport-itsm-architecture` para la regla de puertos y `sport-itsm-workflow`
para el cierre.

#### Precondición
T-C10-01 … T-C10-08 hechos y commiteados. Compruébalo antes de tocar nada:

    git log --oneline -1                 # 6ce1b5e o posterior
    git status --porcelain               # limpio
    pnpm nx show projects                # shared-domain, shared-util, api-e2e, web-e2e, api, web
    pnpm nx test shared-domain           # 5 suites, 66 tests, exit 0
    node -e "console.log(Object.keys(require('./tsconfig.base.json').compilerOptions.paths))"
                                         # exactamente dos alias

**`verify:boundaries` es de un solo proceso a la vez** (`libs/__boundary-probe` hace de lock). Este
ticket no crea proyecto ni toca tags, así que **no necesitas ejecutarlo**; si lo ejecutas, que no
haya nadie más corriéndolo, y si ves "another run is in flight", **espera** — no borres el
directorio.

#### Lo primero que tienes que entender: aquí NO se crea ninguna librería
A diferencia de T-C10-07 y T-C10-08, este ticket **añade a `libs/shared/domain`, que ya existe**.
No hay generador, no hay `project.json` nuevo, no hay alias nuevo en `tsconfig.base.json`, y
`pnpm nx show projects` debe seguir devolviendo **seis** proyectos al terminar. Si te descubres
ejecutando `nx g`, párate: te has equivocado de ticket.

Lo que ya existe y debes leer antes de escribir — `libs/shared/domain/src/index.ts`:
`DomainError`, `Identity`, `TicketReference`, `ImpactLevel`, `UrgencyLevel`, `Priority`,
`DateTimeRange` y sus errores tipados. Convenciones vigentes en esa librería, síguelas: constructor
privado + factoría estática, `readonly` + `Object.freeze(this)`, `equals`, errores que **se lanzan**
y se distinguen por `instanceof`, y ficheros nombrados según `PROJECT-STRUCTURE.md`
(`domain-event.ts`, `clock.port.ts`, y por extensión `event-publisher.port.ts`).

#### La contradicción que debes REPORTAR, no resolver
El `## Scope` del ticket pide `EventPublisherPort` en `libs/shared/domain`. **`ARCHITECTURE.md` §9
dice lo contrario**, con todas las letras:

> `DomainEvent` base type in `shared/domain`; **`EventPublisherPort` in each context's domain**; a
> single in-process dispatcher in `apps/api`.

Y el diagrama de clases de §6.2 lo dibuja **dentro del contexto `incident`**, no en el kernel.

La doctrina del repositorio zanja quién manda: `CLAUDE.md` §4.3 — *"The backlog is derived, never a
source"* —, y hoy mismo se aplicó ese criterio para corregir tickets contra `DATA-MODEL.md`. Pero
el caso tiene dos lados y quiero que los expongas antes de que nadie decida:

- **A favor del kernel** (lo que pide el ticket): la firma es `publish(events): void`, idéntica en
  todos los contextos y sin una palabra de vocabulario de ninguno — N copias idénticas es
  duplicación, no lenguaje ubicuo. Y el kernel **ya alberga un puerto**: `ClockPort` vive ahí por
  §9 y ADR-009, así que "el kernel no tiene puertos" no es una regla de este proyecto.
- **A favor de cada contexto** (lo que dice §9 y dibuja §6.2): es el patrón de ADR-003 — el
  contexto consumidor declara su puerto de salida en su propio dominio, como `SlaPolicyPort` —, y
  un puerto en el kernel lo convierte en dependencia de todos.

**Qué hacer:** implementa `DomainEvent`, `ClockPort` y `FixedClock`, que no están en disputa, y
**no coloques `EventPublisherPort` en ningún sitio hasta que se decida**. Repórtalo como hallazgo
con las dos citas (§9 línea 927 y el diagrama de §6.2), tu recomendación argumentada, y déjalo
fuera de la entrega. Entregar tres cuartos con el conflicto a la vista es mejor que entregar cuatro
cuartos habiendo elegido en silencio. Si al leerlo concluyes que el ticket tiene razón y §9 está
mal, esa es exactamente la misma respuesta: **repórtalo**, no lo escribas.

#### Diseño de cada pieza
- **`DomainEvent`** — nombre del evento, instante de ocurrencia, identidad del actor, identificador
  de correlación y payload inmutable.
  - **El instante se lo pasa el llamante; el evento NO lee el reloj.** Ese es el sentido entero de
    ADR-009, y el AC2 lo comprueba.
  - **El actor es `Identity`**, la primitiva que ya existe en esta misma librería. Sería la primera
    composición interna del kernel: úsala, no declares un `string`.
  - **El identificador de correlación: decide y justifica.** `DATA-MODEL.md` lo modela de dos
    formas distintas según la tabla — `correlation_event_id uuid` en `ntf_dispatch`, y un
    `correlation_id` de petición que viene de pino en otra. No son lo mismo. Di cuál modelas y por
    qué, y si tu respuesta es "hacen falta los dos", dilo en vez de fundirlos.
  - **Payload inmutable de verdad.** `readonly` no impide `event.payload.x = 1`, y `Object.freeze`
    es superficial. Decide hasta dónde llegas —congelación profunda, o una firma de tipo que lo
    haga irrepresentable— y **escribe el test que lo demuestra**, que es literalmente el AC1.
  - Tipado del payload: genérico o `Record<string, unknown>`. Elige pensando en quién lo consume
    (`RoleAssigned`/`RoleRevoked` de `US-C10-13`), y no construyas una jerarquía de eventos
    concretos: eso es de sus tickets.
- **`ClockPort`** — interfaz que devuelve un instante UTC. **Decide el tipo de retorno y
  justifícalo**: `DateTimeRange` (T-C10-08) recibe `Date` en su factoría, así que un `ClockPort`
  que devuelva `Date` compone sin conversión, y el AC2 presupone justamente eso al hablar del
  `new Date(` dentro del doble de test. Si prefieres milisegundos epoch, tendrás que decir cómo
  encaja con lo ya construido.
- **`FixedClock`** — doble determinista, **exportado desde el barrel** porque el ticket lo pide
  para tests de otros. Consecuencia que debes nombrar en el informe: eso lo convierte en superficie
  pública de producción. Y decide si además avanza (`advanceBy`) o solo devuelve un instante fijo —
  YAGNI dice lo segundo hasta que algo lo necesite; si añades lo primero, justifícalo.

#### Una trampa en el propio AC2 — no la resuelvas rompiendo tests
El AC2 dice: *"grepped for `new Date(` → the only matches are inside the ClockPort test double"*.
**Eso hoy ya es falso**, y no por tu culpa: `date-time-range.spec.ts` de T-C10-08 usa `new Date(...)`
para construir sus fixtures, que es la única forma de pasarle instantes a un VO que recibe `Date`.

Ejecuta el grep, **pega la salida completa** y desglósala honestamente: cuántas coincidencias en
código de producción (deben ser cero salvo el doble), cuántas en specs y por qué son legítimas.
**No borres ni reescribas los tests de T-C10-08 para que un grep salga verde** — eso sería degradar
cobertura para maquillar un criterio. Repórtalo como hallazgo sobre la redacción del AC, que
tendría que decir "fuera de los specs".

#### Lo que NO debes tocar
- **Ningún dispatcher, ningún suscriptor, ninguna persistencia.** El dispatcher in-process es de
  `apps/api` (**T-C10-55**) y persistir eventos como entradas de auditoría es de **C18**.
- **`StateModel`** es T-C10-10. Ni un esqueleto.
- **`libs/shared/util`**: si necesitas un helper que no existe, resuélvelo aquí o repórtalo.
- **`tsconfig.base.json`, `nx.json`, `eslint.config.mjs`, `tools/`, `docs/`, `.claude/`.** El ticket
  no se edita ni se marca como hecho.
- Ni una dependencia nueva: `git diff package.json pnpm-lock.yaml` debe quedar vacío.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — test que demuestra que el payload no se puede mutar; pega el resumen de Jest con el
   número total de tests (hoy son 66; debe subir).
2. **AC2** — `grep -rn "new Date(" libs/shared/domain/src` con el desglose honesto descrito arriba.
   Y el de framework:
   `grep -rnE "from '(@nestjs|@angular|typeorm|rxjs|express|node:|fs|path|crypto)" libs/shared/domain/src`
   debe estar vacío.
3. **AC3** — enseña que `ClockPort` (y `EventPublisherPort` si finalmente se coloca) son interfaces
   sin implementación: no `class`, no `abstract class` con cuerpo, cero imports de framework.
4. **AC4** — `pnpm nx test shared-domain` y `pnpm nx lint shared-domain`, ambos en verde.
5. `pnpm nx show projects` sigue devolviendo **seis**, y `git diff tsconfig.base.json` está vacío.
6. `pnpm nx run-many -t lint test build` en verde — es lo que corre CI.
7. `pnpm prettier --check libs/shared/domain` pasa. **No** ejecutes `prettier --check .`: marca ~50
   ficheros por CRLF (`core.autocrlf`), condición preexistente que CI no ve.
8. El barrel: enseña `src/index.ts` final y confirma que cada export nuevo es intencionado.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Informa al terminar
- Ficheros creados y modificados; qué queda fuera y por qué.
- **El hallazgo de `EventPublisherPort`** con las dos citas y tu recomendación argumentada.
- **El hallazgo sobre la redacción del AC2** y el desglose real del grep.
- Tus cuatro decisiones de diseño: tipo de retorno de `ClockPort`, forma del identificador de
  correlación, hasta dónde llega la inmutabilidad del payload, y si `FixedClock` avanza o no.
- La salida de las ocho verificaciones.
- Qué notas de estado quedan obsoletas: **repórtalas, no las corrijas**.

### Response:

Implementado ticket T-C10-09

</br>

**Prompt 10:**

Agent: Claude Code - Opus 5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-16.md ·
El data source de TypeORM y la configuración de su conexión
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, y este sí es backend de verdad: `apps/api`, `@nestjs/config`, TypeORM.
Aplica **`sport-itsm-backend`** (es el primer ticket de la rebanada donde manda), con
`sport-itsm-workflow` para el cierre. Es infraestructura, no dominio: aquí no se modela nada.

#### Por qué este ticket y por qué ahora
Es el **primero de la rebanada 1**, "un requester registra una incidencia y la ve" — 18 tickets, 41h,
que el Product Owner cortó verticalmente y el usuario aprobó. Los README de `C10` y `C1` llevan la
sección `## Delivery slices` con la secuencia completa. Lo que viene detrás de ti es `T-C10-17`
(cadena de migraciones), y la razón de que estén separados es que esta ficha hace la base de datos
**alcanzable** y la siguiente hace el esquema **reproducible**.

#### Precondición
    git log --oneline -1
    git status --porcelain      # limpio
    pnpm nx show projects       # seis proyectos
    pnpm nx test shared-domain  # 8 suites, 85 tests
    docker --version            # necesitas Docker corriendo para los AC

#### El ticket es el contrato
Léelo entero: su Scope es exhaustivo y trae tres notas de contexto que **no** son decorativas —
el servicio `postgres` ya existe y está fuera de alcance, el entrypoint del contenedor no puede
ganar un paso de migración, y la mitad desplegable es `T-C10-69`. Lee además:

- **`CLAUDE.md` §2, fila Database/ORM**: PostgreSQL 18, **TypeORM 1.1**, driver `pg` ^8,
  `synchronize` siempre `false`, cambios de esquema **solo** por migración. Y §3, la lista de
  comandos `pnpm typeorm`.
- **`CLAUDE.md` §3, "What NOT to do"**, backend: *no `synchronize: true`; no unconditional migration
  auto-run in staging/prod; no raw `process.env` in feature code*.
- `docker/docker-compose.dev.yml` — el servicio real, con `postgres:18.6`, `POSTGRES_DB:
  sport_itsm_dev`, `POSTGRES_USER`/`POSTGRES_PASSWORD`. **No lo toques**: es de `ci-cd-expert`.
- `apps/api/src/config/env.validation.ts` y `.env.example` — el patrón que tienes que extender, no
  reinventar: claves obligatorias, sin default en código, con mensaje que nombra la clave que falta.

#### Trampa 1 — las primeras dependencias nuevas desde el bootstrap
Verificado: **`typeorm` y `pg` no están instalados**. Serán las primeras dependencias de runtime que
entran desde `T-C10-01`, así que:

- **`package.json` no tiene un solo rango `^` ni `~`. Mantenlo así**: versiones exactas, incluidas
  las nuevas. CLAUDE.md pinea `major.minor` y el patch lo decide `package.json`, que es la única
  autoridad de lo instalado.
- Instala **solo** lo que el Scope pide. En particular, **no instales `@nestjs/typeorm`**: este
  ticket no registra ningún módulo de Nest para la base de datos, solo crea un data source y valida
  su configuración. Si crees que hace falta, párate y repórtalo.
- Ejecuta `pnpm why typeorm` y `pnpm why pg` al terminar y pega la salida: una sola copia de cada.
- `CLAUDE.md` §2 dice que TypeORM **requiere Node ≥ 22.13**, y `engines.node` de este repositorio
  dice `>=22.0.0 <23.0.0` — es **más laxo que el suelo real**. No lo cambies: tocar un pin es un
  cambio aprobado. **Repórtalo como hallazgo** para el arquitecto.

#### Trampa 2 — la que rompe CI y no se ve hasta que rompe
El AC te pide claves de conexión **obligatorias y sin default en código**: si falta una, el boot
aborta. Perfecto. Pero `apps/api-e2e` **arranca la API sin fichero `.env`**: su target suministra
él mismo `NODE_ENV` y `PORT` (mira `apps/api-e2e/project.json`), y ese comportamiento es un criterio
de aceptación de `T-C10-06` — *"Given a checkout with no `.env` file … Then it boots, because the
target supplies `NODE_ENV` and `PORT` itself"*.

En cuanto añadas claves obligatorias de base de datos, **ese arnés deja de arrancar**, y con él el
job `acceptance` de `.github/workflows/deploy-stage.yml`. Decide cómo lo resuelves —suministrarlas
también desde el target, o cualquier otra vía que no rompa la propiedad de "arranca sin `.env`"— y
**demuéstralo ejecutando `pnpm nx e2e api-e2e`**, no razonándolo. Si tu solución implica levantar
Postgres para los E2E, dilo explícitamente: eso cambia lo que CI necesita y es información que el
`ci-cd-expert` tiene que conocer.

#### Trampa 3 — el problema de diseño real: `ConfigService` vs la CLI de TypeORM
El Scope dice que los valores de conexión se resuelven **solo** a través de `ConfigService`, y el
AC7 exige que `process.env` aparezca únicamente dentro del módulo de configuración. Pero
`apps/api/src/data-source.ts` lo carga **la CLI de TypeORM fuera de Nest**, sin contenedor de DI y
sin aplicación arrancada — que es justo lo que el AC3 te hace ejecutar
(`pnpm typeorm migration:show -d apps/api/src/data-source.ts`).

Ahí está la tensión entera de este ticket, y tiene dos formas fáciles de resolverse mal: un data
source que lee `process.env` a pelo (viola el AC7) o uno que depende del contexto de Nest y **no se
puede cargar desde la CLI** (viola el AC3). Encuentra la forma que satisface ambos —reutilizar la
misma validación que ya existe, sin duplicar el esquema de claves— y **explica en el informe por qué
tu solución no es ninguna de las dos malas**.

#### Lo que NO debes tocar
- **`docker/**`** — ni el compose, ni el Dockerfile, ni el entrypoint. Son de `ci-cd-expert`, y el
  entrypoint tiene una nota explícita de que **no** puede ganar un paso de migración incondicional.
- **Ninguna migración** (`T-C10-17`), **ninguna entidad** (`T-C10-21` en adelante), ningún módulo
  de base de datos en Nest.
- `libs/**`, `docs/**`, `.claude/**`, `nx.json`, `eslint.config.mjs`. El ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. `docker compose -f docker/docker-compose.dev.yml up -d postgres` y comprueba que acepta
   conexiones; pega la versión que reporta el servidor (debe ser PostgreSQL 18).
2. `pnpm typeorm migration:show -d apps/api/src/data-source.ts` → conecta y lista vacío, sin error.
3. `grep -rn "process.env" apps/api/src` → solo dentro del módulo de configuración. Pega la salida.
4. `grep -rn "synchronize" apps/api/src` → solo `false`, sin ninguna ruta que lo ponga a `true`.
5. **Fail-fast**: quita una de las claves nuevas del entorno y arranca; pega el mensaje, que debe
   nombrar la clave que falta, igual que hace hoy con `NODE_ENV`.
6. **`pnpm nx e2e api-e2e` en verde** — la trampa 2. Si has tenido que tocar
   `apps/api-e2e/project.json`, dilo y explica por qué era la vía correcta.
7. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde.
8. `pnpm why typeorm` y `pnpm why pg`; `git diff package.json` sin un solo `^`.
9. `pnpm prettier --check apps/api` pasa. **No** ejecutes `prettier --check .`.
10. Los cuatro scripts `pnpm typeorm migration:generate|run|revert|show` declarados y ejecutables.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Informa al terminar
- Ficheros creados y modificados, y las dependencias añadidas con su versión exacta.
- **Cómo resolviste la tensión `ConfigService` / CLI de TypeORM**, y por qué no es ninguna de las
  dos soluciones malas.
- **Qué hiciste con `api-e2e`** y la salida real de su ejecución.
- La salida de las diez verificaciones.
- El hallazgo del suelo de Node (`engines` más laxo que el requisito de TypeORM) y cualquier otro
  que encuentres: **repórtalos, no los corrijas**.

### Response:

Implementado ticket T-C10-16

</br>

**Prompt 11:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-17.md ·
Cadena base de migraciones y la migración de arranque
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`. Aplica **`sport-itsm-backend`** y cierra con `sport-itsm-workflow`.
Es infraestructura de migraciones: aquí no se crea ninguna tabla, ninguna entidad ni ningún módulo
de Nest.

#### Por qué este ticket y por qué ahora
Es el **segundo de la rebanada 1** ("un requester registra una incidencia y la ve"). `T-C10-16`
dejó la base de datos **alcanzable** (commit `44a9699`); este ticket la deja **reproducible**: fija
la primera migración y la convención que heredan todas las demás. Detrás de ti vienen `T-C10-11` y
`T-C10-73`, y más tarde `T-C1-02`/`T-C1-04`, que crean el esquema `incident` y su primera tabla
**siguiendo la convención que tú escribas**. Lo que dejes aquí es lo que copiarán.

#### Precondición
    git log --oneline -1          # 44a9699 [T-C10-16] ...
    git status --porcelain        # limpio
    docker compose -f docker/docker-compose.dev.yml up -d postgres
    pnpm typeorm migration:show -d apps/api/src/data-source.ts   # conecta, lista vacía

Si la última falla, **para**: la precondición es `T-C10-16`, no algo que arregles tú.

#### El ticket es el contrato
Léelo entero, incluida la sección *Defect fixed here*. Lee además:

- `apps/api/src/data-source.ts` — **ya declara** el glob de migraciones
  (`join(__dirname, 'migrations', '*.{ts,js}')`), con un comentario que dice que llegan con este
  ticket. Tu trabajo en ese fichero es **verificar** que cumple el AC del glob único `.ts`/`.js`
  sin rama por entorno, no reescribirlo. Si lo tocas, justifícalo.
- `tools/typeorm.cjs` y los scripts `migration:*` de `package.json` — cómo se ejecuta la CLI.
- `docs/product/DATA-MODEL.md` §3.1 y §3.1.1 (clave primaria `DEFAULT uuidv7()`, suelo PG ≥ 18),
  §6/§20.1 (esquema **`iam`**) y §19 (el orden de verificación: `SELECT uuidv7();` antes de generar
  nada, y "las migraciones generadas son un borrador, no una autoridad").
- `.claude/skills/ci-cd/references/gotchas.md`, *TypeORM CLI entity globs must match what the
  image ships* — la regla que tu nota de convención tiene que dejar escrita para `T-C10-69`.

#### Trampa 1 — cuántos esquemas crea la migración de arranque
El Scope dice "the per-context schema namespaces of DATA-MODEL, **starting with** the `iam`
schema". Leído a la ligera, eso son los diez esquemas de `DATA-MODEL.md`. **No lo son.**
`T-C1-02` lo resuelve: *"every other context's namespace is that context's own cost"*, y su propio
Scope incluye la migración que crea el esquema `incident`. Si tú creas `incident` aquí, la
migración de `T-C1-02` choca o queda vacía.

La migración de arranque crea **`iam` y las dos extensiones, y nada más**. Ningún otro esquema.

#### Trampa 2 — el nombre del esquema, otra vez
El esquema se llama **`iam`**. `identity_access` es el slug del contexto en Nx, nunca un nombre de
Postgres. El ticket lo corrigió en origen, pero `T-C1-02` (línea 19) **todavía cita** la redacción
antigua: *"starting with the `identity_access` schema"*. No edites ese ticket — está fuera de tu
alcance —: **repórtalo como hallazgo** para que se regenere.

#### Trampa 3 — `down` y las extensiones
El `up` usa `CREATE EXTENSION IF NOT EXISTS`; el `down` tiene que borrarlas (el ticket lo exige).
Eso tiene un filo: si la extensión **ya existía** antes de la migración, el `down` borra algo que
no creó. En la base de desarrollo, recién creada, no pasa; pero razónalo, decide (y di en el informe
qué decidiste y por qué), y déjalo escrito en la nota de convención si afecta a migraciones
futuras. No añadas una tercera extensión: el AC exige exactamente dos. Tampoco `uuid-ossp` ni
`pgcrypto`: `uuidv7()` es core en PostgreSQL 18.

#### Trampa 4 — la convención de nombres de TypeORM
El fichero es `<timestamp>-<PascalCaseName>.ts`; la clase, por convención de TypeORM,
`<PascalCaseName><timestamp>` e implementa `MigrationInterface`. Escríbela **a mano** con SQL
explícito (`queryRunner.query`), no con `migration:generate`: no hay entidades, y aunque las
hubiera, el AC pide SQL explícito revisable. Nada de `synchronize`.

#### Lo que NO debes tocar
- **`docker/**`**, el entrypoint y el `Dockerfile` — son de `ci-cd-expert`. Que la migración viaje
  dentro de la imagen desplegada es `T-C10-69`; si ves que el build de webpack de `apps/api` no
  empaqueta `migrations/` y que `__dirname` apunta a otro sitio en `dist/`, **repórtalo**, no lo
  arregles.
- Ninguna tabla (`T-C10-21`, `T-C10-36`, `T-C10-44`), ninguna entidad, ningún módulo de Nest,
  ningún otro esquema (trampa 1).
- `libs/**`, `docs/**`, `.claude/**`, `nx.json`, `eslint.config.mjs`, `package.json` (no hacen falta
  dependencias nuevas; si crees que sí, párate y repórtalo). El ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. `SELECT version();` y `SELECT uuidv7();` contra el Postgres de desarrollo — pega ambas salidas
   (DATA-MODEL §19 paso 3).
2. **Base vacía de verdad**: parte de una base sin la migración aplicada y sin `iam` ni las
   extensiones. Pega el estado inicial (`\dn` y `\dx`, o las consultas equivalentes a
   `pg_namespace`/`pg_extension`).
3. `pnpm typeorm migration:run -d apps/api/src/data-source.ts` → éxito; pega la salida y el estado
   después (`iam` existe, `citext` y `pg_trgm` instaladas, una fila en la tabla `migrations`).
4. `pnpm typeorm migration:revert -d apps/api/src/data-source.ts` → pega el estado después: debe ser
   **idéntico** al del punto 2, sin residuos.
5. La secuencia run → revert → run, **dos veces seguidas**, con el mismo resultado ambas veces.
   Pega la salida, no un resumen.
6. `pnpm typeorm migration:show -d apps/api/src/data-source.ts` lista la migración como aplicada.
7. `grep -rn "synchronize" apps/api/src` → solo `false`.
8. `pnpm nx e2e api-e2e` sigue en verde (su target ya apunta al Postgres de desarrollo desde
   `T-C10-16`).
9. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde.
10. `pnpm prettier --check apps/api` pasa. **No** ejecutes `prettier --check .`.

Deja la base de desarrollo con la migración **aplicada** al terminar. Un criterio que no has
ejecutado se reporta como no ejecutado, jamás como pasado.

#### Informa al terminar
- Ficheros creados y modificados, y si tocaste `data-source.ts`, por qué.
- El contenido literal de la migración (`up` y `down`) y de la nota de convención.
- Qué decidiste sobre el `down` de las extensiones (trampa 3) y por qué.
- La salida de las diez verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo la redacción `identity_access` que
  sobrevive en `T-C1-02`, y el estado del empaquetado de migraciones en el build de `apps/api` para
  `T-C10-69`.

### Response:

Implementado ticket T-C10-17

</br>

**Prompt 12:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-11.md ·
`libs/shared/contracts` — superficie base de DTOs, enums y códigos de error
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, pero **aquí no se escribe NestJS ni Angular**: es `platform:shared`,
`type:contracts`, **solo tipos**. Manda `sport-itsm-architecture` (ADR-007, la fila `contracts` de
la matriz §5.3), con `sport-itsm-engineering-principles` (YAGNI, nombres del lenguaje ubicuo) y
`sport-itsm-workflow` para el cierre. No apliques idiomas de `sport-itsm-backend`.

#### Por qué este ticket y por qué ahora
Es el tercero de la rebanada 1 ("un requester registra una incidencia y la ve"). Es **el único
acoplamiento permitido entre frontend y backend** (ADR-007, `ARCHITECTURE.md` §3.2): el `POST` de
`T-C1-08`, el data-access de `T-C1-10` y el envelope de error que mostrará el formulario de
`T-C1-09` se escriben contra lo que dejes aquí. Detrás de ti viene `T-C10-73` (dispatcher de
eventos), que no depende de esta librería.

#### Precondición
    git status --porcelain                   # limpio antes de empezar
    pnpm nx show projects                    # EXACTAMENTE: shared-domain, shared-util, api-e2e, web-e2e, api, web
    node -e "console.log(Object.keys(require('./tsconfig.base.json').compilerOptions.paths))"
                                             # exactamente ['@sport-itsm/shared-domain', '@sport-itsm/shared-util']
    pnpm verify:boundaries                   # todas las sondas en verde, exit 0 — anota el número

**El arnés de sondas es de un solo proceso a la vez.** `libs/__boundary-probe` funciona como lock:
si ves "another run is in flight", **espera** — no borres el directorio.

Este ticket no necesita base de datos ni Docker.

#### El ticket es el contrato
Lee `docs/backlog/C10/tickets/T-C10-11.md` entero; su "Out of scope" es vinculante. Lee además, y
no de memoria:

- **`ARCHITECTURE.md` §3.2** — la fila *Errors*: los errores de dominio se mapean a un envelope
  **estable y declarado en el contrato**; *"error codes are part of the contract, error **text** is
  not"*, y el cliente mapea códigos a claves de Transloco. Esa frase decide la forma del envelope.
- **`ARCHITECTURE.md` §5.3** — fila `type:contracts`: solo `contracts` y `util`. Y la regla de
  plataforma: `platform:shared` solo alcanza `platform:shared`.
- **`ARCHITECTURE.md` §5.5** — el comando generador completo y los pasos posteriores.
- **ADR-007** en `ARCHITECTURE.md` §10.
- `libs/shared/util` y `libs/shared/domain` — cómo quedaron andamiadas las dos librerías hermanas.
  Imita su forma.

#### Trampa 1 — el comando del ticket está incompleto
El Scope del ticket trae `pnpm nx g @nx/js:lib --name=shared-contracts --directory=... --tags=...`
y **nada más**. Con eso, `@nx/js:lib` usa `--bundler=tsc` (le da `package.json` propio y un target
`build` que CI ejecutará) y te puede ofrecer Vitest. **Usa el comando completo de
`ARCHITECTURE.md` §5.5**, bloque *Shared kernel*, primera línea: `--importPath`, `--bundler=none`,
`--unitTestRunner=jest`, `--linter=eslint`, `--testEnvironment=node`, `--useProjectJson=true`.
Ejecútalo primero con `--dry-run --no-interactive` y revisa la lista. Después, los pasos que el
generador no sabe hacer: `"types": []` en `tsconfig.lib.json` (§12, *layer purity*) y borrar la
unidad de ejemplo.

#### Trampa 2 — "pagination and correlation-identifier shapes" no están definidas en ningún sitio
El Scope pide, además del envelope y del enum, *"the pagination and correlation-identifier
shapes"*, citando `ARCHITECTURE.md` §3.2. **§3.2 no las define**: la única mención de correlación
en el documento es la de logs de `nestjs-pino` (§9). Búscalas en `PRD.md`, `DATA-MODEL.md` y
`ARCHITECTURE.md` antes de decidir, y cita lo que encuentres.

Si no encuentras nada normativo, declara la forma **mínima y convencional** — sin campos
especulativos —, documenta en el propio barrel o en un comentario de qué se deriva cada campo, y
**repórtalo como hallazgo** para el arquitecto: el ticket cita una fuente que no dice lo que el
ticket le atribuye. Para la paginación, en concreto: no inventes ordenación, filtros ni cursores si
nada los pide; una página de resultados con su total y sus parámetros de petición basta. Para el
identificador de correlación: decide si es un tipo (alias con nombre) y/o el nombre de la cabecera
HTTP como constante, y justifícalo.

#### Trampa 3 — "const enums" y el cliente Angular
El AC admite "type declarations and `const` enums". Ojo: `apps/web/tsconfig.json` tiene
`"isolatedModules": true`, y el builder de Angular compila fichero a fichero. Un `export const enum`
consumido desde otra librería por alias de ruta puede comportarse distinto que un `enum` normal o
que un objeto `as const` + tipo unión. Elige **una** representación para el enum de códigos de
error y **demuestra** que ambos lados pueden consumirla: un import temporal desde `apps/web` y otro
desde `apps/api` que usen un **valor** del enum (no solo el tipo), con `pnpm nx build web` y
`pnpm nx build api` en verde. **Revierte ambos imports después.** Justifica la elección en el
informe. Si eliges `as const`, verifica que eso sigue cumpliendo el AC "no runtime logic beyond type
declarations and const enums" y dilo explícitamente: es un objeto literal congelado, no lógica, pero
es tu responsabilidad argumentarlo, no la del revisor.

#### Trampa 4 — el enum de códigos de error es exactamente cuatro
`UNAUTHENTICATED`, `FORBIDDEN`, `VALIDATION_FAILED`, `NOT_FOUND`. Ni `CONFLICT`, ni
`INTERNAL_ERROR`, ni `LICENSE_REQUIRED`, por muy obvios que parezcan: cada ticket posterior añade
los suyos. Y ningún contrato de identidad (sign-in, asignación de roles…) ni de incidencia: son de
`T-C10-27`, `T-C10-48`, `T-C10-52`, `T-C10-60` y de `C1`.

Si el envelope necesita el detalle de un fallo de validación (qué campo, qué regla), recuerda §3.2:
**el texto no es contrato**. Un detalle por campo con un código máquina sí; un mensaje traducido,
no.

#### Trampas ya pagadas — no las redescubras
- **`--name=` como flag**, nunca posicional (ya está en §5.5).
- **Jest 30.** Tras generar, `git diff package.json`: si el generador ha tocado `jest`, `ts-jest`,
  `@types/jest` o `jest-environment-node`, restaura los pines exactos y reinstala. Lo ideal es que
  `git diff package.json pnpm-lock.yaml` quede **vacío**: esta librería no añade dependencias. Y
  nada de rangos `^`/`~`.
- **`tsconfig.base.json`** pasa de dos entradas a exactamente **tres**. No toques nada más.
- **`jest.config.ts`** con `displayName: 'shared-contracts'`. **No declares un target `test`** en
  `project.json` (lo infiere `@nx/jest`) y **no pongas `passWithNoTests`**. Una librería de solo
  tipos tiene poco que testear en runtime: si no escribes ningún spec, decide qué hacer con el
  target `test` para que `pnpm nx run-many -t test` no se ponga rojo por "No tests found", y
  justifícalo (un spec que verifique que el enum tiene exactamente los cuatro valores es legítimo;
  un spec de decoración, no).
- **`eslint.config.mjs` de proyecto**: las dos líneas que reexportan el raíz, como en `shared-util`.
  Ni una regla añadida ni relajada.
- **Prettier en Windows**: no hay `.gitattributes` y `core.autocrlf=true` deja CRLF en el árbol.
  Comprueba **solo lo tuyo**: `pnpm prettier --check libs/shared/contracts tsconfig.base.json`. No
  reformatees el repositorio.

#### Lo que NO debes tocar
- `libs/shared/util`, `libs/shared/domain`, `apps/**` (salvo los imports temporales de la trampa 3,
  revertidos), el `eslint.config.mjs` raíz, `nx.json`, `tools/boundary-probes/`, `.github/`,
  `docker/`, `CLAUDE.md`, `docs/**`, `.claude/**`, `prompts.md`. El ticket no se edita.
- Ningún DTO con decoradores de `class-validator`: esos viven en `apps/api` y los crea el ticket que
  los necesite.

#### Verificación — ejecútala, no la afirmes
1. **AC1 — pureza.** `grep -rnE "class-validator|@nestjs|@angular|typeorm" libs/shared/contracts/src`
   → vacío. Pega la salida.
2. **AC2 — sin lógica.** Enseña el contenido completo de `libs/shared/contracts/src` y
   `tsconfig.lib.json` con `"types": []`.
3. **AC3 — la sonda.** Añade un import de `@sport-itsm/shared-contracts` en `libs/shared/domain`,
   ejecuta `pnpm nx lint shared-domain` y pega el error de `@nx/enforce-module-boundaries`. **Revierte
   la sonda** y vuelve a ejecutar `pnpm nx lint shared-domain` en verde. `git diff libs/shared/domain`
   debe quedar vacío.
4. **AC4 — tags y lint.** `pnpm nx show project shared-contracts --json`: exactamente los tres tags
   `platform:shared`, `scope:shared`, `type:contracts`; `projectType: library`; sin target `build`.
   Y `pnpm nx lint shared-contracts` en verde.
5. **Trampa 3** — `pnpm nx build web` y `pnpm nx build api` en verde **con** los imports temporales de
   un valor del enum; pega las salidas relevantes; revierte; `git diff apps` vacío.
6. `pnpm nx show projects` → exactamente siete: los seis de antes más `shared-contracts`.
7. `pnpm verify:boundaries` → el mismo número de sondas que en la precondición, todas en verde.
   Ejecútalo **solo**. Después, `git diff tsconfig.base.json` muestra solo el alias nuevo.
8. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde.
9. `pnpm prettier --check libs/shared/contracts tsconfig.base.json` pasa.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push.

#### Informa al terminar — en español
- El comando generador exacto y qué borraste o ajustaste de su salida.
- El contenido literal de cada tipo exportado, y por cada uno **de dónde sale** (sección y documento)
  o, si no sale de ningún sitio, que es una decisión tuya y por qué es la mínima.
- La representación elegida para el enum (trampa 3) y la prueba de que ambos lados la consumen.
- Qué hiciste con el target `test`.
- La salida de las nueve verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo, que `ARCHITECTURE.md` §3.2 no define las
  formas de paginación y correlación que el ticket le atribuye, que el comando del Scope del ticket
  está incompleto respecto a §5.5, y qué notas de estado quedan obsoletas (`ARCHITECTURE.md` §12.3,
  `PROJECT-STRUCTURE.md`).

### Response:

Implementado ticket T-C10-11

</br>

**Prompt 13:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C10/tickets/T-C10-73.md ·
Dispatcher genérico de eventos post-commit, extraído de `T-C10-55`
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`. Aplica **`sport-itsm-backend`** (NestJS 11, DI por tokens, Logger),
`sport-itsm-architecture` (ADR-003, ADR-008, §5.4 y §6.3: `apps/api` es la raíz de composición) y
`sport-itsm-engineering-principles` (errores tipados, YAGNI). Cierra con `sport-itsm-workflow`.

#### Por qué este ticket y por qué ahora
Es el cuarto de la rebanada 1 ("un requester registra una incidencia y la ve"). `T-C1-07`
(`LogIncidentUseCase`) tiene un AC que exige que un suscriptor que lanza al manejar
`IncidentLogged` no afecte a la incidencia ya persistida: necesita **este** mecanismo, y no puede
sacarlo de `T-C10-55`, que está escrito contra eventos de roles. Aquí se construye el mecanismo
**genérico**; cada consumidor cablea sus propios eventos en su propio ticket.

#### Precondición
    git status --porcelain                 # limpio
    pnpm nx show projects                  # 7: shared-contracts, shared-domain, shared-util, api-e2e, web-e2e, api, web
    pnpm nx test shared-domain             # verde
    pnpm verify:boundaries                 # todas las sondas en verde — anota el número

Este ticket no necesita la base de datos.

#### El ticket es el contrato
Léelo entero; su "Out of scope" es vinculante. Lee además, y no de memoria:

- `libs/shared/domain/src/lib/event-publisher.port.ts` — el puerto **ya existe** (`T-C10-09`):
  `publish(events: readonly DomainEvent<object>[]): void`. Su comentario dice que publicar después
  del commit es **responsabilidad del caso de uso, no del puerto**, y que el dispatcher vive en
  `apps/api`.
- `libs/shared/domain/src/lib/domain-event.ts` — `DomainEvent` lleva `name`, `occurredAtEpochMs`,
  `actor`, **`correlationId`** y `payload`, congelado. El identificador de correlación que el AC2
  pide loguear **ya viaja en el evento**.
- `ARCHITECTURE.md` **ADR-008** y §5.4 (el bloque sobre por qué `audit` y `notification` no tienen
  puerto) y §6.3 (raíz de composición).
- `apps/api/src/app/app.module.ts`, `apps/api/src/main.ts`, y el arnés `apps/api-e2e` (su
  `project.json`, `harness-smoke.feature` y sus step definitions).

#### Trampa 1 — no hay transacción todavía, y el AC habla de commit y rollback
Hoy no existe ningún `TypeOrmModule`, ningún repositorio y ninguna unidad de trabajo: el primer
commit real llega con `T-C1-06`/`T-C1-07`. Los AC1 y AC3 (despachado "strictly after the commit";
con rollback, "no event reaches any subscriber") hay que demostrarlos sin esa infraestructura.

- **No inventes** un `UnitOfWorkPort` en `libs/shared/domain`, ni un módulo de TypeORM, ni un
  decorador `@Transactional`. Eso es diseño de otro ticket y cambiaría el kernel compartido.
- El puerto ya fija el reparto: el caso de uso hace commit y **después** llama a `publish`. Demuestra
  AC1/AC3 con un **caso de uso de prueba genérico** (solo en código de test) que modela commit y
  rollback, y comprueba el orden y la ausencia de despacho tras el rollback.
- Decide y justifica si `publish` despacha **en el acto** (síncrono, dentro de la llamada) o lo
  **difiere** (microtask/`setImmediate`). Las dos tienen consecuencias: diferir aleja el despacho
  del commit pero hace que el AC2 ("the caller receives success") y los tests dependan del
  scheduling. Elige una y di por qué.
- **Repórtalo como hallazgo**: la frontera de commit real la pondrá `T-C1-07`, y ese ticket tendrá
  que garantizar que `publish` se llama fuera de la transacción.

#### Trampa 2 — `publish(): void` y suscriptores asíncronos
La firma es síncrona y devuelve `void`. Un suscriptor `async` que **rechaza** su promesa no lanza
dentro de tu `try/catch`: acaba como *unhandled rejection*, y en **Node 22 eso tumba el proceso**.
El aislamiento del AC2 tiene que cubrir **las dos** formas de fallo (throw síncrono y promesa
rechazada), y un suscriptor que falla **no** puede impedir que los demás suscriptores del mismo
evento lo reciban. Demuéstralo con tests de ambos casos y de varios suscriptores.

No cambies la firma de `EventPublisherPort` ni toques `libs/shared/domain`. Si crees que la firma
debe cambiar, **para y repórtalo**.

#### Trampa 3 — el escenario API-E2E necesita algo que lo dispare
El Scope pide un escenario API-E2E con un evento de prueba genérico y un suscriptor que falla. Hoy la
API no tiene ninguna ruta, y `harness-smoke.feature` recuerda que `T-C10-06` prohíbe añadir rutas
para "poner verde" ese smoke. Para disparar el dispatcher por HTTP necesitas algo que **no puede
existir en producción**.

Decide y justifica la vía. Si es un módulo/ruta solo de test:
- se registra **únicamente** con `NODE_ENV=test` (el que ya pone el target de `api-e2e`), decidido
  en la raíz de composición, sin `process.env` fuera del módulo de configuración (usa
  `ConfigService`/el entorno validado);
- **demuestra** que con `NODE_ENV=development` y `production` la ruta responde **404**;
- vive claramente marcado como test harness, no mezclado con código de producción.

Si concluyes que la vía correcta es otra (p. ej. un test de integración de Nest con
`@nestjs/testing` en vez de Cypress), justifícalo contra `CLAUDE.md` §2 (E2E con
Cypress/Cucumber) y **repórtalo como desviación**, no la escondas. Recuerda que el aislamiento de
Cypress en esta máquina exige `unset ELECTRON_RUN_AS_NODE;` en la misma llamada Bash.

#### Trampa 4 — genérico de verdad
- La costura de registro se indexa por **nombre de evento** (`DomainEvent.name` es un `string`; no
  hay subclases por evento). Tipa el payload genéricamente para que un consumidor futuro registre
  `IncidentLogged` con su payload sin que este código lo conozca.
- El token de inyección para `EventPublisherPort` (una interfaz no puede ser token) y la costura de
  registro viven en `apps/api`. **No generes ninguna librería nueva** para esto; si crees que hace
  falta, para y repórtalo.
- AC4: ni `identity`, ni `role`, ni `Role`, ni `incident`, ni `Incident` en el código del
  dispatcher. Nombres de test: `TestEvent`, `FailingTestSubscriber`, o similares.
- **Nada de reintentos**: ADR-008 menciona "retry" como mitigación de audit, pero el ticket no lo
  pide. No lo implementes; menciónalo como hallazgo si lo ves necesario para `C18`.

#### Logging
`nestjs-pino` **no está instalado** (llega con `T-C10-28`). Usa el `Logger` de `@nestjs/common`,
nunca `console.log`. El log del fallo incluye el `correlationId` del evento, el nombre del evento y
el error, y nunca el `payload` completo (puede contener datos personales). No instales dependencias.

#### Lo que NO debes tocar
- `libs/**` (incluido `EventPublisherPort` y `DomainEvent`), `docker/**`, `.github/**`, `docs/**`,
  `.claude/**`, `prompts.md`, `package.json`. El ticket no se edita.
- Ningún evento concreto, ningún caso de uso real, nada de `incident` ni de roles.

#### Verificación — ejecútala, no la afirmes
1. `pnpm nx test api` — pega el resumen: tests de despacho único, orden tras commit, nada tras
   rollback, suscriptor que lanza (síncrono), suscriptor que rechaza (asíncrono), varios suscriptores
   con uno que falla, y el log con `correlationId`. Ya no puede pasar por `passWithNoTests`.
2. **AC4**: `grep -rniE "identity|role|incident" <ficheros del dispatcher>` → vacío. Pega la salida.
3. **Trampa 3**: `unset ELECTRON_RUN_AS_NODE; pnpm nx e2e api-e2e` en verde con el escenario nuevo
   y el smoke existente. Y la prueba de que la ruta de test responde 404 fuera de `NODE_ENV=test`.
4. Ninguna *unhandled rejection* en la salida de los tests (búscala explícitamente).
5. `grep -rn "process.env" apps/api/src` → solo dentro de `apps/api/src/config`.
6. `grep -rn "console.log" apps/api/src` → vacío.
7. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde.
8. `pnpm verify:boundaries` → mismo número de sondas que en la precondición, en verde.
9. `pnpm prettier --check` sobre los ficheros que has creado o tocado (no `prettier --check .`).

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push.

#### Informa al terminar — en español
- Ficheros creados y modificados.
- El diseño: token, costura de registro, dispatcher, y cómo los usará `T-C1-07` (un ejemplo de
  registro de dos líneas, sin escribirlo en código).
- Tus decisiones de las trampas 1, 2 y 3, con su porqué.
- La salida de las nueve verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo, la frontera de commit que hereda
  `T-C1-07`, la cuestión del reintento de ADR-008, y qué debe ajustar `T-C10-55` ahora que el
  mecanismo existe.

### Response:

Implementado ticket T-C10-73

</br>

**Prompt 14:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como sport-itsm-architect e implementa UN SOLO ticket: docs/backlog/C1/tickets/T-C1-01.md ·
Andamiar las seis librerías del contexto `incident` con sus tres ejes de etiquetas
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
El ticket tiene `agent: —`: son seis librerías de **las dos plataformas**, así que no es de ningún
agente de desarrollo. Es andamiaje de estructura, y eso es del arquitecto. Aplica
**`sport-itsm-architecture`** (contextos, tags, matriz §5.3), con `sport-itsm-workflow` para el
cierre. **Aquí no se escribe ni una línea de dominio, caso de uso, componente ni migración.**

#### Por qué este ticket y por qué ahora
Es el primero del bloque 3 de la rebanada 1 ("un requester registra una incidencia y la ve"):
`T-C1-01` → `02` → `03` → `05` → `06` → `04`. Nada de `incident` compila hasta que existan estas
seis librerías, y todo lo que viene detrás (agregado, referencia, caso de uso, endpoint, formulario)
vive dentro de ellas.

#### Precondición
    git status --porcelain                   # limpio (salvo prompts.md)
    pnpm nx show projects                    # EXACTAMENTE 7: shared-contracts, shared-domain, shared-util, api-e2e, web-e2e, api, web
    node -e "console.log(Object.keys(require('./tsconfig.base.json').compilerOptions.paths))"
                                             # exactamente los 3 alias shared-*
    pnpm verify:boundaries                   # 10/10, exit 0

**El arnés de sondas es de un solo proceso a la vez.** `libs/__boundary-probe` funciona como lock:
si ves "another run is in flight", **espera** — no borres el directorio.

#### El ticket es el contrato
Léelo entero; su "Out of scope" es vinculante (el esquema `incident` y el `IncidentModule` son
`T-C1-02`). Lee además, y no de memoria:

- **`ARCHITECTURE.md` §5.5** — los **seis comandos exactos**, bajo "Backend hexagon for one context"
  y "Frontend slice for the same context". El ticket solo lista las etiquetas; **los flags de §5.5 no
  son opcionales** (`--name`, `--importPath`, `--bundler=none`, `--unitTestRunner=jest`,
  `--testEnvironment=node`, `--useProjectJson=true` en las de TypeScript; `--prefix=incident`,
  `--style=scss`, `--changeDetection=OnPush`, `--standalone --skipModule` en las de Angular).
  Ejecuta **cada uno primero con `--dry-run --no-interactive`** y revisa la lista.
- **Los dos pasos posteriores de §5.5**: `"types": []` en `tsconfig.lib.json` de
  **`incident-domain` e `incident-application`** (no en `incident-infrastructure`, que hará I/O; las
  de Angular no llevan entrada `types`), y **borrar la unidad de ejemplo** de las seis (en las de
  Angular, el componente de ejemplo con su `.html`, `.scss` y `.spec.ts`).
- **`ARCHITECTURE.md` §5.3** (matriz de tipos, regla de scope, regla de plataforma) y **§8**
  (`incident` nunca importa `sla`).
- `libs/shared/util`, `libs/shared/domain` y `libs/shared/contracts` — cómo quedaron andamiadas las
  hermanas. Imita su forma.
- `tools/boundary-probes/verify.mjs` — cómo el arnés crea proyectos temporales etiquetados y los
  retira. Te servirá para la trampa 2.

#### Trampa 1 — seis librerías vacías y el target `test`
El ticket prohíbe cualquier código, así que las seis quedan **vacías**. Jest sin ningún spec sale
con "No tests found" y **código 1**, y el AC6 exige `pnpm nx run-many -t lint test` en verde.

- Un spec de decoración (`expect(true).toBe(true)`) **no** es aceptable.
- La vía razonable es `passWithNoTests: true` en el `jest.config.ts` de cada una de las seis, con un
  comentario de una línea que diga que se retira cuando llegue el primer código (`T-C1-03` en
  `incident-domain`, etc.). Es lo que ya hacen `apps/api` y `apps/web`. Si eliges otra vía,
  justifícala.
- **No declares un target `test` en `project.json`** (lo infiere `@nx/jest`).

#### Trampa 2 — las sondas del ticket apuntan a una librería que no existe
- **AC3** (`incident-domain` → `incident-infrastructure`): falla por la **matriz de tipos**. Directo.
- **AC4** (`incident-domain` → `libs/sla/domain`): **`libs/sla/domain` no existe.** No generes el
  contexto `sla`. Crea un proyecto **temporal** etiquetado `platform:backend,scope:sla,type:domain`
  (a mano o como hace el arnés), añade su alias, importa desde `incident-domain`, pega el error de la
  **regla de scope**, y retira el proyecto, su alias y la sonda. Al final `tsconfig.base.json` debe
  tener exactamente **nueve** alias: los tres `shared-*` y los seis `incident-*`.
- **AC5** (`incident-application` → `incident-feature`): el AC dice que falla por la **regla de
  plataforma**, pero esa importación viola **también** la matriz de tipos (`application` no puede
  depender de `feature`). Pega **todos** los mensajes que emita `@nx/enforce-module-boundaries` y di
  explícitamente si aparece el de plataforma. Si solo aparece el de tipos, el AC no se ha demostrado:
  dilo y repórtalo como hallazgo, no lo fuerces.
- Revierte **las tres** sondas. `git diff libs/incident` sin rastro de ellas, y
  `pnpm nx lint incident-domain incident-application` en verde después.

#### Trampas ya pagadas — no las redescubras
- **`--name=` como flag**, nunca posicional (§5.5 punto 1).
- **`@nx/angular:library` escribe un bloque `generators` en `nx.json`** la primera vez que se usa
  (§5.5 punto 3). Es esperado: revisa el diff de `nx.json`, confirma que **solo** añade ese bloque y
  que sus valores coinciden con los flags que pasaste, y dilo en el informe. Nada más en `nx.json`.
- **Jest 30 / versiones.** Tras generar, `git diff package.json pnpm-lock.yaml` debe quedar
  **vacío**: `@nx/angular`, `jest-preset-angular` y todo lo necesario ya están instalados. Si un
  generador añade o cambia una dependencia, restaura el pin exacto; nada de `^`/`~`.
- **`eslint.config.mjs` de cada proyecto**: el que genere Nx, reexportando el raíz, sin reglas
  añadidas ni relajadas. Las de Angular llevan el prefijo `incident` para selectores.
- **Prettier en Windows**: comprueba solo lo tuyo:
  `pnpm prettier --check libs/incident tsconfig.base.json nx.json`. No `prettier --check .`.

#### Lo que NO debes tocar
- `libs/shared/**`, `apps/**`, el `eslint.config.mjs` raíz, `tools/boundary-probes/`, `.github/`,
  `docker/`, `package.json`, `CLAUDE.md`, `docs/**`, `.claude/**` (salvo tu propia memoria de
  agente), `prompts.md`. El ticket no se edita.
- Ningún agregado, puerto, caso de uso, entidad, componente, servicio, migración ni módulo de Nest.
- Ningún otro contexto (`sla` incluido): la sonda del AC4 es temporal.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — `pnpm nx show projects`: exactamente 13 (los 7 de antes + los 6 `incident-*`), y
   `ls libs/incident` muestra exactamente `application data-access domain feature infrastructure ui`.
2. **AC2** — `pnpm nx show project <p> --json` de las seis: pega sus tags (exactamente tres, los del
   ticket), `projectType: library`, sin target `build`.
3. **AC3, AC4, AC5** — el error de lint de cada sonda, literal, y la reversión de cada una.
4. `"types": []` en `tsconfig.lib.json` de `incident-domain` e `incident-application`; enséñalos.
   Y ninguna unidad de ejemplo en las seis (`find libs/incident -name "*.ts" -path "*/lib/*"` vacío
   o justificado).
5. **AC6** — `pnpm nx run-many -t lint test --projects='incident-*'` en verde, y
   `pnpm nx graph --file=tmp/graph.json`: nodos y aristas; con seis librerías vacías no debería haber
   ninguna arista nueva. Borra `tmp/graph.json` después.
6. `node -e "..."` sobre `tsconfig.base.json`: exactamente nueve alias.
7. `git diff package.json pnpm-lock.yaml` vacío; `git diff nx.json` solo el bloque `generators` de
   Angular.
8. `pnpm verify:boundaries` → 10/10, ejecutado **solo**.
9. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde — es lo que corre CI.
10. `pnpm prettier --check libs/incident tsconfig.base.json nx.json` pasa.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push.

#### Informa al terminar — en español
- Los seis comandos generadores exactos y qué borraste o ajustaste de la salida de cada uno.
- Tu decisión sobre el target `test` (trampa 1) y por qué.
- Cómo hiciste la sonda del AC4 sin crear el contexto `sla`, y qué reglas saltaron en el AC5.
- El diff de `nx.json`.
- La salida de las diez verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: notas de estado obsoletas (`ARCHITECTURE.md` §12.3,
  `PROJECT-STRUCTURE.md`), y cualquier AC que no se pueda demostrar tal como está escrito.

### Response:

Implementado ticket T-C1-01

</br>


**Prompt 15:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C1/tickets/T-C1-02.md ·
Namespace de esquema `incident` y la raíz de composición `IncidentModule`
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`. Aplica **`sport-itsm-backend`** (NestJS 11, TypeORM, migraciones),
`sport-itsm-architecture` (§6.3: `apps/api` es la única raíz de composición) y cierra con
`sport-itsm-workflow`. Aquí no hay dominio: una migración, un módulo vacío pero cableado y el
registro de una ruta de entidades.

#### Por qué este ticket y por qué ahora
Es el segundo del bloque 3 de la rebanada 1 (`T-C1-01` → **`02`** → `03` → `05` → `06` → `04`).
Nada del contexto `incident` se puede persistir ni exponer por HTTP hasta que exista esto: la tabla
de `T-C1-04`, el repositorio de `T-C1-06` y el endpoint de `T-C1-08` cuelgan de este esquema y de
este módulo. **Lo que dejes aquí es el patrón que copiarán todos los contextos siguientes.**

#### Precondición
    git status --porcelain                   # limpio (salvo prompts.md)
    pnpm nx show projects                    # 13 (incluidos los seis incident-*)
    docker ps --filter name=sport-itsm-postgres-dev   # healthy, 0.0.0.0:5452->5432
    POSTGRES_HOST=localhost POSTGRES_PORT=5452 POSTGRES_DB=sport_itsm_dev POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres pnpm typeorm migration:show -d apps/api/src/data-source.ts
                                             # [X] CreateIamSchemaAndExtensions1790349248155

#### Trampas del entorno — ya pagadas, no las redescubras
- **Puerto de desarrollo 5452**, no 5432 (5432 está ocupado en esta máquina). No lo cambies.
- Hay variables globales de Windows `POSTGRES_*` de otro proyecto (usuario `userdev`) que **pisan el
  `.env`**: pasa los cinco valores explícitos **en la misma llamada Bash** en cada comando de la CLI,
  como en la precondición.
- `pnpm typeorm <cmd> -d apps/api/src/data-source.ts` lleva `-d`; los atajos
  `pnpm migration:run|revert|show` **ya lo llevan** — no añadas otro, rompe con un error confuso.
- Cypress desde el terminal de VS Code: `unset ELECTRON_RUN_AS_NODE;` en la misma llamada Bash.
- Prettier en Windows: comprueba solo tus ficheros.

#### El ticket es el contrato
Léelo entero; su "Out of scope" es vinculante (ninguna tabla, puerto, adaptador ni controlador). Lee
además, y no de memoria:
- **`apps/api/src/migrations/README.md`** — la convención de `T-C10-17`: nombre, clase, reversibilidad,
  nombres de esquema reales de `DATA-MODEL.md`. El esquema es **`incident`** (`DATA-MODEL.md` §8/§20.3).
- La migración de arranque `1790349248155-CreateIamSchemaAndExtensions.ts` — el ejemplo a seguir.
- `apps/api/src/data-source.ts`, `apps/api/tsconfig.migrations.json`, `tools/build-api-runtime.mjs`
  y `docker/backend/Dockerfile` — cómo se carga el data source en local (ts-node) y en la imagen
  (compilado, WORKDIR `/app/dist/apps/api`).
- `ARCHITECTURE.md` §6.3 y `PROJECT-STRUCTURE.md` — el módulo va en
  **`apps/api/src/app/incident/incident.module.ts`**.
- `apps/api/src/app/app.module.ts` y `apps/api/src/event-dispatch/event-dispatch.module.ts` — cómo
  se registran hoy los módulos.

#### Trampa 1 — el AC3 pide `/health/ready`, y no existe
`/health/live` y `/health/ready` son de **`T-C10-28`** (observabilidad, `@nestjs/terminus`), que no
está hecho: hoy `main.ts` solo reserva la exclusión del prefijo. **No implementes health aquí.**
Demuestra lo demostrable del AC3 — que la API arranca con `IncidentModule` registrado (log de Nest
`IncidentModule dependencies initialized`, la API escuchando, `pnpm nx e2e api-e2e` en verde) — y
**reporta el AC3 como parcialmente no demostrable** por dependencia de `T-C10-28`.

#### Trampa 2 — "registrar la ruta de entidades de `incident`" es más difícil de lo que parece
Hoy el data source declara `entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')]`. Con
`__dirname = apps/api/src`, eso busca en `apps/api/**`: **no alcanza `libs/incident/infrastructure`**,
que es donde `T-C1-06` pondrá la entidad TypeORM.

Decide cómo registrar el contexto `incident` y **justifícalo** contra estas tres restricciones:
- **Local (CLI con ts-node)**: la ruta tiene que encontrar
  `libs/incident/infrastructure/src/**/*.entity.ts` desde el `__dirname` real.
- **Imagen desplegada**: `tsconfig.migrations.json` solo compila `data-source.ts`, `config/` y
  `migrations/`. Un `import` de `@sport-itsm/incident-infrastructure` en `data-source.ts` **no
  funciona** allí: `tsc` no reescribe los alias de ruta, y el `require` compilado fallaría en la
  imagen. Por eso **no importes clases de entidad por alias** en `data-source.ts`.
- **El glob no puede escapar al sistema de ficheros**: `T-C10-69` descubrió que un glob con `..` que
  en la imagen resolvía a `/` dejaba colgado `DataSource.initialize()` recorriendo `/proc`. Cualquier
  ruta nueva tiene que resolver a un directorio acotado tanto en local como en `/app/dist/apps/api`
  (si en la imagen no existe, que sea un directorio inexistente, no la raíz).

Hoy no hay ninguna entidad, así que el glob no encontrará nada: está bien. **Repórtalo como hallazgo
para `T-C1-06` y `ci-cd-expert`**: cuando exista la primera entidad, la imagen tendrá que compilarla
y copiarla (o el data source tendrá que cambiar de estrategia), porque hoy no viaja en `dist/`.

#### Trampa 3 — la migración del esquema
- Fichero `<timestamp>-CreateIncidentSchema.ts`, clase `CreateIncidentSchema<timestamp>`, timestamp
  **posterior** a `1790349248155`. SQL explícito con `queryRunner.query`, sin `migration:generate`.
- Sigue la convención del README en `up`/`down`. Decide si el `down` usa `DROP SCHEMA` **sin**
  `CASCADE` (falla si alguien dejó tablas: más seguro, obliga a revertir en orden) o con él, y
  justifícalo. Recomendación: sin `CASCADE`, porque cada tabla futura tendrá su propia migración
  reversible que se revierte antes.
- **"Base vacía" del AC1**: la base de desarrollo ya tiene aplicada la migración de arranque. Haz los
  ciclos run → revert → run contra una base **desechable** (el stack `docker/docker-compose.e2e.yml`
  en 5499, levantado y destruido a mano, o un contenedor propio), partiendo de verdad vacía, y
  demuestra que después del `revert` no queda ningún objeto en el esquema `incident` ni el propio
  esquema. Al terminar, deja la base de **desarrollo** con las dos migraciones aplicadas.

#### Trampa 4 — el módulo vacío pero cableado
- `IncidentModule` en `apps/api/src/app/incident/incident.module.ts`, importado desde `AppModule`.
- **Ningún provider de negocio ni controlador** (AC4). El "bloque de binding de tokens" se establece
  como `providers: []` con un comentario que muestra la forma exacta que añadirán los tickets
  siguientes (`{ provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository }`, citando
  §6.3). **No declares tokens ni clases que aún no existen** para rellenar el ejemplo.
- `EVENT_PUBLISHER` ya es global (`EventDispatchModule`); no lo reimportes.
- No instales `@nestjs/typeorm` ni conectes `TypeOrmModule`: el ticket no lo pide y la API sigue sin
  abrir conexión al arrancar. Si crees que hace falta, **para y repórtalo**.

#### Lo que NO debes tocar
`libs/**`, `docker/**`, `.github/**`, `docs/**`, `.claude/**` (salvo tu memoria de agente),
`package.json`, `prompts.md`, `apps/api/src/event-dispatch/**`, `apps/api/src/testing/**`,
`apps/api/tsconfig.migrations.json` y `tools/build-api-runtime.mjs` (salvo que la trampa 2 lo exija
de verdad; si lo tocas, justifícalo). El ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — contra la base desechable vacía: `migration:run` aplica las dos migraciones; `\dn` muestra
   `iam` e `incident`. Pega la salida.
2. **AC2** — `migration:revert` retira solo `CreateIncidentSchema…`; `\dn` sin `incident` y sin
   objetos residuales (`SELECT … FROM pg_class c JOIN pg_namespace n … WHERE n.nspname='incident'`
   vacío). Luego run → revert → run otra vez con el mismo resultado. Pega todo.
3. Destruye la base desechable. En la base de **desarrollo** (5452), `migration:run` y
   `migration:show` → las dos `[X]`.
4. **Trampa 2** — muestra la ruta de entidades resuelta en local (p. ej. un `node -e` que cargue el
   data source con ts-node e imprima `dataSource.options.entities`) y explica cómo resuelve en la
   imagen. `pnpm nx run api:build-migrations` sigue en verde y `dist/apps/api/migrations/` contiene
   la nueva migración compilada.
5. **AC3** — la API arranca: pega la línea `IncidentModule dependencies initialized` y la de
   escucha. Reporta explícitamente qué parte del AC3 no se puede demostrar (`/health/ready`).
6. **AC4** — enseña `incident.module.ts` completo; `pnpm nx lint api` en verde.
7. `unset ELECTRON_RUN_AS_NODE; pnpm nx e2e api-e2e` en verde (su `e2e-migrate` aplica ahora las dos
   migraciones sobre la base efímera: pega esas líneas).
8. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde y `pnpm verify:boundaries` 10/10.
9. `grep -rn "synchronize" apps/api/src` → solo `false`; `grep -rn "process.env" apps/api/src` → solo
   `config/` y el test de gating ya existente.
10. `pnpm prettier --check` sobre los ficheros que has creado o tocado.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push. Deja los contenedores desechables eliminados y
`sport-itsm-postgres-dev` `healthy` en 5452.

#### Informa al terminar — en español
- Ficheros creados y modificados.
- El contenido literal de la migración y de `incident.module.ts`.
- Tus decisiones de las trampas 2 y 3, con su porqué.
- La salida de las diez verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo el AC3 y `/health/ready` (`T-C10-28`), el
  empaquetado de entidades en la imagen para `T-C1-06`/`ci-cd-expert`, y el `passWithNoTests` que
  `apps/api/project.json` mantiene aunque `api` ya tiene tests.

### Response:

Implementado ticket T-C1-02

</br>

**Prompt 16:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C1/tickets/T-C1-03.md ·
Política de `TicketReference` para incidencias y el puerto de repositorio `nextReference()`
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, pero **aquí no se escribe NestJS ni TypeORM**: es `type:domain`, código
puro. Mandan `sport-itsm-engineering-principles` (inmutabilidad, errores tipados, YAGNI) y
`sport-itsm-architecture` (§5.3 fila `domain`, §5.4 dónde vive un puerto, §6.2–§6.3 puertos con
token). Cierra con `sport-itsm-workflow`.

#### Por qué este ticket y por qué ahora
Es el tercero del bloque 3 de la rebanada 1. El orden real es **`03 → 05 → 06 → 04`** (nota H2 del
README de `C1`): primero el puerto y la política de referencia (este), luego el agregado (`T-C1-05`),
la tabla (`T-C1-06`) y por último la secuencia y la restricción única (`T-C1-04`). `US-C1-05` exige
que ninguna incidencia exista sin referencia, por eso la referencia va antes que el agregado.

#### Precondición
    git status --porcelain                   # limpio (salvo prompts.md)
    pnpm nx show projects                    # 13
    pnpm nx test shared-domain               # verde
    pnpm verify:boundaries                   # 10/10

No necesitas base de datos.

#### El ticket es el contrato — pero tiene dos puntos que chocan con la fuente
Léelo entero. Lee además, y no de memoria:
- **`libs/shared/domain/src/lib/ticket-reference.vo.ts`** — `TicketReference` **ya existe** (`T-C10-08`):
  valida `^[A-Z]{3}[0-9]{7}$`, expone `value` y `prefix`. No se modifica.
- **`DATA-MODEL.md` §3.1 y §3.2** (referencias legibles: `INC0000123`, `varchar(20)`, secuencia
  `incident.incident_reference_seq`, **nunca reutilizada**) y la fila de `id` en §20.3 (UUID v7 emitido
  por `IncidentRepositoryPort.nextIdentity()`).
- **`ARCHITECTURE.md` §6.2** (el agregado se construye completo en dominio puro antes de cualquier
  I/O) y **§6.3** (puerto = `interface` + `Symbol` exportado desde la librería de dominio).
- `libs/shared/domain/src/lib/event-publisher.port.ts` — el ejemplo vigente de puerto + token.
- `PRD.md` **FR-INC-02** y `docs/backlog/C1/user-stories.md` → `US-C1-05`.

#### Trampa 1 — el formato: "prefijo, separador y parte numérica"
El Scope dice *"prefix, separator and numeric part"*. **La fuente dice otra cosa**: `DATA-MODEL.md`
fija `INC0000123` — prefijo de tres letras y siete dígitos, **sin separador** — y el VO compartido lo
hace cumplir. Un separador (`INC-0000123`) no pasaría la validación del kernel ni cabría en la forma
documentada.

- **Implementa la forma de `DATA-MODEL.md`**: `INC` + 7 dígitos con ceros a la izquierda.
- **Repórtalo como hallazgo** para `architect-tech-lead`: el Scope del ticket contradice
  `DATA-MODEL.md`. No edites el ticket.
- El requisito de "no ambigüedad al leerlo en voz alta" se cumple por construcción (prefijo fijo y solo
  dígitos): **demuéstralo con un test**, no con un comentario.
- Siete dígitos se agotan en 9.999.999. Decide qué pasa si la secuencia entrega un número mayor:
  **error de dominio tipado**, nunca truncar ni envolver en silencio (eso reutilizaría referencias,
  que es exactamente lo que FR-INC-02 prohíbe). Documenta el límite.

#### Trampa 2 — `findById()` y `save()` nombran un agregado que aún no existe
El Scope pide que `IncidentRepositoryPort` exponga `nextReference()`, `findById()` y `save()`. Pero
`save(incident: Incident)` y `findById(): Promise<Incident | null>` necesitan el tipo **`Incident`**, que
es `T-C1-05` — el siguiente ticket.

- **No crees un `Incident` provisional** ni un tipo placeholder para que compile: el agregado es de
  `T-C1-05` y un esqueleto aquí sería código que ese ticket tendría que deshacer.
- Declara ahora lo que se puede declarar honestamente (`nextReference()`), y decide entre: (a) dejar
  `findById`/`save` para `T-C1-05`, que es quien trae el tipo, y reportarlo como desviación del Scope;
  o (b) otra forma que no invente el agregado. Recomendación: (a). Justifica tu elección.
- **`nextIdentity()`**: `DATA-MODEL.md` §3.1 y §20.3 dicen que el puerto emite también el UUID v7 del
  agregado (`nextIdentity()` "alongside the existing `nextReference()`"), y el ticket no lo menciona.
  Solo nombra tipos del kernel (`Identity`), así que se puede declarar aquí sin inventar nada. Decide
  si lo incluyes y justifícalo con la fuente; en cualquier caso, repórtalo.

#### Trampa 3 — el puerto y su token
- `interface IncidentRepositoryPort` + `export const INCIDENT_REPOSITORY = Symbol(...)` en
  `libs/incident/domain`, exportados por el barrel — igual que `EVENT_PUBLISHER` junto a
  `EventPublisherPort`. Un `Symbol` es JavaScript puro: nada de `@nestjs/*` aquí.
- Métodos asíncronos (`Promise<…>`): la referencia sale de una secuencia de base de datos, es I/O
  detrás del puerto. `Promise` no es un import de I/O.
- La política de formato/parseo vive en `libs/incident/domain` y **compone** el `TicketReference` del
  kernel; no dupliques su validación ni la cambies. Si el VO del kernel no expone algo que necesitas (la
  parte numérica, por ejemplo), resuélvelo en la política de `incident` — **no toques
  `libs/shared/domain`**. Si crees que el kernel debe cambiar, para y repórtalo.
- Errores: lanza errores tipados que hereden de `DomainError` del kernel, distinguibles por tipo, no por
  mensaje (la misma disciplina que `T-C10-08`).

#### Trampa 4 — la primera arista de `incident`
`libs/incident/domain` pasará a depender de `@sport-itsm/shared-domain`: es la **primera arista** del
contexto `incident` y es legal (`domain` → `domain`, `scope:incident` → `scope:shared`). Importa **solo
por el barrel** `@sport-itsm/shared-domain`, nunca por ruta profunda. Verifícalo en el grafo.

Y quita `passWithNoTests: true` de `libs/incident/domain/jest.config.ts`: su propio comentario dice
que se retira con este ticket.

#### Lo que NO debes tocar
`libs/shared/**`, las otras cinco librerías `incident-*`, `apps/**`, `docker/**`, `.github/**`,
`docs/**`, `.claude/**` (salvo tu memoria de agente), `package.json`, `tsconfig.base.json`,
`prompts.md`. Nada de agregado, adaptador, entidad, migración ni secuencia (`T-C1-04`, `05`, `06`). El
ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — `pnpm nx test incident-domain`: pega el resumen. Tests de round-trip (formatear → parsear →
   mismos componentes), forma exacta (`INC0000123`), límite superior (9.999.999 válido, 10.000.000 lanza
   el error tipado), entradas inválidas (0, negativos, no enteros) y el test de "sin caracteres
   ambiguos".
2. **AC2 — pureza**: `grep -rnE "from '(@nestjs|@angular|typeorm|rxjs|express|pg|node:|fs|path|crypto)" libs/incident/domain/src`
   → vacío. Y `tsconfig.lib.json` sigue con `"types": []`.
3. **AC2 — lint**: `pnpm nx lint incident-domain` en verde.
4. **AC3**: los tests corren sin base de datos ni HTTP (ningún mock de red ni de BD necesario).
5. El grafo: `pnpm nx graph --file=tmp/graph.json` → la arista nueva `incident-domain -> shared-domain` y
   ninguna otra nueva; borra el fichero.
6. `libs/incident/domain/jest.config.ts` sin `passWithNoTests`.
7. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde y `pnpm verify:boundaries` 10/10.
8. `pnpm prettier --check libs/incident/domain`.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push.

#### Informa al terminar — en español
- Ficheros creados y modificados; el contenido literal del puerto y de la política.
- Tus decisiones de las trampas 1 y 2 (formato, límite, `findById`/`save`, `nextIdentity`), con su porqué.
- La salida de las ocho verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo, la contradicción del Scope con
  `DATA-MODEL.md` sobre el separador, qué métodos del puerto quedan para `T-C1-05` y la presencia o no
  de `nextIdentity()` en el ticket.

### Response:

Implementado ticket T-C1-03

</br>

**Prompt 17:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C1/tickets/T-C1-05.md ·
El agregado raíz `Incident` y sus invariantes de creación
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`, pero **aquí no se escribe NestJS ni TypeORM**: es `type:domain`, código
puro. Mandan `sport-itsm-engineering-principles` (inmutabilidad, errores tipados, estados ilegales
irrepresentables, YAGNI) y `sport-itsm-architecture` (§6.2, ADR-005, ADR-008, ADR-009). Cierra con
`sport-itsm-workflow`.

#### Por qué este ticket y por qué ahora
Cuarto del bloque 3 de la rebanada 1 (orden real `03 → 05 → 06 → 04`). Es **el agregado central del
producto**: todos los bloques posteriores lo extienden. Detrás vienen `T-C1-06` (entidad TypeORM y
tabla), `T-C1-04` (secuencia y restricción única) y `T-C1-07` (`LogIncidentUseCase`), que llamará a
`Incident.log()` y publicará su evento con `EVENT_PUBLISHER` tras el commit.

#### Precondición
    git status --porcelain                   # limpio (salvo prompts.md)
    pnpm nx test incident-domain             # 2 suites, 20 tests, verde
    pnpm verify:boundaries                   # 10/10

No necesitas base de datos.

#### Lo que ya existe y debes usar — léelo, no lo supongas
- `libs/incident/domain/src/lib/incident-repository.port.ts` — `IncidentRepositoryPort` con
  `nextIdentity()` y `nextReference()`, y el token `INCIDENT_REPOSITORY` (`T-C1-03`).
- `libs/incident/domain/src/lib/incident-reference.policy.ts` — la política `INC` + 7 dígitos.
- `@sport-itsm/shared-domain`: `Identity`, `TicketReference`, `DomainEvent` (+ `DomainEventInput`: exige
  `name`, `occurredAt`, `actor`, **`correlationId`** y `payload`), `ClockPort`, `FixedClock`,
  `DomainError`, `ImpactLevel`, `UrgencyLevel`, `Priority`.
- `ARCHITECTURE.md` **§6.2** (forma del agregado; "every mutating method returns domain events"),
  **ADR-005, ADR-008, ADR-009**.
- `DATA-MODEL.md` **§20.3 `incident_ticket`** — columnas, nulabilidad y longitudes.
- `PRD.md` **FR-INC-01** y `docs/backlog/C1/user-stories.md` → **US-C1-01** y **US-C1-07**.

#### Trampa 1 — "contact channel" no está definido en ninguna parte
FR-INC-01 y US-C1-01 piden capturar el *"contact channel"*, pero **ningún documento dice qué es**, y
`DATA-MODEL.md` no tiene ninguna columna con ese nombre. Lo más cercano es **`origin_channel`**
(`origin_channel_enum`: `portal` y `agent_logged` en el MVP, FR-OMN-01/02), que es el canal por el que
entró la incidencia, no un medio para contactar al reporter.

- **No inventes** un enum de medios de contacto (email, teléfono…) que ninguna fuente respalde.
- Recomendación: modela `originChannel` con los valores de `DATA-MODEL.md` y trátalo como el "contact
  channel" del AC1, citando la fuente en el código. Si concluyes otra cosa, justifícala contra las
  fuentes.
- **Repórtalo como hallazgo para el Product Owner**: el término del PRD no está definido y el modelo de
  datos lo resuelve implícitamente como canal de origen.

#### Trampa 2 — qué es obligatorio: el AC y el modelo de datos no coinciden del todo
El AC2 exige errores tipados por campo obligatorio ausente. Deriva la lista de **`DATA-MODEL.md`**, no
de tu intuición: `reporter_user_id`, `short_description`, `description` y `origin_channel` son
`NOT NULL`, pero **`service_id` (servicio afectado) es `NULL`**, mientras que FR-INC-01 lo enumera entre
lo que se captura.

- Decide si el servicio afectado es obligatorio en la creación, **justifícalo con la fuente** y
  **reporta la discrepancia**. Recomendación: sigue `DATA-MODEL.md` (opcional) y repórtalo, porque el
  modelo de datos es el prescriptivo para el esquema de `T-C1-06`.
- Cadenas en blanco cuentan como ausentes. Aplica las longitudes de `DATA-MODEL.md` (`short_description`
  `varchar(255)`) como invariante de dominio, con su propio error tipado.
- Cada error nombra el campo **por tipo o por una propiedad tipada**, no solo en el mensaje: un
  llamante (el filtro de excepciones futuro, `T-C1-08`) tiene que poder distinguir qué campo falló sin
  parsear texto. Hereda de `DomainError`.

#### Trampa 3 — "Priority not yet derived" contra columnas `NOT NULL`
El AC3 exige que una incidencia recién creada tenga la **Prioridad explícitamente sin derivar**, el flag
de competición sin marcar y **ninguna categoría**. Pero `DATA-MODEL.md` declara `NOT NULL`
`base_impact`, `assessed_impact`, `urgency`, `priority`, `priority_matrix_id`, `workflow_id` y
`state_id`.

- El agregado sigue **el AC**: "sin derivar" se representa de forma **explícita y tipada** (no con un
  valor por defecto disfrazado como `P4` o `0`). Los campos de bloques posteriores (categoría, Impacto
  evaluado, Urgencia, Prioridad derivada, flag de competición, sujeto afectado, asignación) quedan
  declarados como **ausentes** con tipos honestos — usa los VO del kernel que ya existen
  (`ImpactLevel`, `UrgencyLevel`, `Priority`) y **no crees** VO nuevos para lo que traen otros tickets
  (`CompetitionSubject` es `T-C1-14`, la asignación es de bloques posteriores).
- **Repórtalo como hallazgo crítico para `T-C1-06`**: la tabla no puede ser `NOT NULL` en esas columnas
  si la incidencia nace sin priorizar. Es una contradicción entre `DATA-MODEL.md` y el AC3 que tendrán
  que resolver el arquitecto y el Product Owner antes de escribir la migración.

#### Trampa 4 — el estado del ciclo de vida
§6.2 dibuja `IncidentState`, y el modelo de datos tiene `workflow_id`/`state_id` hacia un ciclo de
vida **configurable** (FR-INC-06, bloque C) que depende de `StateModel` (`T-C10-10`, no construido).
**No construyas el ciclo de vida.** Decide si el agregado lleva ya un estado inicial (`New`, citando
US-C1-07) o nada, sin anticipar la configuración, y justifícalo. Repórtalo.

#### Trampa 5 — tiempo, identidad, actor y correlación: todo entra por parámetro
- **Nada de `new Date()`** (AC4, ADR-009): `log()` recibe el `ClockPort` o el instante ya leído de él.
  Decide cuál y justifícalo.
- La **identidad** y la **referencia** llegan ya generadas por el puerto (`nextIdentity()`,
  `nextReference()`); el agregado no genera nada (§6.2, ADR-005).
- `DomainEvent.record` exige **actor** y **`correlationId`**: `log()` tiene que recibirlos. El
  **reporter** es un `Identity` distinto del actor en el caso general (un agente registra en nombre de
  otro, FR-OMN-02), aunque en el portal coincidan. No colapses los dos conceptos.
- `IncidentLogged` lleva actor, reporter y el estado creado (AC1). El payload se congela (lo hace
  `DomainEvent`): que sea un objeto plano serializable, no el agregado.
- Exactamente **un** evento en éxito; **ninguno** y **ninguna incidencia** en fallo (AC1, AC2).

#### Trampa 6 — completar el puerto
`T-C1-03` dejó pendientes `findById()` y `save()` porque necesitaban el tipo `Incident`. Añádelos ahora
a `IncidentRepositoryPort` (`findById(id: Identity): Promise<Incident | null>`,
`save(incident: Incident): Promise<void>` o la forma que justifiques) y exporta todo por el barrel.
Actualiza el spec del puerto si hace falta.

#### Lo que NO debes tocar
`libs/shared/**`, las otras librerías `incident-*`, `apps/**`, `docker/**`, `.github/**`, `docs/**`,
`.claude/**` (salvo tu memoria de agente), `package.json`, `tsconfig.base.json`, `prompts.md`. Nada de
persistencia, caso de uso, autorización, controlador, entidad ni migración. Ningún comportamiento de
prioridad (bloque D) ni de competición. El ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. **AC1** — `pnpm nx test incident-domain`: pega el resumen. Un test crea una incidencia válida y
   comprueba cada campo, la referencia, y que hay **exactamente un** `IncidentLogged` con actor, reporter,
   `correlationId`, `occurredAt` del reloj fijo y el estado creado.
2. **AC2** — un test por cada campo obligatorio (ausente y en blanco) que comprueba el **tipo** de error
   y el campo nombrado, y que no se devuelve incidencia ni evento. Y el de longitud máxima.
3. **AC3** — un test que lee una incidencia recién creada: Prioridad explícitamente sin derivar, flag de
   competición sin marcar, sin categoría.
4. **AC4 — pureza**:
   `grep -rnE "from '(@nestjs|@angular|typeorm|rxjs|express|pg|node:|fs|path|crypto)|new Date\(" libs/incident/domain/src --include=*.ts --exclude=*.spec.ts`
   → vacío. `tsconfig.lib.json` con `"types": []`.
5. Inmutabilidad: un test demuestra que el agregado y el payload del evento no se pueden mutar.
6. `pnpm nx lint incident-domain` en verde; el grafo sigue con una sola arista desde `incident-domain`
   (`-> shared-domain`); borra `tmp/graph.json`.
7. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde y `pnpm verify:boundaries` 10/10.
8. `pnpm prettier --check libs/incident/domain`.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Restricciones
No instales dependencias. No hagas commit ni push.

#### Informa al terminar — en español
- Ficheros creados y modificados; la forma pública del agregado (`log()` y sus parámetros, los campos,
  el evento) y del puerto completo.
- Tus decisiones de las trampas 1 a 5, con su porqué y la fuente citada.
- La salida de las ocho verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo "contact channel" (Product Owner), el
  servicio afectado obligatorio u opcional, las columnas `NOT NULL` frente al AC3 (crítico para
  `T-C1-06`) y el estado inicial.

### Response:

Implementado ticket T-C1-05

</br>

**Prompt 18:**

Agent: Claude Code - Opus 5.5 (1M context)

### Request:

Actúa como backend-engineer e implementa UN SOLO ticket: docs/backlog/C1/tickets/T-C1-06.md ·
Entidad TypeORM de `Incident`, mapper, adaptador de repositorio y migración
Raíz del repositorio: d:\repositories\ai4devs\proyecto_final\AI4Devs-finalproject

#### Rol
`agent: backend-engineer`. Aplica **`sport-itsm-backend`** (TypeORM 1.1, migraciones, DI por tokens),
`sport-itsm-architecture` (ADR-005: entidad de persistencia separada del agregado, unidas por un
mapper; §5.3: `type:infrastructure` puede depender de `domain`/`application`) y
`sport-itsm-engineering-principles`. Cierra con `sport-itsm-workflow`.

#### Por qué este ticket y por qué ahora
Quinto del bloque 3 de la rebanada 1 (orden `03 → 05 → 06 → 04`). Es **la primera entidad y el primer
adaptador de persistencia del proyecto**: todo lo que decidas aquí (dónde viven, cómo se registran,
cómo llega el `DataSource` a Nest, cómo se prueban contra PostgreSQL) lo copiarán las seis entidades
siguientes. Detrás vienen `T-C1-04` (secuencia, trigger de inmutabilidad y `nextReference()`) y
`T-C1-07` (`LogIncidentUseCase`, primera escritura alcanzable en producción).

#### Precondición
    git status --porcelain                   # limpio (salvo prompts.md)
    pnpm nx test incident-domain             # verde
    docker ps --filter name=sport-itsm-postgres-dev   # healthy, 0.0.0.0:5452->5432
    POSTGRES_HOST=localhost POSTGRES_PORT=5452 POSTGRES_DB=sport_itsm_dev POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres pnpm typeorm migration:show -d apps/api/src/data-source.ts
                                             # [X] ...Iam... y [X] ...IncidentSchema...

#### Trampas del entorno — ya pagadas, no las redescubras
- Postgres de desarrollo en el **puerto de host 5452**. Variables globales de Windows `POSTGRES_*` de
  otro proyecto (usuario `userdev`) pisan el `.env`: pasa los cinco valores **en la misma llamada
  Bash** en cada comando de la CLI. `pnpm typeorm … -d …` lleva `-d`; los atajos `pnpm migration:*`
  **ya lo llevan**, no añadas otro.
- `unset ELECTRON_RUN_AS_NODE;` en la misma llamada Bash si ejecutas Cypress.
- Prettier en Windows: comprueba solo tus ficheros.

#### El ticket es el contrato — léelo entero, incluido todo su `## Context`
Fue reescrito por ADR-014 y dos pases posteriores. Lee además, del repo y no de memoria:
- **`DATA-MODEL.md` §8.5** (tabla de introducción de columnas: este ticket es su primera fila), **§20.3**
  (`incident_ticket`, `origin_channel_enum`), **§3.7** y **M18**; **ADR-014** en `ARCHITECTURE.md` §10.
- `libs/incident/domain/src/lib/incident.aggregate.ts` (campos, `loggedAtEpochMs`, `loggedBy`, slots
  ausentes), `origin-channel.vo.ts`, `incident-repository.port.ts` (`nextIdentity`, `nextReference`,
  `findById`, `save`, token `INCIDENT_REPOSITORY`).
- `apps/api/src/data-source.ts` (su comentario explica el glob de entidades de `T-C1-02` y por qué
  **no** puede importar por alias), `apps/api/tsconfig.migrations.json`, `tools/build-api-runtime.mjs`,
  `apps/api/webpack.config.js`, `apps/api/src/app/incident/incident.module.ts`,
  `apps/api/src/migrations/README.md`.

#### Trampa 1 — el AC4 contradice la fuente vigente
El AC4 dice *"migrations auto-run only when `NODE_ENV=development`"*. **`DATA-MODEL.md` §3.7 (ya
corregido) dice lo contrario**: las migraciones **nunca** corren al arrancar, en ningún entorno
(`migrationsRun: false`), porque la API escala en horizontal y migrar en paralelo corrompe. **No
implementes auto-run.** Demuestra `synchronize: false` y `migrationsRun: false` y **reporta el AC4 como
contradicción** para `architect-tech-lead`.

#### Trampa 2 — dónde vive cada pieza
- Entidad, mapper, error de mapeo y `TypeOrmIncidentRepository` en **`libs/incident/infrastructure`**
  (`type:infrastructure`), con la entidad en un fichero `*.entity.ts` para que el glob de `T-C1-02` la
  encuentre desde la CLI. Nada de TypeORM en `libs/incident/domain` (AC3).
- El binding `{ provide: INCIDENT_REPOSITORY, useClass/useFactory: … }` en `IncidentModule`
  (`apps/api`), la raíz de composición (§6.3).
- La migración en `apps/api/src/migrations/`, timestamp posterior a `1790366187635`, SQL explícito.
- Quita `passWithNoTests` de `libs/incident/infrastructure/jest.config.ts` (este ticket trae su primer
  spec, aunque el comentario diga `T-C1-04`).

#### Trampa 3 — el registro de la entidad en la API arrancada: el glob no sirve en runtime
Esta es la trampa grande, y el ticket la deja "flagged, not resolved". Verifícala tú:
- `nx serve api` ejecuta el **bundle de webpack** `dist/apps/api/main.js`. El glob del data source
  (`libs/incident/infrastructure/src/**/*.entity.{ts,js}`) resuelve, desde `dist/apps/api`, a los
  ficheros **`.ts` fuente** del repo: TypeORM intentaría `require`-arlos en runtime (Node no carga
  `.ts`) o, aunque cargaran, serían **otra clase** distinta de la que el bundle usa en el repositorio
  → *"No metadata for entity"*. En la imagen (`/app/libs/...` no existe) directamente no encuentra nada.
- Para la **API en ejecución**, la entidad tiene que registrarse **por referencia de clase** (un array
  explícito importado de `@sport-itsm/incident-infrastructure`, que webpack sí resuelve y empaqueta).
- Pero **`data-source.ts` no puede importar por alias**: `tsconfig.migrations.json` lo compila con `tsc`
  para la imagen y `tsc` no reescribe alias (`T-C1-02` lo documentó en el propio fichero). La CLI de
  migraciones no necesita entidades (las migraciones son SQL a mano).
- **Diseña** cómo conviven los dos: p. ej. una factoría de opciones compartida (conexión validada,
  `synchronize: false`, `migrationsRun: false`) que la CLI usa con el glob y la raíz de composición usa
  con el array explícito — o la alternativa que justifiques. **Sin rama por entorno** y **sin duplicar**
  la configuración de conexión.
- **Demuéstralo en el bundle real**: la API construida (`pnpm nx build api` + arrancar `main.js`, o
  `nx serve api`) contra el Postgres de desarrollo carga la metadata de la entidad (p. ej. log de
  arranque, o una comprobación que no requiera endpoint). Si no lo puedes demostrar, dilo.
- **Repórtalo para `ci-cd-expert`** con tu conclusión sobre la imagen desplegada.

#### Trampa 4 — cómo llega el `DataSource` a Nest
`@nestjs/typeorm` **no está instalado** y la API **no abre conexión al arrancar** hoy. Para inyectar el
repositorio necesitas un `DataSource` inicializado en el contenedor de Nest.
- Recomendación: un provider propio en `apps/api` (p. ej. `useFactory` que construye e `initialize()`-a
  el `DataSource` con las opciones de la trampa 3, y lo destruye en el cierre de la aplicación), sin
  dependencias nuevas. Si concluyes que hace falta `@nestjs/typeorm`, **para y repórtalo** antes de
  instalar nada.
- Consecuencia a documentar y reportar: desde este ticket **la API necesita PostgreSQL para arrancar**.
  El harness `api-e2e` ya levanta su base efímera (5499) y aplica las migraciones antes de servir la API;
  comprueba que sigue en verde.

#### Trampa 5 — el puerto completo, con `nextReference()` todavía sin secuencia
`TypeOrmIncidentRepository` implementa `IncidentRepositoryPort` entero, pero la secuencia
`incident.incident_reference_seq` es de **`T-C1-04`**, que va después.
- `nextIdentity()`: UUID v7. `crypto.randomUUID()` es v4 (no vale). El kernel no genera IDs. Opciones:
  `SELECT uuidv7()` contra PostgreSQL 18 (core, ADR-012) desde el adaptador, u otra que justifiques sin
  añadir dependencias. Devuelve `Identity`.
- `nextReference()`: **no inventes** un contador ni una secuencia provisional. Lanza un error tipado
  explícito ("disponible con `T-C1-04`") con su test, y repórtalo. `T-C1-04` lo implementará.
- En los tests de round-trip, construye la referencia con `IncidentReferencePolicy.format(n)`.

#### Trampa 6 — mapper y regla 4 de ADR-014
- Columnas exactamente las del primer grupo de §8.5 (el ticket las lista). `origin_channel_enum` en el
  esquema `incident` con **`portal`, `agent_logged`, `email`, `in_app`** (sin `phone`).
- `reference` con **`update: false`** en la entidad y `uq_incident_reference`.
- `created_at`/`created_by` ← `loggedAtEpochMs`/`loggedBy`. Decide y justifica `updated_at`
  (`NOT NULL`) y `updated_by` (`NULL`) en el primer guardado sin inventar estado de dominio.
  `version` como `@VersionColumn`. Timestamps en UTC (`timestamptz`).
- Al cargar: los slots sin columna (`categoryId`, `impact`, `urgency`, `priority`,
  `competitionAffectsInProgress`, `affectedSubject`, `assignment`) salen `null`/`false`. Al guardar: si
  alguno trae valor, **error de mapeo tipado**, nunca descarte silencioso.
- El agregado necesita poder **reconstituirse** desde persistencia sin pasar por `log()` (que emite
  evento). Si no existe una vía, añádela en `libs/incident/domain` de forma mínima (p. ej. una factoría
  `reconstitute` que valida invariantes y **no** emite eventos), con tests. Justifícalo: es la única
  modificación permitida en el dominio.

#### Trampa 7 — el test contra PostgreSQL real no puede romper CI
El AC1 exige round-trip **contra PostgreSQL real, no un mock**. Pero `pnpm nx run-many -t test` corre en
el job `verify` de CI **sin base de datos**: un spec de Jest que necesite Postgres dentro del target
`test` lo pondría en rojo.
- Mantén los tests unitarios del mapper (sin BD) en el target `test`.
- Pon los tests contra BD en un **target aparte** (p. ej. `integration`) que levante la base efímera y la
  destruya siempre, reutilizando el patrón de `apps/api-e2e` (`docker/docker-compose.e2e.yml`,
  `--wait`, `pnpm migration:run` contra 5499, `tools/e2e/teardown-after.mjs`) — o la alternativa que
  justifiques. Que **no** entre en `run-many -t test`.
- Engancharlo a CI es de `ci-cd-expert`: **repórtalo**, no toques `.github/`.

#### Lo que NO debes tocar
`libs/shared/**`, `libs/incident/{application,feature,ui,data-access}`, `docker/**`, `.github/**`,
`docs/**`, `.claude/**` (salvo tu memoria de agente), `package.json` (sin dependencias nuevas),
`prompts.md`, `apps/api/src/event-dispatch/**`, `apps/api/src/testing/**`. En `libs/incident/domain`,
solo la vía de reconstitución si hace falta. Ninguna columna, CHECK, secuencia ni trigger de tickets
posteriores. El ticket no se edita.

#### Verificación — ejecútala, no la afirmes
1. **Migración**: contra una base desechable vacía, `migration:run` aplica las tres migraciones; `\d
   incident.incident_ticket` y `\dT+ incident.origin_channel_enum` muestran exactamente las columnas y
   los cuatro valores. `migration:revert` retira solo la tuya sin residuos; run → revert → run idéntico.
2. **AC1/AC2** — el target de integración: guardar y recargar un `Incident` recién registrado contra
   PostgreSQL real; todos los campos iguales; slots ausentes `null`/`false`. Pega la salida y demuestra
   que la base efímera se destruye también si el test falla.
3. **Regla 4**: test unitario del mapper que rechaza guardar un slot sin columna con valor (error tipado).
4. **AC3**: `grep -rnE "typeorm|@Entity|Column\(" libs/incident/domain/src` → vacío.
5. **AC4**: `grep -rn "synchronize\|migrationsRun" apps/api/src libs/incident/infrastructure/src` → solo
   `false`. Reporta la contradicción.
6. **Trampa 3**: la API construida arranca contra el Postgres de desarrollo (5452) y la entidad está
   registrada en el `DataSource` del bundle. Pega la evidencia.
7. `unset ELECTRON_RUN_AS_NODE; pnpm nx e2e api-e2e` en verde.
8. `pnpm nx run-many -t lint test build --skip-nx-cache` en verde **sin** base de datos corriendo
   (demuéstralo: el target `test` no depende de Postgres) y `pnpm verify:boundaries` 10/10. El grafo:
   `api -> incident-infrastructure -> incident-domain` y ninguna arista ilegal.
9. `pnpm nx run api:build-migrations` en verde (la migración nueva compila a `dist/apps/api/migrations/`).
10. Deja la base de **desarrollo** con las tres migraciones aplicadas; `pnpm prettier --check` sobre tus
    ficheros.

Un criterio que no has ejecutado se reporta como no ejecutado, jamás como pasado.

#### Si no cabe en la estimación
El ticket son 3h y las trampas 3, 4 y 7 son trabajo real. Si no cabe, **no recortes** la verificación
contra PostgreSQL ni la demostración en el bundle: entrega lo que esté verificado, di exactamente qué
falta y déjalo como hallazgo de estimación.

#### Restricciones
No instales dependencias. No hagas commit ni push. Contenedores desechables eliminados al terminar;
`sport-itsm-postgres-dev` `healthy` en 5452.

#### Informa al terminar — en español
- Ficheros creados y modificados; la migración literal; el diseño de registro de entidades y del
  provider del `DataSource`.
- Tus decisiones de las trampas 3 a 7, con su porqué.
- La salida de las diez verificaciones.
- Hallazgos — **repórtalos, no los corrijas**: como mínimo el AC4 contra §3.7, el registro de entidades
  en la imagen (`ci-cd-expert`), el target de integración en CI (`ci-cd-expert`), `nextReference()`
  pendiente de `T-C1-04`, y que la API ya necesita PostgreSQL para arrancar.

### Response:

