import * as XLSX from 'xlsx';
import * as path from 'path';

// Script para visualizar a estrutura de uma aba específica
const excelFilePath = path.join(__dirname, '../../setembro22.xlsx');

try {
  const workbook = XLSX.readFile(excelFilePath);
  
  // Pegar uma aba mensal para ver a estrutura
  const sheetName = 'jan26'; // Vamos ver a mais recente
  console.log(`📄 Analisando aba: "${sheetName}"\n`);
  
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  
  console.log('=== DADOS BRUTOS (primeiras 10 linhas) ===');
  rawData.slice(0, 10).forEach((row: any, index: number) => {
    console.log(`Linha ${index + 1}:`, row);
  });
  
  console.log('\n=== DADOS COM CABEÇALHO (primeiras 5 registros) ===');
  const dataWithHeader = XLSX.utils.sheet_to_json(worksheet);
  console.log(JSON.stringify(dataWithHeader.slice(0, 5), null, 2));
  
} catch (error) {
  console.error('❌ Erro ao ler arquivo:', error.message);
}
