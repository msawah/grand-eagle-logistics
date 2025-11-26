# 🦅 Grand Eagle Logistics - Platform Guide

## Guía Completa de Funcionalidades

---

## 📋 Tabla de Contenidos

1. [Roles y Permisos](#roles-y-permisos)
2. [Dashboard de Shipper](#dashboard-de-shipper)
3. [Dashboard de Driver](#dashboard-de-driver)
4. [Dashboard de Admin](#dashboard-de-admin)
5. [Sistema de Wallet](#sistema-de-wallet)
6. [Sistema de Reviews](#sistema-de-reviews)
7. [Sistema de Penalties](#sistema-de-penalties)
8. [Notificaciones](#notificaciones)
9. [Analytics Avanzado](#analytics-avanzado)
10. [API Documentation](#api-documentation)

---

## 🎭 Roles y Permisos

### Shipper (Transportista)
**Permisos:**
- ✅ Crear nuevos shipments
- ✅ Ver todos sus shipments
- ✅ Asignar drivers a shipments
- ✅ Ver ubicación en tiempo real de drivers
- ✅ Aprobar/rechazar POD (Proof of Delivery)
- ✅ Dejar reviews a drivers
- ✅ Ver estadísticas de revenue
- ✅ Gestionar documentos
- ✅ Acceder a wallet
- ✅ Ver historial de transacciones

**No puede:**
- ❌ Ver shipments de otros shippers
- ❌ Modificar información de drivers
- ❌ Acceder al panel de administración

### Driver (Conductor)
**Permisos:**
- ✅ Ver cargas disponibles
- ✅ Ver sus shipments asignados
- ✅ Actualizar status de shipments
- ✅ Compartir ubicación GPS
- ✅ Upload POD (fotos de entrega)
- ✅ Ver earnings y balance
- ✅ Dejar reviews a shippers
- ✅ Ver métricas de performance
- ✅ Gestionar documentos personales
- ✅ Ver penalties aplicadas

**No puede:**
- ❌ Crear shipments
- ❌ Asignar cargas a otros drivers
- ❌ Ver información de otros drivers
- ❌ Acceder al panel de administración

### Admin (Administrador)
**Permisos:**
- ✅ Ver TODOS los shipments
- ✅ Ver TODOS los usuarios
- ✅ Activar/desactivar usuarios
- ✅ Aplicar penalties a drivers
- ✅ Ver todas las transacciones
- ✅ Ver PODs sospechosos
- ✅ Ver métricas de plataforma
- ✅ Gestionar configuración del sistema
- ✅ Ver top performers
- ✅ Resolver disputas

**Control total de la plataforma**

### Auditor
**Permisos:**
- ✅ Ver todos los datos (solo lectura)
- ✅ Generar reportes
- ✅ Ver analytics avanzado
- ✅ Auditar transacciones

**No puede:**
- ❌ Modificar datos
- ❌ Crear/eliminar usuarios
- ❌ Aplicar penalties

---

## 📦 Dashboard de Shipper

### Vista Principal (`/dashboard/shipper/ultra`)

#### 1. Estadísticas Rápidas
```
┌─────────────────────────────────────────────────────┐
│ 📊 Total Shipments    💰 Total Revenue              │
│     125                   $45,250.00                │
│                                                      │
│ 🚛 Active Loads       📈 This Month                │
│     8                     $12,400.00                │
└─────────────────────────────────────────────────────┘
```

#### 2. Mapa en Tiempo Real
- Visualización de todos los shipments activos
- Ubicación en tiempo real de drivers asignados
- Tracking de rutas
- Markers para pickup y dropoff
- Clusters para múltiples shipments

#### 3. Gestión de Shipments

**Crear Nuevo Shipment:**
```
Campos requeridos:
- Pickup Address (con GPS coordinates)
- Dropoff Address (con GPS coordinates)
- Cargo Type
- Cargo Weight (tons)
- Price ($)
- Special Instructions (opcional)
```

**AI Smart Assignment:**
- El sistema automáticamente puede sugerir el mejor driver basándose en:
  - Ubicación actual
  - Rating promedio
  - Disponibilidad
  - Experiencia con tipo de carga
  - Capacidad del vehículo

**Filtros Disponibles:**
- Por status (created, assigned, in_transit, delivered, etc.)
- Por driver
- Por fecha
- Por rango de precio

#### 4. Proof of Delivery (POD) Management

**Aprobar POD:**
- Ver foto de entrega
- Ver ubicación GPS
- Ver análisis AI de fraude
- Aprobar o rechazar con comentarios

**POD Suspicious:**
- Lista de PODs con fraud score alto
- Requieren revisión manual
- Análisis AI detallado

#### 5. Reviews de Drivers
- Calificar de 1-5 estrellas
- Dejar comentario
- Público o privado
- Impacta rating del driver

---

## 🚛 Dashboard de Driver

### Vista Principal (`/dashboard/driver/ultra`)

#### 1. Estadísticas de Performance
```
┌─────────────────────────────────────────────────────┐
│ 💰 Balance           ⭐ Rating                      │
│     $2,450.00            4.8/5.0                    │
│                                                      │
│ 📦 Total Loads       🎯 On-Time Rate               │
│     87                   96%                        │
└─────────────────────────────────────────────────────┘
```

#### 2. Cargas Disponibles

**AI Smart Matching:**
El sistema muestra primero las cargas que mejor te convienen basándose en:
- Tu ubicación actual
- Tu rating
- Tu historial de entregas
- Capacidad de tu vehículo
- Tipo de carga

**Información de cada carga:**
- Load number
- Shipper name
- Pickup → Dropoff
- Distance
- Price
- Cargo type
- Pickup time estimado
- Botón "Accept Load"

#### 3. Shipments Activos

**Estados posibles:**
- `assigned` - Asignado pero no iniciado
- `en_route` - Camino al pickup
- `at_pickup` - En ubicación de pickup
- `picked_up` - Carga recogida
- `in_transit` - En camino a dropoff
- `at_dropoff` - En ubicación de entrega
- `delivered` - Entregado (esperando POD)

**Acciones por status:**
- Botón "Start Navigation" (abre GPS)
- Botón "Update Status"
- Botón "Upload POD" (cuando llegues a dropoff)

#### 4. GPS Tracking

**Toggle para compartir ubicación:**
```
┌─────────────────────────────────────────────────────┐
│ 📍 GPS Tracking:  [ ON ]                           │
│                                                      │
│ Last Updated: 2 seconds ago                         │
│ Accuracy: 10m                                       │
│ Speed: 65 mph                                       │
└─────────────────────────────────────────────────────┘
```

Se actualiza cada 30 segundos automáticamente.

#### 5. Upload POD (Proof of Delivery)

**Proceso:**
1. Llegar a dropoff location
2. Tomar foto de la carga entregada
3. Click "Upload POD"
4. Seleccionar foto
5. Sistema captura:
   - GPS coordinates
   - Timestamp
   - Device info
6. AI analiza la foto:
   - Detecta si es auténtica
   - Extrae texto (OCR)
   - Calcula fraud score
7. Shipper recibe notificación para aprobar

#### 6. Earnings & Performance

**Métricas visibles:**
- Total earnings (histórico)
- Balance disponible
- Balance pendiente (en shipments activos)
- Total deliveries
- On-time rate
- Average rating
- Total penalties
- Efficiency score

#### 7. Penalties

**Ver penalties aplicadas:**
- Tipo (late_pickup, late_delivery, no_show, etc.)
- Monto
- Razón
- Status (pagada/pendiente)
- Fecha

---

## 👨‍💼 Dashboard de Admin

### Vista Principal (`/dashboard/admin/ultra`)

#### 1. Métricas de Plataforma
```
┌─────────────────────────────────────────────────────┐
│ 👥 Total Users       📦 Total Shipments            │
│     1,245                2,847                      │
│                                                      │
│ 💰 Total Revenue     💵 Platform Fees              │
│     $487,500             $48,750 (10%)             │
└─────────────────────────────────────────────────────┘
```

#### 2. Gestión de Usuarios

**Tabla de usuarios con:**
- ID
- Name
- Email
- Role (shipper/driver/admin/auditor)
- Status (active/inactive)
- Total shipments
- Rating
- Acciones:
  - Ver perfil
  - Activate/Deactivate
  - Change role
  - View history

**Filtros:**
- Por rol
- Por status
- Por rating
- Por fecha de registro

#### 3. Monitoreo de Shipments

**Vista global:**
- Todos los shipments de la plataforma
- Filtro por status
- Filtro por shipper
- Filtro por driver
- Timeline de eventos

**Métricas:**
- Shipments activos
- Completados hoy
- Completados este mes
- Tasa de completación
- Tiempo promedio de entrega

#### 4. Sistema de Penalties

**Aplicar penalty:**
```
Campos:
- Driver (seleccionar)
- Shipment (opcional)
- Tipo:
  - late_pickup
  - late_delivery
  - no_show
  - damaged_cargo
  - unprofessional_behavior
  - policy_violation
- Amount ($)
- Reason (descripción)
```

**Ver penalties activas:**
- Lista de todas las penalties
- Filtro por driver
- Filtro por tipo
- Filtro por status (paid/unpaid)
- Total amount

#### 5. PODs Sospechosos

**Fraud Detection:**
- Lista de PODs con fraud score > 50
- AI analysis details
- Foto del POD
- GPS coordinates
- Acciones:
  - Aprobar (override AI)
  - Rechazar
  - Contactar driver
  - Aplicar penalty

#### 6. Top Performers

**Mejores Drivers:**
- Top 10 por rating
- Top 10 por deliveries
- Top 10 por earnings
- Top 10 por on-time rate

**Mejores Shippers:**
- Top 10 por volume
- Top 10 por revenue
- Top 10 por rating

#### 7. Analytics Avanzado

**Gráficas disponibles:**
- Revenue over time (line chart)
- Shipments by status (pie chart)
- Deliveries by driver (bar chart)
- Platform fees (area chart)
- Geographic heatmap

---

## 💰 Sistema de Wallet

### Funcionalidades

#### 1. Balance
```
Available Balance:    $2,450.00
Pending Balance:      $1,200.00  (in active shipments)
Total Earnings:       $45,780.00
Total Spent:          $3,450.00
```

#### 2. Add Funds (Shipper)
- Integración con Stripe
- Métodos:
  - Credit card
  - Bank transfer
  - ACH
- Mínimo: $10
- Máximo: $10,000 por transacción

#### 3. Withdraw Funds (Driver)
- Mínimo: $50
- Procesamiento: 1-3 días hábiles
- Opciones:
  - Bank transfer
  - PayPal
  - Check

#### 4. Transacciones

**Tipos:**
- `payment` - Pago de shipment
- `refund` - Reembolso
- `penalty` - Penalty aplicada
- `bonus` - Bonus otorgado
- `withdrawal` - Retiro de fondos
- `deposit` - Depósito de fondos
- `platform_fee` - Comisión de plataforma

**Estados:**
- `pending` - Pendiente
- `completed` - Completado
- `failed` - Fallido
- `cancelled` - Cancelado

#### 5. Platform Fees

**Estructura:**
- 10% del shipment price
- Deducido automáticamente
- Driver recibe 90%
- Shipper paga el 100%

**Ejemplo:**
```
Shipment price:    $1,000.00
Platform fee:      -$100.00  (10%)
Driver payout:     $900.00   (90%)
```

---

## ⭐ Sistema de Reviews

### Características

#### 1. Review Bidireccional

**Shipper → Driver:**
- Después de cada shipment completado
- Rating 1-5 estrellas
- Comentario
- Criterios sugeridos:
  - Puntualidad
  - Profesionalismo
  - Comunicación
  - Condición de la carga

**Driver → Shipper:**
- Después de cada shipment completado
- Rating 1-5 estrellas
- Comentario
- Criterios sugeridos:
  - Claridad de instrucciones
  - Facilidad de pickup/dropoff
  - Pago puntual
  - Trato profesional

#### 2. Rating Promedio

**Cálculo:**
```
Average Rating = SUM(all ratings) / COUNT(reviews)
```

Actualizado automáticamente después de cada review.

#### 3. Impacto en el Sistema

**Para Drivers:**
- Rating bajo (< 3.0):
  - Menos prioridad en AI assignment
  - Puede requerir re-certificación
  - Puede resultar en suspensión
- Rating alto (> 4.5):
  - Mayor prioridad en AI assignment
  - Badge de "Top Performer"
  - Bonos potenciales

**Para Shippers:**
- Rating bajo (< 3.0):
  - Drivers pueden declinar cargas
  - Requiere pre-pago
- Rating alto (> 4.5):
  - Drivers prefieren sus cargas
  - Mejor servicio

#### 4. Público vs Privado

**Review Pública:**
- Visible en perfil
- Cuenta para rating promedio
- Otros usuarios pueden ver

**Review Privada:**
- Solo visible para el usuario y admins
- Cuenta para rating promedio
- Útil para feedback constructivo

---

## ⚠️ Sistema de Penalties

### Tipos de Penalties

#### 1. Late Pickup
- **Trigger:** Llegar > 30 min tarde al pickup
- **Amount:** $50 - $200
- **Calculado:** $50 base + $5 por cada 10 min adicionales

#### 2. Late Delivery
- **Trigger:** Entregar > 1 hora tarde
- **Amount:** $100 - $500
- **Calculado:** $100 base + $10 por cada hora adicional

#### 3. No Show
- **Trigger:** No presentarse al pickup
- **Amount:** $200 - $500
- **Impacto:** Afecta severamente el rating

#### 4. Damaged Cargo
- **Trigger:** Carga dañada durante transporte
- **Amount:** Variable (basado en valor de carga)
- **Proceso:** Requiere evidencia fotográfica

#### 5. Unprofessional Behavior
- **Trigger:** Reportes de mal comportamiento
- **Amount:** $50 - $300
- **Proceso:** Requiere revisión manual

#### 6. Policy Violation
- **Trigger:** Violación de políticas de la plataforma
- **Amount:** $100 - $1,000
- **Puede resultar en suspensión**

### Proceso de Penalty

1. **Detección:**
   - Automática (por sistema) o
   - Manual (por admin/shipper)

2. **Notificación:**
   - Driver recibe notificación
   - Detalle de la penalty
   - Razón específica

3. **Pago:**
   - Deducido automáticamente del balance
   - Si balance insuficiente, se marca como "unpaid"
   - Driver no puede recibir nuevas cargas hasta pagar

4. **Apelación:**
   - Driver puede contestar
   - Admin revisa el caso
   - Puede ser reversada

---

## 🔔 Notificaciones

### Tipos de Notificaciones

#### 1. Shipment Updates
```
📦 Shipment #L-12345 status changed to "in_transit"
Your driver is on the way to dropoff location.
```

#### 2. Payment Received
```
💰 Payment received: $450.00
Your shipment #L-12345 payment has been processed.
```

#### 3. Penalty Applied
```
⚠️ Penalty Applied: Late Delivery
Amount: $100.00
Shipment: #L-12345
Reason: Delivered 2 hours late
```

#### 4. New Message
```
💬 New message from John Smith
"Can you pick up the load 30 minutes earlier?"
```

#### 5. System Alert
```
🔔 System Maintenance
Scheduled maintenance on Sunday 2am-4am EST
```

#### 6. Promotion
```
🎉 Special Offer!
Get 20% off platform fees this weekend!
```

### WebSocket Real-time

**Todas las notificaciones se envían instantáneamente via WebSocket:**
```javascript
socket.on('notification', (data) => {
  // Show notification toast
  // Update notification counter
  // Play notification sound
});
```

**Canales:**
- `user-{userId}` - Notificaciones personales
- `shipment-{shipmentId}` - Updates de shipment específico

---

## 📈 Analytics Avanzado

### Métricas para Drivers

#### 1. Performance Metrics
```
Total Deliveries:        87
On-Time Deliveries:      84  (96.6%)
Late Deliveries:         3   (3.4%)
Average Rating:          4.8/5.0
Total Earnings:          $45,780.00
Total Miles:             12,450
Total Penalties:         $150.00
Efficiency Score:        94/100
Customer Satisfaction:   4.8/5.0
```

#### 2. Shipment Analytics
Para cada shipment completado:
- `actualDistance` - Distancia real recorrida
- `fuelEfficiency` - Eficiencia de combustible
- `routeDeviation` - Desviación de la ruta sugerida
- `stopsCount` - Número de paradas
- `idleTimeMinutes` - Tiempo ocioso
- `averageSpeed` - Velocidad promedio
- `weatherImpact` - Impacto del clima
- `trafficImpact` - Impacto del tráfico
- `profitabilityScore` - Score de rentabilidad

#### 3. AI Recommendations
```
Recommendations for Driver John Smith:
- ✅ Excellent on-time performance
- ⚠️  Consider optimizing fuel efficiency (current: 6.2 mpg)
- 💡 You excel at long-haul deliveries (500+ miles)
- 💡 Best performance hours: 6am - 2pm
- 💡 Recommended routes: Interstate highways
```

### Métricas para Shippers

#### 1. Business Analytics
```
Total Shipments:         125
Active Loads:            8
Completed This Month:    23
Total Revenue:           $487,500
Average Shipment Value:  $3,900
Top Driver:              John Smith (45 deliveries)
Average Delivery Time:   2.3 days
Customer Satisfaction:   4.7/5.0
```

#### 2. Cost Analysis
```
Total Spent:             $487,500
Platform Fees:           $48,750  (10%)
Average Cost per Mile:   $2.45
Most Expensive Route:    CA → NY ($4,500)
Most Frequent Route:     TX → FL (18 shipments)
```

### Métricas para Admins

#### 1. Platform Analytics
```
Total Users:             1,245
  - Shippers:            345
  - Drivers:             850
  - Admins:              45
  - Auditors:            5

Total Shipments:         2,847
Active Shipments:        156
Completed Today:         45
Completed This Month:    876

Total Revenue:           $8,450,250
Platform Fees:           $845,025  (10%)
Average Transaction:     $2,970

Top Performing Driver:   John Smith (287 deliveries, 4.9★)
Top Shipper by Volume:   ABC Logistics (456 shipments)
```

#### 2. System Health
```
API Response Time:       45ms (avg)
Database Queries:        2,340/min
WebSocket Connections:   456 active
Uptime:                  99.97%
Error Rate:              0.03%
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://your-domain.com/api/v1
```

### Authentication

**All protected endpoints require JWT token:**
```
Headers:
Authorization: Bearer <your_jwt_token>
```

### Endpoints Reference

#### Authentication
```
POST   /auth/register       - Register new user
POST   /auth/login          - Login
GET    /auth/profile        - Get current user profile
```

#### Shipments
```
GET    /shipments           - List shipments (filtered by role)
POST   /shipments           - Create shipment (shipper)
GET    /shipments/:id       - Get shipment details
PATCH  /shipments/:id/status - Update status
POST   /shipments/:id/assign - Assign driver (shipper)
GET    /shipments/available - Available shipments (driver)
POST   /shipments/:id/pod   - Upload POD (driver)
GET    /shipments/:id/pod-events - Get POD events
```

#### Drivers
```
GET    /drivers             - List all drivers
GET    /drivers/profile     - Get driver profile
PATCH  /drivers/profile     - Update driver profile
POST   /drivers/location    - Update GPS location
GET    /drivers/locations   - Get all driver locations
GET    /drivers/:id/location-history - Location history
POST   /drivers/:id/verify-carrier - Verify MC/DOT
GET    /drivers/:id/verifications - Get verifications
```

#### Analytics
```
GET    /analytics/shipper/:id - Shipper stats
GET    /analytics/driver/:id  - Driver stats
GET    /analytics/admin       - Platform stats (admin)
```

#### Wallet
```
GET    /wallet              - Get wallet balance
POST   /wallet/add-funds    - Add funds (shipper)
POST   /wallet/withdraw     - Withdraw funds (driver)
GET    /wallet/transactions - Transaction history
```

#### Notifications
```
GET    /notifications       - List notifications
PUT    /notifications/:id/read - Mark as read
PUT    /notifications/read-all - Mark all as read
DELETE /notifications/:id   - Delete notification
```

#### Reviews
```
POST   /reviews             - Create review
GET    /reviews/driver/:id  - Driver reviews
GET    /reviews/shipper/:id - Shipper reviews
GET    /reviews/shipment/:id - Shipment reviews
```

#### Admin
```
GET    /admin/users         - Manage users (admin)
PUT    /admin/users/:id/status - Activate/deactivate user
POST   /admin/penalties     - Apply penalty (admin)
GET    /admin/penalties     - List penalties (admin)
GET    /admin/shipments     - All shipments (admin)
GET    /admin/suspicious-pods - PODs with high fraud score
```

### Error Responses

**Standard error format:**
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "field": "field_name"  // for validation errors
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Configuración Avanzada

### Environment Variables

**Backend (.env):**
```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
PORT=3001

# Optional but recommended
OPENAI_API_KEY=sk-...       # For AI features
STRIPE_SECRET_KEY=sk_test_... # For payments
FMCSA_API_KEY=...           # For carrier verification
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### Database Configuration

**PostgreSQL recommended settings:**
```
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
```

### WebSocket Configuration

**Socket.IO events:**
```javascript
// Client-side
socket.emit('join-room', userId);
socket.emit('join-shipment', shipmentId);
socket.emit('location-update', { driverId, lat, lng });

// Server-side
io.to(`user-${userId}`).emit('notification', data);
io.to(`shipment-${shipmentId}`).emit('status-update', data);
io.emit('driver-location', { driverId, lat, lng });
```

---

## 🎯 Best Practices

### Para Shippers
1. **Crear shipments con información completa**
2. **Aprobar PODs rápidamente** para que drivers reciban pago
3. **Dejar reviews constructivos**
4. **Mantener balance en wallet** para pagos rápidos
5. **Comunicarse claramente con drivers**

### Para Drivers
1. **Mantener GPS tracking activado** durante deliveries
2. **Actualizar status frecuentemente**
3. **Tomar fotos claras** para POD
4. **Llegar a tiempo** para evitar penalties
5. **Comunicarse proactivamente** si hay problemas

### Para Admins
1. **Revisar PODs sospechosos diariamente**
2. **Monitorear métricas de plataforma**
3. **Responder a disputas rápidamente**
4. **Mantener configuración actualizada**
5. **Realizar auditorías periódicas**

---

## 📞 Soporte

Para ayuda adicional:
- Ver COMMANDS.md para referencia rápida
- Consultar API health endpoint: `/api/v1/health`
- Revisar logs del servidor
- Contactar a soporte técnico

---

**© 2024 Grand Eagle Logistics - Ultimate Platform**
🦅 *"Soar High, Deliver Fast!"*
