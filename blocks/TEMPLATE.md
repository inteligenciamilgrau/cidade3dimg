# 🏙️ Template de Quarteirão Customizado

## Como Funciona

Cada arquivo `.js` nesta pasta define uma construção para um quarteirão específico do mapa.
O nome do arquivo segue o formato: `block_COLUNA_LINHA.js` (ex: `block_3_3.js` = centro do mapa).

## Mapa do Grid (5×5)

```
        Col1     Col2     Col3     Col4     Col5
        X=-80    X=-40    X=0      X=40     X=80
       ┌────────┬────────┬────────┬────────┬────────┐
Lin1   │ 1_1    │ 2_1    │ 3_1    │ 4_1    │ 5_1    │ Z=-80
Z=-80  │Montanha│        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin2   │ 1_2    │ 2_2    │ 3_2    │ 4_2    │ 5_2    │ Z=-40
Z=-40  │Montanha│        │Heliport│        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin3   │ 1_3    │ 2_3    │ 3_3    │ 4_3    │ 5_3    │ Z=0
Z=0    │        │        │ CENTRO │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin4   │ 1_4    │ 2_4    │ 3_4    │ 4_4    │ 5_4    │ Z=40
Z=40   │        │        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin5   │ 1_5    │ 2_5    │ 3_5    │ 4_5    │ 5_5    │ Z=80
Z=80   │        │        │        │        │ LAGO   │
       └────────┴────────┴────────┴────────┴────────┘
```

> ⚠️ Quarteirões reservados (já possuem construções fixas):
> - **1_1 e 1_2**: Corcovado / Montanha
> - **3_2**: Heliporto
> - **5_5**: Lago / Ponte / Patinho

## Tamanho do Quarteirão

- Cada quarteirão tem **30 × 30 unidades** de espaço utilizável
- Coordenadas locais: de **-15 a +15** em X e Z (relativo ao centro)
- Altura: de **0** (nível da rua) até o quanto quiser pra cima

## Formato do Arquivo

```javascript
// blocks/block_COL_ROW.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['COL_ROW'] = function(ctx) {

        // === PARÂMETROS DISPONÍVEIS ===
        //
        // ctx.createVoxel(x, y, z, largura, altura, profundidade, material)
        //   → Cria um bloco 3D na cena e retorna o mesh
        //   → x, y, z = posição ABSOLUTA no mundo (use ctx.centerX/Z como base)
        //
        // ctx.THREE
        //   → Biblioteca Three.js completa (para criar materiais, cores, etc)
        //
        // ctx.collidables
        //   → Array de caixas de colisão. Adicione seus blocos aqui para
        //     que o jogador não passe através deles:
        //     ctx.collidables.push(new ctx.THREE.Box3().setFromObject(meuBloco));
        //
        // ctx.centerX, ctx.centerZ
        //   → Coordenadas do centro do quarteirão no mundo
        //     Use como origem: ctx.centerX + offsetX, ctx.centerZ + offsetZ
        //
        // ctx.blockW
        //   → Largura/profundidade do quarteirão (30 unidades)
        //
        // ctx.buildings
        //   → Array de prédios. Adicione seus prédios aqui se quiser que
        //     eles apareçam no minimapa.

        // === SEU CÓDIGO AQUI ===

        // Exemplo: cria um prédio no centro do quarteirão
        let mat = new ctx.THREE.MeshLambertMaterial({ color: 0xff6600 });
        let predio = ctx.createVoxel(ctx.centerX, 10, ctx.centerZ, 12, 20, 12, mat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(predio));

    };
})();
```

## Referência de Cores

Cores são definidas em hexadecimal. Exemplos comuns:

| Cor        | Hex        | Descrição         |
|------------|------------|-------------------|
| Vermelho   | `0xff0000` | Paredes, tijolos  |
| Azul       | `0x0066ff` | Vidro, água       |
| Verde      | `0x00cc00` | Plantas, grama    |
| Amarelo    | `0xffcc00` | Luzes, sinalização|
| Cinza      | `0x888888` | Concreto, metal   |
| Marrom     | `0x8B4513` | Madeira           |
| Branco     | `0xffffff` | Neve, paredes     |
| Preto      | `0x111111` | Asfalto, metal    |

## Dicas

1. **Use coordenadas absolutas**: Sempre some `ctx.centerX` e `ctx.centerZ` às suas coordenadas locais
2. **Adicione colisão**: Sem `collidables.push(...)`, o jogador vai atravessar suas construções
3. **Materiais**: Use `MeshLambertMaterial` para blocos que recebem luz, `MeshBasicMaterial` para blocos que brilham sozinhos
4. **Teste rápido**: Crie o arquivo, recarregue a página e vá ao quarteirão correspondente
5. **Limites**: Tente se manter dentro dos 30×30 do quarteirão para não invadir a rua
