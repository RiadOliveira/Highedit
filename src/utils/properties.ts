export type Property =
  | {
      name: string;
      type: 'tag';
    }
  | {
      name: string;
      type: 'style';
      code: {
        cssProp: string;
        value: string;
      };
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
      code: {
        cssProp: 'font-weight',
        value: 'bold',
      },
    },
    {
      name: 'i',
      type: 'style',
      code: {
        cssProp: 'font-style',
        value: 'italic',
      },
    },
  ],
] as Property[][];
