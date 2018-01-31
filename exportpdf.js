module.exports = function (callback, html, value) {
    var jsreport = require('jsreport-core')();

    jsreport.init().then(function () {
        return jsreport.render({
            template: {
                content: html,
                engine: 'jsrender',
                recipe: 'phantom-pdf',
                phantom: {
                    margin: { "top": "5px", "left": "10px", "right": "10px", "bottom": "5px" },
                    headerHeight: "50px",
                    footerHeight: "50px"
                }
            },
            data: value
        }).then(function (resp) {
            callback(/* error */ null, resp.content.toJSON().data);
        });
    }).catch(function (e) {
        callback(/* error */ e, null);
    });
};