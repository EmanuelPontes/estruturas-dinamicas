import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Directive, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { Observable, of } from "rxjs";
import { DadosOrigemTabela } from "./components/apres-table/model/dados-origem-tabela.model";
import { FormField } from "./components/filtro-form/model/form-field.model";
import { DynamicFormBuilderService } from "./components/filtro-form/service/dynamic-form-builder.service";
import { modalButton, ModalFormComponent } from "./components/modal-form/modal-form.component";
import { ModalSearchComponent } from "./components/modal-search/modal-search.component";
import { BaseFilter } from "./models/base-filter.model";
import { AlertService } from "./services/alert.service";
import { CrudService } from "./services/crud.service";
import * as moment from 'moment';
import { Title } from "@angular/platform-browser";
import { handleError, isArray } from "./functions/util";
import { ModalConfirmComponent } from "./components/modal-confirm/modal-confirm.component";
import { BasicCrudBtn, CustomBtn, getBasicCrudBtns } from "./components/action-menu/action-menu.component";
/**
 * E classe de envio de dados
 * F classe de filtro de dados
 * T classe formato da tabela. resposta dos dados
 * 
 * Revisar estruturar e comportamento
 */
@Directive()
export abstract class CrudComponent<E, F extends BaseFilter, T> implements OnInit {


    itemSelecionado: T;
    dadosOrigem: DadosOrigemTabela[] = [];
    actionButtonList: CustomBtn[] = [];
    actionButtonEventHandleMapper: Map<number, () => void> = new Map<number, () => void>();

    tipoOperacao: string = "novo";

    filtroForm: FormField<any>[] = [];
    objectForm: FormField<any>[] = [];
    totalRegistros: number;
    ultimoFiltro: F | BaseFilter;

    constructor(
        public title: string,
        public titleService: Title,
        public crudService: CrudService<E, F, T>,
        public alertService: AlertService,
        public dyFormService: DynamicFormBuilderService,
        public filtroCampos$: Observable<FormField<any>[]>,
        public objectForm$: Observable<FormField<any>[]>,
        public dialog: MatDialog,
    ) {
        this.titleService.setTitle(this.title);
    }
    ngOnInit(): void {
        this.defaultInit();
    }

    protected defaultInit() {
        this.atualizarTabela();
        this.actionButtonList = getBasicCrudBtns();
        this.actionButtonEventHandleMapper.set(BasicCrudBtn.NEW,this.novo);
        this.actionButtonEventHandleMapper.set(BasicCrudBtn.EDIT,this.editar);
        this.actionButtonEventHandleMapper.set(BasicCrudBtn.VIEW,this.consultar);
        this.actionButtonEventHandleMapper.set(BasicCrudBtn.DELETE,this.excluir);
        this.objectForm$.subscribe(fields => { this.objectForm = fields; });
        this.filtroCampos$.subscribe(fields => { this.filtroForm = fields; });
    }

    protected atualizarTabela() {
        this.pesquisar(new BaseFilter());
    }

    public actionRequestEventManager(btnClickedId: number): void {
        this.actionButtonEventHandleMapper.get(btnClickedId)();
    }

    private novo() {
        this.tipoOperacao = "novo";
        let novo = this.objectForm.filter(f => f.key !== 'id');
        this.openDialog(of(novo));
    }

    private editar() {
        if (!this.itemSelecionado) {
            return;
        }
        let obj = this.itemSelecionado as any;
        if (isArray(this.itemSelecionado)) {
            obj = ([...this.itemSelecionado as any])[0]
        }
        this.tipoOperacao = "editar";
        this.crudService.getById(obj.id).subscribe(data => {

            this.openDialog(of(this.dyFormService.objecToFormFieldArray(data).map(obj => {
                if (obj.key == "id") {
                    obj.readonly = true;
                }

                return obj;
            })));
        })


    }

    private consultar() {
        if (!this.itemSelecionado) {
            return;
        }
        this.tipoOperacao = "consultar";
        let enterbtn: modalButton = { label: "", hide: true }
        let exitbtn: modalButton = { label: "Fechar", hide: false }
        let obj = this.itemSelecionado as any;
        if (isArray(this.itemSelecionado)) {
            obj = ([...this.itemSelecionado as any])[0]
        }
        this.crudService.getById(obj.id).subscribe(data => {

            this.openDialog(of(this.dyFormService.objecToFormFieldArray(data).map(obj => {
                obj.readonly = true;
                return obj;
            })), enterbtn,
                exitbtn);
        });
    }

