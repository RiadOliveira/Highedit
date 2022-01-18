export type Property =
  | {
      name: string;
      type: 'tag';
    }
  | {
      name: string;
      type: 'style';
      code: string;
    };

export default [
  [
    {
      name: 'h1',
      type: 'tag',
    },
    {
      name: 'h2',
      type: 'tag',
    },
  ],
  [
    {
      name: 'h3',
      type: 'tag',
    },
    {
      name: 'h4',
      type: 'tag',
    },
  ],
  [
    {
      name: 'b',
      type: 'style',
      code: 'font-weight: bold;',
    },
    {
      name: 'i',
      type: 'style',
      code: 'font-style: italic;',
    },
  ],
] as Property[][];
