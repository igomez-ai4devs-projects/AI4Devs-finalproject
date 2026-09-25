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

