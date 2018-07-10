if (!window.wbiGlobalScope) {
    window.wbiGlobalScope = []
}

function ieIntervalHandler(id, strFunc) {
    var scope = window.wbiGlobalScope[id];
    eval("scope." + strFunc + "()")
}

function WBIHorizontalTicker(a) {
    this.textW = 0;
    this.containerW = 0;
    this.scroller = null;
    this.destLoc = 0;
    this.moveAmount = 1;
    this.moveInterval = 30;
    this.refreshData = 20000;
    this.pauseAnimation = true;
    this.sub_symbols;
    this.updatingList = false;
    this.scrolling = false;
    this.animationStarted = false;
    this.listName = a;
    this.scollerID = "";
    this.timer = null;
    this.alsoMove = null;
    this.animate = true;
    this.animationHost = null;
    this.start = function () {
        var c = new Date();
        this.scollerID = "wbi_scroller_" + c.getSeconds().toString() + c.getMilliseconds().toString() + Math.floor(Math.random() * 101).toString();
        var b = '<div class="wbiscroller"><div class="scrollingtext" id="' + this.scollerID + '"></div></div>';
        document.writeln(b);
        window.wbiGlobalScope[this.scollerID.toString()] = this;
        var d = "#" + this.scollerID;
        this.scroller = $(d);
        this.scroller.mouseenter(this.OnMouseOver);
        this.scroller.mouseleave(this.OnMouseOut);
        this.UpdateList();
        this.startTimer()
    };
    this.startTimer = function () {
        if (document.all) {
            setInterval('ieIntervalHandler("' + this.scollerID + '","UpdateValues")', this.refreshData)
        } else {
            this.timer = setInterval(function (b) {
                b.UpdateValues()
            }, this.refreshData, this)
        }
    };
    this.StartAnimationTimer = function () {
        if (document.all) {
            setInterval('ieIntervalHandler("' + this.scollerID + '","AnimateLoop")', this.moveInterval)
        } else {
            this.timer = setInterval(function (b) {
                b.AnimateLoop()
            }, this.moveInterval, this)
        }
    };
    this.setInitialLocation = function () {
        this.scroller.css({left: (this.containerW * 0.75)});
        if (this.alsoMove != null) {
            this.alsoMove.scroller.css({left: (this.containerW * 0.75)})
        }
    };
    this.OnMouseOver = function () {
        var b = $(this).attr("id");
        var c = window.wbiGlobalScope[b.toString()];
        if (c.animationHost == null) {
            c.pauseAnimation = true
        } else {
            c.animationHost.pauseAnimation = true
        }
    };
    this.OnMouseOut = function () {
        var b = $(this).attr("id");
        var c = window.wbiGlobalScope[b.toString()];
        if (c.animationHost == null) {
            c.pauseAnimation = false
        } else {
            c.animationHost.pauseAnimation = false
        }
    };
    this.configureAnimation = function () {
        this.textW = this.scroller.width();
        this.containerW = this.scroller.parent().width();
        this.setInitialLocation();
        this.destLoc = -this.textW + (this.containerW * 0.15);
        if (this.animate) {
            this.StartAnimationTimer()
        }
    };
    this.AnimateLoop = function () {
        if (this.pauseAnimation == false) {
            var b = this.scroller.position().left;
            if (b <= this.destLoc) {
                this.pauseAnimation = true;
                this.UpdateList()
            }
            b -= this.moveAmount;
            this.scroller.css({left: b});
            if (this.alsoMove != null) {
                this.alsoMove.scroller.css({left: b})
            }
        }
    };
    this.getListHeader = function () {
        if (this.listName == "gainers") {
            return "Top 10 Gainers"
        } else {
            if (this.listName == "losers") {
                return "Top 10 Losers"
            }
        }
    };
    this.getTableHeader = function () {
        var b = b = '<span style="margin-right:5px;color:white;font-style:bold;">' + this.getListHeader() + "</span>";
        return b
    };
    this.getTableFooder = function () {
        var b = '<span style="margin-right:5px;color:white;font-style:bold;"><a style="color:white;" href="http://widgets.freestockcharts.com/Gallery.aspx" target="_blank">Add this widget to your site</a></span>';
        return b;
        var b = "";
        return b
    };
    this.getSymbolDiv = function (b) {
        var e = b.n.replace(".", "_");
        e = e.replace("/", "_");
        var d = '<span class="WLSymbolItem" id="' + e + '_display"><a class="sym" target="_parent" href="http://www.freestockcharts.com/?Symbol=' + b.n + '&source=TickerWidget">';
        var c = "http://widgets.freestockcharts.com/WidgetServer/images/greenup.png";
        if (b.v1.substr(0, 1) == "-") {
            c = "http://widgets.freestockcharts.com/WidgetServer/images/reddown.png"
        }
        d += b.n + ' <span style="padding-left:3px;margin-right:3px;color:silver;" class="quoteup" id="' + e + '_quote">' + b.v2 + '</span><span style="height:100%;" class="dirup" id="' + e + '_dir"><img alt="" border="0" id="' + e + '_img" src="' + c + '" /></span><span class="quoteup" id="' + e + '_change">' + b.v1 + "</span>";
        d += "</a></span>";
        return d
    };
    this.clearChangeClass = function () {
        var e = sub_symbols.split(",");
        for (i = 0; i <= e.length - 1; i++) {
            var c = "#" + e[i] + "_quote";
            var d = "#" + e[i] + "_change";
            var b = "#" + e[i] + "_display";
            $(b).removeClass("valueChanged")
        }
    };
    this.NewDataCallback = function (d) {
        if ((d != null)) {
            if (d.length > 0) {
                this.sub_symbols = "";
                var c = "";
                c = this.getTableHeader();
                for (i = 0; i <= d.length - 1; i++) {
                    var b = d[i];
                    this.sub_symbols += b.n;
                    if (i < d.length - 1) {
                        this.sub_symbols += ","
                    }
                    c += this.getSymbolDiv(b)
                }
                c += this.getTableFooder();
                this.scroller.empty();
                this.scroller.append(c);
                this.updatingList = false;
                this.UpdateValues();
                if (this.animationStarted == false) {
                    this.animationStarted = true;
                    this.configureAnimation()
                }
                this.setInitialLocation();
                this.pauseAnimation = false
            }
        }
        this.updatingList = false
    };
    this.UpdateList = function () {
        this.updatingList = true;
        var c = new Date();
        var b = c.getHours().toString() + c.getMinutes().toString() + c.getSeconds().toString() + c.getMilliseconds().toString();
        $.getJSON("http://widgets.freestockcharts.com/WidgetServer/DynamicLists.ashx?name=" + this.listName + "&senderID=" + this.scollerID + "&take=10&cbust=" + b + "&jsoncallback=?", function (e, f) {
            if ((e != null)) {
                var d = window.wbiGlobalScope[e.senderId.toString()];
                d.NewDataCallback(e.lst)
            }
        })
    };
    this.newQuotedata = function (b, c) {
        if ((b != null)) {
            if (b.length > 0) {
                for (i = 0; i <= b.length - 1; i++) {
                    this.updateSymbolData(b[i].Symbol, b[i].Price, b[i].vol, b[i].percent, b[i].isUp)
                }
            }
        }
    };
    this.UpdateValues = function () {
        if (this.updatingList) {
            return
        }
        var c = new Date();
        var b = c.getHours().toString() + c.getMinutes().toString() + c.getSeconds().toString() + c.getMilliseconds().toString();
        $.getJSON("http://widgets.freestockcharts.com/Ajaxserver.aspx?service=DATA&senderID=" + this.scollerID + "&sym=" + this.sub_symbols + "&cbust=" + b + "&jsoncallback=?", function (e, f) {
            if ((e != null)) {
                var d = window.wbiGlobalScope[e.sid.toString()];
                d.newQuotedata(e.quotes)
            }
        })
    };
    this.updateSymbolData = function (d, f, e, k, c) {
        d = d.replace(".", "_");
        d = d.replace("/", "_");
        var j = "#" + d + "_quote";
        var h = "#" + d + "_change";
        var m = "#" + d + "_dir";
        var n = "#" + d + "_img";
        var l = "#" + d + "_vol";
        var b = "#" + d + "_display";
        var g = $(j).text();
        $(j).text(f);
        $(h).text(k);
        $(b).removeClass("valueChanged");
        if (c) {
            $(h).removeClass("changedown");
            $(h).addClass("changeup");
            $(j).removeClass("changedown");
            $(m).removeClass("dirdown");
            $(m).addClass("dirup");
            $(n).attr("src", "http://widgets.freestockcharts.com/WidgetServer/images/greenup.png")
        } else {
            $(h).removeClass("changeup");
            $(h).addClass("changedown");
            $(j).removeClass("changeup");
            $(m).removeClass("dirup");
            $(m).addClass("dirdown");
            $(n).attr("src", "http://widgets.freestockcharts.com/WidgetServer/images/reddown.png")
        }
    }
};