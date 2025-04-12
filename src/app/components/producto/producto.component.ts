import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{
  public productos!: Producto[];
  constructor(private productoService: ProductoService, private carritoService: CarritoService, private router: Router) { }
  ngOnInit(): void {
    console.log('Componente inicializado'); // Depuración
    this.productoService.obtenerProductos().subscribe(
      data => {
        console.log('Productos obtenidos en el componente:', data); // Depuración
        this.productos = data;
      },
      error => {
        console.error('Error al obtener productos:', error);
      }
    );
  }
  agregarACarrito(producto: any){
    this.carritoService.agregarProducto(producto);
  }

  irACarrito():void{
    this.router.navigate(['/carrito']);
  }


  irAlInventario():void {
    this.router.navigate(['/inventario']);
  }

}
