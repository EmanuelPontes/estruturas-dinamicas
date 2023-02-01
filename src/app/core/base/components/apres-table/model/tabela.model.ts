import { DadosOrigemTabela } from "./dados-origem-tabela.model";



export interface Linha {
    colunas: Coluna[];
    obj: any;
}
export interface Coluna {
    key: string;
    value: any;
    formatedValue: string;
}
export class Tabela {
    linhas: Linha[] = [];
    cabecalho: string[] = [];
    constructor(objects: DadosOrigemTabela[]) {

        if (objects.length === 0) {
            return;
        }
        this.linhas = objects.map(obj => {
            let colunas = Object.keys(obj.objeto).map(key =>{
                let col: Coluna = {
                   key: key,
                   value: obj.objeto[key],
                   formatedValue: obj.formatarExibicao(obj.objeto[key])
                }
   
                return col;
           });

           let linha: Linha = {
            colunas: colunas,
            obj: obj.objeto
           }

           return linha;
        })

        this.cabecalho = Object.keys(objects[0].objeto);
    }
}