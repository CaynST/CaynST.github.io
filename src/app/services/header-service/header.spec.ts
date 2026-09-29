import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { HeaderService } from './header';

describe('HeaderService', () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AngularFirestore,
          useValue: { collection: () => ({ snapshotChanges: () => of([]) }) },
        },
      ],
    });
    service = TestBed.inject(HeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
