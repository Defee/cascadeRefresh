﻿//Template based on http://www.queness.com/post/112/a-really-simple-jquery-plugin-tutorial
(function ($) {
    //Your plugin's name
    var pluginName = 'cascadeRefresh';
    $.cascadeRefresh = function (element, options) {

        var defaults = {
            refreshOptions: {},
            targetsSplitter: ';'
        };

        defaults = $.extend({}, $.cascadeRefresh.globalSettings, defaults);
        options = $.extend(defaults, options);

        var plugin = this;

        plugin.settings = {};
        var $element = $(element),
            el = element;

        plugin.init = function () {
            var eventNamespace = '.cascade';
            plugin.settings = options; //$.extend({}, defaults, options);

            var opts = options;

            var jqObject = $element;
            var eventN = opts.eventName + eventNamespace;
            jqObject.on(eventN, { options: opts }, function (event) {
                var htmlElement = this;

                var eventOpts = event.data.options;
                var resfreshTargetsAttr = htmlElement.getAttribute(opts.bindings.refreshTargetsBinding);
                var targetsSplitter = htmlElement.getAttribute(opts.bindings.splitter);
                if (targetsSplitter == null) targetsSplitter = eventOpts.targetsSplitter;

                if (resfreshTargetsAttr != undefined) {
                    var resfreshTargetsSelectors = resfreshTargetsAttr.split(targetsSplitter);

                    for (var i = 0; i < resfreshTargetsSelectors.length; i++) {
                        var jqRefreshTarget = $(resfreshTargetsSelectors[i]);
                        if (jqRefreshTarget != undefined) {
                            jqRefreshTarget.each(function () {
                                var jqTarget = $(this);
                                clearDependencies(0, jqTarget);
                                jqTarget.elRefresh({}, eventOpts.refreshOptions);
                            });
                        }
                    }
                }
            });

        };

        plugin.init();
    };

    $.cascadeRefresh.globalSettings = {
        bindings: {
            refreshTargetsBinding: 'data-refresh-targets',
            splitterBinding: 'data-splitter'
        },
        eventName: 'change',
    };

    $.cascadeRefresh.setGlobalSettings = function (settings) {
        return $.cascadeRefresh.globalSettings = $.extend({}, $.cascadeRefresh.globalSettings, settings);
    };
    $.cascadeRefresh.setCascadeRefreshBindings = function (bindings) {
        return $.cascadeRefresh.globalSettings.bindings = $.extend({}, $.cascadeRefresh.globalSettings.bindings, bindings);
    };
    $.cascadeRefresh.setElementRefreshBindings = function (bindings) {
        return $.elementRefresh.globalSettings.bindings = $.extend({}, $.elementRefresh.globalSettings.bindings, bindings);
    };

    function clearDependencies(depth, jobj) {
        var globalSet = $.cascadeRefresh.globalSettings;
        var splitter = jobj.attr(globalSet.bindings.splitterBinding);
        if (splitter === undefined) {
            splitter = ';';
        }
        var content = $("*[" + globalSet.bindings.refreshTargetsBinding + "]", jobj);
        var targetsSelectors;
        var refreshtargets;
        if (!content.exists()) {
            depth++;
            targetsSelectors = jobj.attr(globalSet.bindings.refreshTargetsBinding);
            if (targetsSelectors === undefined || targetsSelectors === null || typeof targetsSelectors.split !== "function") {
                if (depth != 0) {
                    if (!jobj.is('input')) {
                        executeEmptyAction(jobj);
                    }
                    else
                        jobj.val('');
                };
                return;

            }
            refreshtargets = targetsSelectors.split(splitter);

            for (var k = 0; k < refreshtargets.length; k++) {
                clearDependencies(depth, $(refreshtargets[k]));
            }
            if (depth != 0) {
                if (!jobj.is('input')) {
                    jobj.html('');
                }
                else
                    jobj.val('');
            }
            depth--;
        } else {
            targetsSelectors = content.attr(globalSet.bindings.refreshTargetsBinding);
            if (targetsSelectors === undefined || targetsSelectors === null || typeof targetsSelectors.split !== "function") return;
            for (var i = 0; i < content.length; i++) {
                refreshtargets = targetsSelectors.split(splitter);
                depth++;
                for (var j = 0; j < refreshtargets.length; j++) {
                    clearDependencies(depth, $(refreshtargets[j]));
                }
                if (depth != 0) {
                    if (!jobj.is('input'))
                        jobj.html('');
                    else
                        jobj.val('');
                }
                depth--;
            }
        }




    };

    $.fn.extend({
        'cascadeRefresh': function (options) {
            //     var eventNamespace = '.cascade';
            //     var defaults = {

            //         refreshOptions: {},
            //         targetsSplitter: ';',
            //     };
            //     defaults = $.extend(globalSettings, defaults);
            //      options = $.extend(defaults, options);

            return this.each(function () {
                $.cascadeRefresh(this, options);
                //       var opts = options;

                //       var jqObject = $(this);
                //       var eventN = opts.eventName + eventNamespace;
                //       jqObject.on(eventN, { options: opts }, function (event) {
                //           var eventOpts = event.data.options;
                //           var resfreshTargetsAttr = this.getAttribute(opts.bindings.refreshTargetsBinding);
                //           var targetsSplitter = this.getAttribute(opts.bindings.splitter);
                //           if (targetsSplitter == null) targetsSplitter = eventOpts.targetsSplitter;

                //           var resfreshTargetsSelectors = resfreshTargetsAttr.split(targetsSplitter);

                //           for (var i = 0; i < resfreshTargetsSelectors.length; i++) {
                //               var jqRefreshTarget = $(resfreshTargetsSelectors[i]);
                //               if (jqRefreshTarget != undefined) {
                //                   jqRefreshTarget.each(function () {
                //                       var jqTarget = $(this);
                //                       clearDependencies(0, jqTarget);
                //                       jqTarget.elRefresh({}, eventOpts.refreshOptions);

                //                   });
                //               }
                //           }
                //       });


            });
        }
    });


    $(document).on('mouseenter.cascade', '*[data-cascade=true]', function () {
        var cascades = $(this);

        if (cascades.exists() && (cascades.attr('data-cascade-binded') == null || cascades.attr('data-cascade-binded') == false)) {
            cascades.cascadeRefresh();
            cascades.attr('data-cascade-binded', true);
        }
    });
    function functik(obj) {

        if (obj == undefined || obj.attr('data-refresh-targets') == undefined) return;
        var targets = obj.attr('data-refresh-targets').split(';');
        if (targets.length > 0) {
            for (var i = 0; i < targets.length; i++) {
                var jqTarget = $(targets[i]);
                if (!jqTarget.hasChildNodes) {
                    executeEmptyAction(jqTarget);
                }
                functik(jqTarget);
            }

        } else {
            if (!obj.hasChildNodes) {
                executeEmptyAction(obj);
            }
            return;
        }
    }
    var executeEmptyAction = function (jObj) {
        var emptyAction = jObj.attr("data-empty");
        if (emptyAction == undefined || emptyAction == false) {
            emptyAction = "makeInvisible";
        }
        switch (emptyAction) {
            case "disable":
                var disabledAttr = jObj.attr('data-disabled');
                if (disabledAttr == undefined || disabledAttr == false) {
                    jObj.attr('disabled', 'disabled');
                    jObj.attr('data-disabled', true);
                }
                break;

            default:
                var dataFadedAttr = jObj.attr('data-faded');
                if (dataFadedAttr == undefined || dataFadedAttr == false) {
                    jObj.attr('data-faded', true);
                    jObj.fadeOut(0);
                }

        }
    }
    $(function () {
        var emptyCascades = $('select[data-cascade=true]:empty');
        emptyCascades.each(function () {
            var $this = $(this);
            executeEmptyAction($this);
        });

        var notEmptySelects = $('select[data-cascade=true]:not(:empty)');
        for (var i = 0; i < notEmptySelects.length; i++) {
            functik($(notEmptySelects[i]));
        }


    });
    //$(document).ajaxComplete(function () {
    //    var cascadedElements = $('*[data-cascade=true]');
    //    console.clear();
    //    console.log(cascadedElements);
    //    if (cascadedElements.exists()) {

    //        if (cascadedElements.exists() && !cascadedElements.hasClass('cascade-binded')) {

    //            console.clear();console.log(cascadedElements);
    //                cascadedElements.cascadeRefresh();
    //                cascadedElements.addClass('cascade-binded');
    //            }

    //    }

    //});

    //$(document).ready(function () {

    //    $('*[data-cascade=true]').elRefresh();
    //});

    //$.ajaxComplete(function() {
    //    var cascades = $('*[data-cascade=true]');
    //    if (cascades.exists()) {
    //        cascades.elRefresh();
    //    }


    //});
    //$(document).on(eventName+ '.cascade', '*[data-cascade=true]', function() {
    //   
    //});


})(jQuery);