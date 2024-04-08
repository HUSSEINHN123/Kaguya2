import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicDetailHeader from '../classes/MusicDetailHeader.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
declare class Playlist {
    #private;
    header?: MusicDetailHeader;
    items?: ObservedArray<YTNode> | null;
    constructor(response: ApiResponse, actions: Actions);
    /**
     * Retrieves playlist items continuation.
     */
    getContinuation(): Promise<Playlist>;
    /**
     * Retrieves related playlists
     */
    getRelated(): Promise<MusicCarouselShelf>;
    getSuggestions(refresh?: boolean): Promise<any>;
    get page(): IBrowseResponse;
    get has_continuation(): boolean;
}
export default Playlist;
