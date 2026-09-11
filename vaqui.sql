-- ============================================================
-- VAQUI
-- Motor: MySQL 8+
-- Módulos: usuarios, cuentas, categorías, movimientos
--          (ingresos/gastos) y deudas
-- ============================================================

CREATE DATABASE IF NOT EXISTS vaqui
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vaqui;

DROP TABLE IF EXISTS deudas;
DROP TABLE IF EXISTS movimientos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS cuentas;
DROP TABLE IF EXISTS usuarios;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- Soporta US8 (registro) y US7 (login)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)      NOT NULL,
    correo          VARCHAR(150)      NOT NULL,
    password_hash   VARCHAR(255)      NOT NULL,
    activo          TINYINT(1)        NOT NULL DEFAULT 1,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuarios_correo UNIQUE (correo),
    CONSTRAINT chk_usuarios_correo_formato
        CHECK (correo LIKE '%_@__%.__%'),
    CONSTRAINT chk_usuarios_password_hash_len
        CHECK (CHAR_LENGTH(password_hash) >= 20)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: cuentas
-- Soporta US1 (visualizar entidades/cuentas con su monto)
-- ------------------------------------------------------------
CREATE TABLE cuentas (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED      NOT NULL,
    nombre          VARCHAR(100)      NOT NULL,
    tipo            ENUM('ahorros','corriente','efectivo','tarjeta','otro')
                                       NOT NULL DEFAULT 'otro',
    saldo           DECIMAL(12,2)     NOT NULL DEFAULT 0.00,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cuentas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,

    INDEX idx_cuentas_usuario_id (usuario_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: categorias
-- Clasifica ingresos y gastos (ej: comida, transporte, sueldo)
-- ------------------------------------------------------------
CREATE TABLE categorias (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED      NOT NULL,
    nombre          VARCHAR(60)       NOT NULL,
    tipo            ENUM('ingreso','gasto')  NOT NULL,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categorias_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_categorias_usuario_nombre_tipo
        UNIQUE (usuario_id, nombre, tipo),

    INDEX idx_categorias_usuario_id (usuario_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: movimientos
-- Ingresos y gastos asociados a una cuenta (US2, Sprint 2)
-- ------------------------------------------------------------
CREATE TABLE movimientos (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED      NOT NULL,
    cuenta_id       INT UNSIGNED      NOT NULL,
    categoria_id    INT UNSIGNED      NULL,
    tipo            ENUM('ingreso','gasto')  NOT NULL,
    monto           DECIMAL(12,2)     NOT NULL,
    descripcion     VARCHAR(200)      NULL,
    fecha           DATE              NOT NULL,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimientos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_movimientos_cuenta
        FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_movimientos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_movimientos_monto_positivo
        CHECK (monto > 0),  -- el signo lo da `tipo`, no el monto

    INDEX idx_movimientos_usuario_id (usuario_id),
    INDEX idx_movimientos_cuenta_id (cuenta_id),
    INDEX idx_movimientos_fecha (fecha)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: deudas
-- Deudas del usuario (con o sin relación directa a una cuenta)
-- ------------------------------------------------------------
CREATE TABLE deudas (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED      NOT NULL,
    cuenta_id       INT UNSIGNED      NULL,
    acreedor        VARCHAR(100)      NOT NULL,
    monto_total     DECIMAL(12,2)     NOT NULL,
    monto_pagado    DECIMAL(12,2)     NOT NULL DEFAULT 0.00,
    fecha_limite    DATE              NULL,
    estado          ENUM('pendiente','parcial','pagada')
                                       NOT NULL DEFAULT 'pendiente',
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_deudas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_deudas_cuenta
        FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_deudas_montos
        CHECK (monto_total > 0 AND monto_pagado >= 0
               AND monto_pagado <= monto_total),

    INDEX idx_deudas_usuario_id (usuario_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Vista: total consolidado por usuario (US1)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vista_total_por_usuario AS
SELECT
    u.id            AS usuario_id,
    u.nombre        AS usuario_nombre,
    COUNT(c.id)     AS numero_cuentas,
    COALESCE(SUM(c.saldo), 0.00) AS saldo_total
FROM usuarios u
LEFT JOIN cuentas c ON c.usuario_id = u.id
GROUP BY u.id, u.nombre;

-- ------------------------------------------------------------
-- Vista: resumen mensual de ingresos y gastos por usuario
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vista_resumen_mensual AS
SELECT
    usuario_id,
    DATE_FORMAT(fecha, '%Y-%m')            AS mes,
    SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN tipo = 'gasto'   THEN monto ELSE 0 END) AS total_gastos
FROM movimientos
GROUP BY usuario_id, DATE_FORMAT(fecha, '%Y-%m');

-- ------------------------------------------------------------
-- Consultas de referencia (uso obligatorio: filtrar por sesión)
-- ------------------------------------------------------------

-- Cuentas del usuario autenticado
-- SELECT id, nombre, tipo, saldo
-- FROM cuentas
-- WHERE usuario_id = :usuario_sesion
-- ORDER BY created_at;

-- Movimientos recientes del usuario autenticado
-- SELECT m.id, m.tipo, m.monto, m.fecha, c.nombre AS categoria
-- FROM movimientos m
-- LEFT JOIN categorias c ON c.id = m.categoria_id
-- WHERE m.usuario_id = :usuario_sesion
-- ORDER BY m.fecha DESC;

-- Deudas pendientes del usuario autenticado
-- SELECT id, acreedor, monto_total, monto_pagado, estado
-- FROM deudas
-- WHERE usuario_id = :usuario_sesion AND estado <> 'pagada';

-- ============================================================
-- Regla de seguridad por usuario
-- ============================================================
-- Toda consulta a cuentas, categorías, movimientos y deudas
-- filtra por usuario_id tomado de la sesión del backend, nunca
-- de un parámetro enviado por el cliente. Ningún usuario puede
-- ver ni modificar información de otro usuario.
-- ============================================================