-- Script para criar o banco (se não existir) e um usuário dedicado 'ironfit'
-- Execute como usuário administrador do MySQL (ex.: mysql -u root -p < create_db_user.sql)

CREATE DATABASE IF NOT EXISTS sistemaTmbNdcImc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'ironfit'@'localhost' IDENTIFIED BY 'IronFit2026';

GRANT ALL PRIVILEGES ON sistemaTmbNdcImc.* TO 'ironfit'@'localhost';

FLUSH PRIVILEGES;

-- Observação: se você usa Docker/WSL ou outro host, ajuste 'localhost' para o host apropriado.
