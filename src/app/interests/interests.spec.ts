import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Interests } from './interests';

const firestoreStub = {
  collection: () => ({ snapshotChanges: () => of([]) }),
};

describe('Interests', () => {
  let component: Interests;
  let fixture: ComponentFixture<Interests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Interests],
      providers: [{ provide: AngularFirestore, useValue: firestoreStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Interests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
