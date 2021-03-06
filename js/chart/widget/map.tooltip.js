jui.define("chart.widget.map.tooltip", [], function() {

    /**
     * @class chart.widget.map.core
     * @extends chart.widget.core
     */
    var MapTooltipWidget = function(chart, axis, widget) {
        var self = this;
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;

        function getFormat(data) {
            if(typeof(widget.format) == "function") {
                return self.format(data);
            }

            return null;
        }

        function printTooltip(data) {
            // 위젯 포지션에 따른 별도 처리
            if(widget.orient == "bottom") {
                text.attr({ y: textY + anchor });
            }

            var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            elem.textContent = getFormat(data);

            text.element.appendChild(elem);
            text.attr({ "text-anchor": "middle" });
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.text({
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var isActive = false,
                w, h;

            axis.map.group(function(i, path) {

            });

            this.on("mouseover", function(obj, e) {
                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.orient, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            this.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.orient == "left" || widget.orient == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.orient == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.orient == "right") {
                    x = e.bgX + anchor;
                } else if(widget.orient == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            this.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    return MapTooltipWidget;
}, "chart.widget.tooltip");