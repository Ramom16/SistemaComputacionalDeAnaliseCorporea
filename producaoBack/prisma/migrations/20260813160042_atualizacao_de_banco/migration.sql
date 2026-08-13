/*
  Warnings:

  - You are about to drop the column `token` on the `email_verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `email_verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_hash` to the `email_verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `calculos` DROP FOREIGN KEY `calculos_idDados_fkey`;

-- DropForeignKey
ALTER TABLE `dados_corporais` DROP FOREIGN KEY `dados_corporais_idUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `email_verification_tokens` DROP FOREIGN KEY `email_verification_tokens_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `historico_corporal` DROP FOREIGN KEY `historico_corporal_idDados_fkey`;

-- DropForeignKey
ALTER TABLE `treinos` DROP FOREIGN KEY `treinos_idCalculo_fkey`;

-- DropForeignKey
ALTER TABLE `treinos_exercicios` DROP FOREIGN KEY `treinos_exercicios_idExercicio_fkey`;

-- DropForeignKey
ALTER TABLE `treinos_exercicios` DROP FOREIGN KEY `treinos_exercicios_idTreino_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idPerfil_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idUsuario_fkey`;

-- DropIndex
DROP INDEX `email_verification_tokens_token_key` ON `email_verification_tokens`;

-- AlterTable
ALTER TABLE `email_verification_tokens` DROP COLUMN `token`,
    ADD COLUMN `token_hash` VARCHAR(64) NOT NULL,
    ADD COLUMN `usado_em` TIMESTAMP(0) NULL,
    MODIFY `expira_em` TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `bloqueado_ate` TIMESTAMP(0) NULL,
    ADD COLUMN `tentativas_login` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_hash` VARCHAR(64) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `expira_em` TIMESTAMP(0) NOT NULL,
    `usado_em` TIMESTAMP(0) NULL,
    `criado_em` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `password_reset_tokens_token_hash_key`(`token_hash`),
    INDEX `password_reset_tokens_usuarioId_idx`(`usuarioId`),
    INDEX `password_reset_tokens_expira_em_idx`(`expira_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `jti` VARCHAR(255) NOT NULL,
    `criado_em` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expira_em` TIMESTAMP(0) NOT NULL,
    `revogado_em` TIMESTAMP(0) NULL,
    `ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,

    UNIQUE INDEX `sessoes_jti_key`(`jti`),
    INDEX `sessoes_usuarioId_idx`(`usuarioId`),
    INDEX `sessoes_expira_em_idx`(`expira_em`),
    INDEX `sessoes_revogado_em_idx`(`revogado_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_autenticacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NULL,
    `evento` ENUM('LOGIN_SUCESSO', 'LOGIN_FALHA', 'LOGOUT', 'SESSAO_REVOGADA', 'EMAIL_VERIFICADO', 'EMAIL_VERIFICACAO_SOLICITADA', 'EMAIL_VERIFICACAO_EXPIRADA', 'SENHA_ALTERADA', 'RECUPERACAO_SOLICITADA', 'RECUPERACAO_CONCLUIDA', 'CONTA_BLOQUEADA', 'CONTA_DESBLOQUEADA') NOT NULL,
    `sucesso` BOOLEAN NOT NULL DEFAULT false,
    `ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `criado_em` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `logs_autenticacao_usuarioId_idx`(`usuarioId`),
    INDEX `logs_autenticacao_evento_idx`(`evento`),
    INDEX `logs_autenticacao_criado_em_idx`(`criado_em`),
    INDEX `logs_autenticacao_ip_idx`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `email_verification_tokens_token_hash_key` ON `email_verification_tokens`(`token_hash`);

-- CreateIndex
CREATE INDEX `email_verification_tokens_expira_em_idx` ON `email_verification_tokens`(`expira_em`);

-- AddForeignKey
ALTER TABLE `usuarios_perfil` ADD CONSTRAINT `usuarios_perfil_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_perfil` ADD CONSTRAINT `usuarios_perfil_idPerfil_fkey` FOREIGN KEY (`idPerfil`) REFERENCES `perfil`(`idPerfil`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dados_corporais` ADD CONSTRAINT `dados_corporais_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculos` ADD CONSTRAINT `calculos_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idCalculo_fkey` FOREIGN KEY (`idCalculo`) REFERENCES `calculos`(`idCalculo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idTreino_fkey` FOREIGN KEY (`idTreino`) REFERENCES `treinos`(`idTreino`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idExercicio_fkey` FOREIGN KEY (`idExercicio`) REFERENCES `exercicios`(`idExercicio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs_autenticacao` ADD CONSTRAINT `logs_autenticacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_corporal` ADD CONSTRAINT `historico_corporal_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `calculos` RENAME INDEX `calculos_idDados_fkey` TO `calculos_idDados_idx`;

-- RenameIndex
ALTER TABLE `email_verification_tokens` RENAME INDEX `email_verification_tokens_usuarioId_fkey` TO `email_verification_tokens_usuarioId_idx`;

-- RenameIndex
ALTER TABLE `treinos` RENAME INDEX `treinos_idCalculo_fkey` TO `treinos_idCalculo_idx`;

-- RenameIndex
ALTER TABLE `treinos_exercicios` RENAME INDEX `treinos_exercicios_idExercicio_fkey` TO `treinos_exercicios_idExercicio_idx`;

-- RenameIndex
ALTER TABLE `usuarios_perfil` RENAME INDEX `usuarios_perfil_idPerfil_fkey` TO `usuarios_perfil_idPerfil_idx`;
