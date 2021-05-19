import { Component, NgModule, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  CdkDrag,
CdkDragMove,
  CdkDragStart,
  CdkDropList, CdkDropListContainer, CdkDropListGroup,
  moveItemInArray
} from "@angular/cdk/drag-drop";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;


finallist: CdkDropList<any>[];
  @ViewChildren("Alllist") listRef: QueryList<CdkDropList>;
 Alldata = [
    {
      name: 'Task 1',
      pages: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    // {
    //   name: 'Task 2',
    //   pages: [15,16,17]
    // },
    // {
    //   name: 'Task 2',
    //   pages: [22, 23,34]
    // },
   
  ];


 // public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  public target: CdkDropList;
  public targetIndex: number;
  public source: any;
  public sourceIndex: number;
  Newtask:any;
  drageditem:any;

  constructor() {
    this.target = null;
    this.source = null;
  }

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentNode.removeChild(phElement);
  }

  add() {
    this.Alldata[0].pages.push(this.Alldata[0].pages.length + 1);
  }

  shuffle() {
    this.Alldata[0].pages.sort(function() {
      return .5 - Math.random();
    });
  }

  drop() {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentNode;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.Alldata[0].pages, this.sourceIndex, this.targetIndex);
  }

  enter = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    let phElement = this.placeholder.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentNode.children, drag.dropContainer.element.nativeElement);
    let dropIndex = __indexOf(dropElement.parentNode.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      let sourceElement = this.source.element.nativeElement;
      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';
      
      sourceElement.parentNode.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentNode.insertBefore(phElement, (dragIndex < dropIndex)
      ? dropElement.nextSibling : dropElement);

    this.source.start();
    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);

    return false;
  }
  dragMoved(e: CdkDragMove,page:any,item:any) {

  
    console.log("el===",e);
    console.log("page===",page);
    console.log("item===",item);

    this.drageditem=item;
    //item.pages=item.pages.filter(ipage=>ipage!=page);

    this.Newtask={
      name:'Task '+(this.Alldata.length+1),
      pages:[
        page
      ]
    };
  
    //this.Newtask.pages.push(page);


    
    let point = this.getPointerPositionOnPage(e.event);

    // this.listGroup._items.forEach(dropList => {
    //   if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
    //     this.activeContainer = dropList;
    //     return;
    //   }
    // });
  }
  AddNewTask()
  {
    
    console.log('ref',this.listRef.toArray());

    console.log('final',this.finallist);

    if(this.Newtask!=null)
    {
      this.Alldata.push(this.Newtask);
      this.finallist = this.listRef.toArray();
      console.log('new task',this.Newtask);
      console.log('new mlist ',this.Alldata);

        this.Alldata.forEach(data => {
              if(data.name==this.drageditem.name)
              {
                  data.pages=data.pages.filter(page=>page!=this.Newtask.pages[0]);
              }
        });

        //this.toaster.success(this.Newtask.name+ " Created Successfully");


    }
   
   // this.drageditem.pages=this.drageditem.pages.filter(ipage=>ipage!=this.Newtask.pages[0]);

    
      this.Newtask=null;
  }
}

function __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
  };