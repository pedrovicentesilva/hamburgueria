document.addEventListener("DOMContentLoaded", () => {
    // 1. Catálogo centralizado de produtos
    const catalogo = {
        classic: { nome: "Classic Burger", preco: 25.90 },
        bacon: { nome: "Bacon Burger", preco: 29.90 },
        duplo: { nome: "Duplo Sabor", preco: 34.90 }
    };

    // Referências aos elementos do DOM
    const video = document.getElementById("video-hamburgueria");
    const statusFormatos = document.getElementById("status-formatos");
    const inputBusca = document.getElementById("busca-cardapio");
    const itensCardapio = document.querySelectorAll(".item-cardapio");
    const botoesSelecionar = document.querySelectorAll(".btn-selecionar");

    const formPedido = document.getElementById("form-pedido");
    const selectHamburguer = document.getElementById("hamburguer");
    const inputQuantidade = document.getElementById("quantidade");
    const spanValorTotal = document.getElementById("valor-total");
    const divComprovante = document.getElementById("comprovante-pedido");
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");

    // Formatador de moeda para Real (BRL)
    const formatarMoeda = (valor) => {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    // =========================================================
    // FUNCIONALIDADE 1: Diagnóstico e Eventos do Vídeo
    // =========================================================
    if (video && statusFormatos) {
        const suporteMP4 = video.canPlayType('video/mp4; codecs="avc1.4d401f"');
        const suporteWebM = video.canPlayType('video/webm; codecs="vp9"');

        let mensagemStatus = suporteMP4 === "probably" || suporteWebM === "probably"
            ? 'Compatibilidade: pelo menos um formato retorna "probably". '
            : 'Nenhum dos formatos retornou "probably" neste navegador. ';

        mensagemStatus += `MP4: ${suporteMP4 || "não suportado"} | WebM: ${suporteWebM || "não suportado"}.`;
        statusFormatos.textContent = mensagemStatus;

        // Mostrar duração total assim que os metadados carregarem
        video.addEventListener("loadedmetadata", () => {
            const minutos = Math.floor(video.duration / 60);
            const segundos = Math.floor(video.duration % 60).toString().padStart(2, "0");
            statusFormatos.textContent += ` | Duração do vídeo: ${minutos}:${segundos}.`;
        });

        // Incentivo ao pedido quando o vídeo terminar
        video.addEventListener("ended", () => {
            statusFormatos.textContent = "Ficou com água na boca? Faça o seu pedido logo abaixo!";
        });
    }

    // =========================================================
    // FUNCIONALIDADE 2: Filtro de Pesquisa no Cardápio
    // =========================================================
    if (inputBusca) {
        inputBusca.addEventListener("input", (evento) => {
            const termo = evento.target.value.toLowerCase().trim();

            itensCardapio.forEach((cartao) => {
                const textoCartao = cartao.textContent.toLowerCase();
                if (textoCartao.includes(termo)) {
                    cartao.style.display = "block";
                } else {
                    cartao.style.display = "none";
                }
            });
        });
    }

    // =========================================================
    // FUNCIONALIDADE 3: Cálculo Automático do Total do Pedido
    // =========================================================
    const atualizarTotal = () => {
        const idSelecionado = selectHamburguer.value;
        const quantidade = parseInt(inputQuantidade.value, 10) || 1;
        const produto = catalogo[idSelecionado];

        if (produto) {
            const total = produto.preco * quantidade;
            spanValorTotal.textContent = formatarMoeda(total);
        }
    };

    selectHamburguer.addEventListener("change", atualizarTotal);
    inputQuantidade.addEventListener("input", atualizarTotal);

    // =========================================================
    // FUNCIONALIDADE 4: Botões "Escolher este" no Cardápio
    // =========================================================
    botoesSelecionar.forEach((botao) => {
        botao.addEventListener("click", () => {
            const burgerId = botao.getAttribute("data-burger");
            selectHamburguer.value = burgerId;
            atualizarTotal();

            // Deslocação suave até ao formulário
            document.getElementById("pedido").scrollIntoView({ behavior: "smooth" });
            inputQuantidade.focus();
        });
    });

    // =========================================================
    // FUNCIONALIDADE 5: Preenchimento Automático (LocalStorage)
    // =========================================================
    const carregarDadosCliente = () => {
        const dadosSalvos = localStorage.getItem("saborBrasaCliente");
        if (dadosSalvos) {
            const cliente = JSON.parse(dadosSalvos);
            inputNome.value = cliente.nome || "";
            inputEmail.value = cliente.email || "";
        }
    };
    carregarDadosCliente();

    // =========================================================
    // FUNCIONALIDADE 6: Envio e Resumo do Pedido
    // =========================================================
    formPedido.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página

        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();
        const idHamburguer = selectHamburguer.value;
        const quantidade = parseInt(inputQuantidade.value, 10);
        const observacoes = document.getElementById("observacoes").value.trim();

        const produto = catalogo[idHamburguer];
        const totalFinal = produto.preco * quantidade;

        // Guardar dados do cliente para futuros pedidos
        localStorage.setItem("saborBrasaCliente", JSON.stringify({ nome, email }));

        // Gerar número de pedido aleatório
        const numeroPedido = Math.floor(1000 + Math.random() * 9000);

        // Exibir recibo na tela
        divComprovante.innerHTML = `
            <h3>Pedido #${numeroPedido} confirmado!</h3>
            <p>Obrigado, <strong>${nome}</strong>. Enviámos os detalhes para <em>${email}</em>.</p>
            <ul>
                <li><strong>Item:</strong> ${quantidade}x ${produto.nome}</li>
                <li><strong>Observações:</strong> ${observacoes || "Nenhuma"}</li>
                <li><strong>Total a pagar:</strong> ${formatarMoeda(totalFinal)}</li>
            </ul>
        `;
        divComprovante.style.display = "block";

        // Limpar apenas as observações e repor a quantidade para 1
        document.getElementById("observacoes").value = "";
        inputQuantidade.value = 1;
        atualizarTotal();
    });
});
