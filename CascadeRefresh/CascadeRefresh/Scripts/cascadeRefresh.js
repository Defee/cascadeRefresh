//Template based on http://www.queness.com/post/112/a-really-simple-jquery-plugin-tutorial
(function ($) {
    //Your plugin's name
    var pluginName = 'cascadeRefresh';
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
                    if (jObj.data('chosen') != undefined) {
                        jObj.next().fadeOut(0);
                    } else {
                        jObj.fadeOut(0);
                    }


                }

        }
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
    $.cascadeRefresh = function (element, options) {

        var defaults = {
            refreshOptions: {

            },
            targetsSplitter: ';'

        };

        defaults = $.extend({}, $.cascadeRefresh.globalSettings, defaults);
        options = $.extend(defaults, options);

        var plugin = this;
        plugin.settings = {};
        var $element = $(element),
            el = element;
        plugin.showLoadingElement = function (element, options) {
            //var jqLoadElement = $(element.dataset.loadingElement);
            var jqLoadElement = $(element.getAttribute(options.bindings.loadIndicatorBinding));
            if (jqLoadElement.exists()) {
                if (jqLoadElement.modal != undefined && typeof (jqLoadElement.modal) === "function") {
                    jqLoadElement.modal('show');
                } else {
                    jqLoadElement.fadeIn(500);
                }
            }
        };

        plugin.hideLoadingElement = function (element, options) {
            //var jqLoadElement = $(element.dataset.loadingElement);
            var jqLoadElement = $(element.getAttribute(options.bindings.loadIndicatorBinding));
            if (jqLoadElement.exists()) {
                if (jqLoadElement.modal != undefined && typeof (jqLoadElement.modal) === "function") {
                    jqLoadElement.modal('hide');
                } else {
                    jqLoadElement.fadeOut(500);
                }
            }
        };

        plugin.init = function () {

            var eventNamespace = '.cascade';
            plugin.settings = options;

            var opts = options;

            var jqObject = $element;
            var eventN = opts.eventName + eventNamespace;
            jqObject.on(eventN, { options: opts }, function (event) {
                var htmlElement = this;

                var eventOpts = event.data.options;
                var resfreshTargetsAttr = htmlElement.getAttribute(opts.bindings.refreshTargetsBinding);
                var targetsSplitter = htmlElement.getAttribute(opts.bindings.splitter);
                var loadingElement = htmlElement.getAttribute(opts.bindings.loadIndicatorBinding);//htmlElement.dataset.loadingElement;
                var enableProgress = htmlElement.getAttribute(opts.bindings.enableLoadIndicatorBinding);//htmlElement.dataset.enableProgress;

                if (targetsSplitter == null)
                    targetsSplitter = eventOpts.targetsSplitter;
                if (enableProgress == undefined && eventOpts.enableProgress != undefined)
                    enableProgress = eventOpts.enableProgress;
                if (loadingElement == undefined && eventOpts.loadingElement != undefined)
                    element.setAttribute(opts.bindings.loadIndicatorBinding, opts.loadingElement);



                if (resfreshTargetsAttr != undefined) {
                    var resfreshTargetsSelectors = resfreshTargetsAttr.split(targetsSplitter);
                    var ajaxCallsCount = 0;
                    var currentAjaxCalls = 0;
                    eventOpts.refreshOptions.caller = element;

                    if (enableProgress) {
                        element.setAttribute(opts.bindings.currentRefreshTargetsCountBinding, currentAjaxCalls);
                        //element.dataset.currentRefreshTargetsCount = currentAjaxCalls;
                        plugin.showLoadingElement(element, opts);
                    }

                    for (var i = 0; i < resfreshTargetsSelectors.length; i++) {
                        var jqRefreshTarget = $(resfreshTargetsSelectors[i]);
                        if (jqRefreshTarget != undefined) {
                            if (enableProgress) {
                                ajaxCallsCount += jqRefreshTarget.length;
                                element.setAttribute(opts.bindings.refreshTargetsCountBinding, ajaxCallsCount);
                                //element.dataset.refreshTargetsCount = ajaxCallsCount;
                                currentAjaxCalls = parseInt(element.getAttribute(opts.bindings.currentRefreshTargetsCountBinding));
                                //currentAjaxCalls = parseInt(element.dataset.currentRefreshTargetsCount);
                                currentAjaxCalls += jqRefreshTarget.length;
                                element.setAttribute(opts.bindings.currentRefreshTargetsCountBinding, currentAjaxCalls);
                                //element.dataset.currentRefreshTargetsCount = currentAjaxCalls;
                            }

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
            splitterBinding: 'data-splitter',
            enableLoadIndicatorBinding: 'data-enable-progress',
            loadIndicatorBinding: 'data-loading-element',
            currentRefreshTargetsCountBinding: 'data-current-refresh-targets-count',
            refreshTargetsCountBinding: 'date-refresh-targets-count'
        },
        eventName: 'change',
        loadingElement: '#loadIndicator',
        enableProgress: false
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



    $.fn.extend({
        'cascadeRefresh': function (options) {

            return this.each(function () {

                var pluginVictim = this;
                var $pluginVictim = $(this);

                if (undefined == $pluginVictim.data(pluginName)) {


                    var plugin = new $.cascadeRefresh(pluginVictim, options);


                    $pluginVictim.data(pluginName, plugin);

                }
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

    $(document).on('mouseenter.cascade', '.chosen-container', function () {
        var $chosens = $(this);
        var selector = '#' + $chosens.attr('id').split('_')[0];
        var cascades = $(selector, $chosens.parent());
        if (cascades.exists() && cascades.attr('data-cascade') != false && cascades.attr('data-cascade') != undefined && (cascades.attr('data-cascade-binded') == null || cascades.attr('data-cascade-binded') == false)) {
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
                if (!(jqTarget.children().length > 0) || ((jqTarget.is('input') || jqTarget.is('select')) && (jqTarget.val() != '' || jqTarget.val() != 0))) {
                    var targetElRefresh = jqTarget.data('elementRefresh')
                    if (targetElRefresh != null) {
                        console.log(targetElRefresh.options);
                    }
                    console.log(jqTarget.is('select'));
                    console.log(jqTarget.val() != '' || jqTarget.val() != 0);
                    //alert(!(jqTarget.children().length > 0) || ((jqTarget.is('input') || jqTarget.is('select')) && (jqTarget.val()!= '' || jqTarget.val()!= 0) ));
                    executeEmptyAction(jqTarget);
                }
                functik(jqTarget);
            }

        } else {
            if (!(jqTarget.children().length > 0) || ((jqTarget.is('input') || jqTarget.is('select')) && (jqTarget.val() != '' || jqTarget.val() != 0))) {
                executeEmptyAction(obj);
            }
            return;
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

})(jQuery);