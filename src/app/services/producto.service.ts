import { inject, Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private xmlUrl = 'assets/productos.xml';
  private http = inject(HttpClient);

  // Obtener productos desde la API
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        console.log('Datos obtenidos de la API:', data); // Depuración
        return data;
      }),
      catchError(error => {
        console.warn('Fallo la API, intentando cargar desde XML local:', error);
        return this.obtenerProducto(); // Cargar desde XML si falla la API
      })
    );
  }

  // Obtener productos desde el archivo XML o localStorage
  obtenerProducto(): Observable<Producto[]> {
    const productos = localStorage.getItem('productos');

    if (productos) {
      console.log('Cargando productos desde localStorage'); // Depuración
      return new Observable<Producto[]>(observer => {
        observer.next(this.parseXML(productos));
        observer.complete();
      });
    } else {
      console.log('Cargando productos desde archivo XML'); // Depuración
      return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
        map(xml => this.parseXML(xml)),
        catchError(error => {
          console.error('Error al cargar los productos desde XML:', error);
          return of([]); // Devuelve un Observable vacío si falla
        })
      );
    }
  }

  // Parsear el archivo XML a un array de productos
  private parseXML(xml: string): Producto[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const productos: Producto[] = [];

    Array.from(xmlDoc.getElementsByTagName('producto')).forEach(prod => {
      const id = parseInt(prod.getAttribute('id') || '0', 10);

      productos.push({
        id: id,
        nombre: prod.getElementsByTagName('nombre')[0]?.textContent || '',
        imagen: prod.getElementsByTagName('imagen')[0]?.textContent || '',
        precio: parseInt(prod.getElementsByTagName('precio')[0]?.textContent || '0', 10),
        cantidad: parseInt(prod.getElementsByTagName('cantidad')[0]?.textContent || '0', 10)
      });
    });

    return productos;
  }
}
