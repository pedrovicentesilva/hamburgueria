/*
 * Tema: Mini-analisador de dados da Hamburgueria Sabor & Brasa (Catálogo de Produtos)
 * Entrada: Um número inteiro representando o limite de estoque para alerta inserido via prompt.
 * Processamento: Validação da entrada, laço for...of para classificar o estoque com if/else if/else, 
 *                switch para categorias, acumulador para valor total do estoque, identificador do item mais caro,
 *                e um laço while para simulação de comandos de atendimento até digitar "sair".
 * Saída: Relatórios formatados via console.table e template literals com classificação e resumos.
 * 
 * Pseudocódigo:
 * 1. Definir array de objetos com 5 hambúrgueres (nome, preco, estoque, categoria).
 * 2. Pedir e validar limite de estoque via prompt.
 * 3. Percorrer o array com for...of:
 *    a. Classificar estoque (Esgotado, Baixo, Normal) usando if/else if/else.
 *    b. Aplicar switch na categoria para mensagens específicas.
 *    c. Acumular valor total e verificar o mais caro.
 * 4. Executar while para ler comandos do usuário até "sair".
 * 5. Exibir console.table e template literals com os resultados.
 */

const produtosSaborBrasa = [
    { nome: "Classic Burger", preco: 25.90, estoque: 15, categoria: "tradicional" },
    { nome: "Bacon Burger", preco: 29.90, estoque: 8, categoria: "especial" },
    { nome: "Duplo Sabor", preco: 34.90, estoque: 3, categoria: "duplo" },
    { nome: "Veggie Burger", preco: 27.90, estoque: 0, categoria: "vegetariano" },
    { nome: "Chicken Crispy", preco: 26.90, estoque: 12, categoria: "frango" }
];

// Entrada e Validação com prompt
let entradaValida = false;
let limiteEstoque = 0;

while (!entradaValida) {
    let inputUsuario = prompt("Digite o limite mínimo de estoque para alerta (0 a 20):");
    
    if (inputUsuario === null) {
        alert("Operação cancelada pelo usuário.");
        break;
    }
    
    if (inputUsuario.trim() === "") {
        alert("O campo não pode estar vazio. Tente novamente.");
        continue;
    }
    
    let numeroConvertido = Number(inputUsuario);
    
    if (isNaN(numeroConvertido)) {
        alert("Valor inválido! Digite apenas números.");
        continue;
    }
    
    if (numeroConvertido < 0 || numeroConvertido > 20) {
        alert("Valor fora da faixa permitida (entre 0 e 20). Tente novamente.");
        continue;
    }
    
    limiteEstoque = numeroConvertido;
    entradaValida = true;
}

if (entradaValida) {
    console.log(`--- RELATÓRIO DA HAMBURGUERIA SABOR & BRASA ---`);
    console.log(`Limite de estoque informado: ${limiteEstoque}`);

    let valorTotalEstoque = 0;
    let produtoMaisCaro = produtosSaborBrasa[0];
    let relatorioItens = [];

    // Processamento com for...of, if / else if / else e switch
    for (let produto of produtosSaborBrasa) {
        let statusEstoque = "";

        // Cadeia if / else if / else com 3 faixas
        if (produto.estoque === 0) {
            statusEstoque = "Esgotado";
        } else if (produto.estoque <= limiteEstoque) {
            statusEstoque = "Baixo";
        } else {
            statusEstoque = "Normal";
        }

        // Uso do switch sobre a categoria do produto
        let mensagemCategoria = "";
        switch (produto.categoria) {
            case "tradicional":
                mensagemCategoria = "O queridinho dos clientes!";
                break;
            case "especial":
                mensagemCategoria = "Preparado com ingredientes selecionados.";
                break;
            case "duplo":
                mensagemCategoria = "Para quem tem muita fome!";
                break;
            case "vegetariano":
                mensagemCategoria = "Opção leve e saborosa sem carne.";
                break;
            case "frango":
                mensagemCategoria = "Crocante e suculento.";
                break;
            default:
                mensagemCategoria = "Categoria padrão da casa.";
                break;
        }

        // Padrão de laço 1: Acumulador (valor total do estoque)
        let valorItemEstoque = produto.preco * produto.estoque;
        valorTotalEstoque += valorItemEstoque;

        // Padrão de laço 2: Máximo (produto mais caro)
        if (produto.preco > produtoMaisCaro.preco) {
            produtoMaisCaro = produto;
        }

        relatorioItens.push({
            Nome: produto.nome,
            Preço: `R$ ${produto.preco.toFixed(2)}`,
            Estoque: produto.estoque,
            Status: statusEstoque,
            Info: mensagemCategoria
        });
    }

    // Exibição dos resultados
    console.table(relatorioItens);

    console.log(`Valor total estimado em estoque: R$ ${valorTotalEstoque.toFixed(2)}`);
    console.log(`Hambúrguer mais caro do cardápio: ${produtoMaisCaro.nome} (R$ ${produtoMaisCaro.preco.toFixed(2)})`);

    // Laço while com condição de saída baseada em comando do usuário
    console.log("\n--- SIMULAÇÃO DE COMANDOS DE ATENDIMENTO ---");
    let comando = "";
    while (comando.toLowerCase() !== "sair") {
        comando = prompt("Digite um comando ('verificar', 'status') ou digite 'sair' para encerrar:");
        if (comando === null) {
            break;
        }
        if (comando.toLowerCase() === "sair") {
            console.log("Encerrando o sistema de atendimento...");
            break;
        } else if (comando.toLowerCase() === "verificar") {
            console.log(`Total de produtos cadastrados: ${produtosSaborBrasa.length}`);
        } else if (comando.toLowerCase() === "status") {
            console.log("Sistema operando normalmente. Estoques atualizados.");
        } else {
            console.log(`Comando '${comando}' não reconhecido. Digite 'sair' para terminar.`);
        }
    }
}

/*
 * Teste de Mesa (Primeiras 3 voltas do laço principal, assumindo limiteEstoque = 5)
 * --------------------------------------------------------------------------------------------
 * Volta | produto.nome     | produto.estoque | limiteEstoque | statusEstoque (if/else) |
 * ------|------------------|-----------------|---------------|--------------------------|
 * 1     | "Classic Burger" | 15              | 5             | "Normal"                 |
 * 2     | "Bacon Burger"   | 8               | 5             | "Normal"                 |
 * 3     | "Duplo Sabor"    | 3               | 5             | "Baixo"                  |
 * --------------------------------------------------------------------------------------------
 */