(function ($) {
    var pluginName = 'elRefresh';
    $.fn.exists = function () {
        return $(this).length > 0;
    };
    function getFunction(code, argNames) {
        var fn = window, parts = (code || "").split(".");
        while (fn && parts.length) {
            fn = fn[parts.shift()];
        }
        if (typeof (fn) === "function") {
            return fn;
        }
        argNames.push(code);
        return Function.constructor.apply(null, argNames);
    }


    $.elementRefresh = function (element, obj, options) {
        var $element = $(element),
           el = element;
        var defaults = {
            method: 'GET',
            splitter: ';',
            target: '#' + $element.attr('id'),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'html',
            isTraditional: true,
            ajaxCache: false,
            propertyName: 'name',
            url: window.location.href,
            refreshCompleted: function () { },
            caller: null
        };

        defaults = $.extend({}, $.elementRefresh.globalSettings, defaults);
        options = $.extend(defaults, options);

        var plugin = this;
        plugin.parseJsonToSelect = function (element, jqTarget, bindings, jsonData, clearSelectData) {
            var idBinding = element.getAttribute(bindings.html.select.id);
            if (idBinding == null) idBinding = bindings.json.select.id;

            var nameBinding = element.getAttribute(bindings.html.select.name);
            if (nameBinding == null) nameBinding = bindings.json.select.name;

            var getfullAttributes = element.getAttribute(bindings.html.select.specifyAllData);
            if (getfullAttributes == null) {
                getfullAttributes = bindings.json.specifyAllData;
            }
            if (clearSelectData)
                jqTarget.find('option').remove();
            if (getfullAttributes) {

                var htmlAttrBinding = element.getAttribute(bindings.html.select.htmlAttributes);
                if (htmlAttrBinding == null) htmlAttrBinding = bindings.json.select.htmlAttributes;

                $.each(jsonData[htmlAttrBinding], function (key, val) {
                    if (key == 'class') {
                        var classAtrr = jqTarget.attr(key);
                        if (classAtrr != undefined && classAtrr.indexOf(val) == -1) {
                            val = classAtrr + ' ' + val;
                        }

                    }
                    jqTarget.attr(key, val);
                });
                var defaultValueBinding = element.getAttribute(bindings.html.select.defaultValue);
                if (defaultValueBinding == null) defaultValueBinding = bindings.json.select.defaultValue;
                if (jsonData[defaultValueBinding] != undefined && jsonData[defaultValueBinding] != null)
                    jqTarget.append('<option value>' + jsonData[defaultValueBinding] + '</option>');


                var optionsBinding = element.getAttribute(bindings.html.select.options);
                if (optionsBinding == null) optionsBinding = bindings.json.select.options;

                $.each(jsonData[optionsBinding], function (key, val) {
                    if ($.isPlainObject(val)) {

                        console.log(idBinding);
                        console.log(nameBinding);
                        jqTarget.append('<option value=' + val[idBinding] + '>' + val[nameBinding] + '</option>');
                    } else {
                        jqTarget.append('<option value=' + key + '>' + val + '</option>');
                    }
                });
                var selectValueBinding = element.getAttribute(bindings.html.select.selectedValue);
                if (selectValueBinding == null) selectValueBinding = bindings.json.select.selectedValue;
                if (jsonData[selectValueBinding] != undefined && jsonData[selectValueBinding] != null)
                    jqTarget.val(jsonData[selectValueBinding]);

            } else {
                $.each(jsonData, function (key, val) {

                    if ($.isPlainObject(val)) {
                        jqTarget.append('<option value=' + val[idBinding] + '>' + val[nameBinding] + '</option>');
                    } else {
                        jqTarget.append('<option value=' + key + '>' + val + '</option>');
                    }
                });
            }



        }
        plugin.parseJsonToInput = function (jqTarget, jsonData, clearSelectData) {
            if (clearSelectData)
                jqTarget.val(jsonData);
            else
                jqTarget(jqTarget.val() + jsonData);
        }
        plugin.processCallerAjaxPackages = function (caller) {
            var jqCaller = $(caller);
            if (caller != null) {
                var plugin = jqCaller.data('cascadeRefresh');
                //if plugin is initialized
                if (plugin != undefined) {
                    //get the plugin settings
                    var settings = plugin.settings;
                    //is progress enabled flag
                    var progress = caller.getAttribute(settings.bindings.enableLoadIndicatorBinding);
                    //loading element
                    var loadingElement = caller.getAttribute(settings.bindings.loadIndicatorBinding);
                    if ((progress == 'true' || progress == 'True')
                        && loadingElement != undefined) {
                        var currentRefreshTargetsCount =
                            parseInt(caller.getAttribute(settings.bindings.currentRefreshTargetsCountBinding));
                        currentRefreshTargetsCount--;
                        caller.setAttribute(settings.bindings.currentRefreshTargetsCountBinding, currentRefreshTargetsCount);
                        if (currentRefreshTargetsCount == 0) {
                            plugin.hideLoadingElement(caller, settings);
                        }
                    }
                }
            }
        };
        plugin.init = function () {
            var opts = options;
            $(el).off('refresh.RefreshComplited');
            $(el).on('refresh.RefreshComplited', opts.refreshCompleted);
            var target = el.getAttribute(opts.bindings.html.target);
            var method = el.getAttribute(opts.bindings.html.method);
            var action = el.getAttribute(opts.bindings.html.url);
            var dataType = el.getAttribute(opts.bindings.html.dataType);
            var contentType = el.getAttribute(opts.bindings.html.contentType);
            var selectorsOfDependencies = el.getAttribute(opts.bindings.html.dependecies);
            var splitter = el.getAttribute(opts.bindings.html.splitter);
            var propName = el.getAttribute(opts.bindings.html.propertyName);
            var ajaxCache = el.getAttribute(opts.bindings.html.ajaxCache);
            var isTraditional = el.getAttribute(opts.bindings.html.isTraditional);

            if (splitter == null) splitter = opts.splitter;
            if (action == null) action = opts.url;
            if (target == null) target = opts.target;
            if (method == null) method = opts.method;
            if (dataType == null) dataType = opts.dataType;
            if (contentType == null) contentType = opts.contentType;
            if (propName == null) propName = opts.propertyName;
            if (ajaxCache == null) ajaxCache = opts.ajaxCache;
            if (isTraditional == null) isTraditional = opts.isTraditional;

            var model = GenearateObjFromDependencies(selectorsOfDependencies, propName, splitter, opts.bindings.html.dependencies.defaultSendValue);
            if (obj != undefined)
                model = $.extend(model, obj);

            if (contentType.indexOf('json') > -1)
                model = JSON.stringify(model);

            var defaultDone = function (data, statusText, jqXhr) {

                var actionTarget = $(target);

                if (dataType == 'json' || dataType == 'jsonp') {
                    var clearPrevious = el.getAttribute(opts.bindings.html.clearData);
                    if (clearPrevious == undefined) clearPrevious = opts.bindings.json.clearData;
                    switch (actionTarget[0].tagName.toLowerCase()) {
                        case "input":
                            plugin.parseJsonToInput(actionTarget, data, clearPrevious);
                            break;
                        case "select":
                            plugin.parseJsonToSelect(el, actionTarget, opts.bindings, data, clearPrevious);
                            break;
                        default:
                            alert("there is no controllers for tag:" + actionTarget.attr("tagName"));
                    }
                } else {
                    actionTarget.html(data);
                }

                var emptyAction =
                    showAction($(target), $(target).attr('data-empty'));
            };
            var ajaxOptions = {
                cache: ajaxCache,
                type: method,
                url: action,
                dataType: dataType,
                data: model,
                contentType: contentType,
                traditional: isTraditional,
                success: function (data, status, jqXhr) {
                    var onSuccessAttr = el.getAttribute("data-ajax-success");
                    if (onSuccessAttr != undefined) {
                        var result;
                        if (el.getAttribute('data-override-defaultDone')) {
                            result = getFunction(onSuccessAttr, ["data", "status", "jqXhr"]).apply(el, arguments);
                        } else {
                            defaultDone(data, status, jqXhr);
                            result = getFunction(onSuccessAttr, ["data", "status", "jqXhr"]).apply(el, arguments);
                        }
                    } else {
                        defaultDone(data, status, jqXhr);
                    }

                },
                error: function (jqXhr, status, error) {

                    getFunction(el.getAttribute("data-ajax-error"), ["jqXhr", "status", "error"]).apply(el, arguments);
                },
                beforeSend: function (jqXhr) {
                    var result;
                    result = getFunction(el.getAttribute("data-ajax-send"), ["jqXhr"]).apply(el, arguments);
                    if (result !== false) {
                        //loading.show(duration);
                    }
                    return result;
                },
                complete: function (jqXhr, status) {

                    plugin.processCallerAjaxPackages(opts.caller);
                    $(el).trigger('refresh.RefreshComplited');

                    //loading.hide(duration);
                    getFunction(el.getAttribute("data-ajax-complete"), ["jqXhr", "status"]).apply(el, arguments);
                }

            };

            $.ajax(ajaxOptions);//.done(defaultDone);


        };

        plugin.init();
    };

    function showAction(jObj, actionName) {

        //if (actionName == undefined || actionName == false) {
        switch (actionName) {
            case "disable":
                var disabledAttr = jObj.attr('data-disabled');
                if (disabledAttr != undefined) {
                    jObj.removeAttr('disabled');
                    jObj.removeAttr('data-disabled');
                }
                break;
            default:

                var dataFadedAttr = jObj.attr('data-faded');

                if (dataFadedAttr != undefined) {
                    jObj.removeAttr('data-faded');
                    if (jObj.data('chosen') == undefined) {
                        jObj.fadeIn(200);
                    }

                }

        }
        if (jObj.data('chosen') != undefined) {
            jObj.next().fadeIn(200);
            jObj.trigger('chosen:updated');
        }
        // }
    }
    $.elementRefresh.setGlobalBindings = function (bindings, bindingType) {
        switch (bindingType) {
            case 'json':
                $.elementRefresh.globalSettings.bindings.json = $.extend({}, $.elementRefresh.globalSettings.bindings.json, bindings);
                break;
            case 'html':
                $.elementRefresh.globalSettings.bindings.html = $.extend({}, $.elementRefresh.globalSettings.bindings.html, bindings);
                break;
            default:
                $.elementRefresh.globalSettings.bindings = $.extend({}, $.elementRefresh.globalSettings.bindings, bindings);
                break;
        }
    }

    $.elementRefresh.globalSettings = {
        bindings: {
            html: {
                splitter: 'data-splitter',
                url: 'data-url',
                method: 'data-method',
                target: 'data-target',
                dependecies: 'data-dependent-on',
                ajaxCache: 'data-cache',
                isTraditional: 'data-traditional',
                dataType: 'data-dataType',
                contentType: 'data-contentType',
                propertyName: 'data-use-as-name',
                clearData: 'data-clear-onRefresh',
                dependencies: {
                    defaultSendValue: 'data-default-value'
                },
                select: {
                    htmlAttributes: 'data-select-htmlAttributes-binding',
                    specifyAllData: 'data-select-full-attributed',
                    id: 'data-select-id-binding',
                    name: 'data-select-name-binding',
                    defaultValue: 'data-select-defaultValue',
                    options: 'data-select-options-binding',
                    selectedValue: 'data-select-selectedValue-binding'
                }
            },
            json: {
                clearData: true,
                specifyAllData: true,
                select: {
                    id: 'Id',
                    name: 'Name',
                    htmlAttributes: 'htmlAttributes',
                    options: 'options',
                    selectedValue: 'selectedValue',
                    defaultValue: 'defaultValue'
                }
            }
        }
    };

    function GenearateObjFromDependencies(dependenciesSelectors, propertyAttributeBinding, splitter, takeAsDefaultBinding) {
        var selectors = [];
        var model = {};
        if (dependenciesSelectors != undefined) {
            selectors = dependenciesSelectors.split(splitter);
            for (var i = 0; i < selectors.length; i++) {

                var dependenDomElement = $(selectors[i]);
                if (dependenDomElement != undefined) {


                    var value;
                    if (dependenDomElement.is('input[type="checkbox"]') && dependenDomElement.val() == "on") {
                        value = dependenDomElement.is(':checked');
                    } else {
                        value = dependenDomElement.val();
                    }

                    var defaultValue = dependenDomElement.attr(takeAsDefaultBinding);
                    if (typeof defaultValue !== typeof undefined && defaultValue !== false) {
                        if (value == '')
                            value = defaultValue;
                        else
                            value = 0;
                    };

                    model[$(selectors[i]).attr(propertyAttributeBinding)] = value;
                }
            }
        }
        return model;
    };

    $.fn.extend({
        'elRefresh': function (obj, options) {
            return this.each(function () {
                $.elementRefresh(this, obj, options);
            });
        }
    });
    $.fn.extend({
        'SelfRefresh': function (obj, options) {
            return this.each(function () {
                $.elementRefresh(this, obj, options);
            });
        }
    });
})(jQuery);