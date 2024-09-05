import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isArray, isObject } from '../../base/functions/util';
import { Observable } from "rxjs";
import {map, retry } from "rxjs/operators";
import { BaseFilter } from "../models/base-filter.model";


// export type Entity<E> = E | any;
// export type Filter<F extends BaseFilter> = F | BaseFilter;
// export type Table<T> = T | any;
export class CrudService<E,F extends BaseFilter,T> {
    headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    
    constructor(
        protected apiPath: string,
        protected http: HttpClient
    ) { 

        
    }


    post(form: E): Observable<T> {
        return this.http.post<T>(this.apiPath, form);
    }

    put(form: E): Observable<T> {
        return this.http.put<T>(this.apiPath, form);
    }

    delete(codigo: number): Observable<string> {
        return this.http.delete<string>(`${this.apiPath}/${codigo}`);
    }

    getById(codigo: number): Observable<any> {
        return this.http.get(`${this.apiPath}/${codigo}`);
    }

    getByFilter(filtro: F | BaseFilter): Observable<{selecionados: T[], total: number}> {

        let params = new HttpParams({
            fromObject: {
                page: filtro.pagina.toString(),
                size: filtro.itensPorPagina.toString()
            }
        });

        params = this.criarFiltroParams(filtro, params);

        return this.http.get<any>(`${this.apiPath}/pesquisar`, { params })
            .pipe(map( response => {
                const resultado = {
                    selecionados: response.content,
                    total: response.totalElements
                  }
                  return resultado;
              }));
    }

    getAll(): Promise<T[]> {
        return this.http.get<T[]>(`${this.apiPath}`)
            .toPromise();
    }

    getForm():Observable<any> {
        return this.http.get(`${this.apiPath}/form`)
    }

    getFormFiltro():Observable<any> {
        return this.http.get(`${this.apiPath}/form-filtro`)
    }

    getAreaFormFiltro():Observable<any> {
        return this.http.get(`${this.apiPath}/form-area-filtro`)
    }

    uploadCSV(fileToUpload: File):Observable<any> {
        let formData = new FormData();
        formData.append('file',fileToUpload);
        const httpOptions = {
          headers: new HttpHeaders ({ 
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json, text/html',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
          })
        }
        return this.http.post(`${this.apiPath}/upload-csv`, formData).pipe(retry(1));
    }

    downloadCSV():Observable<any> {
        return this.http.get(`${this.apiPath}/download-csv`, { responseType: 'blob' });
    }

    protected criarFiltroParams(obj: any, params?: HttpParams) {

        let paramsLocal = params || new HttpParams();
        for (const [key, value] of Object.entries(obj)) {
            
            if (key === "pagina" || key === "itensPorPagina") {
                continue;
            }
            if (isObject(value)) {
                paramsLocal = paramsLocal.append(key, JSON.stringify(value));
            }else if (value && value.toString() !== "") {
                paramsLocal = paramsLocal.append(key, value.toString());
            }
            
        }

        return paramsLocal;
    }

}
