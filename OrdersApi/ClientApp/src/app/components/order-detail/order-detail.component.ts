import { ChangeDetectorRef, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { HoldOrderDetailService } from '../../../services/hold-order-detail.service';
import { openOrders } from '../../models/openorders';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-order-detail',
  standalone:true,
  imports: [CommonModule, FormsModule, NgSelectComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
 orderRecord: openOrders|undefined
@ViewChild('imageCapture') imageCapture!:ElementRef

@ViewChild('toastBootstrap') toastBootstrap!:ElementRef

responseMessage:string = ''

previewUrl: string | ArrayBuffer | null = null;

userText: string = '';

selectedFile:File|undefined

documentTypes:string[] = []

selectedDocumentType:string = ''

isFileUploading:boolean = false

constructor(private heldOrder:HoldOrderDetailService,
  private router:Router, private orderService:OrdersService, private snackBar: MatSnackBar
, private cdr:ChangeDetectorRef) {
}

handleImageCapture(event:Event):void{
  event.preventDefault()
  this.imageCapture?.nativeElement.click()
}

getFileExtension(fileName: string): string {
  return fileName.split('.').pop() || '';
}


onImageSelected(event:any):void{

  event.preventDefault()

  const file = event?.target?.files[0]

  this.selectedFile = event?.target?.files[0]

  console.log('Selected file:', file);

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      console.log('Image loaded:', this.previewUrl);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  } else {
    this.previewUrl = null;
    console.log('Invalid file type');
  }
}

handleImageSubmit():void{
  this.isFileUploading = true
  if(this.selectedFile)
  {
  const file = this.selectedFile
      if(this.orderRecord===undefined)
      {
        console.log("Debug entered here")
        this.snackBar.open('Please reload the page and try again', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
        this.isFileUploading = false
      }
      else
      {
        this.orderService.copyFileToServer(file
          , this.getFileExtension(file.name)
          , this.orderRecord?.po??''
          ,''
          , this.orderRecord?.jobNo??''
          , this.orderRecord?.order_Header_ID
          , this.orderRecord?.order_Detail_ID
          , this.userText===''? 'Job Picture': this.userText
        , this.selectedDocumentType).subscribe({next: (status:any) =>{
          this.responseMessage = status.message??''
          this.snackBar.open(this.responseMessage, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
        }, error: (err)=> {this.previewUrl = null
          this.isFileUploading = false
        }, complete: ()=>{this.previewUrl = null
          this.isFileUploading = false
        }})
      }
    }
  else{
    this.isFileUploading = false
    this.snackBar.open('Please reload the page and try again', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}

openFileBrowser():void{
  this.router.navigate(['/browser'])
}

  ngOnInit(): void {
    this.orderRecord = this.heldOrder.getOrder()
    if(this.orderRecord==undefined)
    {
      this.router.navigate(['/openorders'])
    }

    this.orderService.getDocumentTypes().subscribe({next: (res) => {this.documentTypes = res}, error: (err)=> {}, complete: ()=>{}})
  }

  redirectToOrders():void{
    this.router.navigate(['/openorders'])
  }

  closePreview(): void {
    this.previewUrl = null
    this.userText = ''
  }
}
