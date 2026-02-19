//  Mini sistema simples com localStorage
const usuario = { //  Objeto usuario com dados basicos
  nome: "Hamilton B. Jr.", //  Propriedade nome do usuario
  email: "HBurratto@gmail.com" //  Propriedade email do usuario
}; //  Fecha o objeto usuario

//  Lista de produtos disponiveis
const produtos = [ //  Array de objetos produto
  { id: 1, nome: "Teclado", preco: 150 }, 
  { id: 2, nome: "Mouse", preco: 80 }, 
  { id: 3, nome: "Monitor", preco: 1200 }, 
  { id: 4, nome: "Headphone", preco: 400 },
  { id: 5, nome: "Microfone", preco: 700 }    
]; //  Fecha o array produtos

//  Chave usada para salvar no localStorage
const STORAGE_KEY = "carrinho_de_compras"; //  Identificador do armazenamento

//  Objeto carrinho com metodos
const carrinho = { //  Inicia o objeto carrinho
  itens: [], //  Array de itens no carrinho
  adicionar(idProduto) { //  Metodo para adicionar item
    const produto = produtos.find(p => p.id === idProduto); //  find percorre o array e devolve o 1º produto cujo id é igual ao idProduto
    if (!produto) return; //  Se nao encontrar, sai

    const item = this.itens.find(i => i.id === idProduto); //  this = carrinho, this.itens = array do carrinho, i = cada item, i.id === idProduto = compara ids
    if (item) { //  Se item existir (find achou um item, então não é undefined)
      item.quantidade += 1; //  Aumenta a quantidade
    } else { //  Se item nao existir
      this.itens.push({ //  Adiciona novo item
        id: produto.id, //  Id do produto
        nome: produto.nome, //  Nome do produto
        preco: produto.preco, //  Preco do produto
        quantidade: 1 //  Quantidade inicial
      }); //  Fecha o push do novo item
    } //  Fecha o if/else
    salvarCarrinho(); //  Salva no localStorage
  }, //  Fecha o metodo adicionar
  remover(idProduto) { //  Metodo para remover item
    const item = this.itens.find(i => i.id === idProduto); //  Procura no array o item cujo id seja igual ao idProduto
    if (!item) return; // !item significa "não existe" (find retornou undefined)

    item.quantidade -= 1; //  Diminui a quantidade
    if (item.quantidade <= 0) { //  Se zerar ou ficar negativo
      this.itens = this.itens.filter(i => i.id !== idProduto); //  filter cria um novo array sem o item que tem o id informado
    } //  Fecha o if
    salvarCarrinho(); //  Salva no localStorage
  }, //  Fecha o metodo remover
  total() { //  Metodo para calcular total
    return this.itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0); //  Soma preco * quantidade
  } //  Fecha o metodo total
}; //  Fecha o objeto carrinho

//  Salva o carrinho no localStorage
function salvarCarrinho() { //  Abre funcao salvarCarrinho
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho.itens)); //  Salva itens como texto
} //  Fecha funcao salvarCarrinho

//  Carrega o carrinho do localStorage
function carregarCarrinho() { //  Abre funcao carregarCarrinho
  const dados = JSON.parse(localStorage.getItem(STORAGE_KEY)); //  Le os dados do localStorage
  carrinho.itens = Array.isArray(dados) ? dados : []; //  Se for array, usa; senao, vazio
} //  Fecha funcao carregarCarrinho

//  Formata numero para preco em reais
function formatarPreco(valor) { //  Abre funcao formatarPreco
  return `R$ ${valor.toFixed(2)}`.replace(".", ","); //  Converte para 2 casas e troca ponto por virgula
} //  Fecha funcao formatarPreco

//  Mostra a lista de produtos na tela
function renderProdutos() { //  Abre funcao renderProdutos
  const listaProdutos = document.getElementById("listaProdutos"); //  Pega a div de produtos
  listaProdutos.innerHTML = ""; //  Limpa o conteudo atual

  produtos.forEach(produto => { //  Percorre cada produto
    const linha = document.createElement("div"); //  Cria uma div para o produto
    linha.className = "item"; //  Adiciona classe para estilo

    const info = document.createElement("span"); //  Cria um span para texto
    info.textContent = `${produto.nome} - ${formatarPreco(produto.preco)}`; //  Texto com nome e preco

    const btn = document.createElement("button"); //  Cria botao de adicionar
    btn.textContent = "Adicionar"; //  Texto do botao
    btn.addEventListener("click", () => { //  Evento de clique
      carrinho.adicionar(produto.id); //  Adiciona o produto no carrinho
      renderCarrinho(); //  Atualiza o carrinho na tela
    }); //  Fecha o evento

    linha.appendChild(info); //  Adiciona info na linha
    linha.appendChild(btn); //  Adiciona botao na linha
    listaProdutos.appendChild(linha); //  Adiciona a linha na lista
  }); //  Fecha o forEach
} //  Fecha funcao renderProdutos

//  Mostra o carrinho na tela
function renderCarrinho() { //  Abre funcao renderCarrinho
  const listaCarrinho = document.getElementById("listaCarrinho"); //  Pega a div do carrinho
  const totalCarrinho = document.getElementById("totalCarrinho"); //  Pega o total do carrinho

  listaCarrinho.innerHTML = ""; //  Limpa o carrinho atual

  if (carrinho.itens.length === 0) { //  Se carrinho estiver vazio
    const vazio = document.createElement("p"); //  Cria paragrafo
    vazio.textContent = "Carrinho vazio"; //  Texto de carrinho vazio
    listaCarrinho.appendChild(vazio); //  Adiciona na tela
  } else { //  Se carrinho tiver itens
    carrinho.itens.forEach(item => { //  Percorre cada item
      const linha = document.createElement("div"); //  Cria uma linha do item
      linha.className = "item"; //  Classe de estilo

      const info = document.createElement("span"); //  Span para texto do item
      info.textContent = `${item.nome} x${item.quantidade} = ${formatarPreco(item.preco * item.quantidade)}`; //  Texto com calculo

      const btn = document.createElement("button"); //  Botao para remover
      btn.textContent = "Remover"; //  Texto do botao
      btn.addEventListener("click", () => { //  Evento de clique
        carrinho.remover(item.id); //  Remove uma unidade do item
        renderCarrinho(); //  Atualiza a lista
      }); //  Fecha o evento

      linha.appendChild(info); //  Adiciona info na linha
      linha.appendChild(btn); //  Adiciona botao na linha
      listaCarrinho.appendChild(linha); //  Adiciona linha no carrinho
    }); //  Fecha o forEach
  } //  Fecha o if/else

  totalCarrinho.textContent = `Total: ${formatarPreco(carrinho.total())}`; //  Atualiza o total
} //  Fecha funcao renderCarrinho

//  Inicia a pagina quando o HTML carregar
document.addEventListener("DOMContentLoaded", () => { //  Espera o DOM carregar
  document.getElementById("infoUsuario").textContent = `Usuario: ${usuario.nome} (${usuario.email})`; //  Mostra o usuario

  carregarCarrinho(); //  Carrega itens do localStorage
  renderProdutos(); //  Renderiza produtos
  renderCarrinho(); //  Renderiza carrinho

  document.getElementById("btnLimpar").addEventListener("click", () => { //  Evento do botao limpar
    carrinho.itens = []; //  Limpa o array do carrinho
    salvarCarrinho(); //  Salva o carrinho vazio
    renderCarrinho(); //  Atualiza a tela
  }); //  Fecha o evento do botao
}); //  Fecha o listener do DOMContentLoaded
