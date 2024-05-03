(function($){
    $.fn.TimePlan = function (myParam) {
        //响应鼠标移动事件
        function myMouseMove(t) {
            if (bMouseDown && null != myTimePlan.drawSection) {
                var i = Math.floor(getMouseDownPos(t.clientX) - myTimePlan.minClientX);
                //优化ie
                if (myTimePlan.drawEndClientX == i || myTimePlan.drawStartClientX == i) {
                    return;
                }
                if (myMouseDownPos > i) {
                    myTimePlan.drawEndClientX = myTimePlan.drawStartClientX;
                    return;
                }
                if (pointInSection(myTimePlan.drawSection.day, i)) {
                    return;
                }
                if (interSection(myTimePlan.drawSection.day, myMouseDownPos, i)) {
                    return;
                }
                if (myParam.particle) {
                    myTimePlan.drawEndClientX = myTimePlan.drawStartClientX + 1;
                } else {
                    myTimePlan.drawEndClientX = i;
                }
                var n = myTimePlan.drawEndClientX - myTimePlan.drawStartClientX;
                myTimePlan.drawSection.width(n);
                $("#" + myTimePlan.id + "_tipsLeft").css({
                    left: myTimePlan.drawStartClientX + 69,
                    top: 45 * myTimePlan.drawSection.day + 34
                }).text(calcTimeByPos(myTimePlan.drawStartClientX).substring(0, 5)).show();
                if (myParam.particle) {
                    return;//时间点时不绘制右边信息
                }
                $("#" + myTimePlan.id + "_tipsRight").css({
                    left: myTimePlan.drawEndClientX + 69,
                    top: 45 * myTimePlan.drawSection.day + 34
                }).text(calcTimeByPos(myTimePlan.drawEndClientX).substring(0, 5)).show();
            }
            //拖整体处理
            if (null != H && "" == mySectionSide) {
                //解决拖动选中文字的问题
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var distance = t.clientX - myTimePlan.minClientX - myMouseDownPos;
                var sPos = H.start + distance;
                //优化ie
                if (distance == 0) {
                    return;
                }
                if (myTimeTip.is(":visible")) {
                    myTimeTip.hide();
                }
                //优化ie
                if (tmpSection && tmpSection.start == sPos) {
                    return;
                }
                var ePos = sPos + (H.end - H.start);
                if (sPos < K.min || ePos > K.max) {
                    return;
                }
                myCurSection.css({left: sPos});
                tmpSection = {start: sPos, end: ePos};
                $("#" + myTimePlan.id + "_tipsLeft").css({
                    left: sPos + 69,
                    top: 45 * myCurSection.day + 34
                }).text(calcTimeByPos(sPos).substring(0, 5)).show();
                if (myParam.particle) {
                    return;//时间点时不绘制右边信息
                }
                $("#" + myTimePlan.id + "_tipsRight").css({
                    left: ePos + 69,
                    top: 45 * myCurSection.day + 34
                }).text(calcTimeByPos(ePos).substring(0, 5)).show();
            }
            //拖边处理
            if (null != H && "" != mySectionSide) {
                if (myParam.particle) {
                    return;//时间点不处理拖边
                }
                var sPos;
                var ePos;
                var distance = t.clientX - myTimePlan.minClientX - myMouseDownPos;
                //优化ie
                if (distance == 0) {
                    return;
                }
                if (myTimeTip.is(":visible")) {
                    myTimeTip.hide();
                }
                //解决拖动选中文字的问题
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                if ("left" == mySectionSide) {
                    sPos = H.start + distance;
                    ePos = H.end;
                    //优化ie
                    if (tmpSection && tmpSection.start == sPos) {
                        return;
                    }
                    if (sPos < K.min || distance > 0 && sPos + 5 > ePos) {
                        return;
                    }
                } else {
                    sPos = H.start;
                    ePos = H.end + distance;
                    //优化ie
                    if (tmpSection && tmpSection.end == ePos) {
                        return;
                    }
                    if (ePos > K.max || distance < 0 && sPos + 5 > ePos) {
                        return;
                    }
                }
                myCurSection.css({left: sPos, width: ePos - sPos});
                tmpSection = {start: sPos, end: ePos};
                $("#" + myTimePlan.id + "_tipsLeft").css({
                    left: sPos + 69,
                    top: 45 * myCurSection.day + 34
                }).text(calcTimeByPos(sPos).substring(0, 5)).show();
                $("#" + myTimePlan.id + "_tipsRight").css({
                    left: ePos + 69,
                    top: 45 * myCurSection.day + 34
                }).text(calcTimeByPos(ePos).substring(0, 5)).show();
            }
        }
        //响应鼠标抬起事件
        function myMouseUp() {
            $("#" + myTimePlan.id + "_tipsLeft, #" + myTimePlan.id + "_tipsRight").hide();
            bMouseDown = false;
            if (null != myTimePlan.drawSection) {
                if (myTimePlan.drawStartClientX == myTimePlan.drawEndClientX || 0 == myTimePlan.drawEndClientX) {
                    myTimePlan.drawSection.unbind().remove();
                    myTimePlan.drawSection = null;
                    return;
                }
                var t = {
                    type: myEventType,
                    start: myTimePlan.drawStartClientX,
                    end: myTimePlan.drawEndClientX,
                    enable: "0",
                    number: "0"
                };
                if ("patrol" == myEventType || "pattern" == myEventType || "preset" == myEventType || "auxoutput" == myEventType) {
                    t.number = "1";
                }
                for (var i = 0, n = 0, a = 0, o = myDays[myTimePlan.drawSection.day].length; o > a; a++) {
                    n = myDays[myTimePlan.drawSection.day][a].start;
                    if (myTimePlan.drawStartClientX > n) {
                        //记录画的数量
                        i = a + 1;
                    }
                }
                myDays[myTimePlan.drawSection.day].splice(i, 0, t);
                if ("undefined" == typeof myData[myTimePlan.drawSection.day]) {
                    myData[myTimePlan.drawSection.day] = [];
                }
                myData[myTimePlan.drawSection.day].splice(i, 0, {
                    type: t.type,
                    sTime: calcTimeByPos(t.start),
                    eTime: calcTimeByPos(myParam.particle ? t.start : t.end),
                    enable: t.enable,
                    number: t.number
                });
                myTimePlan.drawSection.end = myTimePlan.drawEndClientX;
                myTimePlan.drawSection.sec = t;
                myTimePlan.drawSection = null;
                myTimePlan.drawStartClientX = 0;
                myTimePlan.drawEndClientX = 0;
            }
            if (null != H && null != tmpSection) {
                var r = tmpSection.start;
                var s = tmpSection.end;
                H.start = r;
                H.end = s;
                curSectionData.sTime = calcTimeByPos(r);
                curSectionData.eTime = calcTimeByPos(myParam.particle ? r : s);
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
        function insertDrawType() {
            if (null != myType && 0 != myType.length) {
                var t = "";
                $.each(myType, function (n) {
                    //"1":定时报警,"2":报警输入,"3":移动报警,"4":丢失报警,"5":侦测或端口,"6":遮挡报警,"7"侦测和端口
                    if(myType[n]=="1"){
                        t += '<option value="'+this +'">定时报警</option>'
                    }
                    if(myType[n]=="2"){
                        t += '<option value="'+this +'">报警输入</option>'
                    }
                    if(myType[n]=="3"){
                        t += '<option value="'+this +'">移动报警</option>'
                    }
                    if(myType[n]=="4"){
                        t += '<option value="'+this +'">丢失报警</option>'
                    }
                    if(myType[n]=="5"){
                        t += '<option value="'+this +'">侦测或端口</option>'
                    }
                    if(myType[n]=="6"){
                        t += '<option value="'+this +'">遮挡报警</option>'
                    }
                    if(myType[n]=="7"){
                        t += '<option value="'+this +'">侦测或端口</option>'
                    }
                });
                $("#" + myTimePlan.id + "_drawTypeSel").empty().append(t).show();
                var i = "";
                $.each(myType, function (n) {
                    if(-1 == $.inArray(this.toString(), VCA)) {
                        if(myType[n]=="1") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="2") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="3") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="4") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="5") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="6") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }
                        if(myType[n]=="7") {
                            i += '<div class="drawtype"><span class="color" style="background-color:' + bgColor[this] + '"></span><span class="txt">移动报警</span></div>';
                        }

                    }
                });
                $("#" + myTimePlan.id + "_drawTypeShow").empty().append(i);
                insertTimeTipDlg();
            }
        }
        //初始化所有section绘图
        function insertSectionAll() {
            $("#" + myTimePlan.id + " ." + myTimePlan.prefix + "section").unbind().remove();
            for (var t = 0; 8 > t; t++) {
                myDays[t] = [];
            }
            if (myTimeTip) {
                myTimeTip.hide();
            }
            myCurSection = null;
            $("#" + myTimePlan.id + "_delete").prop("disabled", true);
            if (null != myData) {
                $.each(myData, function (t, i) {
                    $.each(i, function (e, i) {
                        var n = {};
                        n.type = i.type;
                        if (myParam.particle) {
                            i.eTime = i.sTime;
                        }
                        n.start = calcPosByTime(i.sTime);
                        n.end = calcPosByTime(i.eTime);
                        n.enable = i.enable;
                        n.number = i.number || 0;
                        myDays[t].push(n);
                        var i = insertSection(t, n.type, n.start, n.end);
                        i.sec = n;
                        myTimePlan.dayTimePlans[t].append(i);
                    })
                })
            }
        }
        //绘图复制到
        function drawCopyTo() {
            $("#" + myTimePlan.id + " ." + myTimePlan.prefix + "section").unbind().remove();
            $.each(myDays, function (t) {
                $.each(this, function () {
                    var e = insertSection(t, this.type, this.start, this.end);
                    e.sec = this;
                    myTimePlan.dayTimePlans[t].append(e);
                });
            });
        }
        //把字符串转化为时间
        function calcTimeByStr(e) {
            var t = 0;
            if ("" != e) {
                var i = e.split(":");
                t = 60 * parseInt(i[0], 10) + parseInt(i[1], 10);
            }
            return t;
        }
        //根据时间计算位置
        function calcPosByTime(e) {
            var t = 0;
            if ("" != e) {
                var i = e.split(":");
                t = Math.round((60 * parseInt(i[0], 10) + parseInt(i[1], 10)) * myTimePlan.minuteWidth);
            }
            return t;
        }
        //根据位置计算时间
        function calcTimeByPos(e) {
            var time = "";
            if (e >= 0) {
                var i = e / myTimePlan.minuteWidth;
                var hour = "";
                var minute = "";
                hour = Math.floor(i / 60);
                if (10 > hour) {
                    hour = "0" + hour;
                }
                minute = Math.floor(i % 60);
                if (10 > minute) {
                    minute = "0" + minute;
                }
                time = hour + ":" + minute + ":00";

                if (time == "24:00:00") {
                    time = "23:59:00";
                }
            }
            return time;
        }
        //背景颜色
        var bgColor = {
            "1": "#0000ff",//定时报警
            "2": "#cd4242",//报警输入
            "3": "#920783",//移动报警
            "4": "#898989",//丢失报警
            "5": "#00a651",//侦测或端口
            "6": "#b38850",//遮挡报警
            "7": "#00aeef"//侦测和端口
        };
        //插入区域，给新的section绑定事件
        function insertSection(t, i, n, a) {
            var sPos = 0;
            var ePos = 0;
            var s = "";
            sPos = n;
            ePos = "undefined" == typeof a ? n : a;
            sPos = Math.floor(sPos);
            ePos = Math.floor(ePos);
            s = bgColor[i];
            if ("undefined" == typeof s) {
                s = bgColor["1"];
            }
            var newSection = $("<div class='" + myTimePlan.prefix + "section'><i class='" + myTimePlan.prefix + "resizeLeft'></i><i class='" + myTimePlan.prefix + "resizeRight'></i></div>").css({
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
                        var s = $("#" + myTimePlan.id + "_timeTipHover");
                        var c = "";
                        if (myParam.particle) {
                            c += n;
                        } else {
                            c += n + " - " + a;
                        }
                        s.find("div").eq(0).html(c);
                        //s.document.title=c;
                        s.css({
                            left: $(newSection).position().left + $(newSection).outerWidth() / 2 +37,
                            top: 45 * t + (60 - s.height())
                        }).unbind("show").show();
                    }
                },
                mouseout: function () {
                    $("#" + myTimePlan.id + "_timeTipHover").unbind("hide").hide();
                },
                mousedown: function (i) {
                    mySectionSide = i.target.className == myTimePlan.prefix + "resizeLeft" ? "left" : i.target.className == myTimePlan.prefix + "resizeRight" ? "right" : "";
                    $("#" + myTimePlan.id + "_timeTipHover").hide();
                    //更改其他section
                    if (null != myCurSection) {
                        myCurSection.css({border: 0});
                        $("#" + myTimePlan.id + "_tipsLeft, #" + myTimePlan.id + "_tipsRight").hide();
                        $("." + myTimePlan.prefix + "resizeLeft", myCurSection).eq(0).hide();
                        $("." + myTimePlan.prefix + "resizeRight", myCurSection).eq(0).hide();
                    }
                    $(this).css({border: "1px dotted #000000"});
                    if (!myParam.particle) {
                        $("." + myTimePlan.prefix + "resizeLeft", this).eq(0).css("display", "inline-block");
                        $("." + myTimePlan.prefix + "resizeRight", this).eq(0).css("display", "inline-block");
                    }
                    $("#" + myTimePlan.id + "_delete").prop("disabled", false);
                    myCurSection = $(this);
                    myCurSection.day = t;
                    var n = this.sec || newSection.sec;
                    myCurSection.start = n.start;
                    myCurSection.end = n.end;
                    myCurSection.enable = n.enable;
                    myCurSection.number = n.number;
                    if (null != myType && myType.length > 0) {
                        $("#" + myTimePlan.id + "_drawTypeSel2").val(n.type);
                        $("#" + myTimePlan.id + "_modalSel").find("select").val(n.enable);
                    }
                    if ("patrol" == n.type || "pattern" == n.type || "preset" == n.type || "auxoutput" == n.type) {
                        $("#" + myTimePlan.id + "_drawNumberSel").val(n.number);
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
                    sectionMDExtend(n.type, n.number);
                    showTimeTip();
                }
            });
            return newSection;
        }
        //显示编辑对话框
        function showTimeTip() {
            if(null != myType && myType.length > 0 && $("#" + myTimePlan.id + "_drawTypeSel2").val() == "1") {//"1"为定时录像
                $("#" + myTimePlan.id + "_modalSel").show();
            } else {
                $("#" + myTimePlan.id + "_modalSel").hide();
            }
            if (myParam.particle) {
                myTimeTip.find(".txt").eq(2).hide().prev().hide();
                myTimeTip.find(".txt").eq(3).hide().prev().hide();
            } else {
                myTimeTip.find(".txt").eq(2).show().prev().show();
                myTimeTip.find(".txt").eq(3).show().prev().show();
            }
            myTimeTip.css({
                left: $(myCurSection).position().left + $(myCurSection).outerWidth() / 2 -4,
                top: 45 * myCurSection.day + (60 - myTimeTip.height())
            }).show();
        }
        //section鼠标按下扩展处理
        function sectionMDExtend(t, n) {
            if ("patrol" == t || "pattern" == t || "preset" == t || "auxoutput" == t) {
                for (var a = "<select style='margin-top: 5px;'>", o = myParam.oAlarmOutNum, r = 1; r <= o[t]; r++) {
                    a += '<option value="' + r + '">' + r + "</option>";
                }
                a += "</select>";
                $("#" + myTimePlan.id + "_numberSel").empty().append($(a).width(147).attr("id", myTimePlan.id + "_drawNumberSel"));
                $("#" + myTimePlan.id + "_drawNumberSel").val(n);
            } else {
                $("#" + myTimePlan.id + "_numberSel").empty();
            }
        }
        //鼠标位置是否在section内
        function pointInSection(e, t) {
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
        function interSection(e, t, i) {
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
        function timeInOtherSection() {
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
                    var c = calcTimeByStr(r);
                    if (null != a && c <= calcTimeByStr(a.eTime)) {
                        return true;
                    }
                    var u = calcTimeByStr(s);
                    if (null != o && u >= calcTimeByStr(o.sTime)) {
                        return true;
                    }
                    break;
                }
            }
            return false;
        }
        //是否还能创建section
        function caninsertSection(e) {
            return myDays[e].length == myParam.sectionNum ? false : true;
        }
        //获取鼠标按下位置
        function getMouseDownPos(e) {
            return e < myTimePlan.minClientX ? myTimePlan.minClientX : e > myTimePlan.maxClientX ? myTimePlan.maxClientX : e;
        }
        //创建编辑对话框
        function insertTimeTipDlg() {
            var n = "<div id='" + myTimePlan.id + "_timetip' class='" + myTimePlan.prefix + "timetip'>" +
                "<div class='" + myTimePlan.prefix + "timetip_top'></div>" +
                "<div id='" + myTimePlan.id + "_timetip_middle' class='" + myTimePlan.prefix + "timetip_middle'>" +
                "<div id='" + myTimePlan.id + "_typeSel'></div>" +
                "<div id='" + myTimePlan.id + "_modalSel'></div>" +
                "<div id='" + myTimePlan.id + "_numberSel'></div>" +
                "<div style='padding-top: 5px;'>" +
                "<input type='text' class='txt' maxlength='2' onpaste='return false' />" +
                "<span> : </span>" +
                "<input type='text' class='txt' maxlength='2' onpaste='return false' />" +
                "<span> - </span>" +
                "<input type='text' class='txt' maxlength='2' onpaste='return false' />" +
                "<span> : </span>" +
                "<input type='text' class='txt' maxlength='2' onpaste='return false' />" +
                "</div>" +
                "<div style='padding: 5px 0;'>" + "<span class='ctrl'>取消</span> | <span class='ctrl'>保存</span>";
            if (myParam.onScenceCfg) {
                n += " | <span class='ctrl'>" + myParam.lan + "</span>";
            };
            n += "</div><span class='close'></span></div><div class='" + myTimePlan.prefix + "timetip_bottom'></div>" + "</div>";
            myTimeTip = $(n);
            if ($("#" + myTimePlan.id + "_timetip").length > 0) {
                $("#" + myTimePlan.id + "_timetip").unbind().remove();
            }
            $(myTimePlan).append(myTimeTip);
            if (null != myType && myType.length > 0) {
                $("#" + myTimePlan.id + "_typeSel").append($("#" + myTimePlan.id + "_drawTypeSel").clone().width(147).attr("id", myTimePlan.id + "_drawTypeSel2"));
                //绘图事件模板选择
                var modal= "";
                modal += '<select style="width: 147px; margin-top: 5px;">';
                modal += '<option value="0">123</option>';
                modal += '<option value="1">123</option>';
                modal += '<option value="2">123</option>';
                modal += '</select>';
                //$("#" + myTimePlan.id + "_modalSel").empty().append(modal).show();
                myEventType = myType[0];
                $("#" + myTimePlan.id + "_drawTypeSel2").change(function () {
                    sectionMDExtend($(this).val(), 1);
                    showTimeTip();
                });
            }
            myTimeTip.bind("click", function (e) {
                e.stopPropagation();
            });
            //给输入框注册键盘弹起事件
            myTimeTip.find(".txt").each(function (t) {
                if (0 == t % 2) {
                    $(this).bind("keyup", function (event) {
                        validHour(this);
                    });
                } else {
                    $(this).bind("keyup", function (event) {
                        validMinute(this);
                    });
                }
            });
            //点击关闭按钮的时候，编辑框消失
            myTimeTip.find(".close").eq(0).click(function () {
                myTimeTip.hide();
            });
            //点击删除的时候，删除单个section
            myTimeTip.find(".ctrl").eq(0).click(function () {
                $("#" + myTimePlan.id + "_delete").click();
            });
            //点击保存的时候，编辑框消失，且根据输入的时间判断位置改变
            myTimeTip.find(".ctrl").eq(1).click(function () {
                if (myParam.particle) {
                    var t = myTimeTip.find(".txt");
                    t.eq(2).val(t.eq(0).val());
                    t.eq(3).val(t.eq(1).val());
                }
                if (myParam.particle || validTime()) {
                    if (timeInOtherSection()) {
                        alert(Config.Language.GetStr(9120));
                    } else {
                        var n = myTimeTip.find(".txt");
                        var a = n.eq(0).val() + ":" + n.eq(1).val() + ":00";
                        var o = n.eq(2).val() + ":" + n.eq(3).val() + ":00";
                        var sPos = calcPosByTime(a);
                        var ePos = calcPosByTime(o);
                        var l = null;
                        var d = myDays[myCurSection.day].length;
                        for (var u = 0; d > u; u++) {
                            l = myDays[myCurSection.day][u];
                            if (l.start == myCurSection.start && l.end == myCurSection.end) {
                                if (null != myType && myType.length > 0) {
                                    l.type = $("#" + myTimePlan.id + "_drawTypeSel2").val();
                                    l.enable = $("#" + myTimePlan.id + "_modalSel").find("select").val();
                                    var p = bgColor[l.type];
                                    "undefined" == typeof p && (p = bgColor["1"]);
                                    myCurSection.css({background: p});
                                    myData[myCurSection.day][u].type = l.type;
                                    myData[myCurSection.day][u].enable = l.enable;
                                    l.number = "0";
                                    ("patrol" == l.type || "pattern" == l.type || "preset" == l.type || "auxoutput" == l.type) && (l.number = $("#" + myTimePlan.id + "_drawNumberSel").val());
                                    myData[myCurSection.day][u].number = l.number;
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
                    alert(Config.Language.GetStr(9120));
                }
            });
            if (myParam.onScenceCfg) {
                myTimeTip.find(".ctrl").eq(2).click(function () {
                    myParam.onScenceCfg(myCurSection);
                });
            }
        }
        //判断小时输入是否有效
        function validHour(t) {
            if (Number(t.value) <= 23) {
                //if (24 == Number(t.value)) {
                //    $(t).next().val("00");
                //}
            } else {
                t.value = "00";
            }
        }
        //判断分钟输入是否有效
        function validMinute(t) {
            if (Number(t.value) <= 59) {
                //if (24 == Number($(t).prev().val())) {
                //    t.value = "00";
                //}
            } else {
                t.value = "00";
            }
        }
        //创建复制到对话框
        function insertCopytoDlg() {
            var t = "<table id='" + myTimePlan.id + "_checkboxs' class='" + myTimePlan.prefix + "checkboxs' cellspacing='0' cellspadding='0' border='0'>" +
                "<tr><td colspan='3'><div class='" + myTimePlan.prefix + "copyto_top'><label class='" + myTimePlan.prefix + "copyto_txt' id='" + myTimePlan.id + "_copyTo_txt'>复制到</label><span class='" + myTimePlan.prefix + "copyto_checkall'><input id='" + myTimePlan.id + "_checkall' type='checkbox' class='" + myTimePlan.prefix + "checkbox' /><label id='" + myTimePlan.id + "_selAll'>全选</label></span></div></td></tr>" +
                "<tr><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='0' /><label id='" + myTimePlan.id + "_monDay1'>星期一</label></td><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='1' /><label id='" + myTimePlan.id + "_tueDay1'>星期二</label></td><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='2' /><label id='" + myTimePlan.id + "_wedDay1'>星期三</label></td></tr>" +
                "<tr><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='3' /><label id='" + myTimePlan.id + "_thuDay1'>星期四</label></td><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='4' /><label id='" + myTimePlan.id + "_friDay1'>星期五</label></td><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='5' /><label id='" + myTimePlan.id + "_satDay1'>星期六</label></td></tr>" +
                "<tr><td><input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='6' /><label id='" + myTimePlan.id + "_sunDay1'>星期日</label></td><td>";
            t += myParam.holiday ? "<input type='checkbox' class='" + myTimePlan.prefix + "checkbox' day='7' /><label id='" + myTimePlan.id + "_holDay1'>假日</label></td>" : "&nbsp;</td>", t += "<td>&nbsp;</td></tr>";
            t += "<tr><td class='" + myTimePlan.prefix + "copyto_bottom' colspan='3'><button type='button' class='btn btn-browser' id='" + myTimePlan.id + "_ok'>确定</button><button type='button' class='btn btn-browser' id='" + myTimePlan.id + "_cancel'>取消</button></td></tr></table>";
            if ($("#" + myTimePlan.id + "_checkboxs").length > 0) {
                $("#" + myTimePlan.id + "_checkboxs").unbind().remove();
            }
            myCopyTo = $(t);
            $(myTimePlan).append(myCopyTo);
            $("#" + myTimePlan.id + "_checkall").click(function () {
                $("#" + myTimePlan.id + "_checkboxs ." + myTimePlan.prefix + "checkbox").not(":first").not(":disabled").prop("checked", $(this).prop("checked"))
            });
            $("#" + myTimePlan.id + "_checkboxs ." + myTimePlan.prefix + "checkbox").not(":first").click(function (t) {
                $(this).prop("disabled") && t.preventDefault();
                if ($("#" + myTimePlan.id + "_checkboxs ." + myTimePlan.prefix + "checkbox").not(":first").not(":checked").length > 0) {
                    $("#" + myTimePlan.id + "_checkall").prop("checked", false);
                } else {
                    $("#" + myTimePlan.id + "_checkall").prop("checked", true);
                }
            });
            $("#" + myTimePlan.id + "_ok").click(function () {
                myCopyTo.hide();
                dataCopyTo();
            });
            $("#" + myTimePlan.id + "_cancel").click(function () {
                myCopyTo.hide();
            })
        }
        //复制数据到其他星期
        function dataCopyTo() {
            var t;
            var n = -1;
            var a = $.extend(true, [], myDays[selectDay]);
            var o = [];
            $("#" + myTimePlan.id + "_checkboxs ." + myTimePlan.prefix + "checkbox").not(":first").each(function () {
                if ($(this).prop("checked") && !$(this).prop("disabled")) {
                    n = $(this).attr("day");
                    o.push(n);
                    myDays[n] = [];
                    $.extend(true, myDays[n], a);
                    myData[n] = [];
                    $.each(a, function (i) {
                        t = myData[selectDay][i].scenePatrol;
                        if (t) {
                            t = $.extend(true, [], t);
                        }
                        myData[n][i] = {
                            type: this.type,
                            sTime: myData[selectDay][i].sTime,
                            eTime: myData[selectDay][i].eTime,
                            enable: this.enable,
                            number: this.number
                        }
                    });
                }
            });
            drawCopyTo();
            if (myParam.onScenceCfg) {
                myParam.onScenceCfg("copyto", selectDay, o);
            }
        }
        //判断时间范围是否有效
        function validTime() {
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
        function insertDay() {
            var weeks=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
            var e = [];
            var t = ["mon", "tue", "wed", "thu", "fri", "sat", "sun", "hol"];
            for (var i = 0; 8 > i; i++) {
                if (7 == i) {
                    e.push('<div class="' + myTimePlan.prefix + 'day" day="' + i + '" id="' + myTimePlan.id + '_holDayDiv" style="display:none;">');
                } else {
                    e.push('<div class="' + myTimePlan.prefix + 'day" day="' + i + '">');
                }
                e.push('<div class="' + myTimePlan.prefix + 'dayname" day="' + i + '"><label id="' + myTimePlan.id + "_" + t[i] + 'Day" title='+weeks[i]+'>'+weeks[i]+'</label></div>');
                e.push('<div class="' + myTimePlan.prefix + 'daydraw">');
                e.push('<div id="' + myTimePlan.id + "_dayTimePlan" + i + '" day="' + i + '" class="' + myTimePlan.prefix + 'daytimeplan"></div>');
                e.push("</div>");
                e.push('<div class="' + myTimePlan.prefix + 'copyto" day="' + i + '" style="display:none;"></div>');
                e.push("</div>");
            }
            return e.join("");
        }
        //给$扩展属性和方法
        myParam = $.extend({
            //控制插入的数量
            sectionNum:12,
            data: null,
            mode: 0,
            holiday: false,
            types: [1,2,3,4,5,6,7],
            lan: null,
            particle: false,
            editable: true,
            onAdvanced: null,
            onScenceCfg: null,
            oAlarmOutNum: {patrol: 8, pattern: 4, preset: 8, auxoutput: 2}
        },myParam);
        //给$添加属性和方法
        $.extend(this, {
            //获取id
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
                insertDrawType();
            },
            setData: function (data) {
                myData = data;
                insertSectionAll();
            },
            setSectionNum: function (sectionNum) {
                myParam.sectionNum = sectionNum;
            },
            setAlarmOutNum: function (oAlarmOutNum) {
                myParam.oAlarmOutNum = oAlarmOutNum;
            },
            setHoliday: function (t) {
                myParam.holiday = t;
                if (t) {
                    $("#" + myTimePlan.id + "_holDayDiv").show();
                } else {
                    $("#" + myTimePlan.id + "_holDayDiv").hide();
                }
            },
            setParticle: function (particle) {
                myParam.particle = particle;
            }
        });
        //初始化值和属性
        var VCA = [];
        var myTimePlan = this;
        var myType = null;
        var myData = [[],[],[],[],[],[],[],[]];
        var myCopyTo = null;
        var myDays = [];
        var myCurSection = null;
        var myTimeTip = null;
        var myEventType = "0";
        var bMouseDown = false;
        var myMouseDownPos = -1;
        var selectDay = -1;
        var H = null;
        var curSectionData = null;
        var K = {};
        var tmpSection = null;
        var mySectionSide = "";
        //创建页面
        var U =
            '<div class="' + this.prefix + 'btns">' +
            '<div class="' + this.prefix + 'btn"><select id="' + this.id + '_drawTypeSel" style="display: block; width: 100px;"></select></div>' +
            '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_delete"><span class="delete">&nbsp;</span><span id="' + this.id + '_delete_txt">删除</span></button></div>' +
            '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_deleteAll"><span class="deleteAll">&nbsp;</span><span id="' + this.id + '_deleteAll_txt">删除全部</span></button></div>' +
            '<div class="' + this.prefix + 'btn" style="float:right;"><button type="button" class="btn" id="' + this.id + '_advanced" style="display:none;">高级参数</button></div>' +
            "</div>" +
            '<div class="' + this.prefix + 'days" onselectstart="return false;" style="-moz-user-select:none;">' + insertDay() + "</div>" +
            '<div id="' + this.id + '_drawTypeShow" class="' + this.prefix + 'drawtypes"></div>' +
            '<div style="clear: both;"></div>' +
            '<div id="' + this.id + '_timeTipHover" class="' + this.prefix + 'timetip_hover">' +
            '<div class="' + this.prefix + 'timetip_hover_top"></div>' +
            '<div class="' + this.prefix + 'timetip_hover_bottom"></div>' +
            '</div>' +
            '<div id="' + this.id + '_tipsLeft" class="' + this.prefix + 'tipsleft"></div>' +
            '<div id="' + this.id + '_tipsRight" class="' + this.prefix + 'tipsright"></div>';
        //把页面挂在div下面
        $(this).append(U)
        this.css("position", "relative");
        if (myParam.types) {
            myType = myParam.types;
        }
        if (myParam.data) {
            myData = myParam.data;
        }
        if (1 == myParam.mode) {
            $("#" + myTimePlan.id + "_advanced").show();
        }
        if (myParam.holiday) {
            $("#" + myTimePlan.id + "_holDayDiv").show();
        }
        //根据值得改变，选择对应的背景色
        $("#" + myTimePlan.id + "_drawTypeSel").change(function () {
            myEventType = $(this).val();
        });
        //点击删除，删除单个section
        $("#" + myTimePlan.id + "_delete").click(function () {
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
                $("#" + myTimePlan.id + "_delete").prop("disabled", true);
            }
        }).prop("disabled", true);
        //点击全部删除，删除所有的section
        $("#" + this.id + "_deleteAll").click(function () {
            $("#" + myTimePlan.id + " ." + myTimePlan.prefix + "section").unbind().remove();
            myTimeTip.hide();
            $.each(myDays, function (e) {
                myDays[e] = [];
                myData[e] = [];
            });
            myCurSection = null;
            $("#" + myTimePlan.id + "_delete").prop("disabled", true);
        });
        //遍历每一天，图标出现和隐藏
        $("#" + myTimePlan.id + " ." + myTimePlan.prefix + "day").each(function () {
            $(this).bind({
                mouseover: function () {
                    if ("" == mySectionSide) {
                        $("." + myTimePlan.prefix + "copyto", this).eq(0).show()
                    }
                }, mouseout: function () {
                    if ("" == mySectionSide) {
                        $("." + myTimePlan.prefix + "copyto", this).eq(0).hide()
                    }
                }
            })
        });
        //遍历点击复制图标出现复制框，并且设置对应的禁选框
        $("#" + myTimePlan.id + " ." + myTimePlan.prefix + "copyto").each(function () {
            $(this).bind({
                mouseout: function () {
                }, click: function (t) {
                    t.stopPropagation();
                    selectDay = parseInt($(this).attr("day"), 10);
                    myCopyTo.css({
                        left: $(this).position().left - myCopyTo.outerWidth(),
                        top: $(this).position().top - myCopyTo.outerHeight() / 2 + 25
                    }).show();
                    var i = $("#" + myTimePlan.id + "_checkboxs");
                    i.find("." + myTimePlan.prefix + "checkbox:disabled").prop("disabled", false);
                    i.find("." + myTimePlan.prefix + "checkbox:checked").prop("checked", false);
                    i.find("." + myTimePlan.prefix + "checkbox[day='" + selectDay + "']").prop("disabled", true).prop("checked", true);
                    if (null != myCurSection) {
                        myCurSection.css({
                            height: 16,
                            border: 0
                        });
                    }
                    $("." + myTimePlan.prefix + "resizeLeft", myCurSection).eq(0).hide();
                    $("." + myTimePlan.prefix + "resizeRight", myCurSection).eq(0).hide();
                    myTimeTip.hide();
                    myCurSection = null;
                    $("#" + myTimePlan.id + "_delete").prop("disabled", true);
                }
            });
        });
        //把每一天添加到数组中
        for (var sun = 0; 8 > sun; sun++) {
            myTimePlan.dayTimePlans.push($("#" + myTimePlan.id + "_dayTimePlan" + sun));
        }
        //响应鼠标按下事件
        $.each( myTimePlan.dayTimePlans, function (t) {
            $(this).bind({
                mousedown: function (i) {
                    myTimePlan.minClientX = Math.floor($(this).offset().left);
                    myTimePlan.maxClientX = Math.floor($(this).offset().left)+576;
                    myMouseDownPos = i.clientX - myTimePlan.minClientX;
                    myTimePlan.drawStartClientX = myMouseDownPos;
                    if (pointInSection(t, myMouseDownPos)) {
                        if (null != myCurSection) {
                            var Q=myDays[myCurSection.day];
                            for (var o = 0, r = Q.length; r > o; o++) {
                                H = myDays[myCurSection.day][o];
                                if (H.start == myCurSection.start && H.end == myCurSection.end) {
                                    curSectionData = myData[myCurSection.day][o];
                                    K.min = o - 1 >= 0 ? myDays[myCurSection.day][o - 1].end : 0;
                                    K.max = r > o + 1 ? myDays[myCurSection.day][o + 1].start : 576;
                                    break;
                                }
                            }
                        }
                    } else if (!caninsertSection(t)) {
                        return;
                    }
                    $(document).bind("mousemove", function (e) {
                        myMouseMove(e);
                    });
                    $(document).bind("mouseup", function (e) {
                        myMouseUp(e);
                    });
                    bMouseDown = true;
                }, mousemove: function () {
                    if (bMouseDown && null == myTimePlan.drawSection && null == H) {
                        $("#" + myTimePlan.id + "_tipsLeft, #" + myTimePlan.id + "_tipsRight").hide();
                        var i = myTimePlan.drawStartClientX;
                        myTimePlan.drawSection = insertSection(t, myEventType, i);
                        myTimePlan.drawSection.day = t;
                        $(this).append(myTimePlan.drawSection);
                    }
                }

            })
        });
        //创建复制到对话框
        insertCopytoDlg();
        //插入绘图类型
        insertDrawType();
        //初始化所有section绘图
        insertSectionAll();
        //创建编辑对话框
        insertTimeTipDlg();
        return this;
    }
})(jQuery)


