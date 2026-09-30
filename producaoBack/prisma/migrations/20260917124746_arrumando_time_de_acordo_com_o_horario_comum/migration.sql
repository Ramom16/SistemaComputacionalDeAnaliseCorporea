/*
  Warnings:

  - You are about to alter the column `grupo_muscular` on the `treinos_exercicios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `Enum(EnumId(6))`.
  - Made the column `grupo_muscular` on table `exercicios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `exercicios` MODIFY `grupo_muscular` ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio') NOT NULL;

-- AlterTable
ALTER TABLE `treinos_exercicios` MODIFY `grupo_muscular` ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio') NOT NULL;
