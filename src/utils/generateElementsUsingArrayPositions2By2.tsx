import { ReactElement } from 'react';

interface PropType {
  name: string;
}

function generateElementsUsingArrayPositions2By2<Type extends PropType>(
  array: Type[],
  ParentElement: React.FC,
  callback: (item: Type) => ReactElement,
): ReactElement[] {
  const parsedArray: Type[][] = [];

  for (let ind = 0; ind < array.length; ind += 2) {
    parsedArray.push([array[ind], array[ind + 1]]);
  }

  return parsedArray.map(([first, second]) => (
    <ParentElement key={first.name + second.name}>
      {callback(first)}
      {callback(second)}
    </ParentElement>
  ));
}

export default generateElementsUsingArrayPositions2By2;
