# Snkr Magnet API
## Como Usar
### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/JeanCSF/sneakers_monitor.git
```

2. Instale as dependências:
```bash
npm install
```

3. Será necessário configurar algumas variáveis de ambiente. Crie um arquivo `.env` com as seguintes variáveis:
```dotenv
ENVIRONMENT='dev' ou 'prod', caso esteja testando o projeto em ambiente de desenvolvimento. As próximas variáveis não são necessárias, pois os dados do script serão salvos em um arquivo .xlsx
DB_USER=Seu_usuário_do_banco_de_dados_MongoDB
DB_PASSWORD=Sua_senha_do_banco_de_dados_MongoDB
```

### Execução

Inicie o servidor:
*OBS.: Os scripts de raspagem estão configurados para serem executados apenas em ambiente de desenvolvimento, para evitar gastos desnecessários com hospedagem. Ao executar o comando `npm start` os dados raspados estarão salvos no caminho src/utils/test_data.xlsx*

Caso você tenha configurado as variaves do banco de dados, basta remover o if da linha 36 no arquivo app.js e executar que os dados raspados irão direto para o seu banco de dados e serão servidos pela API. Se não tiver configurado o banco a API não terá nenhuma base de dados para servir.*

```bash
npm start
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

- `/sneakers`: Obter todos os sneakers.
- `/sneaker/:id`: Obter um sneaker pelo seu ID.
- `/sneakers/store/:store`: Obter todos os sneakers de uma loja especifica.
- `/sneakers/brand/:brand`: Obter todos os sneakers de uma marca especifica.
  
### Parâmetros de Consulta

- `page` (opcional): Número da página para paginação. O padrão é `1`.
- `limit` (opcional): Número máximo de itens por página. O padrão é `10`.
- `minPrice` (opcional): Preço mínimo do sneaker.
- `maxPrice` (opcional): Preço máximo do sneaker.
- `color` (opcional): Cor(es) do sneaker. Pode ser uma ou várias cores.
- `size` (opcional): Tamanho(s) do sneaker. Pode ser um ou vários tamanhos.
- `brand` (opcional): Marca(s) do sneaker. Pode ser uma ou várias marcas.
- `orderBy` (opcional): Ordenar os sneakers por preço ou data. Os valores permitidos são `price-asc`, `price-desc`, `date-asc` e `date-desc`. O padrão é `date-desc`.

### Exemplo de Requisição

```http
GET /sneakers?page=1&limit=10&minPrice=50&maxPrice=200&color=blue&size=42&brand=Nike&orderBy=price-desc
```

### Exemplo de Resposta

```json
[
    {
        "_id": "string",
        "srcLink": "string",
        "productReference": "string",
        "store": "string",
        "brands": ["string"],
        "img": "string",
        "sneakerTitle": "string",
        "categories": ["string"],
        "colors": ["string"],
        "currentPrice": 50.0,
        "discountPrice": 45.0,
        "priceHistory": [
            {
                "price": 50.0,
                "date": "2024-04-30T12:00:00Z",
                "_id": "string"
            }
        ],
        "availableSizes": [42],
        "codeFromStore": "string",
        "createdAt": "2024-04-30T12:00:00Z",
        "updatedAt": "2024-04-30T12:00:00Z",
        "__v": 0
    }
]
```

### Códigos de Resposta

- `200 OK`: Sucesso ao obter a lista de sneakers.

## Sobre os scripts de raspagem

Os scripts de raspagem são responsáveis por coletar informações sobre sneakers em várias lojas online. Aqui está uma visão geral de como eles funcionam:

### Configuração dos Scripts

- Todos os scripts necessários estão no arquivo `mainCluster.js`.
- O array `urls`, encontrado na linha 8, contém os links das lojas que serão raspadas.
- O objeto `storesObj`, localizado na linha 23, contém os principais seletores CSS de cada loja e os termos que serão usados para pesquisa.

### Estrutura de Arquivos

- Dentro da pasta `src/utils`, você encontrará os arquivos das funções, cada um nomeado de acordo com suas responsabilidades.
- O arquivo `utils.js` contém as principais funções, como `getLinks` e `processLinks`, responsáveis por obter os links das lojas e processá-los.

## Contribuindo

Se você deseja contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma branch para sua nova funcionalidade: `git checkout -b feature/nova-funcionalidade`.
3. Commit suas mudanças: `git commit -m 'Adicionando nova funcionalidade'`.
4. Faça push para a branch: `git push origin feature/nova-funcionalidade`.
5. Envie um pull request.
