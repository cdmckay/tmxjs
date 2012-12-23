require.config({
    paths: {
        jquery: "../lib/jquery"
    },
    shim: {
        nodeunit: {
            exports: "nodeunit"
        }
    }
});

require(["nodeunit"], function (nodeunit) {

});