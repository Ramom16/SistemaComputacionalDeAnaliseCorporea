CREATE TABLE `usuarios` (
    `id` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `data_nascimento` DATE NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `push_token` VARCHAR(255) NULL,
    `fcm_token` VARCHAR(255) NULL,
    `ultimo_login` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tentativas_login` INTEGER NOT NULL DEFAULT 0,
    `bloqueado_ate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `perfil` (
    `idPerfil` VARCHAR(36) NOT NULL,
    `idUsuario` VARCHAR(36) NOT NULL,
    `fotoPerfil` VARCHAR(255) NULL,

    UNIQUE INDEX `perfil_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`idPerfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `dados_corporais` (
    `idDados` VARCHAR(36) NOT NULL,
    `idUsuario` VARCHAR(36) NOT NULL,
    `peso_kg` DECIMAL(10, 2) NOT NULL,
    `altura_cm` DECIMAL(5, 2) NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    `idade` INTEGER NOT NULL,
    `nivel_atividade` ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso') NOT NULL,
    `data_registro_Inicial` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_atualizacao_dados` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dados_corporais_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`idDados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `calculos` (
    `idCalculo` VARCHAR(36) NOT NULL,
    `idDados` VARCHAR(36) NOT NULL,
    `imc` DECIMAL(10, 2) NOT NULL,
    `tmb` DECIMAL(10, 2) NOT NULL,
    `ndc` DECIMAL(10, 2) NOT NULL,
    `data_calculo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_atualizacao_calculo` DATETIME(3) NOT NULL,

    INDEX `calculos_idDados_idx`(`idDados`),
    PRIMARY KEY (`idCalculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `treinos` (
    `idTreino` VARCHAR(36) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL DEFAULT 'Novo Treino',
    `idCalculo` VARCHAR(36) NULL,
    `idUsuario` VARCHAR(36) NULL,
    `objetivo` ENUM('Hipertrofia', 'Emagrecimento', 'Resistencia', 'Condicionamento') NOT NULL,
    `nivel` ENUM('Iniciante', 'Intermediario', 'Avancado') NOT NULL,
    `is_oficial` BOOLEAN NOT NULL DEFAULT false,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `treinos_idCalculo_idx`(`idCalculo`),
    INDEX `treinos_idUsuario_idx`(`idUsuario`),
    PRIMARY KEY (`idTreino`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `exercicios` (
    `idExercicio` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `grupo_muscular` ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio') NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `caminho_video` VARCHAR(255) NULL,

    PRIMARY KEY (`idExercicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `treinos_exercicios` (
    `idTreino` VARCHAR(36) NOT NULL,
    `idExercicio` VARCHAR(36) NOT NULL,
    `series` INTEGER NOT NULL,
    `descanso_segundos` INTEGER NOT NULL,
    `repeticoes` INTEGER NOT NULL,
    `grupo_muscular` ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio') NOT NULL,
    `tipo` ENUM('Forca', 'Cardio', 'Alongamento', 'Mobilidade') NOT NULL,

    INDEX `treinos_exercicios_idExercicio_idx`(`idExercicio`),
    PRIMARY KEY (`idTreino`, `idExercicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `email_verification_tokens` (
    `id` VARCHAR(36) NOT NULL,
    `token_hash` VARCHAR(64) NOT NULL,
    `usuarioId` VARCHAR(36) NOT NULL,
    `expira_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `email_verification_tokens_token_hash_key`(`token_hash`),
    INDEX `email_verification_tokens_usuarioId_idx`(`usuarioId`),
    INDEX `email_verification_tokens_expira_em_idx`(`expira_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(36) NOT NULL,
    `token_hash` VARCHAR(64) NOT NULL,
    `usuarioId` VARCHAR(36) NOT NULL,
    `expira_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usado_em` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_hash_key`(`token_hash`),
    INDEX `password_reset_tokens_usuarioId_idx`(`usuarioId`),
    INDEX `password_reset_tokens_expira_em_idx`(`expira_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `historico_corporal` (
    `idHistorico` VARCHAR(36) NOT NULL,
    `idDados` VARCHAR(36) NOT NULL,
    `peso_kg` DECIMAL(10, 2) NOT NULL,
    `altura_cm` DECIMAL(5, 2) NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    `idade` INTEGER NOT NULL,
    `nivel_atividade` ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso') NOT NULL,
    `imc` DECIMAL(10, 2) NOT NULL,
    `tmb` DECIMAL(10, 2) NOT NULL,
    `ndc` DECIMAL(10, 2) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historico_corporal_idDados_idx`(`idDados`),
    INDEX `historico_corporal_criado_em_idx`(`criado_em`),
    PRIMARY KEY (`idHistorico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `perfil` ADD CONSTRAINT `perfil_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `dados_corporais` ADD CONSTRAINT `dados_corporais_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `calculos` ADD CONSTRAINT `calculos_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idCalculo_fkey` FOREIGN KEY (`idCalculo`) REFERENCES `calculos`(`idCalculo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idTreino_fkey` FOREIGN KEY (`idTreino`) REFERENCES `treinos`(`idTreino`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idExercicio_fkey` FOREIGN KEY (`idExercicio`) REFERENCES `exercicios`(`idExercicio`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `historico_corporal` ADD CONSTRAINT `historico_corporal_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE CASCADE ON UPDATE CASCADE;

