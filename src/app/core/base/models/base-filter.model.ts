export class BaseFilter {
    public pagina: number = 0;
    public itensPorPagina: number = 5;

    constructor(pagina?: number, itensPorPagina?: number) {
        this.pagina = pagina || 0;
        this.itensPorPagina = itensPorPagina || 20;
    }
}