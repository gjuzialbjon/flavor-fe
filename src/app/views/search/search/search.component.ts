import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  keyword!: string

  constructor(
    private route: ActivatedRoute,
  ) { 
    console.log('Construcing search')
    this.route.queryParams.subscribe(
      res => {
        this.keyword = res.key
        this.performSearch()
      },
      e => {
        console.error(e)
      }
    )
  }

  ngOnInit(): void {
  }

  performSearch(){
    // console.log('Performing search for ', this.keyword);
  }

  ngOnDestroy(){
    // console.log('On destroy');
  }
}
