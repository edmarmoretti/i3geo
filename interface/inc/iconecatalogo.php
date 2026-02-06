            <!-- catalogo de adicao de temas ao mapa
                data-idCatalogo - id do DIV que contem a primeira pagina do catalogo. Esse DIV sera escondido e mostrado conforme o usuario navega pelo catalogo
                data-idMenus - id do DIV que recebera a lista de menus cadastrados no sistema de administracao
                data-idNavegacao - id do DIV que recebera a lista de opcoes apos o usuario clicar em um item do catalogo principal
                data-idMigalha - id do DIV que recebera o link para retorno ao nivel anterior do catalogo
                data-folderFirst - "true" ou "false" indica se na listagem os folders sao mostrados antes dos temas
                Variaveis javascript:
                i3GEO.catalogoMenus.IDSMENUS - (array) apenas os menus com idmenu que constem nessa lista serao mostrados. Por default e vazio.
            -->
            <div data-tutorial="catalogo" onclick="i3GEO.guias.ativa('adiciona',this)" data-idconteudo="guia2obj" data-idMigalha="catalogoMigalha" data-idNavegacao="catalogoNavegacao"
                data-idCatalogo="catalogoPrincipal" data-folderFirst="true" data-idMenus="catalogoMenus" style="margin-top: 3px;">
                <button title="{{{iconeCatalogo}}}" class="iconeGuiaMovel" style="color: white; box-shadow: none;">
                    <i class="material-icons">layers</i>
                </button>
            </div>