import { FaBold, FaItalic, FaUnderline, FaStrikethrough } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

export type SelectableProp = 'h1' | 'h2' | 'h3' | 'h4' | 'b' | 'i' | 'u' | 's';

export type Property =
  | {
      name: string;
      type: 'tag';
    }
  | {
      name: SelectableProp;
      type: 'style';
      code: {
        cssProp: string;
        value: string;
      };
      icon: IconType;
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
      icon: FaBold,
    },
    {
      name: 'i',
      type: 'style',
      code: {
        cssProp: 'font-style',
        value: 'italic',
      },
      icon: FaItalic,
    },
  ],
  [
    {
      name: 'u',
      type: 'style',
      code: {
        cssProp: 'text-decoration',
        value: 'underline',
      },
      icon: FaUnderline,
    },
    {
      name: 's',
      type: 'style',
      code: {
        cssProp: 'text-decoration',
        value: 'line-through',
      },
      icon: FaStrikethrough,
    },
  ],
] as Property[][];
