!function ($) {
    $.fn.TimePlan = function (myParam) {
            //响应鼠标移动事件
            function myMouseMove(t) {
                if (bMouseDown && null != MyTimePlan.drawSection) {
                    var i = Math.floor(GetMouseDownPos(t.clientX) - MyTimePlan.minClientX);
                    if (myMouseDownPos > i) {
                        MyTimePlan.drawEndClientX = MyTimePlan.drawStartClientX
                        return;
                    }
                    if (PointInSection(MyTimePlan.drawSection.day, i)) {
                        return;
                    }
                    if (InterSection(MyTimePlan.drawSection.day, myMouseDownPos, i)) {
                        return;
                    }
                    MyTimePlan.drawEndClientX = i;
                    var n = MyTimePlan.drawEndClientX - MyTimePlan.drawStartClientX;
                    MyTimePlan.drawSection.width(n);
                    $("#" + MyTimePlan.id + "_tipsLeft").css({
                        left: MyTimePlan.drawStartClientX + 42,
                        top: 45 * MyTimePlan.drawSection.day + 40
                    }).text(CalcTimeByPos(MyTimePlan.drawStartClientX).substring(0, 5)).show();
                    $("#" + MyTimePlan.id + "_tipsRight").css({
                        left: MyTimePlan.drawEndClientX + 41,
                        top: 45 * MyTimePlan.drawSection.day + 40
                    }).text(CalcTimeByPos(MyTimePlan.drawEndClientX).substring(0, 5)).show()
                }
                //拖整体处理
                if (null != H && "" == mySectionSide) {
                    if (myTimeTip.is(":visible")) {
                        myTimeTip.hide();
                    }
                    var distance = t.clientX - MyTimePlan.minClientX - myMouseDownPos;
                    var sPos = H.start + distance;
                    var ePos = sPos + (H.end - H.start);
                    if (sPos < K.min || ePos > K.max) {
                        return;
                    }
                    myCurSection.css({left: sPos});
                    tmpSection = {start: sPos, end: ePos};
                    $("#" + MyTimePlan.id + "_tipsLeft").css({
                        left: sPos + 42,
                        top: 45 * myCurSection.day + 40
                    }).text(CalcTimeByPos(sPos).substring(0, 5)).show();
                    $("#" + MyTimePlan.id + "_tipsRight").css({
                        left: ePos + 41,
                        top: 45 * myCurSection.day + 40
                    }).text(CalcTimeByPos(ePos).substring(0, 5)).show()
                }
                //拖边处理
                if (null != H && "" != mySectionSide) {
                    if (myTimeTip.is(":visible")) {
                        myTimeTip.hide();
                    }
                    var sPos;
                    var ePos;
                    var distance = t.clientX - MyTimePlan.minClientX - myMouseDownPos;
                    if ("left" == mySectionSide) {
                        sPos = H.start + distance;
                        ePos = H.end;
                        if (sPos < K.min || distance > 0 && sPos + 5 > ePos) {
                            return;
                        }
                    } else {
                        sPos = H.start;
                        ePos = H.end + distance;
                        if (ePos > K.max || distance < 0 && sPos + 5 > ePos) {
                            return;
                        }
                    }
                    myCurSection.css({left: sPos, width: ePos - sPos});
                    tmpSection = {start: sPos, end: ePos};
                    $("#" + MyTimePlan.id + "_tipsLeft").css({
                        left: sPos + 42,
                        top: 45 * myCurSection.day + 40
                    }).text(CalcTimeByPos(sPos).substring(0, 5)).show();
                    $("#" + MyTimePlan.id + "_tipsRight").css({
                        left: ePos + 41,
                        top: 45 * myCurSection.day + 40
                    }).text(CalcTimeByPos(ePos).substring(0, 5)).show();
                }
            }

            //响应鼠标抬起事件
            function myMouseUp() {
                $("#" + MyTimePlan.id + "_tipsLeft, #" + MyTimePlan.id + "_tipsRight").hide();
                bMouseDown = false;
                if (null != MyTimePlan.drawSection) {
                    if (MyTimePlan.drawStartClientX == MyTimePlan.drawEndClientX || 0 == MyTimePlan.drawEndClientX) {
                        MyTimePlan.drawSection.unbind().remove();
                        MyTimePlan.drawSection = null;
                        return;
                    }
                    var t = {
                        type: myEventType,
                        start: MyTimePlan.drawStartClientX,
                        end: MyTimePlan.drawEndClientX,
                        number: "0"
                    };
                    if ("patrol" == myEventType || "pattern" == myEventType || "preset" == myEventType || "auxoutput" == myEventType) {
                        t.number = "1"
                    }
                    for (var i = 0, n = 0, a = 0, o = myDays[MyTimePlan.drawSection.day].length; o > a; a++) {
                        n = myDays[MyTimePlan.drawSection.day][a].start;
                        if (MyTimePlan.drawStartClientX > n) {
                            i = a + 1;
                        }
                    }
                    myDays[MyTimePlan.drawSection.day].splice(i, 0, t);
                    if ("undefined" == typeof myData[MyTimePlan.drawSection.day]) {
                        myData[MyTimePlan.drawSection.day] = [];
                    }
                    myData[MyTimePlan.drawSection.day].splice(i, 0, {
                        type: t.type,
                        sTime: CalcTimeByPos(t.start),
                        eTime: CalcTimeByPos(t.end),
                        number: t.number
                    });
                    MyTimePlan.drawSection.end = MyTimePlan.drawEndClientX;
                    MyTimePlan.drawSection.sec = t;
                    MyTimePlan.drawSection = null;
                    MyTimePlan.drawStartClientX = 0;
                    MyTimePlan.drawEndClientX = 0;
                }
                if (null != H && null != tmpSection) {
                    var r = tmpSection.start;
                    var s = tmpSection.end;
                    H.start = r;
                    H.end = s;
                    curSectionData.sTime = CalcTimeByPos(r);
                    curSectionData.eTime = CalcTimeByPos(s);
                    myCurSection.start = r;
                    myCurSection.end = s;
                    tmpSection = null;
                }
                mySectionSide = "";
                H = null;
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
            }

            //插入绘图类型
            function InsertDrawType() {
                if (null != myType && 0 != myType.length) {
                    var t = "";
                    $.each(myType, function () {
                        t += '<option value="' + this + '"></option>'
                    });
                    $("#" + MyTimePlan.id + "_drawTypeSel").empty().append(t).show();
                    var i = "";
                    $.each(myType, function () {
                        if(-1 == $.inArray(this.toString(), VCA)) {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt"></span></div>';
                        }
                    });
                    $("#" + MyTimePlan.id + "_drawTypeShow").empty().append(i);
                    LanguageChange();
                    InsertTimeTipDlg();
                    $.each(myType, function () {
                        if ($.inArray(this.toString(), VCA) > -1) {
                            $("#" + MyTimePlan.id + "_drawTypeSel option[value='" + this + "']").remove();
                        }
                    });
                }
            }

            //初始化所有section绘图
            function InsertSectionAll() {
                $("#" + MyTimePlan.id + " ." + MyTimePlan.prefix + "section").unbind().remove();
                for (var t = 0; 8 > t; t++) {
                    myDays[t] = [];
                }
                if (myTimeTip) {
                    myTimeTip.hide();
                }
                myCurSection = null;
                $("#" + MyTimePlan.id + "_delete").prop("disabled", true);
                if (null != myData) {
                    $.each(myData, function (t, i) {
                        $.each(i, function (e, i) {
                            var n = {};
                            n.type = i.type;
                            n.start = CalcPosByTime(i.sTime);
                            n.end = CalcPosByTime(i.eTime);
                            n.number = i.number || 0;
                            myDays[t].push(n);
                            var i = InsertSection(t, n.type, n.start, n.end);
                            i.sec = n;
                            MyTimePlan.dayTimePlans[t].append(i);
                        })
                    })
                }
            }

            //绘图复制到
            function DrawCopyTo() {
                $("#" + MyTimePlan.id + " ." + MyTimePlan.prefix + "section").unbind().remove();
                $.each(myDays, function (t) {
                    $.each(this, function () {
                        var e = InsertSection(t, this.type, this.start, this.end);
                        e.sec = this;
                        MyTimePlan.dayTimePlans[t].append(e);
                    });
                });
            }

            function CalcTimeByStr(e) {
                var t = 0;
                if ("" != e) {
                    var i = e.split(":");
                    t = 60 * parseInt(i[0], 10) + parseInt(i[1], 10)
                }
                return t
            }

            //根据时间计算位置
            function CalcPosByTime(e) {
                var t = 0;
                if ("" != e) {
                    var i = e.split(":");
                    t = Math.round((60 * parseInt(i[0], 10) + parseInt(i[1], 10)) * MyTimePlan.minuteWidth);
                }
                return t;
            }

            //根据位置计算时间
            function CalcTimeByPos(e) {
                var time = "";
                if (e >= 0) {
                    var i = e / MyTimePlan.minuteWidth;
                    var hour = "";
                    var minute = "";
                    hour = Math.floor(i / 60);
                    if (10 > hour) {
                        hour = "0" + hour;
                    }
                    minute = Math.floor(i % 60);
                    if (10 > minute) {
                        minute = "0" + a;
                    }
                    time = hour + ":" + minute + ":00";
                }
                return time
            }

            //插入区域
            function InsertSection(t, i, n, a) {
                var sPos = 0;
                var ePos = 0;
                var s = "";
                sPos = n;
                ePos = "undefined" == typeof a ? n : a;
                sPos = Math.floor(sPos);
                ePos = Math.floor(ePos);
                s = bgColor[i];
                if ("undefined" == typeof s) {
                    s = bgColor.AllEvent;
                }
                var newSection = $("<div class='" + MyTimePlan.prefix + "section'><i class='" + MyTimePlan.prefix + "resizeLeft'></i><i class='" + MyTimePlan.prefix + "resizeRight'></i></div>").css({
                    position: "absolute",
                    left: sPos,
                    height: 16,
                    width: ePos - sPos ? ePos - sPos : 1,
                    background: s,
                    boxSizing: "border-box"
                });
                newSection.bind({
                    mouseover: function () {
                        if (!bMouseDown) {
                            for (var i = null, n = "", a = "", o = 0, r = myDays[t].length; r > o; o++) {
                                i = myDays[t][o];
                                if (i.start == newSection.sec.start && i.end == newSection.sec.end) {
                                    n = myData[t][o].sTime;
                                    a = myData[t][o].eTime;
                                    break;
                                }
                            }
                            n = n.substring(0, 5);
                            a = a.substring(0, 5);
                            var s = $("#" + MyTimePlan.id + "_timeTipHover");
                            var c = "";
                            if (null != myType && myType.length > 0) {
                                c += "patrol" == i.type || "pattern" == i.type || "preset" == i.type || "auxoutput" == i.type ? MyTranslate(i.type) + "(" + i.number + ")<br/>" : MyTranslate(i.type) + "<br/>";
                            }
                            c += n + " - " + a;
                            s.find("div").eq(0).html(c);
                            s.css({
                                left: $(newSection).position().left + $(newSection).outerWidth() / 2 + 9,
                                top: 45 * t + (60 - s.height())
                            }).show();
                        }
                    }, mouseout: function () {
                        $("#" + MyTimePlan.id + "_timeTipHover").hide()
                    }, mousedown: function (i) {
                        mySectionSide = i.target.className == MyTimePlan.prefix + "resizeLeft" ? "left" : i.target.className == MyTimePlan.prefix + "resizeRight" ? "right" : "";
                        $("#" + MyTimePlan.id + "_timeTipHover").hide();
                        //更改其他section
                        if (null != myCurSection) {
                            myCurSection.css({border: 0});
                            $("." + MyTimePlan.prefix + "resizeLeft", myCurSection).eq(0).hide();
                            $("." + MyTimePlan.prefix + "resizeRight", myCurSection).eq(0).hide();
                        }
                        $(this).css({border: "1px dotted #000000"});
                        $("." + MyTimePlan.prefix + "resizeLeft", this).eq(0).css("display", "inline-block");
                        $("." + MyTimePlan.prefix + "resizeRight", this).eq(0).css("display", "inline-block");
                        $("#" + MyTimePlan.id + "_delete").prop("disabled", false);
                        myCurSection = $(this);
                        myCurSection.day = t;
                        var n = this.sec || newSection.sec;
                        myCurSection.start = n.start;
                        myCurSection.end = n.end;
                        myCurSection.number = n.number;
                        if (null != myType && myType.length > 0) {
                            $("#" + MyTimePlan.id + "_drawTypeSel2").val(n.type);
                        }
                        if ("patrol" == n.type || "pattern" == n.type || "preset" == n.type || "auxoutput" == n.type) {
                            $("#" + MyTimePlan.id + "_drawNumberSel").val(n.number);
                        }
                        var c = myDays[myCurSection.day].length;
                        for (var a = null, o = "", r = "", s = 0; c > s; s++) {
                            a = myDays[myCurSection.day][s];
                            if (a.start == myCurSection.start && a.end == myCurSection.end) {
                                o = myData[myCurSection.day][s].sTime;
                                r = myData[myCurSection.day][s].eTime;
                                myCurSection.oSec = myData[myCurSection.day][s];
                                break;
                            }
                        }
                        o = o.split(":");
                        r = r.split(":");
                        myTimeTip.find(".txt").each(function (t) {
                            2 > t ? $(this).val(o[t]) : $(this).val(r[t - 2]);
                        });
                        SectionMDExtend(n.type, n.number);
                        ShowTimeTip();
                    }
                });
                return newSection;
            }

            //显示编辑对话框
            function ShowTimeTip() {
                myTimeTip.css({
                    left: $(myCurSection).position().left + $(myCurSection).outerWidth() / 2 - 33,
                    top: 45 * myCurSection.day + (60 - myTimeTip.height())
                }).show();
            }

            //section鼠标按下扩展处理
            function SectionMDExtend(t, n) {
                if ("patrol" == t || "pattern" == t || "preset" == t || "auxoutput" == t) {
                    for (var a = "<select style='margin-top: 5px;'>", o = myParam.oAlarmOutNum, r = 1; r <= o[t]; r++) {
                        a += '<option value="' + r + '">' + r + "</option>";
                    }
                    a += "</select>";
                    $("#" + MyTimePlan.id + "_numberSel").empty().append($(a).width(147).attr("id", MyTimePlan.id + "_drawNumberSel"));
                    $("#" + MyTimePlan.id + "_drawNumberSel").val(n)
                } else {
                    $("#" + MyTimePlan.id + "_numberSel").empty();
                }
            }

            //鼠标位置是否在section内
            function PointInSection(e, t) {
                var start = 0;
                var end = 0;
                var a = myDays[e].length;
                for (var n = 0; a > n; n++) {
                    start = myDays[e][n].start;
                    end = myDays[e][n].end;
                    if (t >= start && end >= t) {
                        return true;
                    }
                }
                return false;
            }

            //检测新区域是否跨过旧区域
            function InterSection(e, t, i) {
                var start = 0;
                var end = 0;
                var o = myDays[e].length;
                for (var a = 0; o > a; a++) {
                    start = myDays[e][a].start;
                    end = myDays[e][a].end;
                    if (start >= t && i >= end) {
                        return true;
                    }
                }
                return false;
            }

            //编辑时间时判断是否在其他区域内
            function TimeInOtherSection() {
                for (var e = null, t = 0, i = myDays[myCurSection.day].length; i > t; t++) {
                    e = myDays[myCurSection.day][t];
                    if (e.start == myCurSection.start && e.end == myCurSection.end) {
                        var n = myTimeTip.find(".txt");
                        var a = null;
                        var o = null;
                        var r = n.eq(0).val() + ":" + n.eq(1).val() + ":00";
                        var s = n.eq(2).val() + ":" + n.eq(3).val() + ":00";
                        if (myData[myCurSection.day][t].sTime == r && myData[myCurSection.day][t].eTime == s) {
                            break;
                        }
                        if (t - 1 >= 0) {
                            a = myData[myCurSection.day][t - 1];
                        }
                        if (i > t + 1) {
                            o = myData[myCurSection.day][t + 1];
                        }
                        var c = CalcTimeByStr(r);
                        if (null != a && c < CalcTimeByStr(a.eTime)) {
                            return true;
                        }
                        var u = CalcTimeByStr(s);
                        if (null != o && u > CalcTimeByStr(o.sTime)) {
                            return true;
                        }
                        break
                    }
                }
                return false;
            }

            //是否还能创建section
            function CanInsertSection(e) {
                return myDays[e].length == myParam.sectionNum ? false : true;
            }

            //获取鼠标按下位置
            function GetMouseDownPos(e) {
                return e < MyTimePlan.minClientX ? MyTimePlan.minClientX : e > MyTimePlan.maxClientX ? MyTimePlan.maxClientX : e
            }

            //创建编辑对话框
            function InsertTimeTipDlg() {
                var n = "<div id='" + MyTimePlan.id + "_timetip' class='" + MyTimePlan.prefix + "timetip'>" +
                    "<div class='" + MyTimePlan.prefix + "timetip_top'></div>" +
                    "<div id='" + MyTimePlan.id + "_timetip_middle' class='" + MyTimePlan.prefix + "timetip_middle'>" + "<div id='" + MyTimePlan.id + "_typeSel'></div>" + "<div id='" + MyTimePlan.id + "_numberSel'></div>" +
                    "<div style='padding-top: 5px;'>" + "<input type='text' class='txt' maxlength='2' onpaste='return false' /> : <input type='text' class='txt' maxlength='2' onpaste='return false' />" + " - <input type='text' class='txt' maxlength='2' onpaste='return false' /> : <input type='text' class='txt' maxlength='2' onpaste='return false' /></div>" +
                    "<div style='padding: 5px 0;'>" + "<span class='ctrl'>" + myParam.lan["delete"] + "</span> | <span class='ctrl'>" + myParam.lan.save + "</span>";
                if (myParam.onScenceCfg) {
                    n += " | <span class='ctrl'>" + myParam.lan.config + "</span>"
                };
                n += "</div><span class='close'></span></div><div class='" + MyTimePlan.prefix + "timetip_bottom'></div>" + "</div>";
                myTimeTip = $(n);
                if ($("#" + MyTimePlan.id + "_timetip").length > 0) {
                    $("#" + MyTimePlan.id + "_timetip").unbind().remove();
                }
                $(MyTimePlan).append(myTimeTip);
                if (null != myType && myType.length > 0) {
                    $("#" + MyTimePlan.id + "_typeSel").append($("#" + MyTimePlan.id + "_drawTypeSel").clone().width(147).attr("id", MyTimePlan.id + "_drawTypeSel2"));
                    myEventType = myType[0];
                    $("#" + MyTimePlan.id + "_drawTypeSel2").change(function () {
                        SectionMDExtend($(this).val(), 1);
                        ShowTimeTip();
                    });
                }
                myTimeTip.bind("click", function (e) {
                    e.stopPropagation()
                });
                myTimeTip.find(".txt").each(function (t) {
                    if (0 == t % 2) {
                        $(this).bind("keyup", function () {
                            ValidHour(this);
                        });
                    } else {
                        $(this).bind("keyup", function () {
                            ValidMinute(this);
                        });
                    }
                });
                myTimeTip.find(".close").eq(0).click(function () {
                    myTimeTip.hide()
                });
                myTimeTip.find(".ctrl").eq(0).click(function () {
                    $("#" + MyTimePlan.id + "_delete").click();
                });
                myTimeTip.find(".ctrl").eq(1).click(function () {
                    if (ValidTime()) {
                        if (TimeInOtherSection()) {
                            t.alert(myParam.lan.timeIntersect);
                        } else {
                            var n = myTimeTip.find(".txt");
                            var a = n.eq(0).val() + ":" + n.eq(1).val() + ":00";
                            var o = n.eq(2).val() + ":" + n.eq(3).val() + ":00";
                            var sPos = CalcPosByTime(a);
                            var ePos = CalcPosByTime(o);
                            var l = null;
                            var d = myDays[myCurSection.day].length;
                            for (var u = 0; d > u; u++) {
                                l = myDays[myCurSection.day][u];
                                if (l.start == myCurSection.start && l.end == myCurSection.end) {
                                    if (null != myType && myType.length > 0) {
                                        l.type = $("#" + MyTimePlan.id + "_drawTypeSel2").val();
                                        var p = bgColor[l.type];
                                        "undefined" == typeof p && (p = bgColor.AllEvent), myCurSection.css({background: p}), myData[myCurSection.day][u].type = l.type, l.number = "0", ("patrol" == l.type || "pattern" == l.type || "preset" == l.type || "auxoutput" == l.type) && (l.number = $("#" + MyTimePlan.id + "_drawNumberSel").val()), myData[myCurSection.day][u].number = l.number
                                    }
                                    myCurSection.css({
                                        left: sPos,
                                        width: ePos - sPos ? ePos - sPos : 1
                                    }), l.start = sPos, l.end = ePos, myData[myCurSection.day][u].sTime = a, myData[myCurSection.day][u].eTime = o;
                                    break
                                }
                            }
                            myTimeTip.hide();
                        }
                    } else {
                        t.alert(myParam.lan.sTimeEarlierETime);
                    }
                });
                if (myParam.onScenceCfg) {
                    myTimeTip.find(".ctrl").eq(2).click(function () {
                        myParam.onScenceCfg(myCurSection);
                    });
                }
            }

            //判断小时输入是否有效
            function ValidHour(t) {
                if (Number(t.value) <= 24) {
                    if (24 == Number(t.value)) {
                        $(t).next().val("00");
                    }
                } else {
                    t.value = "00";
                }
            }

            //判断分钟输入是否有效
            function ValidMinute(t) {
                if (Number(t.value) <= 59) {
                    if (24 == Number($(t).prev().val())) {
                        t.value = "00";
                    }
                } else {
                    t.value = "00";
                }
            }

            //创建复制到对话框
            function InsertCopytoDlg() {
                var t = "<table id='" + MyTimePlan.id + "_checkboxs' class='" + MyTimePlan.prefix + "checkboxs' cellspacing='0' cellspadding='0' border='0'>" +
                    "<tr><td colspan='3'><div class='" + MyTimePlan.prefix + "copyto_top'><label class='" + MyTimePlan.prefix + "copyto_txt' id='" + MyTimePlan.id + "_copyTo_txt'>复制到...</label><span class='" + MyTimePlan.prefix + "copyto_checkall'><input id='" + MyTimePlan.id + "_checkall' type='checkbox' class='" + MyTimePlan.prefix + "checkbox' /><label id='" + MyTimePlan.id + "_selAll'>全选</label></span></div></td></tr>" +
                    "<tr><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='0' /><label id='" + MyTimePlan.id + "_monDay1'>星期一</label></td><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='1' /><label id='" + MyTimePlan.id + "_tueDay1'>星期二</label></td><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='2' /><label id='" + MyTimePlan.id + "_wedDay1'>星期三</label></td></tr>" +
                    "<tr><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='3' /><label id='" + MyTimePlan.id + "_thuDay1'>星期四</label></td><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='4' /><label id='" + MyTimePlan.id + "_friDay1'>星期五</label></td><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='5' /><label id='" + MyTimePlan.id + "_satDay1'>星期六</label></td></tr>" +
                    "<tr><td><input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='6' /><label id='" + MyTimePlan.id + "_sunDay1'>星期日</label></td><td>";
                t += myParam.holiday ? "<input type='checkbox' class='" + MyTimePlan.prefix + "checkbox' day='7' /><label id='" + MyTimePlan.id + "_holDay1'>假日</label></td>" : "&nbsp;</td>", t += "<td>&nbsp;</td></tr>";
                t += "<tr><td class='" + MyTimePlan.prefix + "copyto_bottom' colspan='3'><button type='button' class='btn btn-browser' id='" + MyTimePlan.id + "_ok'>确定</button><button type='button' class='btn btn-browser' id='" + MyTimePlan.id + "_cancel'>取消</button></td></tr></table>";
                if ($("#" + MyTimePlan.id + "_checkboxs").length > 0) {
                    $("#" + MyTimePlan.id + "_checkboxs").unbind().remove();
                }
                myCopyTo = $(t);
                $(MyTimePlan).append(myCopyTo);
                $("#" + MyTimePlan.id + "_checkall").click(function () {
                    $("#" + MyTimePlan.id + "_checkboxs ." + MyTimePlan.prefix + "checkbox").not(":first").not(":disabled").prop("checked", $(this).prop("checked"))
                });
                $("#" + MyTimePlan.id + "_checkboxs ." + MyTimePlan.prefix + "checkbox").not(":first").click(function (t) {
                    $(this).prop("disabled") && t.preventDefault();
                    if ($("#" + MyTimePlan.id + "_checkboxs ." + MyTimePlan.prefix + "checkbox").not(":first").not(":checked").length > 0) {
                        $("#" + MyTimePlan.id + "_checkall").prop("checked", false);
                    } else {
                        $("#" + MyTimePlan.id + "_checkall").prop("checked", true);
                    }
                });
                $("#" + MyTimePlan.id + "_ok").click(function () {
                    myCopyTo.hide();
                    DataCopyTo();
                });
                $("#" + MyTimePlan.id + "_cancel").click(function () {
                    myCopyTo.hide();
                })
            }

            //复制数据到其他星期
            function DataCopyTo() {
                var t;
                var n = -1;
                var a = $.extend(true, [], myDays[selectDay]);
                var o = [];
                $("#" + MyTimePlan.id + "_checkboxs ." + MyTimePlan.prefix + "checkbox").not(":first").each(function () {
                    if ($(this).prop("checked") && !$(this).prop("disabled")) {
                        n = $(this).attr("day");
                        o.push(n);
                        myDays[n] = [];
                        $.extend(true, myDays[n], a);
                        myData[n] = [];
                        $.each(a, function (i) {
                            t = myData[selectDay][i].scenePatrol;
                            if (angular.isDefined(t)) {
                                t = $.extend(true, [], t);
                            }
                            myData[n][i] = {
                                type: this.type,
                                sTime: myData[selectDay][i].sTime,
                                eTime: myData[selectDay][i].eTime,
                                number: this.number,
                                scenePatrol: t
                            }
                        });
                    }
                });
                DrawCopyTo();
                if (myParam.onScenceCfg) {
                    myParam.onScenceCfg("copyto", selectDay, o);
                }
            }

            //语言初始化
            function LanguageChange() {
                if (null != myParam.lan) {
                    var t = myParam.lan;
                    if (null != myType && myType.length > 0) {
                        var n;
                        var a = $("#" + MyTimePlan.id + "_drawTypeSel option");
                        var o = $("#" + MyTimePlan.id + "_drawTypeShow .txt");
                        var r = 0;
                        $.each(myType, function (t) {
                            n = MyTranslate(this.toString());
                            a.eq(t).text(n);
                            if (-1 == $.inArray(this.toString(), VCA)) {
                                o.eq(r++).text(n);
                            }
                        });
                    }
                    $("#" + MyTimePlan.id + "_delete_txt").text(t["delete"]);
                    $("#" + MyTimePlan.id + "_deleteAll_txt").text(t.deleteAll);
                    $("#" + MyTimePlan.id + "_advanced").text(t.advancedParam);
                    $("#" + MyTimePlan.id + "_selAll").text(t.selectAll).attr("title", t.selectAll);
                    $("#" + MyTimePlan.id + "_ok").text(t.ok);
                    $("#" + MyTimePlan.id + "_cancel").text(t.cancel);
                    $("#" + MyTimePlan.id + "_copyTo_txt").text(t.copyTo);
                    $("#" + MyTimePlan.id + "_monDay, #" + MyTimePlan.id + "_monDay1").text(t.monday).attr("title", t.monday);
                    $("#" + MyTimePlan.id + "_tueDay, #" + MyTimePlan.id + "_tueDay1").text(t.tuesday).attr("title", t.tuesday);
                    $("#" + MyTimePlan.id + "_wedDay, #" + MyTimePlan.id + "_wedDay1").text(t.wednesday).attr("title", t.wednesday);
                    $("#" + MyTimePlan.id + "_thuDay, #" + MyTimePlan.id + "_thuDay1").text(t.thursday).attr("title", t.thursday);
                    $("#" + MyTimePlan.id + "_friDay, #" + MyTimePlan.id + "_friDay1").text(t.friday).attr("title", t.friday);
                    $("#" + MyTimePlan.id + "_satDay, #" + MyTimePlan.id + "_satDay1").text(t.saturday).attr("title", t.saturday);
                    $("#" + MyTimePlan.id + "_sunDay, #" + MyTimePlan.id + "_sunDay1").text(t.sunday).attr("title", t.sunday);
                    $("#" + MyTimePlan.id + "_holDay, #" + MyTimePlan.id + "_holDay1").text(t.holiday).attr("title", t.holiday);
                }
            }

            //语言转换
            function MyTranslate(e) {
                if (null == myParam.lan) {
                    return "";
                }
                var t = myParam.lan;
                var n = {
                    CMR: t.continuous,
                    MOTION: t.motion,
                    ALARM: t.alarm,
                    EDR: t.motionOrAlarm,
                    ALARMANDMOTION: t.motionAndAlarm,
                    COMMAND: t.command,
                    SMART: "Smart",
                    AllEvent: t.event,
                    SCENE1: t.SceneDefault + "1",
                    SCENE2: t.SceneDefault + "2",
                    SCENE3: t.SceneDefault + "3",
                    SCENE4: t.SceneDefault + "4",
                    disable: t.off,
                    autoscan: t.autoScan,
                    framescan: t.frameScan,
                    randomscan: t.randomScan,
                    patrol: t.patrolScan,
                    pattern: t.pattern,
                    preset: t.preset,
                    panoramascan: t.panoramaScan,
                    tiltscan: t.tiltScan,
                    periodreboot: t.domeReboot,
                    periodadjust: t.domeAdjust,
                    auxoutput: t.auxOutput,
                    LineDetection: t.lineCrossDetect,
                    FieldDetection: t.fieldDetectionType,
                    AudioDetection: t.audioDetection,
                    facedetection: t.faceDetection,
                    regionEntrance: t.regionEntranceDetect,
                    regionExiting: t.regionExitDetect,
                    loitering: t.loiterDetect,
                    group: t.peopleGatherDetect,
                    rapidMove: t.fastMoveDetect,
                    parking: t.parkDetect,
                    unattendedBaggage: t.unattendedBaggageDetect,
                    attendedBaggage: t.objectRemovalDetect,
                    scenechangedetection: t.sceneChangeDetection,
                    pir: t.pir,
                    wlsensor: t.wlsensor,
                    callhelp: t.callhelp,
                    INTELLIGENT: t.intelligent,
                    vandalProofDetection: t.vandalProofAlarm
                };
                return n[e];
            }

            //判断时间范围是否有效
            function ValidTime() {
                var t = myTimeTip.find(".txt");
                $.each(t, function () {
                    if ("" == $.trim($(this).val())) {
                        $(this).val("00");
                    }
                    if (parseInt($(this).val(), 10) < 10) {
                        $(this).val("0" + parseInt($(this).val(), 10));
                    }
                });
                var sTime = 60 * Number(t.eq(0).val()) + Number(t.eq(1).val());
                var eTime = 60 * Number(t.eq(2).val()) + Number(t.eq(3).val());
                return sTime >= eTime ? false : true;
            }

            //插入timeplan_day
            function InsertDay() {
                for (var e = [], t = ["mon", "tue", "wed", "thu", "fri", "sat", "sun", "hol"], i = 0; 8 > i; i++) {
                    if (7 == i) {
                        e.push('<div class="' + MyTimePlan.prefix + 'day" day="' + i + '" id="' + MyTimePlan.id + '_holDayDiv" style="display:none;">');
                    } else {
                        e.push('<div class="' + MyTimePlan.prefix + 'day" day="' + i + '">');
                    }
                    e.push('<div class="' + MyTimePlan.prefix + 'dayname" day="' + i + '"><label id="' + MyTimePlan.id + "_" + t[i] + 'Day"></label></div>');
                    e.push('<div class="' + MyTimePlan.prefix + 'daydraw">');
                    e.push('<div id="' + MyTimePlan.id + "_dayTimePlan" + i + '" day="' + i + '" class="' + MyTimePlan.prefix + 'daytimeplan"></div>');
                    e.push("</div>");
                    e.push('<div class="' + MyTimePlan.prefix + 'copyto" day="' + i + '"></div>');
                    e.push("</div>");
                }
                return e.join("");
            }

            function SetPageDisable() {
                var t = $(MyTimePlan).find(".timeplan_days").eq(0).outerWidth();
                n = $(MyTimePlan).height();
                if (myParam.editable) {
                    $("#" + MyTimePlan.id + "_mask").hide()
                } else {
                    $("#" + MyTimePlan.id + "_mask").css({width: t, height: n}).show();
                }
            }

            myParam = $.extend({
                sectionNum: 8,
                data: null,
                mode: 0,
                holiday: false,
                types: null,
                lan: null,
                editable: true,
                onAdvanced: null,
                onScenceCfg: null,
                oAlarmOutNum: {patrol: 8, pattern: 4, preset: 8, auxoutput: 2}
            }, myParam);
            $.extend(this, {
                id: $(this).attr("id"), //recordDiv
                prefix: "timeplan_",
                minuteWidth: .4,
                minClientX: 0,
                maxClientX: 0,
                drawSection: null,
                drawStartClientX: 0,
                drawEndClientX: 0,
                dayTimePlans: [],
                setType: function (type) {
                    myType = type;
                    InsertDrawType();
                },
                setData: function (data) {
                    myData = data;
                    InsertSectionAll();
                },
                setSectionNum: function (sectionNum) {
                    myParam.sectionNum = sectionNum;
                },
                setAlarmOutNum: function (oAlarmOutNum) {
                    myParam.oAlarmOutNum = oAlarmOutNum;
                },
                setEditable: function (editable) {
                    myParam.editable = editable;
                    SetPageDisable();
                },
                setMode: function (mode) {
                    myParam.mode = mode;
                    $("#" + MyTimePlan.id + "_advanced").toggle(1 === mode);
                }
            });
            var MyTimePlan = this;
            var bgColor = {
                CMR: "#637DEC",
                MOTION: "#74B557",
                ALARM: "#B83F42",
                EDR: "#E58805",
                ALARMANDMOTION: "#B9E2FE",
                COMMAND: "#15B89B",
                SMART: "#F66D72",
                AllEvent: "#AA6FFE",
                SCENE1: "#637DEC",
                SCENE2: "#74B557",
                SCENE3: "#B83F42",
                SCENE4: "#E58805",
                disable: "#808080",
                autoscan: "#637DEC",
                framescan: "#74B557",
                randomscan: "#E58805",
                patrol: "#B9E2FE",
                pattern: "#15B89B",
                preset: "#F66D72",
                panoramascan: "#8C97CB",
                tiltscan: "#5F52A0",
                periodreboot: "#EC6941",
                periodadjust: "#419923",
                auxoutput: "#16A1E0"
            };
            var VCA = [
                "LineDetection",
                "FieldDetection",
                "AudioDetection",
                "facedetection",
                "regionEntrance",
                "regionExiting",
                "loitering",
                "group",
                "rapidMove",
                "parking",
                "unattendedBaggage",
                "attendedBaggage",
                "scenechangedetection",
                "pir",
                "wlsensor",
                "callhelp",
                "INTELLIGENT",
                "vandalProofDetection"
            ];
            var myType = null;
            var myData = null;
            var myDays = [];
            var myCurSection = null;
            var myTimeTip = null;
            var myEventType = "CMR";
            var bMouseDown = false;
            var myMouseDownPos = -1;
            var selectDay = -1;
            var myCopyTo = null;
            var H = null;
            var curSectionData = null;
            var K = {};
            var tmpSection = null;
            var mySectionSide = "";
            var U =
                '<div class="' + this.prefix + 'btns">' +
                    '<div class="' + this.prefix + 'btn"><select id="' + this.id + '_drawTypeSel" style="display:none;"></select></div>' +
                    '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_delete"><span class="delete">&nbsp;</span><span id="' + this.id + '_delete_txt">删除</span></button></div>' +
                    '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_deleteAll"><span class="deleteAll">&nbsp;</span><span id="' + this.id + '_deleteAll_txt">删除全部</span></button></div>' +
                    '<div class="' + this.prefix + 'btn" style="float:right;"><button type="button" class="btn" id="' + this.id + '_advanced" style="display:none;">高级参数</button></div>' +
                "</div>" +
                '<div class="' + this.prefix + 'days" onselectstart="return false;" style="-moz-user-select:none;">' + InsertDay() + "</div>" +
                '<div id="' + this.id + '_drawTypeShow" class="' + this.prefix + 'drawtypes"></div>' +
                '<div style="clear: both;"></div>' +
                '<div id="' + this.id + '_timeTipHover" class="' + this.prefix + 'timetip_hover">' +
                    '<div class="' + this.prefix + 'timetip_hover_top"></div>' +
                    '<div class="' + this.prefix + 'timetip_hover_bottom"></div>' +
                '</div>' +
                '<div id="' + this.id + '_tipsLeft" class="' + this.prefix + 'tipsleft"></div>' +
                '<div id="' + this.id + '_tipsRight" class="' + this.prefix + 'tipsright"></div>';
            this.html(U);
            this.css("position", "relative");
            if (myParam.types) {
                myType = myParam.types;
            }
            if (myParam.data) {
                myData = myParam.data;
            }
            $("#" + MyTimePlan.id + "_advanced").click(function () {
                if (myParam.onAdvanced) {
                    myParam.onAdvanced();
                }
            });
            if (1 == myParam.mode) {
                $("#" + MyTimePlan.id + "_advanced").show();
            }
            if (myParam.holiday) {
                $("#" + MyTimePlan.id + "_holDayDiv").show();
            }
            $("#" + MyTimePlanA.id + "_drawTypeSel").change(function () {
                myEventType = $(this).val();
            });
            $("#" + MyTimePlan.id + "_delete").click(function () {
                if (null != myCurSection) {
                    myCurSection.unbind().remove();
                    myTimeTip.hide();
                    for (var t = null, i = 0, n = myDays[myCurSection.day].length; n > i; i++) {
                        if (t = myDays[myCurSection.day][i], t.start == myCurSection.start && t.end == myCurSection.end) {
                            myDays[myCurSection.day].splice(i, 1);
                            myData[myCurSection.day].splice(i, 1);
                            break;
                        }
                    }
                    myCurSection = null;
                    $("#" + MyTimePlan.id + "_delete").prop("disabled", true);
                }
            }).prop("disabled", true);
            $("#" + this.id + "_deleteAll").click(function () {
                $("#" + MyTimePlan.id + " ." + MyTimePlan.prefix + "section").unbind().remove();
                myTimeTip.hide();
                $.each(myDays, function (e) {
                    myDays[e] = [];
                    myData[e] = [];
                });
                myCurSection = null;
                $("#" + MyTimePlan.id + "_delete").prop("disabled", true);
            });
            $("#" + MyTimePlan.id + " ." + MyTimePlan.prefix + "day").each(function () {
                $(this).bind({
                    mouseover: function () {
                        if ("" == mySectionSide) {
                            $("." + MyTimePlan.prefix + "copyto", this).eq(0).show()
                        }
                    }, mouseout: function () {
                        if ("" == mySectionSide) {
                            $("." + MyTimePlan.prefix + "copyto", this).eq(0).hide()
                        }
                    }
                })
            });
            $("#" + MyTimePlanid + " ." + MyTimePlan.prefix + "copyto").each(function () {
                $(this).bind({
                    mouseout: function () {
                    }, click: function (t) {
                        t.stopPropagation();
                        selectDay = parseInt($(this).attr("day"), 10);
                        myCopyTo.css({
                            left: $(this).position().left - myCopyTo.outerWidth(),
                            top: $(this).position().top - myCopyTo.outerHeight() / 2 + 25
                        }).show();
                        var i = $("#" + MyTimePlan.id + "_checkboxs");
                        i.find("." + MyTimePlan.prefix + "checkbox:disabled").prop("disabled", false);
                        i.find("." + MyTimePlan.prefix + "checkbox:checked").prop("checked", false);
                        i.find("." + MyTimePlan.prefix + "checkbox[day='" + selectDay + "']").prop("disabled", true).prop("checked", true);
                        if (null != myCurSection) {
                            myCurSection.css({
                                height: 16,
                                border: 0
                            });
                        }
                        $("." + MyTimePlan.prefix + "resizeLeft", myCurSection).eq(0).hide();
                        $("." + MyTimePlan.prefix + "resizeRight", myCurSection).eq(0).hide();
                        myTimeTip.hide();
                        myCurSection = null;
                        $("#" + MyTimePlan.id + "_delete").prop("disabled", true);
                    }
                });
            });
            for (var $ = 0; 8 > $; $++) {
                MyTimePlan.dayTimePlans.push($("#" + MyTimePlan.id + "_dayTimePlan" + $));
            }
            $.each(MyTimePlan.dayTimePlans, function (t) {
                $(this).bind({
                    mousedown: function (i) {
                        MyTimePlan.minClientX = Math.floor(MyTimePlan.offset().left) + 60;
                        MyTimePlan.maxClientX = Math.floor(MyTimePlan.offset().left) + 636;
                        myMouseDownPos = i.clientX - MyTimePlan.minClientX;
                        MyTimePlan.drawStartClientX = myMouseDownPos;
                        if (PointInSection(t, myMouseDownPos)) {
                            if (null != myCurSection) {
                                for (var o = 0, r = myDays[myCurSection.day].length; r > o; o++) {
                                    H = myDays[myCurSection.day][o];
                                    if (H.start == myCurSection.start && H.end == myCurSection.end) {
                                        curSectionData = myData[myCurSection.day][o];
                                        K.min = o - 1 >= 0 ? myDays[myCurSection.day][o - 1].end : 0;
                                        K.max = r > o + 1 ? myDays[myCurSection.day][o + 1].start : 576;
                                        break;
                                    }
                                }
                            }
                        } else if (!CanInsertSection(t)) {
                            return;
                        }
                        $(document).bind("mousemove", function (e) {
                            myMouseMove(e);
                        }), $(document).bind("mouseup", function (e) {
                            myMouseUp(e);
                        });
                        bMouseDown = true;
                    }, mousemove: function () {
                        if (bMouseDown && null == MyTimePlan.drawSection && null == H) {
                            var i = MyTimePlan.drawStartClientX;
                            MyTimePlan.drawSection = InsertSection(t, myEventType, i);
                            MyTimePlan.drawSection.day = t;
                            $(this).append(MyTimePlan.drawSection);
                        }
                    }
                })
            });
            InsertCopytoDlg();
            InsertDrawType();
            InsertSectionAll();
            LanguageChange();
            InsertTimeTipDlg();
            return this;
        }
    }($)
