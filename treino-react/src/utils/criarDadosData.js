export function criarDadosData(dataObjeto) {
    return {
        data: dataObjeto.toISOString(),
        dia: dataObjeto.getDate(),
        mes: dataObjeto.getMonth() + 1,
        ano: dataObjeto.getFullYear()
    };
}