import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-services/certificates';
import { Certificates as CertificatesModel } from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-certificates',
  standalone: false,
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
})
export class Certificates {
  certificates: CertificatesModel[] = [];

  constructor(public certificatesService: CertificatesService) {
    console.log(this.certificatesService);
    this.certificatesService
      .getCertificates()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      )
      .subscribe((data) => {
        this.certificates = data;
        console.log(this.certificates);
      });
  }
}
