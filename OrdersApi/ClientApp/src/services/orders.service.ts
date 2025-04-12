import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openOrders } from '../app/models/openorders';
import { Observable } from 'rxjs';
import { baseURL } from './api';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private client: HttpClient) { }

  getOpenOrders(params:any):Observable<openOrders[]>
  {
    return this.client.post<openOrders[]>(`${baseURL}api/orders/open-orders-get`, params);
  }

  copyFileToServer(fileBytes:File, fileType:string, ponumber:string, fileName:string, jobNo:string, Order_Header_ID:number, Order_Detail_ID:number, userText:string, selectedDocumentType:string):Observable<boolean>{

    const formData = new FormData();
    formData.append('fileBytes', fileBytes);
    formData.append('fileType', fileType);
    formData.append('PONumber', ponumber);
    formData.append('JobNo', jobNo);
    formData.append('Order_Header_ID', Order_Header_ID?.toString());
    formData.append('Order_Detail_ID', Order_Detail_ID?.toString());
    formData.append('UserText', userText);
    formData.append('DocumentType', selectedDocumentType);

    return this.client.post<boolean>(`${baseURL}api/orders/copy-file-to-server`, formData)
  }

  getFilesFromDirectory(PO:string):Observable<string[]>{
    return this.client.get<string[]>(`${baseURL}api/orders/get-files-from-directory/${PO}`)
  }

  downloadFileFromDirectory(fileName:string, poNum:string):Observable<Blob>{
     return this.client.get(`${baseURL}api/orders/download-file/${fileName}/${poNum}`, {responseType:'blob'})
  }

  getDocumentTypes():Observable<string[]>
  {
    return this.client.get<string[]>(`${baseURL}api/orders/documenttype`)
  }

}
