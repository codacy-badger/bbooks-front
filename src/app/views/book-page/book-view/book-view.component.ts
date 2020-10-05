import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book} from '../../../models/book.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {switchMap, take} from 'rxjs/operators';
import {ReadingTrackingTO} from '../../../models/ReadingTrackingTO.model';
import {TrackingDialogComponent} from '../tracking-dialog/tracking-dialog.component';
import {ReadingTrackingService} from '../../../services/reading-tracking.service';
import {BookStatus, mapBookStatus} from '../../../models/enums/BookStatus.enum';
import {BookAddDialogComponent} from '../../shared/book-add-dialog/book-add-dialog.component';

@Component({
    selector: 'app-book-view',
    templateUrl: './book-view.component.html',
    styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit, OnDestroy {

    inscricao: Subscription;
    book: Book = new Book();
    stars: number[] = [1, 2, 3, 4, 5];
    rating = 1;
    stringAuthors: string;
    readingTracking: ReadingTrackingTO[] = [];
    status = BookStatus;
    percentage: number;


    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private trackingService: ReadingTrackingService
    ) {
        this.inscricao = this.route.data.pipe(take(1)).subscribe((data: { book: Book }) => {
            this.book = data.book;
            this.stringAuthors = this.convertAuthorsToString();
            if (this.book.idUserBook) {
                this.trackingService.getAllByUserBook(this.book.idUserBook).pipe(take(1)).subscribe(trackings => {
                        this.readingTracking = trackings.slice().sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                        this.percentage = this.getPercentTotal();
                    },
                    error => {
                        if (error.error.message.contains('Livro já está concluído')) {
                            alert(error.error.message);
                        } else {
                            console.log('error tracking all by idbook', error);
                        }
                    });
            }
        });
    }

    ngOnInit(): void {

    }

    getPercentTotal(): number {
        // let total = 0;
        // this.readingTracking.forEach(tracking => {
        //     total += tracking.percentage;
        // });
        // return total;
        return this.readingTracking[0]?.percentage ? this.readingTracking[0].percentage : 0;
    }

    verifystatusBook(): boolean {
        return this.book.status === this.status.EMPRESTADO || !this.book.idUserBook;
    }

    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
    }

    verifyPercentageIsLess100() {
        return this.percentage <= 100;
    }

    convertAuthorsToString(): string {
        const namesAuthors = this.book.authors.map(value => value.name);
        return namesAuthors.toString();
    }

    openDialogAddBook(book: Book) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: {
                book
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;
        })).subscribe((result) => {
            if (result) {
                this.book.idUserBook = result?.id;
                this.book.status = result?.status;
            }
        });
    }

    openDialogTracking(tracking: ReadingTrackingTO) {
        const dialogRef = this.dialog.open(TrackingDialogComponent, {
            height: '300px',
            width: '400px',
            data: {
                tracking,
                idUserbook: this.book.idUserBook
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;

        })).subscribe((result) => {
            if (result) {
                if (tracking) {
                    tracking.comentario = result.comentario;
                    tracking.percentage = result.percentage;
                    tracking.numPag = result.numPag;
                } else {
                    this.readingTracking.splice(0, 0, result);
                }
                this.percentage = this.getPercentTotal();
            }
        });
    }

}
