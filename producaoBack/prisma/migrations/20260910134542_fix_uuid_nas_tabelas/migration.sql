/*
  Warnings:

  - The primary key for the `calculos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dados_corporais` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `email_verification_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exercicios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `historico_corporal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `password_reset_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `perfil` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `treinos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `treinos_exercicios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usuarios_perfil` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
ALTER TABLE `password_reset_tokens` DROP FOREIGN KEY `password_reset_tokens_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `treinos` DROP FOREIGN KEY `treinos_idCalculo_fkey`;

-- DropForeignKey
ALTER TABLE `treinos` DROP FOREIGN KEY `treinos_idUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `treinos_exercicios` DROP FOREIGN KEY `treinos_exercicios_idExercicio_fkey`;

-- DropForeignKey
ALTER TABLE `treinos_exercicios` DROP FOREIGN KEY `treinos_exercicios_idTreino_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idPerfil_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idUsuario_fkey`;

-- AlterTable
ALTER TABLE `calculos` DROP PRIMARY KEY,
    MODIFY `idCalculo` VARCHAR(36) NOT NULL,
    MODIFY `idDados` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idCalculo`);

-- AlterTable
ALTER TABLE `dados_corporais` DROP PRIMARY KEY,
    MODIFY `idDados` VARCHAR(36) NOT NULL,
    MODIFY `idUsuario` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idDados`);

-- AlterTable
ALTER TABLE `email_verification_tokens` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `usuarioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `exercicios` DROP PRIMARY KEY,
    MODIFY `idExercicio` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idExercicio`);

-- AlterTable
ALTER TABLE `historico_corporal` DROP PRIMARY KEY,
    MODIFY `idHistorico` VARCHAR(36) NOT NULL,
    MODIFY `idDados` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idHistorico`);

-- AlterTable
ALTER TABLE `password_reset_tokens` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `usuarioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `perfil` DROP PRIMARY KEY,
    MODIFY `idPerfil` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idPerfil`);

-- AlterTable
ALTER TABLE `treinos` DROP PRIMARY KEY,
    MODIFY `idTreino` VARCHAR(36) NOT NULL,
    MODIFY `idCalculo` VARCHAR(191) NULL,
    MODIFY `idUsuario` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`idTreino`);

-- AlterTable
ALTER TABLE `treinos_exercicios` DROP PRIMARY KEY,
    MODIFY `idTreino` VARCHAR(191) NOT NULL,
    MODIFY `idExercicio` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idTreino`, `idExercicio`);

-- AlterTable
ALTER TABLE `usuarios` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuarios_perfil` DROP PRIMARY KEY,
    MODIFY `idUsuario` VARCHAR(191) NOT NULL,
    MODIFY `idPerfil` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idUsuario`, `idPerfil`);

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
ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idTreino_fkey` FOREIGN KEY (`idTreino`) REFERENCES `treinos`(`idTreino`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idExercicio_fkey` FOREIGN KEY (`idExercicio`) REFERENCES `exercicios`(`idExercicio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_corporal` ADD CONSTRAINT `historico_corporal_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE CASCADE ON UPDATE CASCADE;
