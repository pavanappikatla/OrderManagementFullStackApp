import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { openOrders } from '../../models/openorders';
import {MatTableModule} from '@angular/material/table';
import { Observer } from 'rxjs';
import { NgFor,NgIf, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HoldOrderDetailService } from '../../../services/hold-order-detail.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-open-orders',
  imports: [NgFor,NgIf, NgClass, FormsModule, RouterLink],
  standalone:true,
  templateUrl: './open-orders.component.html',
  styleUrl: './open-orders.component.css'
})
export class OpenOrdersComponent implements OnInit {

  fetchedOpenOrders: openOrders[] | undefined;
  searchKey:string = ''
  isLoading:boolean = false
  dateSortOrderDesc:boolean|undefined
  orderNumberSortOrderDesc:boolean|undefined


  onSearchKeyChange():void{
    this.getOpenOrders()
  }


  constructor(private ordersService: OrdersService
    , private router:Router
    , private heldOrder:HoldOrderDetailService
    , private route:ActivatedRoute) {

  }

  handleSort(key:string):void{
    if(key==='date')
    {
      this.dateSortOrderDesc = !(this.dateSortOrderDesc??false)
      this.orderNumberSortOrderDesc = undefined
    }
    else{
      this.orderNumberSortOrderDesc = !(this.orderNumberSortOrderDesc??false)
      this.dateSortOrderDesc = undefined
    }
    this.getOpenOrders()
  }

  getOpenOrders():void{
    this.isLoading = true
    const params:any = {
      searchKey:this.searchKey,
      dateSortOrder: this.dateSortOrderDesc===true? 'desc': this.dateSortOrderDesc===false?'asc':'',
      orderNumberSortOrder: this.orderNumberSortOrderDesc===true?'desc':this.orderNumberSortOrderDesc===false? 'asc':''
    }

    this.ordersService.getOpenOrders(params).subscribe({
      next: (data:openOrders[]) => {
        this.fetchedOpenOrders = data
      },
      error: (err) => {
        console.error('Error:', err); // Log any error to the console
      },
    complete: ()=>{
      this.isLoading=false
    }}
    );
  }
  navigateToHome():void{
    this.router.navigate([''])
  }

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => this.searchKey =  params['jobNo']||'')

    this.getOpenOrders()
  }

  openOrder(order:any):void{
    this.heldOrder.setOrder(order)
    this.router.navigate(['/orderdetail'])
  }
  }




