// =====================================================
// CONFIGURAÇÃO DO SUPABASE
// =====================================================

const SUPABASE_URL = "https://ujrzbwoqcgygaizxnyhl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_b6gtNhRw2SvBUYdI7_hzyQ_XL0wXFn3";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function carregarCategorias(data) {

    const container = document.getElementById("categorias");

    container.innerHTML = "";

    data.forEach((categoria) => {

        const ativo = categoria.status === "active";

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="card-image">

                ${
                    categoria.image_url
                    ? `
                        <img
                            src="${categoria.image_url}"
                            alt="${categoria.name}"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >
                    `
                    : `
                        <div class="sem-imagem">
                            Sem imagem
                        </div>
                    `
                }

            </div>

            <div class="card-content">

                <div class="card-header">

                    <h2>
                        ${categoria.name}
                    </h2>

                    <span class="status ${ativo ? "ativo" : "inativo"}">
                        ${ativo ? "Ativo" : "Inativo"}
                    </span>

                </div>

                <p class="descricao">
                    ${categoria.description || "Nenhuma descrição disponível."}
                </p>

                <div class="card-id">
                    ID: ${categoria.id}
                </div>

            </div>
        `;

        container.appendChild(card);
    });
}
async function testarConexaoSupabase() {

    console.log("🚀 Testando conexão com Supabase...");

    try {

        const { data, error } = await supabaseClient
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("❌ Erro ao consultar Supabase:");
            console.error(error);
            return;
        }

        console.log("✅ Conexão com Supabase funcionando!");

        console.log("🔑 URL:", SUPABASE_URL);
        console.log("📁 Total de categorias:", data.length);

        data.forEach((categoria, index) => {

            console.log(`\n📁 Categoria ${index + 1}`);

            console.log("ID:", categoria.id);
            console.log("Nome:", categoria.name);
            console.log("Status:", categoria.status);
            console.log("Descrição:", categoria.description);
            console.log("Imagem:", categoria.image_url);
            console.log("Criada em:", categoria.created_at);
            console.log("Atualizada em:", categoria.updated_at);

        });

        return data;

    } catch (erro) {

        console.error("❌ Erro inesperado:", erro);

    }
}
testarConexaoSupabase()

// =====================================================
// LOCALIZAÇÃO DO USUÁRIO
// =====================================================

function detectarLocalizacao() {

    if (!navigator.geolocation) {

        console.error(
            "❌ Geolocalização não é suportada por este navegador."
        );

        return;
    }


    console.log(
        "📍 Solicitando localização..."
    );


    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;

            const precisao =
                posicao.coords.accuracy;


            console.log("================================");

            console.log(
                "📍 LOCALIZAÇÃO CAPTURADA"
            );

            console.log("================================");


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );

            console.log(
                "Precisão:",
                precisao.toFixed(0),
                "metros"
            );


            console.log(
                "🗺️ Google Maps:",
                `https://www.google.com/maps?q=${latitude},${longitude}`
            );


            // Atualiza a cidade exibida

            mostrarCidade();


            // Futuramente podemos
            // buscar estabelecimentos no Supabase

            buscarEstabelecimentos(
                latitude,
                longitude
            );

        },


        function (erro) {

            console.error(
                "❌ Erro ao obter localização:",
                erro
            );


            switch (erro.code) {

                case erro.PERMISSION_DENIED:

                    console.error(
                        "Usuário negou o acesso à localização."
                    );

                    break;


                case erro.POSITION_UNAVAILABLE:

                    console.error(
                        "Não foi possível obter a localização."
                    );

                    break;


                case erro.TIMEOUT:

                    console.error(
                        "Tempo limite para obter localização."
                    );

                    break;


                default:

                    console.error(
                        "Erro desconhecido."
                    );

            }

        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


// =====================================================
// MOSTRAR CIDADE
// =====================================================

function mostrarCidade() {

    const select =
        document.getElementById("cidade");


    if (!select) {

        console.error(
            "❌ Elemento #cidade não encontrado no HTML."
        );

        return;
    }


    select.innerHTML = "";


    const option =
        document.createElement("option");


    option.value =
        "SANTA INÊS - MA";


    option.textContent =
        "SANTA INÊS - MA";


    option.selected =
        true;


    select.appendChild(
        option
    );


    console.log(
        "🏙️ Cidade selecionada: SANTA INÊS - MA"
    );

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

testarConexaoSupabase();

detectarLocalizacao();
