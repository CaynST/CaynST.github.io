import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Header } from './header';

const firestoreStub = {
  collection: () => ({ snapshotChanges: () => of([]) }),
};

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Header],
      providers: [{ provide: AngularFirestore, useValue: firestoreStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
