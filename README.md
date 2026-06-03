# Control de Aforo - Eventos Públicos 🎫

Una webapp completa para gestionar el aforo máximo permitido en eventos públicos, permitiendo controlar el número de personas que entran y salen por diferentes accesos.

## 🎯 Características

### 1. **Panel de Configuración**
- Personaliza el título del evento
- Define el aforo máximo permitido
- Configura múltiples accesos (hasta 10)
- Asigna nombres personalizados a cada acceso
- Los datos se guardan automáticamente en el navegador

### 2. **Generador de Códigos QR**
- Genera un código QR único para cada acceso
- Un código QR adicional para visualizar el dashboard general
- Descarga todos los QR en un documento para imprimir
- Los QR contienen la información necesaria codificada

### 3. **Control de Acceso**
- Interfaz simple con botones grandes para entrada/salida
- Contador visual del número de personas
- Opción para reiniciar el contador
- Impide entradas cuando se alcanza el aforo máximo
- Acceso único por código QR

### 4. **Dashboard General**
- Visualización en tiempo real de:
  - Total de personas en el evento
  - Aforo máximo configurado
  - Capacidad disponible
  - Porcentaje de ocupación
  - Barra de progreso visual
  - Estado individual de cada acceso

## 🚀 Cómo Usar

### Instalación
1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador
3. ¡Listo! No requiere servidor ni dependencias externas (excepto CDN de QRCode.js)

### Flujo de Uso

#### Paso 1: Configurar el Evento
1. Completa el formulario con:
   - **Título del Evento**: Nombre del evento (ej: "Concierto 2026")
   - **Aforo Máximo**: Número máximo de personas permitidas
   - **Número de Accesos**: Cuántos accesos tendrá el evento
   - **Nombres de Accesos**: Asigna nombres a cada acceso (ej: "Entrada Principal", "Entrada VIP", etc.)

2. Haz clic en "Generar Códigos QR"

#### Paso 2: Distribuir Códigos QR
1. Se generarán automáticamente todos los códigos QR
2. Cada acceso tendrá su propio QR
3. Habrá un QR adicional para el dashboard general
4. Puedes descargar todos los QR haciendo clic en "Descargar todos los QR"
5. Distribuye un QR a cada persona que controle un acceso

#### Paso 3: Control en el Evento
1. Cada controlador escanea su código QR (puede abrir en móvil)
2. Se abre la interfaz de control para ese acceso
3. Botones grandes para:
   - **➕ Entrada**: Suma una persona
   - **➖ Salida**: Resta una persona
   - **🔄 Reiniciar**: Resetea el contador del acceso

#### Paso 4: Ver el Dashboard
1. Escanea el código QR del Dashboard General
2. Visualiza en tiempo real:
   - Total de personas en todo el evento
   - Ocupación actual
   - Estado de cada acceso
   - Capacidad disponible

## 💾 Almacenamiento de Datos

- **LocalStorage**: Todos los datos se guardan en el navegador
- **Persistencia**: Los datos se mantienen entre sesiones
- **Sin servidor**: Funciona completamente offline
- **Privacidad**: Todos los datos quedan en tu dispositivo

## 📱 Compatibilidad

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iPhone, Android)
- ✅ Responsive design
- ✅ PWA ready (funciona sin conexión)

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos responsivos con variables CSS
- **JavaScript vanilla**: Lógica de la aplicación sin frameworks
- **QRCode.js**: Librería para generar códigos QR

## 📋 Estructura de Archivos
