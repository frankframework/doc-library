import { Component, computed, inject, Signal } from '@angular/core';
import { FFDocService } from './ffdoc.service';
import { KeyValuePipe } from '@angular/common';
import { Elements } from '@common/ff-doc-base';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe, JavadocTransformDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected elements: Signal<Elements> = computed(() => this.ffdoc.elements() ?? {});

  private ffdocService: FFDocService = inject(FFDocService);
  private ffdoc = this.ffdocService.getFFDoc();
}
