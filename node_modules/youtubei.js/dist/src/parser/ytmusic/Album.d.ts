import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicDetailHeader from '../classes/MusicDetailHeader.js';
import type { ApiResponse } from '../../core/index.js';
import type { ObservedArray } from '../helpers.js';
import type { IBrowseResponse } from '../types/index.js';
import type MusicResponsiveListItem from '../classes/MusicResponsiveListItem.js';
declare class Album {
    #private;
    header?: MusicDetailHeader;
    contents: ObservedArray<MusicResponsiveListItem>;
    sections: ObservedArray<MusicCarouselShelf>;
    url: string | null;
    constructor(response: ApiResponse);
    get page(): IBrowseResponse;
}
export default Album;
