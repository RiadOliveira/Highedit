import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaLink,
  FaImage,
  FaSave,
  FaFont,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

export type SelectableTag = 'h1' | 'h2' | 'h3' | 'h4' | 'a' | 'img' | 'save';
export type SelectableProp =
  | 'font'
  | 'Aa' // Font-size
  | 'b'
  | 'i'
  | 'u'
  | 's'
  | 'center'
  | 'justify'
  | 'left'
  | 'right'
  | '#'; // Color

export type Property =
  | {
      name: SelectableTag;
      type: 'tag';
      icon?: IconType;
    }
  | {
      name: SelectableProp;
      type: 'style';
      code: {
        cssProp: string;
        value: string;
      };
      icon?: IconType;
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
      name: 'a',
      type: 'tag',
      icon: FaLink,
    },
    {
      name: 'img',
      type: 'tag',
      icon: FaImage,
    },
  ],
  [
    {
      name: 'font',
      type: 'style',
      code: {
        cssProp: 'font-family',
        value: 'Arial',
      },
      icon: FaFont,
    },
    {
      name: 'Aa',
      type: 'style',
      code: {
        cssProp: 'font-size',
        value: '42px',
      },
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
  [
    {
      name: 'center',
      type: 'style',
      code: {
        cssProp: 'text-align',
        value: 'center',
      },
      icon: FaAlignCenter,
    },
    {
      name: 'justify',
      type: 'style',
      code: {
        cssProp: 'text-align',
        value: 'justify',
      },
      icon: FaAlignJustify,
    },
  ],
  [
    {
      name: 'left',
      type: 'style',
      code: {
        cssProp: 'text-align',
        value: 'left',
      },
      icon: FaAlignLeft,
    },
    {
      name: 'right',
      type: 'style',
      code: {
        cssProp: 'text-align',
        value: 'right',
      },
      icon: FaAlignRight,
    },
  ],
  [
    {
      name: '#',
      type: 'style',
      code: {
        cssProp: 'color',
        value: 'blue',
      },
    },
    {
      name: 'save',
      type: 'tag',
      icon: FaSave,
    },
  ],
] as Property[][];
