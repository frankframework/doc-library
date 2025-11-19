# FF! Doc Library

The FF! Doc Library is a powerful and easy-to-use Node.js package designed to extract and process information from the `frankdoc.json`.
This library simplifies working with the data structure and enables seamless integration with [FF! Reference](https://frankdoc.frankframework.org/#/search) and FF! Flow projects.
No matter if you use React, Angular or vanilla JavaScript, FF! Doc Library has you covered.

## Usage
### Angular
```ts
import { NgFFDoc, JavadocTransformDirective } from '@frankframework/doc-library-angular';
```

### React
```tsx
import { useFFDoc, useJavadocTransform } from '@frankframework/doc-library-react';
```

### ESM / TS
```js
import { FFDoc } from '@frankframework/doc-library-core';
```

## Development
Make sure you have pnpm installed and run `pnpm install`.

The core package is written in TypeScript and can be used in any environment that supports ESM.
This is also the basis for the Angular and React packages.

To build and test the Angular & React packages, run `pnpm build`.
To run the Angular & React playgrounds, refer to their respective README files.
