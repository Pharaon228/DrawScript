const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Явно указанный путь к директории с Chromium
const sourceDir = 'C:\\Users\\Artem\\.cache\\puppeteer\\chrome\\win64-122.0.6261.128\\chrome-win64';
// Путь к директории, куда будут скопированы файлы Chromium
const targetDir = path.join(__dirname, 'AutoDrawScriptDirectory', 'puppeteer');

// Проверяем, существует ли директория с Chromium
if (!fs.existsSync(sourceDir)) {
    console.error('Директория с Chromium не найдена:', sourceDir);
    process.exit(1);
}

// Создание директории для Chromium, если она еще не существует
fs.mkdirSync(targetDir, { recursive: true });

// Копирование файлов Chromium
fs.readdirSync(sourceDir).forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    // Проверяем, доступен ли файл для чтения
    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
        try {
            fs.copyFileSync(sourcePath, targetPath);
        } catch (error) {
            console.error('Ошибка копирования файла:', sourcePath, '->', targetPath, error);
        }
    }
});

// Запуск pkg для сборки приложения
console.log('Building application with pkg...');
execSync('pkg . --output AutoDrawScriptDirectory/AutoDrawScript.exe', { stdio: 'inherit' });
console.log('Build completed.');
