import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Friend} from '../models/friend.model';
import {Observable} from 'rxjs';
import {ReviewTO} from '../models/ReviewTO.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    api: string = environment.api + 'review/';
    constructor(private http: HttpClient) {
    }

    save(friendTO: Friend): Observable<ReviewTO> {
        return this.http.post<ReviewTO>(this.api, friendTO);
    }
    delete(friendId: string): Observable<void> {
        return this.http.delete<void>(this.api + friendId);
    }
    update(friendTO: Friend): Observable<ReviewTO> {
        return this.http.put<ReviewTO>(this.api + friendTO.id, friendTO);
    }
    getAllByBook(idBook: number): Observable<ReviewTO[]> {
        return this.http.get<ReviewTO[]>(this.api + 'book/' + idBook);
    }
    getAllByGoogleBook(googleBook: string): Observable<ReviewTO[]> {
        return this.http.get<ReviewTO[]>(this.api + 'google-book/' + googleBook);
    }
}
