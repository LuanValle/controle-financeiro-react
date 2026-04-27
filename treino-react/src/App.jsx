import { useState, useEffect } from "react";
import PainelReserva from "./components/PainelReserva";
import PainelPrincipal from "./components/PainelPrincipal";
import "./App.css";
import {
  salvarTransacao,
  removerTransacao,
  buscarTransacoes,
  atualizarTransacao,
} from "./services/transacaoService";
import {auth} from './firebase'
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import { logoutUsuario } from "./services/authServices";
import PainelPlanejamento from "./components/PainelPlanejamento";

const CORES = {
  sucesso: "#22c55e",
  erro: "#ef4444",
};

//funçao para transformar numeros puro em Reais(R$)
function formatarDinheiro(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function App() {

  //useStats
  const [transacoes, setTransacoes] = useState([]);

  const [reserva, setReserva] = useState(() => {
    //criando a conta de reserva de emergencia.
    const reservaGuardada = localStorage.getItem("reserva_emergencia"); //tentar pegar o que esta salvo no navegador com o nome 'reserva_emergencia'
    if (reservaGuardada) {
      return Number(reservaGuardada); //se tiver algo salvo, converte para numero e retorna o valor
    } else {
      return 0; //se nao tiver nada salvo, retorna zero como valor inicial da reserva
    }
  });

  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoTipo, setNovoTipo] = useState("entrada"); //ja começa com 'entrada' para vir como padrao essa opçao.
  const [filtro, setFiltro] = useState("todos"); //filtro para mostrar todas as transaçoes, ou somente as de entrada ou somente as de saida
  const [valorInputReserva, setValorInputReserva] = useState(""); //controla o que esta sendo digitado no campo da reserva.
  const [telaAtual, setTelaAtual] = useState("principal"); //variavel para controlar qual tela esta sendo exibida, se a tela de controle ou a tela de relatorios
  const [carregando, setCarregando] = useState(false); //mostrar tela de loading na tela enquanto nao carregou os dados.
  const [usuario, setUsuario] = useState(null); //variavel para armazenar as informaçoes do usuário logado, ou null se nao tiver nenhum usuário logado
  const [modalAberto, setModalAberto] = useState(false); //controla quando abrimos ou fechamos o modal de confirmaçao
  const [novaCategoria, setNovaCategoria] = useState("Alimentação"); //controla o valor do campo de categoria
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState(null); //se for null ta criando uma nova, se tiver id, editando
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0])


  //funçao para mudar o tipo e garantir que a categoria faça sentido
  function mudarTipo(tipoSelecionado){
    setNovoTipo(tipoSelecionado);

    //se mudou para entrada, define uma categoria padrao de entrada
    if(tipoSelecionado === 'entrada'){
      setNovaCategoria("Salário");
    }

    //se mudou para saida, define uma categoria padrao de saida
    else{
      setNovaCategoria("Alimentação");
    }
  }

  //calcular o saldo total
  const resultadoSaldo = transacoes.reduce(
    (acc, transacao) =>
      transacao.tipo === "entrada"
        ? acc + transacao.valor
        : acc - transacao.valor,
    0,
  );
  //se for entrada, soma o valor, se for saida, subtrai o valor, o zero é o valor inicial do acumulador

  //cor inteligente para o resultado do saldo, for + verde, for - vermelho
  const corSaldo = resultadoSaldo >= 0 ? CORES.sucesso : CORES.erro;

  //filtro para mostrar somente as transaçoes de entrada, ou somente as de saida, ou todas as transaçoes
  const transacoesFiltradas = transacoes.filter((transacao) => {
    if (filtro === "todos") {
      return true; //mostra todas as transaçoes
    } else {
      return transacao.tipo === filtro; //mostra somente as transaçoes do tipo selecionado no filtro
    }
  });

  //funçao para adicionar valores
  async function adicionarTransacao() {
    if (!novaDescricao || !novoValor) return;

    setCarregando(true);

    const dataObjeto = new Date(novaData);
    dataObjeto.setMinutes(dataObjeto.getMinutes() + dataObjeto.getTimezoneOffset());

    const novaTransacao = {
      //caixa da nova transaçao
      data: dataObjeto.toISOString(), //boa pratica, salvar data
      dia: dataObjeto.getDate(), //pega o dia do mes para usar no planejamento financeiro
      mes: dataObjeto.getUTCMonth() + 1, //pega o mes para usar no planejamento financeiro
      ano: dataObjeto.getFullYear(), //pega o ano para usar no planejamento financeiro
      descricao: novaDescricao,
      categoria: novaCategoria,
      valor: Number(novoValor), //garante que o valor seja um numero
      tipo: novoTipo,
    };

    try {

      //condiçao para verificar se estamos editando ou criando uma nova transaçao
      if(transacaoEmEdicao !== null){
        await atualizarTransacao(transacaoEmEdicao, novaTransacao); //chama a funçao de atualizar a transaçao, passando o id da transaçao em ediçao e os novos dados da transaçao

      }else{
        await salvarTransacao(novaTransacao); //chama a funçao de salvar a nova transaçao, passando os
      }

      setNovaDescricao(""); //limpa o campo de descricao
      setNovoValor(""); //limpa o campo de valor
      setNovoTipo("entrada"); //reseta o tipo para 'entrada'
      setNovaCategoria("Alimentação"); //reseta a categoria para 'Alimentação'
      setModalAberto(false); //fecha o modal de confirmaçao
      setNovaData(new Date().toISOString().split('T')[0]) //reseta a data para a data atual

    } catch (error) {
      //se o valor for igual a zero, nao entra na lista de transaçoes, entao nao tem
      console.error("Erro ao adicionar transação:", error);
      alert(
        "Ocorreu um erro ao adicionar a transação. Por favor, tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  //funçao para editar transaçoes
  function iniciarEdicao(transacao){

    //preencher os dados.
    setNovaDescricao(transacao.descricao);
    setNovaCategoria(transacao.categoria);
    setNovoValor(transacao.valor);
    setNovoTipo(transacao.tipo);

    //mudar o modo
    setTransacaoEmEdicao(transacao.id);

    //abrir a janela
    setModalAberto(true);

  }

  //funçao para limpar o modal quando for abrir novatransacao
  function prepararNovaTransacao(){
    setNovaDescricao("");
    setNovaCategoria("Alimentação");
    setNovoValor("");
    setNovoTipo("entrada");
    setTransacaoEmEdicao(null);
    setModalAberto(true);
  }

  //funçao para excluir transaçoes
  async function excluirTransacao(idFirebase) {
    try {
      //manda o google excluir ele.
      await removerTransacao(idFirebase);
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  }

  //effect para pegar as transaçoes do banco de dados do firebase em tempo real, toda vez que tiver uma nova transaçao adicionada, ele atualiza a lista de transaçoes automaticamente
  useEffect(() => {
    //quando a foto estiver pronta, use o setTransacoes para atualizar a tela.
    const desinscrever = buscarTransacoes(setTransacoes);

    return () => {
      if (desinscrever) {
        desinscrever(); //desinscreve o listener para evitar vazamento de memória quando o componente for desmontado
      }
    };
  }, [usuario]); // vai atualizar toda vez que o usuario mudar.

  //effect para monitorar o estado de autenticaçao do usuário, toda vez que o usuário fizer login ou logout, ele atualiza a variavel usuario com as informaçoes do usuário logado ou null se nao tiver nenhum usuário logado
  useEffect(() => {
    const desinscrever = onAuthStateChanged(auth, (usuarioLogado) => {
      setUsuario(usuarioLogado);
    });
    
    return () => desinscrever();
  }, []);

  //funçao para guardar na reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
  async function guardarReserva() {
    const valorDigitado = Number(valorInputReserva); //converte o valor digitado para numero
    if (valorDigitado > 0 && valorDigitado <= resultadoSaldo) {
      //verifica se o valor digitado é maior que zero e menor ou igual ao saldo total
      setReserva(reserva + valorDigitado); // pega o valor atual do cofre e soma com o que foi digitado

      //toda vez que guardar o valor, ele vai fazer uma transaçao de saida para o valor guardado.
      const transacaoTranferencia = {
        data: new Date().toISOString(),
        descricao: "Aporte na reserva de Emergência",
        valor: valorDigitado,
        tipo: "saida",
      };

      await salvarTransacao(transacaoTranferencia); //adiciona a transaçao de saida do valor guardado na reserva

      setValorInputReserva(""); //limpa o campo de entrada da reserva
    } else {
      alert(
        "Valor inválido para guardar na reserva. Verifique se o valor é positivo e não excede o saldo total.",
      );
      setValorInputReserva(""); //limpa o campo de entrada da reserva caso o valor seja inválido
    }
  }

  //funçao para retirar dinheiro da reserva de emergencia, toda vez que o valor da reserva mudar, ele salva o novo valor no localstorage
  async function resgatarReserva() {
    const valorDigitado = Number(valorInputReserva); //converte o valor digitado para numero
    if (valorDigitado > 0 && valorDigitado <= reserva) {
      setReserva(reserva - valorDigitado); // pega o valor atual do cofre e subtrai com o que foi digitado

      //toda vez que resgatar o valor, ele vai fazer uma transaçao de entrada para o valor resgatado.
      const transacaoTranferencia = {
        descricao: "Resgate da reserva de Emergência",
        valor: valorDigitado,
        tipo: "entrada",
        data: new Date().toISOString(),
      };

      await salvarTransacao(transacaoTranferencia); //adiciona a transaçao de entrada do valor resgatado da reserva

      setValorInputReserva(""); //limpa o campo de entrada da reserva
    } else {
      alert(
        "Valor inválido para resgatar da reserva. Verifique se o valor é positivo e não excede o valor disponível na reserva.",
      );
      setValorInputReserva(""); //limpa o campo de entrada da reserva caso o valor seja inválido
    }
  }

  //sentinela da reserva de emergencia. Toda vez que a reserva mudar, ele salva o novo valor no localstorage
  useEffect(() => {
    localStorage.setItem("reserva_emergencia", reserva.toString()); //salva o valor da reserva no localstorage como string
  }, [reserva]); //o useEffect é executado toda vez que o valor da reserva mudar

  return (
    <div className="App">
      

      {/* Exibe o painel de login se o usuário não estiver autenticado, caso contrário, exibe o conteúdo principal do aplicativo */}
      {!usuario ? (
        <Login />
        ) : (
        <>
        <h1>Meu Controle Financeiro</h1>
        
        <div className="app-header">
          <p className="user-email">logado como: <strong>{usuario.email}</strong></p>
        {/* Botão de logout para o usuário sair da conta */}
          <button
            onClick={logoutUsuario}
            className="btn-logout"
            >Sair da Conta</button>
        {/* Fim do botão de logout */}
        </div>
        
        {/*Menu de Navegação*/}
      <div
        className="nav-menu"
      >
        <button
          className={
            telaAtual === "principal"
              ? "btn-filtro btn-filtro-ativo"
              : "btn-filtro"
          }
          onClick={() => setTelaAtual("principal")}
        >
          Dia a Dia
        </button>

        {/* botao para acessar a tela de planejamento financeiro */}
        <button className={telaAtual === "planejamento" ? "btn-filtro btn-filtro-ativo" : "btn-filtro"} 
          onClick={() => setTelaAtual("planejamento")}>Planejamento</button>

        {/* botao para acessar a tela de reserva de emergencia */}
        <button className={telaAtual === "reserva" ? "btn-filtro btn-filtro-ativo" : "btn-filtro"}
          onClick={() => setTelaAtual("reserva")}>Reserva de Emergência</button>
      </div>

      <h2 style={{ color: corSaldo }}>
        Saldo Total: {formatarDinheiro(resultadoSaldo)}
      </h2>

      {/*Tela da Reserva de Emergência*/}
      {telaAtual === "reserva" && (
        <PainelReserva
          reserva={reserva}
          formatarDinheiro={formatarDinheiro}
          valorInputReserva={valorInputReserva}
          setValorInputReserva={setValorInputReserva}
          guardarReserva={guardarReserva}
          resgatarReserva={resgatarReserva}
        />
      )}

      {/*Tela do Controle Financeiro*/}
      {telaAtual === "principal" && (
        <PainelPrincipal
          novaDescricao={novaDescricao}
          setNovaDescricao={setNovaDescricao}
          novoValor={novoValor}
          setNovoValor={setNovoValor}
          novoTipo={novoTipo}
          setNovoTipo={mudarTipo}
          adicionarTransacao={adicionarTransacao}
          transacoes={transacoes}
          filtro={filtro}
          setFiltro={setFiltro}
          transacoesFiltradas={transacoesFiltradas}
          excluirTransacao={excluirTransacao}
          formatarDinheiro={formatarDinheiro}
          carregando={carregando}
          setModalAberto={setModalAberto}
          modalAberto={modalAberto}
          novaCategoria={novaCategoria}
          setNovaCategoria={setNovaCategoria}
          iniciarEdicao={iniciarEdicao}
          transacaoEmEdicao={transacaoEmEdicao}
          prepararNovaTransacao={prepararNovaTransacao}
          novaData={novaData}
          setNovaData={setNovaData}
        />
      )}

      {/*Tela do Planejamento Financeiro*/}
      {telaAtual === "planejamento" && (
        <PainelPlanejamento
          transacoes={transacoes}
          formatarDinheiro={formatarDinheiro}
          saldoReal={resultadoSaldo}
          
        />
      )}

        </>
      )}
    </div>
  );
}

export default App;
