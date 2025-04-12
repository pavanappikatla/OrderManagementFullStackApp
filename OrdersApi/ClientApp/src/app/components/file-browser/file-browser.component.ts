import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { OrdersService } from '../../../services/orders.service';
import { OnInit } from '@angular/core';
import { HoldOrderDetailService } from '../../../services/hold-order-detail.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-file-browser',
  imports: [NgFor, NgClass,RouterLink, ImagePreviewComponent],
  templateUrl: './file-browser.component.html',
  styleUrl: './file-browser.component.css'
})
export class FileBrowserComponent implements OnInit{
  listOfFiles :string[] = []
  poNum:string|undefined
  fileURL:string = ''
  imagePreview:boolean = false
  whetherPdf: boolean = false;
  isLoading:boolean = false

  constructor(private orderService:OrdersService, private currentRecord:HoldOrderDetailService, private cdRef: ChangeDetectorRef, private router: Router) {

  }
  ngOnInit(): void {
    const orderRecord = this.currentRecord.getOrder()
    this.poNum = orderRecord?.po
    if(orderRecord)
    {
     this.orderService.getFilesFromDirectory(orderRecord.po).subscribe({next: (res)=>{
        this.listOfFiles.push(...res)
        this.cdRef.detectChanges()
     }, error: (err)=> {console.log("Debug error: ", err)}})
    }
  }

  navigateToHome():void{
    this.router.navigate(['/'])
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  downloadFileFromDirectory(fileName:string, poNum:string):void{
    this.isLoading = true
    this.orderService.downloadFileFromDirectory(fileName,poNum).subscribe({next: (res) => {
      if(this.getFileExtension(fileName)==='.pdf' || this.getFileExtension(fileName)==='pdf')
      {
        this.whetherPdf = true
      }
      else{
        this.whetherPdf = false
      }
      this.fileURL = window.URL.createObjectURL(res)
      this.imagePreview = true
      this.cdRef.detectChanges()
    }, error: (err) => { console.log("Debug error: ", err)
      this.isLoading=false
    }, complete:()=>{this.isLoading = false}})
  }

  hidePreview(event:boolean):void{
    this.imagePreview = false
  }


}
