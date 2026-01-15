import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PagosService {
    // La URL será: http://localhost:3000/api/pagos
    private API_URL: string = `${environment.apiUrl}/api/pagos`;

    constructor(private http: HttpClient) { }

    // Obtener todos los métodos (Lo usará el Socio y el Admin)
    obtenerMetodos(): Observable<any> {
        return this.http.get(this.API_URL);
    }

    // Crear un nuevo método (Solo para el Admin)
    crearMetodo(datos: any): Observable<any> {
        return this.http.post(this.API_URL, datos);
    }

    // Actualizar un método existente
    actualizarMetodo(id: string, datos: any): Observable<any> {
        return this.http.put(`${this.API_URL}/${id}`, datos);
    }

    // Eliminar un método
    eliminarMetodo(id: string): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}