    private excluir() {
        if (!this.itemSelecionado) {
            return;
        }

        this.openConfirm("Tem certeza que deseja excluir e/ou cancelar este item ?").subscribe(result => {
            if (result === "ok") {
                let obj = this.itemSelecionado as any;
                this.crudService.delete(obj.id).subscribe((res: string) => {
                    this.alertService.msgSucesso(res);
                    this.atualizarTabela();
                }, error => {

                    this.alertService.msgErro(handleError(error))
                })
            }
        })

    }

    protected aoMudarPagina(event: PageEvent) {

        let filtro = this.ultimoFiltro ? this.ultimoFiltro : new BaseFilter();

        filtro.pagina = event.pageIndex;
        filtro.itensPorPagina = event.pageSize
        if (this.totalRegistros > 0) {
            this.pesquisar(filtro);
        }
    }

    protected pesquisar(event: F | BaseFilter) {

        if (!this.ultimoFiltro?.itensPorPagina && !event.itensPorPagina) {
            event = Object.assign(event, new BaseFilter());
        }
        this.ultimoFiltro = this.ultimoFiltro ? Object.assign(this.ultimoFiltro, event) : event;
        this.crudService.getByFilter(this.ultimoFiltro).subscribe((result: any) => {
            this.dadosOrigem = result.selecionados.map((item: any) => {
                return {
                    objeto: item,
                    formatarExibicao: formatarLabel
                };
            });
            this.totalRegistros = result.total;
            this.itemSelecionado = null;
        },
        (erro: any) => {
            this.alertService.msgErro(handleError(erro))
        });
    }

    protected selecionar(event: any) {
        this.itemSelecionado = event;
    }

    protected openDialog(form$: Observable<FormField<any>[]>, enterBtn?: modalButton, exitBtn?: modalButton) {

        const dialogRef = this.dialog.open(ModalFormComponent,
            {
                data: {
                    form$: form$,
                    searchConfig: []
                }
            });

        if (enterBtn) {
            dialogRef.componentInstance.enterButtonText = enterBtn;
        }

        if (exitBtn) {
            dialogRef.componentInstance.exitButtonText = exitBtn;
        }

        this.setModalTitulo(dialogRef);


        dialogRef.afterClosed().subscribe(result => {
            this.modalCloseHandler(result);
        });

    }

    protected modalCloseHandler(result: any) {
        console.log(`Dialog result: ${result}`);
        if (result === '' || result === undefined || result === null) {
            return;
        }
        if (this.tipoOperacao === 'editar') {
            if (result !== null && result !== undefined) {
                this.crudService.put(result).subscribe((i: any) => {
                    this.atualizarTabela();
                    this.alertService.msgSucesso("Edição realizada com sucesso!");
                }, (err: any) => {

                    
                    this.alertService.msgErro(handleError(err))
                })
            }

        }
        else if (this.tipoOperacao === 'consultar') {

        } else {

            this.crudService.post(result).subscribe((i: any) => {
                this.atualizarTabela();
                this.alertService.msgSucesso("Criado com sucesso!");
            }, (err: any) => {
                this.alertService.msgErro(handleError(err))
            })

        }
    }

    protected setModalTitulo(dialogRef: any) {
        if (this.tipoOperacao === 'editar') {
            dialogRef.componentInstance.title = 'Editar';
        }

        if (this.tipoOperacao === 'consultar') {
            dialogRef.componentInstance.title = 'Consultar';
        }

        if (this.tipoOperacao === 'novo') {
            dialogRef.componentInstance.title = 'Novo';
        }
    }

    private openConfirm(msg: string, enterBtn?: modalButton, exitBtn?: modalButton,) {
        const dialogRef = this.dialog.open(ModalConfirmComponent,
            {
                data: {
                    msg: msg
                }
            });

        if (enterBtn) {
            dialogRef.componentInstance.enterButtonText = enterBtn;
        }

        if (exitBtn) {
            dialogRef.componentInstance.exitButtonText = exitBtn;
        }

        return dialogRef.afterClosed();
    }
}
//remover
export function formatarLabel(key: string, a: any) {
    if (key === 'loja') {
        return (a.codigo ? a.codigo : a.id) + " - " + a.nomeFantasia;
    }
    if (key === 'inventario') {
        return a.descricao ? (a.id) + " - " + a.descricao : (a.id)+  " - sem descrição"  ;
    }
    if (typeof a === 'object' && a !== null) {
        return a['descricao'] ? a['descricao'] : a['nome'] ? a['nome'] :

            key + '-' + (a['id'] < 10 ? '0' + a['id'] : a['id']);
    }
    if (Object.prototype.toString.call(a) === '[object Date]' || moment(a, 'YYYY-MM-DD', true).isValid()) {
        return (moment(a, 'YYYY-MM-DD').toDate()).toLocaleDateString("pt-br");
    }
    return a;
}
