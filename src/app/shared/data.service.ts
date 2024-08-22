import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  QueryFn,
  CollectionReference,
  Query,
  FieldPath,
} from '@angular/fire/compat/firestore';

import {
  Firestore,
  collectionData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc
} from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Article,
  getArticleObjectFromDB,
  getDBObjectFromArticleObject,
} from '../model/article';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private afs: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private firestore: Firestore
  ) {}

  // add article
  addArticle(article: Article) {
    article.id = article.barcode;

    this.getArticle(article.barcode, article.articleCode).subscribe({
      next: (res) =>{
        if(res && res.length>0){
          let existArticle = res[0];
          existArticle.count = existArticle.count + article.count;
          const articleRef = doc(this.firestore, 'Articles', existArticle.barcode);
          setDoc(articleRef, { count : existArticle.count }, { merge: true });
        }else{
          let data = getDBObjectFromArticleObject(article);
          setDoc(doc(this.firestore, "Articles", article.id), data);
        }
      }
    })
    // let data = getDBObjectFromArticleObject(article);
    // return this.afs.collection(`/Articles`).doc(data.id).set(data);
  }


  // delete article
  async deleteArticle(article: Article) {
    await deleteDoc(doc(this.firestore, "Article", article.barcode));
  }

  // update article
  checkOutArticle(article: Article) {
    this.getArticle(article.barcode, article.articleCode).subscribe({
      next: (res) =>{
        if(res && res.length>0){
          let existArticle = res[0];
          existArticle.count = existArticle.count - article.count;

          if(existArticle.count>0){
            const articleRef = doc(this.firestore, 'Articles', existArticle.barcode);
            setDoc(articleRef, { count : existArticle.count }, { merge: true });
          }else{
            this.deleteArticle(article);
          }
        }
      }
    })
  }

  getArticle(barcode: string | null, articleID: string | null) : Observable<Article[]>{
    
    let articles: Article[] = [];
   
    return from(getDocs(this.getQueryObject(barcode, articleID))
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
      }));
  }

  getQueryObject(barcode: string | null, articleID: string | null){
    if(barcode && articleID){
      return query(
        collection(this.firestore, 'Articles'),
        where('bar_code', '==', barcode),  where('article_code', '==', articleID)
      );
    }
    else if(barcode){
      return query(
        collection(this.firestore, 'Articles'), where('bar_code', '==', barcode)
      );
    }else if(articleID){
      return query(
        collection(this.firestore, 'Articles'),  where('article_code', '==', articleID)
      );
    }else{
      return collection(this.firestore, 'Articles');
    }

  }
}
