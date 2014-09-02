
(function ($) {
    var pluginName = 'elRefresh';
    $.fn.exists = function () {
        return $(this).length > 0;
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
            var defaults = {
                bindings: {
                    splitter: 'data-splitter',
                    url: 'data-url',
                    method: 'data-method',
                    target: 'data-target',
                    dependecies: 'data-dependent-on',
                    ajaxCache: 'data-cache',
                    isTraditional: 'data-traditional',
                    dataType: 'data-dataType',
                    contentType: 'data-contentType',
                    //TODO: Impliment: onSuccess: 'data-onSuccess',
                    //TODO: Impliment: onError: 'data-onError',
                    //TODO: Impliment: onBegin: 'data-onBegin',
                    //TODO: Impliment: onComplite: 'data-onComplite',
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
                method: 'GET',
                splitter: ';',
                target: '#' + $(this).attr('id'),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'html',
                isTraditionsl: true,
                ajaxCache: false,
                propertyName: 'name',
                url: window.location.href,
                bindingDefaults: {
                    clearData: true,
                    select: {
                        specifyAllData: 'false',
                        id: 'Id',
                        name: 'Name',
                        htmlAttributes: 'htmlAttributes',
                        options: 'options',
                        selectedValue: 'selectedValue',
                        defaultValue: 'defaultValue'

                    }
                },
                refreshCompleted : function(){}

        };
            options = $.extend(defaults, options);

            return this.each(function () {
                var opts = options;
                var htmlElement = this;
                $(htmlElement).off('refresh.RefreshComplited');
                $(htmlElement).on('refresh.RefreshComplited', opts.refreshCompleted);
                var target = htmlElement.getAttribute(opts.bindings.target);
                var method = htmlElement.getAttribute(opts.bindings.method);
                var action = htmlElement.getAttribute(opts.bindings.url);
                var dataType = htmlElement.getAttribute(opts.bindings.dataType);
                var contentType = htmlElement.getAttribute(opts.bindings.contentType);
                var selectorsOfDependencies = htmlElement.getAttribute(opts.bindings.dependecies);
                var splitter = htmlElement.getAttribute(opts.bindings.splitter);
                var propName = htmlElement.getAttribute(opts.bindings.propertyName);
                var ajaxCache = htmlElement.getAttribute(opts.bindings.ajaxCache);
                var isTraditional = htmlElement.getAttribute(opts.bindings.isTraditional);
               
                if (splitter == null) splitter = opts.splitter;
                if (action == null)action= opts.url;
                if (target == null) target = opts.target;
                if (method == null) method = opts.method;
                if (dataType == null) dataType = opts.dataType;
                if (contentType == null) contentType = opts.contentType;
                if (propName == null) propName = opts.propertyName;
                if (ajaxCache == null) ajaxCache = opts.ajaxCache;
                if (isTraditional == null) isTraditional = opts.isTraditional;
              
                var model = GenearateObjFromDependencies(selectorsOfDependencies, propName, splitter, opts.bindings.dependencies.defaultSendValue);
                if (obj != undefined)
                    model = $.extend(model, obj);

                if (contentType.indexOf('json') > -1)
                    model = JSON.stringify(model);
                
                var defaultDone = function (data, statusText, jqXhr) {
                    console.log(data);
                    debugger;
                    var actionTarget = $(target);
                    console.log(dataType);

                    if (dataType == 'json' || dataType == 'jsonp') {
                        var clearPrevious = htmlElement.getAttribute(opts.bindings.clearData);
                        if (clearPrevious == undefined) clearPrevious = opts.bindingDefaults.clearData;

                        if (actionTarget.is('input')) {

                            if (clearPrevious)
                                actionTarget.val(data);
                            else
                                actionTarget(actionTarget.val() + data);


                        }

                        if (actionTarget.is('select')) {

                            var idBinding = htmlElement.getAttribute(opts.bindings.select.id);
                            if (idBinding == null) idBinding = opts.bindingDefaults.select.id;

                            var nameBinding = htmlElement.getAttribute(opts.bindings.select.name);
                            if (nameBinding == null) nameBinding = opts.bindingDefaults.select.name;

                            var getfullAttributes = htmlElement.getAttribute(opts.bindings.select.specifyAllData);
                            if (getfullAttributes == null) getfullAttributes = opts.bindingDefaults.select.specifyAllData;


                            if (clearPrevious)
                                actionTarget.find('option').remove();
                            if (getfullAttributes) {
                                var htmlAttrBinding = htmlElement.getAttribute(opts.bindings.select.htmlAttributes);
                                if (htmlAttrBinding == null) htmlAttrBinding = opts.bindingDefaults.select.htmlAttributes;

                                $.each(data[htmlAttrBinding], function (key, val) {
                                    if (key == 'class') {
                                        var classAtrr = actionTarget.attr(key);
                                        if (classAtrr.indexOf(val) == -1) {
                                            val = classAtrr + ' ' + val;
                                        }

                                    }
                                    actionTarget.attr(key, val);
                                });
                                var defaultValueBinding = htmlElement.getAttribute(opts.bindings.select.defaultValue);
                                if (defaultValueBinding == null) defaultValueBinding = opts.bindingDefaults.select.defaultValue;
                                if (data[defaultValueBinding] != undefined && data[defaultValueBinding] != null)
                                    actionTarget.append('<option value>' + data[defaultValueBinding] + '</option>');


                                var optionsBinding = htmlElement.getAttribute(opts.bindings.select.options);
                                if (optionsBinding == null) optionsBinding = opts.bindingDefaults.select.options;

                                $.each(data[optionsBinding], function (key, val) {
                                    if ($.isPlainObject(val)) {
                                        actionTarget.append('<option value=' + val[idBinding] + '>' + val[nameBinding] + '</option>');
                                    } else {
                                        actionTarget.append('<option value=' + key + '>' + val + '</option>');
                                    }
                                });
                                var selectValueBinding = htmlElement.getAttribute(opts.bindings.select.selectedValue);
                                if (selectValueBinding == null) selectValueBinding = opts.bindingDefaults.select.selectedValue;
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

                

                if (dataType == "jsonp") {
                    //ajaxOptions['crossDomain'] = true;
                    ////ajaxOptions[]
                    //ajaxOptions['jsonpCallback'] = 'callback';
                }


                $.ajax(ajaxOptions);//.done(defaultDone);


                $(htmlElement).trigger('refresh.RefreshComplited');

            });
        }
    });
})(jQuery);