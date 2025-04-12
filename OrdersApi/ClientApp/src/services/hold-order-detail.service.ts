import { Injectable } from '@angular/core';
import { openOrders } from '../app/models/openorders';

@Injectable({
  providedIn: 'root'
})
export class HoldOrderDetailService {

  orderDetail: openOrders|undefined

  setOrder(order:openOrders):void{
    this.orderDetail = order
    window.sessionStorage.setItem('currentorder', JSON.stringify(order))
  }

  getOrder():openOrders|undefined{
    return JSON.parse(window.sessionStorage.getItem('currentorder')??'')
  }

  constructor() { }
}
