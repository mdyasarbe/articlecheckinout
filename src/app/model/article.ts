export interface Article {
    id : string;
    barcode : string;
    articleCode : string;
    count : number;
}



export function getArticleObjectFromDB(obj : any) : Article {
   let data  = {
        id: obj!.id,
        barcode : obj.bar_code,
        articleCode : obj.article_code,
        count : obj.count,
    }
    return data;
}
export function getDBObjectFromArticleObject(article : Article) : any {
    let data  = {
         id: article!.id,
         bar_code : article.barcode,
         article_code : article.articleCode,
         count : article.count,
     }
     return data;
 }


