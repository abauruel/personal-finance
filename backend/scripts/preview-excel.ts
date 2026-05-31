import * as XLSX from 'xlsx';
import * as path from 'path';

// Script para visualizar a estrutura do arquivo Excel
const excelFilePath = path.join(__dirname, '../../setembro22.xlsx');

try {
  const workbook = XLSX.readFile(excelFilePath);
  
  console.log('📊 Abas encontradas:', workbook.SheetNames);
  console.log('\n');
  
  // Mostrar estrutura da primeira aba como exemplo
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`📄 Exemplo da aba "${firstSheetName}":`);
  console.log('Primeiras 5 linhas:');
  data.slice(0, 5).forEach((row: any, index: number) => {
    console.log(`Linha ${index + 1}:`, row);
  });
  
  console.log('\n');
  console.log('Dados com cabeçalho:');
  const dataWithHeader = XLSX.utils.sheet_to_json(worksheet);
  console.log(dataWithHeader.slice(0, 3));
  
} catch (error) {
  console.error('❌ Erro ao ler arquivo:', error.message);
}
