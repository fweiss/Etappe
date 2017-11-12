function XB(tag, attrs) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = [];
}
XB.prototype.buildAttrs = function() {
    var attrs = '';
    for (var prop in this.attrs) {
        if (this.attrs.hasOwnProperty(prop)) {
            attrs += ' ' + prop + '="' + this.attrs[prop] + '"';
        }
    }
    return attrs;
};
XB.prototype.wrap = function(tag, attrs) {
    var child = new XB(tag, attrs);
    this.children.push(child);
    return child;
};
XB.prototype.build = function() {
    return (this.tag ? '<' + this.tag + this.buildAttrs() + '>' : '') + this.buildChildren() + (this.tag ? '</' + this.tag + '>' : '');
};
XB.prototype.buildChildren = function() {
    var build = '';
    for (var i=0; i<this.children.length; i++) {
        build += this.children[i].build();
    }
    return build;
}
