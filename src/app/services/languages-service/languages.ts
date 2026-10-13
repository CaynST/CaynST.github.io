import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Languages } from '../../models/languages/languages.model';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {

	private dbPath = '/language';

	languagesRef: AngularFirestoreCollection<Languages>;

	constructor(private db: AngularFirestore){
		this.languagesRef = db.collection(this.dbPath);
	}

	getLanguages(): AngularFirestoreCollection<Languages>{
		return this.languagesRef;
	}

}
