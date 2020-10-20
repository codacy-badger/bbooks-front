import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book} from '../../../models/book.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {map, switchMap, take} from 'rxjs/operators';
import {ReadingTrackingTO} from '../../../models/ReadingTrackingTO.model';
import {TrackingDialogComponent} from '../tracking-dialog/tracking-dialog.component';
import {ReadingTrackingService} from '../../../services/reading-tracking.service';
import {
    BookStatus,
    BookStatusEnglish,
    mapBookStatus,
    mapBookStatusEnglish
} from '../../../models/enums/BookStatus.enum';
import {BookAddDialogComponent} from '../../shared/book-add-dialog/book-add-dialog.component';
import {GoogleBooksService} from '../../../services/google-books.service';
import {BookService} from '../../../services/book.service';
import {TrackingViewComponent} from '../tracking-view/tracking-view.component';
import {TrackingTO} from '../../../models/TrackingTO.model';
import {TrackingService} from '../../../services/tracking.service';

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
    trackings: TrackingTO[] = [];

    status = BookStatus;
    mapEnglish = mapBookStatusEnglish;
    statusEnglish = BookStatusEnglish;
    panelOpenState = true;
    search;

    percentage: number;


    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private readingTrackingService: ReadingTrackingService,
        private gBookService: GoogleBooksService,
        private bookService: BookService,
        private trackingService: TrackingService
    ) {
        this.inscricao = this.route.data.pipe(take(1)).subscribe((data: { book: Book }) => {
            this.book = data.book;
            this.stringAuthors = this.convertAuthorsToString();
        });
    }

    ngOnInit(): void {
        this.getAllTracking();
    }

    getBook(): void {
        this.bookService.getAllUserBooks().subscribe((userbooks) => {
            this.gBookService.getById(this.book.id).subscribe(b => {
                const book = this.bookService.convertBookToModel(b);
                userbooks.books.forEach(userbook => {
                    if (userbook.idBook === book.id) {
                        book.status = userbook.status;
                        book.idUserBook = userbook.id;
                    }
                });
                this.book = book;
            });
        });
    }

    // getAllReadingTracking() {
    //     this.readingTrackingService.getAllByUserBook(this.book.idUserBook).pipe(take(1)).subscribe(trackings => {
    //             this.readingTracking = trackings
    //                 .slice()
    //                 .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    //             this.percentage = this.getPercentTotal();
    //         },
    //         error => {
    //             console.log('error tracking all by idbook', error);
    //         });
    // }
    getAllTracking() {
        this.trackingService.getAllByUserBook(this.book.idUserBook).pipe(take(1)).subscribe(trackings => {
                this.trackings = trackings
                    .slice()
                    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            },
            error => {
                console.log('error tracking all by idbook', error);
            });
    }

    orderByDate(readingTracking: ReadingTrackingTO[]) {
        return readingTracking
            .slice()
            .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }

    getPercentTotal(readingTrackings: ReadingTrackingTO[]): number {
        readingTrackings = this.orderByDate(readingTrackings);
        return readingTrackings[0]?.percentage ? readingTrackings[0].percentage : 0;
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
        })).subscribe(() => {
            this.getBook();
        });
    }

    openDialogTracking(tracking: ReadingTrackingTO, editPag: boolean, trackingUpId: string) {
        const dialogRef = this.dialog.open(TrackingDialogComponent, {
            height: '300px',
            width: '400px',
            data: {
                tracking,
                idUserbook: this.book.idUserBook,
                canEditPag: editPag,
                trackingUpId
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;

        })).subscribe((result) => {
            if (result) {
                if (result === 'delete') {
                    this.getAllTracking();
                }
                if (tracking) {
                    tracking.comentario = result.comentario;
                    tracking.percentage = result.percentage;
                    tracking.numPag = result.numPag;
                } else {
                    this.readingTracking.splice(0, 0, result);
                }
                //this.percentage = this.getPercentTotal();
            }
            this.getBook();
            this.getAllTracking();
        });
    }

    openDialogView(tracking: TrackingTO) {

        const dialogRef = this.dialog.open(TrackingViewComponent, {
            height: '300px',
            width: '400px',
            data: {
                tracking,
                idUserbook: this.book.idUserBook,
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;
        })).subscribe(() => {
            this.getBook();
            this.getAllTracking();
        });
    }

    getStatus(readingTrackings: ReadingTrackingTO[]): string {
        if (readingTrackings.length > 0) {
            readingTrackings = this.orderByDate(readingTrackings);
            return readingTrackings[0].percentage.toString() === '100' ? 'concluido' : 'pending';
        } else {
            return 'pending';
        }
    }

    getConcluidos(status: string): number {
        let response = 0;
        this.trackings.forEach(tracking => {
            if (status === this.getStatus(tracking.trackings)) {
                response++;
            }
        });
        return response;
    }

    getStatusTranslate(readings: ReadingTrackingTO[]): string {
        const resp = this.getStatus(readings);
        if (resp === 'concluido') {
            return 'PADRAO.CONCLUIDO';
        } else {
            return 'PADRAO.PENDENTE';
        }
    }

}
