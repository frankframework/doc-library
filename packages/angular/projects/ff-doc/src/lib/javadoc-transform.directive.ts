import { Directive, inject, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ElementsWithInfo, LinkData, transformAsHtml, transformAsText } from '@frankframework/doc-library-core';

export type TemplateContext = { $implicit: string };
export type LinkTemplateContext = { $implicit: LinkData };

/**
 * Transforms javadoc text to html text, handles links as a different template.
 * */
@Directive({
  selector: '[fdJavadocTransform]',
  standalone: true,
})
export class JavadocTransformDirective implements OnChanges {
  @Input({ required: true }) fdJavadocTransformOf?: string;
  @Input({ required: true }) fdJavadocTransformElements!: Record<string, ElementsWithInfo> | null;
  @Input() fdJavadocTransformLink?: TemplateRef<LinkTemplateContext>;
  @Input() fdJavadocTransformAsText = false;

  private readonly templateRef: TemplateRef<TemplateContext> = inject(TemplateRef);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  ngOnChanges(): void {
    if (this.fdJavadocTransformOf === '') this.fdJavadocTransformOf = '-';
    if (!this.fdJavadocTransformOf || !this.fdJavadocTransformElements) return;
    const javadocParts = this.fdJavadocTransformAsText
      ? transformAsText(this.fdJavadocTransformOf, this.fdJavadocTransformElements)
      : transformAsHtml(this.fdJavadocTransformOf, this.fdJavadocTransformElements, !!this.fdJavadocTransformLink);
    this.viewContainerRef.clear();

    for (const part of javadocParts) {
      if (this.fdJavadocTransformLink && typeof part === 'object') {
        this.viewContainerRef.createEmbeddedView<LinkTemplateContext>(this.fdJavadocTransformLink, {
          $implicit: part as LinkData,
        });
        continue;
      }
      this.viewContainerRef.createEmbeddedView<TemplateContext>(this.templateRef, {
        $implicit: part as string,
      });
    }
  }
}
