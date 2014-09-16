
(function ($) {
    var pluginName = 'elRefresh';
    $.fn.exists = function () {
        return $(this).length > 0;
    };
    function callFunction(functionName, context /*, args */) {
        var args = [].slice.call(arguments).splice(2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(this, args);
    }
     
    $.elementRefresh = function (element,obj, options) {
         var $element = $(element),
            el = element;
         var defaults = {
            method: 'GET',
            splitter: ';',
            target: '#' + $element.attr('id'),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'html',
            isTraditionsl: true,
            ajaxCache: false,
            propertyName: 'name',
            url: window.location.href,
            refreshCompleted: function () { }
        };
        
        defaults = $.extend({}, $.elementRefresh.globalSettings, defaults);
        options = $.extend(defaults, options);

        var plugin = this;

        plugin.init = function () {
            var opts = options;
            console.log(opts);
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

                    if (actionTarget.is('input')) {
                        if (clearPrevious)
                            actionTarget.val(data);
                        else
                            actionTarget(actionTarget.val() + data);
                    }

                    if (actionTarget.is('select')) {

                        var idBinding = el.getAttribute(opts.bindings.html.select.id);
                        if (idBinding == null) idBinding = opts.bindings.json.select.id;

                        var nameBinding = el.getAttribute(opts.bindings.html.select.name);
                        if (nameBinding == null) nameBinding = opts.bindings.json.select.name;

                        var getfullAttributes = el.getAttribute(opts.bindings.html.select.specifyAllData);
                        if (getfullAttributes == null) getfullAttributes = opts.bindings.json.select.specifyAllData;


                        if (clearPrevious)
                            actionTarget.find('option').remove();
                        if (getfullAttributes) {
                            var htmlAttrBinding = el.getAttribute(opts.bindings.html.select.htmlAttributes);
                            if (htmlAttrBinding == null) htmlAttrBinding = opts.bindings.json.select.htmlAttributes;

                            $.each(data[htmlAttrBinding], function (key, val) {
                                if (key == 'class') {
                                    var classAtrr = actionTarget.attr(key);
                                    if (classAtrr.indexOf(val) == -1) {
                                        val = classAtrr + ' ' + val;
                                    }

                                }
                                actionTarget.attr(key, val);
                            });
                            var defaultValueBinding = el.getAttribute(opts.bindings.html.select.defaultValue);
                            if (defaultValueBinding == null) defaultValueBinding = opts.bindings.json.select.defaultValue;
                            if (data[defaultValueBinding] != undefined && data[defaultValueBinding] != null)
                                actionTarget.append('<option value>' + data[defaultValueBinding] + '</option>');


                            var optionsBinding = el.getAttribute(opts.bindings.html.select.options);
                            if (optionsBinding == null) optionsBinding = opts.bindings.json.select.options;

                            $.each(data[optionsBinding], function (key, val) {
                                if ($.isPlainObject(val)) {
                                    actionTarget.append('<option value=' + val[idBinding] + '>' + val[nameBinding] + '</option>');
                                } else {
                                    actionTarget.append('<option value=' + key + '>' + val + '</option>');
                                }
                            });
                            var selectValueBinding = el.getAttribute(opts.bindings.html.select.selectedValue);
                            if (selectValueBinding == null) selectValueBinding = opts.bindings.json.select.selectedValue;
                            if (data[selectValueBinding] != undefined && data[selectValueBinding] != null)
                                actionTarget.val(data[selectValueBinding]);

                        } else {
                            $.each(data, function (key, val) {

                                if ($.isPlainObject(val)) {
                                    actionTarget.append('<option value=' + val[idBinding] + '>' + val[nameBinding] + '</option>');
                                } else {
                                    actionTarget.append('<option value=' + key + '>' + val + '</option>');
                                }
                            });
                        }


                    }
                } else {
                    actionTarget.html(data);
                }

                var emptyAction = $(target).attr('data-empty');
                console.log($(target));
                if (emptyAction == undefined || emptyAction == false) {
                    switch (emptyAction) {
                        case "disable":
                            var disabledAttr = $(target).attr('data-disabled');
                            if (disabledAttr != undefined) {
                                $(target).removeAttr('disabled');
                                $(target).removeAttr('data-disabled');
                            }

                        default:
                            var dataFadedAttr = $(target).attr('data-faded');
                            if (dataFadedAttr != undefined) {
                                $(target).removeAttr('data-faded');
                                $(target).fadeIn(200);
                            }
                    }
                }
            };

            var ajaxOptions = {
                cache: ajaxCache,
                type: method,
                url: action,
                dataType: dataType,
                data: model,
                contentType: contentType,
                traditional: isTraditional,
                success: defaultDone
            };

            $.ajax(ajaxOptions);//.done(defaultDone);

            $(el).trigger('refresh.RefreshComplited');
        };

        plugin.init();
    };

    $.elementRefresh.setGlobalBindings=function(bindings, bindingType) {
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
                specifyAllData: 'false',
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
                console.log('asd');
                $.elementRefresh(this, obj, options);
            });
        }
    });
})(jQuery);