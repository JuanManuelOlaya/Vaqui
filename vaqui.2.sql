-- 1. Tabla de usuario (en singular, estricto con el código base)
CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  hash_password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de cuenta (Gestión Financiera Básica)
CREATE TABLE IF NOT EXISTS cuenta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  tipo ENUM('efectivo', 'bancaria', 'billetera', 'ahorro') NOT NULL,
  saldo_inicial DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  archivada BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 3. Tabla de categoría (Personalizables por el usuario)
CREATE TABLE IF NOT EXISTS categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  tipo ENUM('gasto', 'ingreso') NOT NULL,
  icono VARCHAR(50) DEFAULT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 4. Tabla de movimiento (Ingresos y Gastos)
CREATE TABLE IF NOT EXISTS movimiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cuenta_id INT NOT NULL,
  categoria_id INT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  tipo ENUM('ingreso', 'gasto') NOT NULL,
  descripcion VARCHAR(255),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (cuenta_id) REFERENCES cuenta(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

-- 5. Planes de ahorro y aportes (Gestión de Ahorro)
CREATE TABLE IF NOT EXISTS planes_ahorro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre_meta VARCHAR(100) NOT NULL,
  monto_objetivo DECIMAL(12,2) NOT NULL,
  monto_actual DECIMAL(12,2) DEFAULT 0.00,
  fecha_limite DATE NOT NULL,
  estado ENUM('activo', 'completado', 'cancelado') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS aportes_ahorro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_ahorro_id INT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_ahorro_id) REFERENCES planes_ahorro(id) ON DELETE CASCADE
);

-- 6. Retos de ahorro semanales
CREATE TABLE IF NOT EXISTS retos_ahorro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  monto_meta DECIMAL(12,2) NOT NULL,
  semana INT NOT NULL,
  cumplido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 7. Divisor de cuentas entre amigos (Gastos compartidos)
CREATE TABLE IF NOT EXISTS gastos_compartidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  descripcion VARCHAR(150) NOT NULL,
  monto_total DECIMAL(12,2) NOT NULL,
  tipo_reparto VARCHAR(50) DEFAULT 'equitativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS participantes_gasto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gasto_compartido_id INT NOT NULL,
  nombre_participante VARCHAR(100) NOT NULL,
  monto_a_pagar DECIMAL(12,2) NOT NULL,
  pagado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (gasto_compartido_id) REFERENCES gastos_compartidos(id) ON DELETE CASCADE
);

-- 8. Gestión de deudas
CREATE TABLE IF NOT EXISTS deuda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tercero VARCHAR(80) NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  tipo ENUM('debo', 'me_deben') NOT NULL,
  fecha_limite DATE DEFAULT NULL,
  pagada BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 9. Alertas inteligentes y notificaciones
CREATE TABLE IF NOT EXISTS configuraciones_alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('exceso_gasto', 'saldo_bajo', 'recordatorio_ahorro') NOT NULL,
  umbral DECIMAL(12,2) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  UNIQUE KEY uk_usuario_tipo (usuario_id, tipo)
);

CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);