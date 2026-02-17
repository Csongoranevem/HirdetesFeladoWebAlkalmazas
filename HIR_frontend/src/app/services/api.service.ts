import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private server = environment.serverUrl;
  private tokenName = environment.tokenName;

  constructor(private http: HttpClient) { }

  getToken(): String | null {
    return sessionStorage.getItem(this.tokenName);
  }

  tokenHeader():{ headers: HttpHeaders }{

    let token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return { headers }
  }

  // PUBLIC ENDPOINTS --------------------------------------------------------------

  registration(table: string, data: object){
    return this.http.post(`${this.server}/${table}/register`, data);
  }

  login(table: string, data: object){
    return this.http.post(`${this.server}/${table}/login`, data);
  }

 // lostpass(){}

 // restorepass(){}

  readById(table: string, id: string){
    return this.http.get(`${this.server}/public/${table}/${id}`);
  }

  readByField(table: string, field: string, op: string, value: string){
    return this.http.get(`${this.server}/public/${table}/${field}/${op}/${value}`);
  }

  readAll(table: string){
    return this.http.get(`${this.server}/public/${table}`);
  }

  sendMail(data: object){
    return this.http.post(`${this.server}/sendmail`, data);
  }

  // PRIVATE ENDPOINTS --------------------------------------------------------------

  selectById(table: string, id: string){
    return this.http.get(`${this.server}/${table}/${id}`, this.tokenHeader());
  }

  selectByField(table: string, field: string, op: string, value: string){
    return this.http.get(`${this.server}/${table}/${field}/${op}/${value}`, this.tokenHeader());
  }

  selectAll(table: string){
    return this.http.get(`${this.server}/${table}`, this.tokenHeader());
  }

  insert(table: string, data: object){
    return this.http.post(`${this.server}/${table}`, data, this.tokenHeader());
  }

  update(){}

  delete(){}

  deleteAll(){}

  uploadFile(){}

  downloadFile(){}

  deleteFile(){}

}
