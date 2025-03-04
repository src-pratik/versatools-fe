import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Category } from '../../models';

@Component({
  selector: 'app-category-list-horizontal',
  templateUrl: './category-list-horizontal.component.html',
  styleUrls: ['./category-list-horizontal.component.scss'],
  standalone: false
})
export class CategoryListHorizontalComponent implements OnInit, OnChanges {
  @Input() categories: Category[] | undefined;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  // @Output('ngModelChange') update: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit() { }

  onClick(category: any) {
    this.onSelect.emit(category);
  }
}
