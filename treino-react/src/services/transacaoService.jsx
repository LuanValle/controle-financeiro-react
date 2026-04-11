//gerente do banco de dados

import {collection, addDoc, onSnapshot, query, doc, deleteDoc} from 'firebase/firestore'
import { db } from '../firebase'

//funçao para salvar a transaçao no banco de dados do firebase
export const salvarTransacao = async (novaTransacao) =>{
    return await addDoc(collection(db, 'transacoes'), novaTransacao)
}

//funçao para remover a transação do banco de dados do firebase
export const removerTransacao = async (idFirebase) =>{
    return await deleteDoc(doc(db, 'transacoes', idFirebase))
}

//funçao para ouvir as transaçoes
export const buscarTransacoes = (aoAtualizar) => {
    const q = query(collection(db, 'transacoes')) //cria uma consulta para pegar

    return onSnapshot(q, (snapshot) => {
        const dados = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        aoAtualizar(dados);
    })
}