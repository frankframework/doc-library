import type { Route } from "./+types/home";
import { useFFDoc, useJavadocTransform } from "@frankframework/doc-library-react";
import type { Elements, ElementDetails } from '@frankframework/doc-library-core';

export function loader() {
  return { name: "React Router" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { elements } = useFFDoc();

  return (
    <>
      <div className="text-center p-4">
        <h1 className="text-2xl">Hello, {loaderData.name}</h1>
      </div>
      <div className="p-4">
        <h2 className="text-2xl">Elements</h2>
        {Object.entries(elements ?? {}).map((elementEntry) => <ShowElement key={elementEntry[0]} elementEntry={elementEntry} elements={elements!} />)}
      </div>
    </>
  );
}

function ShowElement({ elementEntry: [elementName, element], elements }: { elementEntry: [string, ElementDetails], elements: Elements }) {
  const description = useJavadocTransform(element.description ?? '', elements);

  return (
    <div className="py-2">
      <h3 className="text-lg">{elementName}</h3>
      <p dangerouslySetInnerHTML={description}></p>
    </div>
  )
}
