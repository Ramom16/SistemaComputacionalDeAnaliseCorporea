import prisma from '../src/database/prismaClient.js';
async function main() {
  try {
    console.log('Verificando e adicionando colunas push_token e fcm_token...');
    const colunas = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME IN ('push_token', 'fcm_token');
    `);
    const colunasExistentes = colunas.map(c => c.COLUMN_NAME);
    if (!colunasExistentes.includes('push_token')) {
      await prisma.$executeRawUnsafe(`ALTER TABLE usuarios ADD COLUMN push_token VARCHAR(255) NULL;`);
      console.log('Coluna push_token adicionada com sucesso.');
    } else {
      console.log('Coluna push_token já existe.');
    }
    if (!colunasExistentes.includes('fcm_token')) {
      await prisma.$executeRawUnsafe(`ALTER TABLE usuarios ADD COLUMN fcm_token VARCHAR(255) NULL;`);
      console.log('Coluna fcm_token adicionada com sucesso.');
    } else {
      console.log('Coluna fcm_token já existe.');
    }
    console.log('✅ Migração de tokens concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();