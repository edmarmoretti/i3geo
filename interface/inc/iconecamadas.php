
<!-- temas existentes no mapa
                data-idListaDeCamadas - id onde sera incluida a lista de camadas
                data-idListaFundo - id onde sera incluida a lista de camadas de fundo (mapa base)
                data-verificaAbrangencia - se for uma string, faz a verificacao se a camada esta fora da abrangencia atual do mapa,
                    inserindo ou nao a string como uma classe CSS. Pode degradar a performance e depende
                    do metadata existente na camada. Deixe vazio para nao ativar a operacao.
            -->
<div data-tutorial="camadas" onclick="i3GEO.guias.ativa('temas',this)" data-verificaAbrangencia="" data-idconteudo="guia1obj" data-idListaFundo="listaFundo" data-idListaDeCamadas="listaTemas"
    style="margin-top: 3px;">
    <button title="{{{iconeMapa}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
        <i class="material-icons"><i class="material-icons">visibility</i></i>
    </button>
</div>