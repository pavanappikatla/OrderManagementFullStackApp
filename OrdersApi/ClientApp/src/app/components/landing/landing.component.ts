import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { openOrders } from '../../models/openorders';
import { Observable } from 'rxjs';
import {  provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {


  ordersObservable$: Observable<openOrders[]>|undefined
  constructor(private router: Router) {
  }

  getOpenOrders():void{
    this.router.navigateByUrl('openorders')
  }

ngOnInit(): void {
  console.log("Debug hit: ")
  // this.ordersObservable$ = this.ordersService.getOpenOrders();

}

}
