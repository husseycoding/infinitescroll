var infinitescroll = Class.create({
    afterInit: function() {
        this.restyle();
        this.addShowMore();
    },
    restyle: function() {
        $$(".pager").each(function(e) {
            e.remove();
        });
    },
    addShowMore: function() {
        if (this.shouldload) {
            Event.observe(window, "scroll", function() {
                this.makeRequest();
            }.bind(this));
            this.makeRequest();
        }
    },
    testRequest: function() {
        if ((document.viewport.getScrollOffsets().top + document.viewport.getHeight()) >= this.getTriggerHeight()) {
            return true;
        }
        return false;
    },
    addLoading: function() {
        if (this.mode == "grid") {
            this.getInsertElement().insert({ before:"<div id=\"infinitescroll-loading\"></div>" });
        } else {
            this.getInsertElement().insert({ bottom:"<div id=\"infinitescroll-loading\"></div>" });
        }
    },
    makeRequest: function() {
        if (this.testRequest()) {
            Event.stopObserving(window, "scroll");
            this.addLoading();
            var url = window.location.href;
            var args = url.split("?");
            if (args.length > 1) {
                url += "&p=" + this.nextpage;
            } else {
                url += "?p=" + this.nextpage;
            }
            new Ajax.Request(url, {
                method:'get',
                onSuccess: function(response) {
                    this.nextpage++;
                    $("infinitescroll-loading").remove();
                    this.addContent(response);
                }.bind(this)
            });
        }
    },
    addContent: function(response) {
        if (this.mode == "grid") {
            this.addGridContent(response);
        } else {
            this.addListContent(response);
        }
        this.disable.bind(this).defer();
        this.addShowMore.bind(this).defer();
    },
    addGridContent: function(response) {
        $$(".category-products > .last").each(function(e) {
            e.removeClassName("last");
        });
        var page = new Element("div").update(response.responseText);
        this.removeToolbar(page);
        this.getInsertElement().insert({ before:page.down(".category-products").innerHTML });
    },
    addListContent: function(response) {
        $$(".products-list > .last").each(function(e) {
            e.removeClassName("last");
        });
        var page = new Element("div").update(response.responseText);
        this.removeToolbar(page);
        this.getInsertElement().insert({ bottom:page.down(".products-list").innerHTML });
        this.getInsertElement().insert({ bottom:page.down(".category-products script") });
    },
    removeToolbar: function(page) {
        while (page.down(".toolbar")) {
            page.down(".toolbar").remove();
        }
        while (page.down(".toolbar-bottom")) {
            page.down(".toolbar-bottom").remove();
        }
    },
    getInsertElement: function() {
        if (this.mode == "grid") {
            return $$(".toolbar-bottom")[0];
        } else {
            return $$(".products-list")[0];
        }
    },
    disable: function() {
        if (this.nextpage > this.lastpage) {
            this.shouldload = false;
        }
    },
    getTriggerHeight: function() {
        return this.getInsertElement().up().cumulativeOffset().top + this.getInsertElement().up().getHeight();
    }
});

document.observe("dom:loaded", function() {
    if (typeof(thisinfinitescroll) == "object") {
        thisinfinitescroll.afterInit();
    }
});
