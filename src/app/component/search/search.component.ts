import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../shared/data.service';
import { Article, getArticleObjectFromDB } from '../../model/article';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tabFocused = 0;
  displayedColumns: string[] = ['No', 'Barcode', 'ArticleCode', 'Count'];
  dataSource: MatTableDataSource<Article>;
  dbData: Article[] = [];
  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  articleId = '';
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.getAllArticle(null, null);
    this.dataSource = new MatTableDataSource<Article>(this.dbData);
  }

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    if (changes['tabFocused'].currentValue == 0) {
      this.getAllArticle(null, null);
    }
  }
  getAllArticle(barcode: string | null, articleID: string | null) {
    this.loading = true;
    let articles = this.dataService.getArticle(barcode, articleID);
    articles.subscribe({
      next: (res) => {
        this.dbData = res;
        console.log("Data From New",this.dbData);
        this.dataSource = new MatTableDataSource<Article>(this.dbData);
        this.loading = false;
        return this.dataSource;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      },
      complete: () => console.info('complete'),
    })
  }
  searchArticle() {
    this.getAllArticle(null, this.articleId);
  }

  showLoading() {}
  showNoData() {
    return !this.loading && (!this.dbData || this.dbData.length == 0);
  }
}
