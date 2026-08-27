-- AlterTable
ALTER TABLE `exercicios` ADD COLUMN `grupo_muscular` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `treinos` ADD COLUMN `idUsuario` INTEGER NULL,
    ADD COLUMN `is_oficial` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `titulo` VARCHAR(150) NOT NULL DEFAULT 'Novo Treino',
    MODIFY `idCalculo` INTEGER NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX `treinos_idUsuario_idx` ON `treinos`(`idUsuario`);

-- AddForeignKey
ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
