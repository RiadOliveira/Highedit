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

// # = color ; Aa = font-size ; save = save result of edition
export type SpecialProperty = 'a' | 'img' | '#' | 'font' | 'Aa' | 'save';
export type SelectableProp =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'b'
  | 'i'
  | 'u'
  | 's'
  | 'center'
  | 'justify'
  | 'left'
  | 'right';

export type PropertyName = SpecialProperty | SelectableProp | SelectableProp;

export type Property =
  | {
      name: SelectableProp;
      type: 'style';
      code: {
        cssProp: string;
        value: string;
      };
      icon?: IconType;
    }
  | {
      name: SpecialProperty; // Props with unique handling
      type: 'special';
      code?:
        | {
            cssProp: string;
            value: string;
          }
        | string;
      icon?: IconType;
    };

export default [
  // All possibly buttons of the app (Separated in arrays in order to facilitate exhibition)
  {
    name: 'h1',
    type: 'style',
    code: {
      cssProp: 'font-size',
      value: '42px',
    },
  },
  {
    name: 'h2',
    type: 'style',
    code: {
      cssProp: 'font-size',
      value: '36px',
    },
  },
  {
    name: 'h3',
    type: 'style',
    code: {
      cssProp: 'font-size',
      value: '24px',
    },
  },
  {
    name: 'h4',
    type: 'style',
    code: {
      cssProp: 'font-size',
      value: '16px',
    },
  },
  {
    name: 'a',
    type: 'special',
    code: 'modal',
    icon: FaLink,
  },
  {
    name: 'img',
    type: 'special',
    code: 'modal',
    icon: FaImage,
  },
  {
    name: 'font',
    type: 'special',
    code: {
      cssProp: 'font-family',
      value: 'modal',
    },
    icon: FaFont,
  },
  {
    name: 'Aa',
    type: 'special',
    code: {
      cssProp: 'font-size',
      value: 'modal',
    },
  },
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
  {
    name: '#',
    type: 'special',
    code: {
      cssProp: 'color',
      value: 'modal',
    },
  },
  {
    name: 'save',
    type: 'special',
    icon: FaSave,
  },
] as Property[];
