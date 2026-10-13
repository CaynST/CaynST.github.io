import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Languages } from './languages';

const firestoreStub = {
  collection: () => ({ snapshotChanges: () => of([]) }),
};

describe('Languages', () => {
  let component: Languages;
  let fixture: ComponentFixture<Languages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Languages],
      providers: [{ provide: AngularFirestore, useValue: firestoreStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Languages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
