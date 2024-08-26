import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Article,
  getArticleObjectFromDB,
  getDBObjectFromArticleObject,
} from '../model/article';
import { from, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private fireStorage: AngularFireStorage,
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {}

  // add article
  addArticle(article: Article) {
    article.id = article.barcode;
    this.spinnerService.show();
    this.getArticle(article.barcode, article.articleCode).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          let existArticle = res[0];
          existArticle.count = existArticle.count + article.count;
          const articleRef = doc(
            this.firestore,
            'Articles',
            existArticle.barcode
          );
          setDoc(articleRef, { count: existArticle.count }, { merge: true })
            .then((e) => {
              this.snackBar.open(
                `Article ${article.articleCode} updated`,
                'OK',
                {
                  duration: 2000,
                }
              );
              this.spinnerService.hide();
            })
            .catch((err) => {
              this.snackBar.open(
                `Error in updatting Article ${article.articleCode}`,
                'OK',
                {
                  duration: 2000,
                }
              );
              console.error(err);
              this.spinnerService.hide();
            });
        } else {
          let data = getDBObjectFromArticleObject(article);
          setDoc(doc(this.firestore, 'Articles', article.id), data)
            .then((e) => {
              this.snackBar.open(`Article ${article.articleCode} added`, 'OK', {
                duration: 2000,
              });
              this.spinnerService.hide();
            })
            .catch((err) => {
              this.snackBar.open(
                `Error in updatting Article ${article.articleCode}`,
                'OK',
                {
                  duration: 2000,
                }
              );
              console.error(err);
              this.spinnerService.hide();
            });
        }
      },
    });
  }

  // delete article
  async deleteArticle(article: Article) {
    debugger;
    return await deleteDoc(doc(this.firestore, 'Articles', article.barcode));
  }

  // update article
  checkOutArticle(article: Article) {
    this.getArticle(article.barcode, article.articleCode).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          let existArticle = res[0];
          existArticle.count = existArticle.count - article.count;

          if (existArticle.count > 0) {
            const articleRef = doc(
              this.firestore,
              'Articles',
              existArticle.barcode
            );
            setDoc(articleRef, { count: existArticle.count }, { merge: true })
              .then((e) => {
                this.snackBar.open(
                  `Article ${article.articleCode} updated`,
                  'OK',
                  {
                    duration: 2000,
                  }
                );
              })
              .catch((err) => {
                this.snackBar.open(
                  `Error in updatting Article ${article.articleCode}`,
                  'OK',
                  {
                    duration: 2000,
                  }
                );
                console.error(err);
              });
          } else {
            this.deleteArticle(article)
              .then((e) => {
                this.snackBar.open(
                  `Article ${article.articleCode} Deleted`,
                  'OK',
                  {
                    duration: 2000,
                  }
                );
              })
              .catch((err) => {
                this.snackBar.open(
                  `Error in updatting Article ${article.articleCode}`,
                  'OK',
                  {
                    duration: 2000,
                  }
                );
                console.error(err);
              });
          }
        }
      },
    });
  }

  getArticle(
    barcode: string | null,
    articleID: string | null
  ): Observable<Article[]> {
    let articles: Article[] = [];

    return from(
      getDocs(this.getQueryObject(barcode, articleID))
        .then((e) => {
          return e.docs.map((doc: any) => {
            const data = getArticleObjectFromDB(doc.data());
            data.id = doc.id;
            return data;
          });
        })
        .catch((e) => {
          alert('error in Fetching data');
          return articles;
        })
    );
  }

  getQueryObject(barcode: string | null, articleID: string | null) {
    if (barcode && articleID) {
      return query(
        collection(this.firestore, 'Articles'),
        where('bar_code', '==', barcode),
        where('article_code', '==', articleID)
      );
    } else if (barcode) {
      return query(
        collection(this.firestore, 'Articles'),
        where('bar_code', '==', barcode)
      );
    } else if (articleID) {
      return query(
        collection(this.firestore, 'Articles'),
        where('article_code', '==', articleID)
      );
    } else {
      return collection(this.firestore, 'Articles');
    }
  }

  deleteAllDocuments() {
    this.spinnerService.show();
    this.getArticle(null, null).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          res.forEach((e) => {
            this.deleteArticle(e).then((e)=>{
              console.log(e);
            }).catch(err=>{
              console.error(err);
            });
          });
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }
}
