import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { Elements } from '@frankframework/doc-library-core';
import { JavadocTransformDirective } from '@frankframework/doc-library-ng';
import { HttpClient } from '@angular/common/http';
import { NgFFDoc } from '../../projects/ff-doc/src/lib/ng-ff-doc';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe, JavadocTransformDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected elements: Signal<Elements> = computed(() => this.ffdoc.elements() ?? {});
  private jsonUrl = '/assets/example-ffdoc.json';

  private readonly httpClient: HttpClient = inject(HttpClient);
  private ffdoc = new NgFFDoc(this.httpClient);

  ngOnInit(): void {
    this.ffdoc.initialize(this.jsonUrl);
  }
}
