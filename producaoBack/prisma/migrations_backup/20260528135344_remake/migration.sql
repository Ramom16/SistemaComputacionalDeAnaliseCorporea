/*
  Warnings:

  - You are about to drop the column `data_registro` on the `dados_corporais` table. All the data in the column will be lost.
  - You are about to alter the column `altura_cm` on the `dados_corporais` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(5,2)`.
  - Added the required column `data_atualizacao_calculo` to the `calculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao_dados` to the `dados_corporais` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calculos` ADD COLUMN `data_atualizacao_calculo` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `dados_corporais` DROP COLUMN `data_registro`,
    ADD COLUMN `data_atualizacao_dados` DATETIME(3) NOT NULL,
    ADD COLUMN `data_registro_Inicial` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `altura_cm` DECIMAL(5, 2) NOT NULL;
