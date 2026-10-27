/*
  Warnings:

  - You are about to drop the `logs_autenticacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessoes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `logs_autenticacao` DROP FOREIGN KEY `logs_autenticacao_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `sessoes` DROP FOREIGN KEY `sessoes_usuarioId_fkey`;

-- DropTable
DROP TABLE `logs_autenticacao`;

-- DropTable
DROP TABLE `sessoes`;
