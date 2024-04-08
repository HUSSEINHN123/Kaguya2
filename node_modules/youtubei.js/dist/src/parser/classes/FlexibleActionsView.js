import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ButtonView from './ButtonView.js';
class FlexibleActionsView extends YTNode {
    constructor(data) {
        super();
        this.actions_rows = data.actionsRows.map((row) => ({
            actions: Parser.parseArray(row.actions, ButtonView)
        }));
        this.style = data.style;
    }
}
FlexibleActionsView.type = 'FlexibleActionsView';
export default FlexibleActionsView;
//# sourceMappingURL=FlexibleActionsView.js.map