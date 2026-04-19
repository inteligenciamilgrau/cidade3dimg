import os, glob, re

blocks_dir = "blocks"

new_func = """function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#0f1720';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#6fd3ff';
            c2.lineWidth = 10;
            c2.strokeRect(10, 10, 492, 172);
            
            c2.fillStyle = '#eef7ff';
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
            c2.fillText(aiModel, 256, 132);

            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 });
            let pX = ctx.centerX - 10; // moved left to not collide with corner perfectly
            let pZ = ctx.centerZ + 12;
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        }"""

for f in glob.glob(os.path.join(blocks_dir, "block_*.js")) + [os.path.join(blocks_dir, "TEMPLATE.md")]:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    content = re.sub(r'function renderStandardSign\(monumentName, aiModel\) \{[\s\S]*?ctx\.collidables\.push\(new ctx\.THREE\.Box3\(\)\.setFromObject\(fundo\)\);\s*\}', new_func, content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print('Replaced functions')
