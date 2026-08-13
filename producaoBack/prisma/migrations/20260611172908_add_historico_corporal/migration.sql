-- CreateTable
CREATE TABLE `historico_corporal` (
    `idHistorico` INTEGER NOT NULL AUTO_INCREMENT,
    `idDados` INTEGER NOT NULL,
    `peso_kg` DECIMAL(10, 2) NOT NULL,
    `altura_cm` DECIMAL(5, 2) NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    `idade` INTEGER NOT NULL,
    `nivel_atividade` ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso') NOT NULL,
    `imc` DECIMAL(10, 2) NOT NULL,
    `tmb` DECIMAL(10, 2) NOT NULL,
    `ndc` DECIMAL(10, 2) NOT NULL,
    `criado_em` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `historico_corporal_idDados_idx`(`idDados`),
    INDEX `historico_corporal_criado_em_idx`(`criado_em`),
    PRIMARY KEY (`idHistorico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historico_corporal` ADD CONSTRAINT `historico_corporal_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE RESTRICT ON UPDATE CASCADE;
