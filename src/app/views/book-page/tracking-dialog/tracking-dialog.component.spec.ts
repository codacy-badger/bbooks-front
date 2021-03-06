import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackingDialogComponent} from './tracking-dialog.component';
import {of} from 'rxjs';
import {SocialAuthServiceConfigMock} from '../../../mocks/google.provide.mock';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService, TranslateStore} from '@ngx-translate/core';
import {MaterialModule} from '../../../material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateServiceMockForChild} from '../../../mocks/translate.service.mock';
import {ReadingTrackingService} from '../../../services/reading-tracking.service';
import {readingTrackingMock} from '../../../mocks/tracking.model';

describe('TrackingDialogComponent', () => {
    let component: TrackingDialogComponent;
    let fixture: ComponentFixture<TrackingDialogComponent>;

    const mockMatDialog = {
        open: jest.fn(() => {
            return {afterClosed: jest.fn(() => of([]))};
        })
    };
    const matDialogRefMock = {
        close: jest.fn((response) => {
            return response;
        })
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackingDialogComponent],
            imports: [
                MaterialModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateServiceMockForChild,
            ],
            providers: [
                ReadingTrackingService,
                SocialAuthServiceConfigMock,
                {
                    provide: MatDialog,
                    useValue: mockMatDialog
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: readingTrackingMock
                },
                {
                    provide: MatDialogRef,
                    useValue: matDialogRefMock
                },
                TranslateService,
                TranslateStore
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
