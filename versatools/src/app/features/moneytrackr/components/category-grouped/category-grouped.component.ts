import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportCategoryGroupedViewModel } from '../../models';

@Component({
  selector: 'app-category-grouped',
  templateUrl: './category-grouped.component.html',
  styleUrls: ['./category-grouped.component.scss'],
  standalone: false
})
export class CategoryGroupedComponent implements OnInit {

  @Input("data") viewModel: ReportCategoryGroupedViewModel | null = null;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onClick(row: any) {
    this.onSelect.emit(row);
  }

}
