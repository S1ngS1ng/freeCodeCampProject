import { CardSuit, CardValue } from '../card';

export type Cache = {
    [key in CardSuit]: CardValue[]
};
