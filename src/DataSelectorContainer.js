
export class DataSelectorContainer {
    constructor(node, dataSelector) {
        this.node = node;
        this.dataSelector = dataSelector;
    }

    from(data) {
        return this.dataSelector.select(data, this.node);
    }
}
