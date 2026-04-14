//gerente do banco de dados

import {collection, addDoc, onSnapshot, query, doc, deleteDoc, where, serverTimestamp, orderBy} from 'firebase/firestore'
import { db } from '../firebase'
import { auth } from '../firebase'

//funçao para salvar a transaçao no banco de dados do firebase
export const salvarTransacao = async (novaTransacao) =>{

    const usuarioAtual = auth.currentUser; //pega o usuário atual logado

    if (!usuarioAtual) { throw new Error('Usuário não autenticado'); } //verifica se o usuário está autenticado

    return await addDoc(collection(db, 'transacoes'), {
        ...novaTransacao, 
        userId: usuarioAtual.uid, //adiciona o id do usuário à transação
        criadoEm: serverTimestamp() //adiciona um timestamp para a transação
    })
}

//funçao para remover a transação do banco de dados do firebase
export const removerTransacao = async (idFirebase) =>{
    return await deleteDoc(doc(db, 'transacoes', idFirebase))
}

//funçao para ouvir as transaçoes
export const buscarTransacoes = (aoAtualizar) => {
    const usuarioAtual = auth.currentUser; //pega o usuário atual logado

    if(!usuarioAtual) return;  //verifica se o usuário está autenticado, se nao, nao busca nada!

    const q = query(collection(db, 'transacoes'), where('userId', '==', usuarioAtual.uid), orderBy('criadoEm', 'desc')) //cria uma consulta para pegar

    return onSnapshot(q, (snapshot) => {
        const dados = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        aoAtualizar(dados);
    })
}