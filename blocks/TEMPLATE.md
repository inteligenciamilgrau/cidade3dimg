# 🏙️ Template de Quarteirão Customizado

## Mapa do Grid Dinâmico (5×5)

Aqui está a disposição atual da cidade. O mapa é 100% dinâmico: se o arquivo `block_X_Y.js` existir e estiver listado no `index.html`, a construção aparecerá. Caso contrário, o quarteirão ficará vazio (grama e rua).

```
                           (Z-)
        Col1     Col2     Col3     Col4     Col5
        X=-80    X=-40    X=0      X=40     X=80
       ┌────────┬────────┬────────┬────────┬────────┐
Lin1   │ 1_1    │ 2_1    │ 3_1    │ 4_1    │ 5_1    │ Z=-80
       │        │        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin2   │ 1_2    │ 2_2    │ 3_2    │ 4_2    │ 5_2    │ Z=-40
       │        │        │        │        │        │ 
(X-)   ├────────┼────────┼────────┼────────┼────────┤ (X+)
Lin3   │ 1_3    │ 2_3    │ 3_3    │ 4_3    │ 5_3    │ Z=0
       │        │        │ CENTRO │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin4   │ 1_4    │ 2_4    │ 3_4    │ 4_4    │ 5_4    │ Z=40
       │        │        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin5   │ 1_5    │ 2_5    │ 3_5    │ 4_5    │ 5_5    │ Z=80
       │        │        │        │        │        │
       └────────┴────────┴────────┴────────┴────────┘
                            (Z+)
```

---

### 📍 Landmarks Modulares Atuais:
- **1_1**: Estação Corcovado (Base do Cristo Redentor)
- **2_1**: Estação Pão de Açúcar (Ponto inicial do Bondinho)
- **3_2**: Heliporto (O helicóptero volta para cá automaticamente)
- **5_5**: Parque do Lago (Lago arredondado, Ponte e Pato)
- **3_3**: Spawn / Centro da Cidade

### 📐 Guia de Construção:
- **Espaço Utilizável**: 30x30 unidades.
- **Relativo**: Use `ctx.centerX` e `ctx.centerZ` para posicionar seus objetos.
- **Colisões**: Não esqueça de dar um `ctx.collidables.push(...)` nos seus prédios.

## Formato do Arquivo

```javascript
// blocks/block_COL_ROW.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['COL_ROW'] = function(ctx) {
        // Exemplo: cria um prédio laranja no centro do quarteirão
        let mat = new ctx.THREE.MeshLambertMaterial({ color: 0xff6600 });
        let predio = ctx.createVoxel(ctx.centerX, 10, ctx.centerZ, 12, 20, 12, mat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(predio));
    };
})();
```

## Referência de Materiais (THREE.js)
- **MeshLambertMaterial**: Reage à luz (sol). Ideal para paredes e concreto.
- **MeshBasicMaterial**: Cor pura, não reage à luz. Ideal para luzes ou objetos que brilham.
- **CanvasTexture**: Usado para placas com texto customizado.
