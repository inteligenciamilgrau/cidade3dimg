const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'blocks');

const oldCode = `            c2.fillStyle = '#eef7ff';
            c2.font = 'bold 56px Arial';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.fillText(monumentName, 256, 78);
            c2.font = 'bold 34px Arial';
            c2.fillStyle = '#6fd3ff';
            c2.fillText(aiModel, 256, 132);`;

const oldCodeTemplate = `            c2.fillStyle = '#eef7ff';
            c2.font = 'bold 56px Arial';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.fillText(monumentName, 256, 78);
            
            c2.font = 'bold 34px Arial';
            c2.fillStyle = '#6fd3ff';
            c2.fillText(aiModel, 256, 132);`;

const newCode = `            c2.fillStyle = '#eef7ff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 56;
            c2.font = 'bold ' + f1 + 'px Arial';
            while (c2.measureText(monumentName).width > 470 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Arial';
            }
            c2.fillText(monumentName, 256, 78);
            
            let f2 = 34;
            c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 470 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Arial';
            }
            c2.fillStyle = '#6fd3ff';
            c2.fillText(aiModel, 256, 132);`;

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.js') && file !== 'TEMPLATE.md') return;
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Trying various regex replaces because of CRLF etc
    content = content.replace(/c2\.fillStyle = '#eef7ff';\s*c2\.font = 'bold 56px Arial';\s*c2\.textAlign = 'center';\s*c2\.textBaseline = 'middle';\s*c2\.fillText\(monumentName, 256, 78\);\s*c2\.font = 'bold 34px Arial';\s*c2\.fillStyle = '#6fd3ff';\s*c2\.fillText\(aiModel, 256, 132\);/g, newCode);
    
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Fixed font sizes');
