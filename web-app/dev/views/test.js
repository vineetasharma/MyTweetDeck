function bar() {
    this.a = 10;
    console.log(this.i);
    var outer = this;
    console.log('outer.i', outer.i);
    var a = function () {
        var inner = this;
        var b = function () {
            var innermost = this;
            innermost.i = 100;
            console.log('b', innermost.i, inner.i, 'i in ou', outer.i);
        }
        b();
        this.i = 'middle';
        console.log('a', this);
    }
    a();
    console.log(outer.i, 'after a', this.i);
    outer.i = 'chamged';
    console.log(outer.i, 'outer.i', this.i);
    this.i = 'anotherchanged';
    console.log(outer.i, 'outer.i end', this.i);
}