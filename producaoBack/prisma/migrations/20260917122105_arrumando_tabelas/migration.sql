/*
  Warnings:

  - You are about to drop the column `nome` on the `perfil` table. All the data in the column will be lost.
  - You are about to drop the `usuarios_perfil` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idUsuario]` on the table `perfil` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUsuario` to the `perfil` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idPerfil_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios_perfil` DROP FOREIGN KEY `usuarios_perfil_idUsuario_fkey`;

-- AlterTable
ALTER TABLE `calculos` MODIFY `data_calculo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `dados_corporais` MODIFY `data_registro_Inicial` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `email_verification_tokens` MODIFY `expira_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `usado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `historico_corporal` MODIFY `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `password_reset_tokens` MODIFY `expira_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `usado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `perfil` DROP COLUMN `nome`,
    ADD COLUMN `fotoPerfil` VARCHAR(255) NULL,
    ADD COLUMN `idUsuario` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `treinos` MODIFY `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usuarios` MODIFY `ultimo_login` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `bloqueado_ate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `usuarios_perfil`;

-- CreateIndex
CREATE UNIQUE INDEX `perfil_idUsuario_key` ON `perfil`(`idUsuario`);

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `perfil_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
