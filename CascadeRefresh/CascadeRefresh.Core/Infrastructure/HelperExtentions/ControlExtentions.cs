using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Xml.Linq;

namespace CascadeRefresh.Infrastructure.HelperExtentions
{
    /// <summary>
    /// Extentions for controls Interpreted as MvcHtmlString
    /// </summary>
    public static class ControlExtentions
    {
        /// <summary>
        /// This extention adds attributes for CascadeRefresh plugin to a standard Mvc control  
        /// </summary>
        /// <param name="control">Interpreted as MvcHtml string control</param>
        /// <param name="options">Cascade refresh options</param>
        /// <returns>Extended Html control as MvcHtml string</returns>
        public static MvcHtmlString CascadeRefresh(this MvcHtmlString control, CascadeOptions options)
        {
            var tagBuilder = control.ToTagBuilder();
            tagBuilder.Key.MergeAttributes(options.OptionsToDictionary);
            return new MvcHtmlString(tagBuilder.Key.ToString(tagBuilder.Value));
        }
        /// <summary>
        /// This extention adds attributes for SelfRefresh plugin actions to a standard Mvc control
        /// </summary>
        /// <param name="control">Interpreted as MvcHtml string control</param>
        /// <param name="options">Self resfresh options</param>
        /// <returns></returns>
        public static MvcHtmlString SelfResfreshTarget(this MvcHtmlString control, SelfRefreshTargetOptions options)
        {
            var tagBuilder = control.ToTagBuilder();
            tagBuilder.Key.MergeAttributes(options.OptionsToDictionary);
            return new MvcHtmlString(tagBuilder.Key.ToString(tagBuilder.Value));
        }

        /// <summary>
        /// This xxtention transforms an MvcTag to TagBuilder
        /// </summary>
        /// <param name="control">Interpreted as MvcHtml string control</param>
        /// <returns>KEy Value Pair  Key is a tag. Value is its rener mode</returns>
        public static KeyValuePair<TagBuilder, TagRenderMode> ToTagBuilder(this MvcHtmlString control)
        {
            var xDoc = XDocument.Parse(control.ToHtmlString());
            var firtsNode = xDoc.FirstNode;
            var htmlElement = (XElement)firtsNode;
            var selfClosing = htmlElement.IsEmpty ? TagRenderMode.SelfClosing : TagRenderMode.Normal;
            var nodeName = htmlElement.Name;

            var tagBuilder = new TagBuilder(nodeName.ToString());
            var attrs = htmlElement.Attributes();
            tagBuilder.MergeAttributes(attrs.ToDictionary(key => key.Name, value => value.Value));

            if (selfClosing != TagRenderMode.Normal)
                return new KeyValuePair<TagBuilder, TagRenderMode>(tagBuilder, selfClosing);

            var sb = new StringBuilder();
            foreach (var xNode in htmlElement.Nodes())
                sb.Append(xNode);
            tagBuilder.InnerHtml = sb.ToString();

            return new KeyValuePair<TagBuilder, TagRenderMode>(tagBuilder, selfClosing);
        }
    }

    /// <summary>
    /// It is Self refresh Target Options object. It describes the ajax request that will be sent to the server to refresh the element.
    /// </summary>
    public class SelfRefreshTargetOptions
    {
        private readonly IDictionary<string, string> _refreshTargetAttrs = new Dictionary<string, string>();

        #region defaultBindings
        private const string UrlBinding = "data-url";
        private const string DataTypeBinding = "data-dataType";
        private const string ContentTypeBinding = "data-contentType";
        private const string MethodBinding = "data-method";
        private const string ClearDataBinding = "data-clear-onRefresh";
        private const string PropertyNameBinding = "data-use-as-name";
        private const string TargetBinding = "data-target";
        private const string AjaxCacheBinding = "data-cache";
        private const string TraditionalBinding = "data-traditional";
        private const string DependeciesBinding = "data-dependent-on";
        private const string OnSuccessBinding = "data-ajax-success";
        private const string OnErrorBinding = "data-ajax-error";
        private const string OnSendBinding = "data-ajax-send";
        private const string OnCompliteBinding = "data-ajax-complite";
        private const string OverrideOnSuccessDefaultBehaviourBinding = "data-override-defaultDone";
       
        #endregion
        /// <summary>
        /// It is a name of javascript function to execute on complete of the ajax request
        /// </summary>
        public string OnComplite
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(OnCompliteBinding) ? _refreshTargetAttrs[OnCompliteBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(OnCompliteBinding))
                    _refreshTargetAttrs.Add(OnCompliteBinding, value);
                else
                    _refreshTargetAttrs[OnCompliteBinding] = value;
            }
        }
        /// <summary>
        ///  It is a name of javascript function to execute on success of the ajax request
        /// </summary>
        public string OnSuccess
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(OnSuccessBinding) ? _refreshTargetAttrs[OnSuccessBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(OnSuccessBinding))
                    _refreshTargetAttrs.Add(OnSuccessBinding, value);
                else
                    _refreshTargetAttrs[OnSuccessBinding] = value;
            }
        }
        /// <summary>
        ///  It is a name of javascript function to execute befire sending the ajax request
        /// </summary>
        public string OnSend
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(OnSendBinding) ? _refreshTargetAttrs[OnSendBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(OnSendBinding))
                    _refreshTargetAttrs.Add(OnSendBinding, value);
                else
                    _refreshTargetAttrs[OnSendBinding] = value;
            }
        }
        /// <summary>
        ///  It is a name of javascript function to execute on error of the ajax request
        /// </summary>
        public string OnError
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(OnErrorBinding) ? _refreshTargetAttrs[OnErrorBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(OnErrorBinding))
                    _refreshTargetAttrs.Add(OnErrorBinding, value);
                else
                    _refreshTargetAttrs[OnErrorBinding] = value;
            }
        }

        /// <summary>
        /// Sets Dependencies from string
        /// </summary>
        /// <param name="obj"></param>
        private void SetDependencies(string obj)
        {
            if (!_refreshTargetAttrs.ContainsKey(DependeciesBinding))
                _refreshTargetAttrs.Add(DependeciesBinding, obj);
            else
                _refreshTargetAttrs[DependeciesBinding] = obj;
        }

        /// <summary>
        /// Sets dependencies from object
        /// </summary>
        /// <param name="obj"></param>
        private void SetDependencies(object obj)
        {
            if (DependenciesAsSelectors)
                return;

            var sb = new StringBuilder();
            foreach (var propertyInfo in obj.GetType().GetProperties())
                sb.Append("#" + propertyInfo.Name + ";");

            if (!_refreshTargetAttrs.ContainsKey(DependeciesBinding))
                _refreshTargetAttrs.Add(DependeciesBinding, sb.ToString());
            else
                _refreshTargetAttrs[DependeciesBinding] = sb.ToString();
        }

        /// <summary>
        /// The dependencies value is selectors  flag
        /// </summary>
        public bool DependenciesAsSelectors { get; set; }

        /// <summary>
        /// Indicates if the on success standard behavier should be overriden.
        /// </summary>
        public bool OverrideStandardtOnSuccessBehavior
        {
            get
            {
                return Boolean.Parse(_refreshTargetAttrs.ContainsKey(OverrideOnSuccessDefaultBehaviourBinding) ? _refreshTargetAttrs[OverrideOnSuccessDefaultBehaviourBinding] : String.Empty);
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(OverrideOnSuccessDefaultBehaviourBinding))
                    _refreshTargetAttrs.Add(OverrideOnSuccessDefaultBehaviourBinding, value.ToString().ToLower());
                else
                    _refreshTargetAttrs[OverrideOnSuccessDefaultBehaviourBinding] = value.ToString().ToLower();
            }
        }
        /// <summary>
        /// Is traditional flag
        /// </summary>
        public bool Traditional
        {
            get
            {
                return Boolean.Parse(_refreshTargetAttrs.ContainsKey(TraditionalBinding) ? _refreshTargetAttrs[TraditionalBinding] : String.Empty);
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(TraditionalBinding))
                    _refreshTargetAttrs.Add(TraditionalBinding, value.ToString().ToLower());
                else
                    _refreshTargetAttrs[TraditionalBinding] = value.ToString().ToLower();
            }
        }
        /// <summary>
        /// Enables or disables ajax caching in browser
        /// </summary>
        public bool AjaxCache
        {
            get
            {
                return Boolean.Parse(_refreshTargetAttrs.ContainsKey(AjaxCacheBinding) ? _refreshTargetAttrs[AjaxCacheBinding] : String.Empty);
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(AjaxCacheBinding))
                    _refreshTargetAttrs.Add(AjaxCacheBinding, value.ToString().ToLower());
                else
                    _refreshTargetAttrs[AjaxCacheBinding] = value.ToString().ToLower();
            }
        }

        /// <summary>
        /// Target Html element selector
        /// </summary>
        public string Target
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(TargetBinding) ? _refreshTargetAttrs[TargetBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(TargetBinding))
                    _refreshTargetAttrs.Add(TargetBinding, value);
                else
                    _refreshTargetAttrs[TargetBinding] = value;
            }
        }

        public string PropertyName
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(PropertyNameBinding) ? _refreshTargetAttrs[PropertyNameBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(PropertyNameBinding))
                    _refreshTargetAttrs.Add(PropertyNameBinding, value);
                else
                    _refreshTargetAttrs[PropertyNameBinding] = value;
            }
        }
        /// <summary>
        /// Flag for clearing previous data
        /// </summary>
        public string ClearData
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(ClearDataBinding) ? _refreshTargetAttrs[ClearDataBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(ClearDataBinding))
                    _refreshTargetAttrs.Add(ClearDataBinding, value);
                else
                    _refreshTargetAttrs[ClearDataBinding] = value;
            }
        }
        /// <summary>
        /// Http Get or Http Post Method
        /// </summary>
        public string Method
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(MethodBinding) ? _refreshTargetAttrs[MethodBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(MethodBinding))
                    _refreshTargetAttrs.Add(MethodBinding, value);
                else
                    _refreshTargetAttrs[MethodBinding] = value;
            }
        }
        /// <summary>
        /// Content Type
        /// </summary>
        public string ContentType
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(ContentTypeBinding) ? _refreshTargetAttrs[ContentTypeBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(ContentTypeBinding))
                    _refreshTargetAttrs.Add(ContentTypeBinding, value);
                else
                    _refreshTargetAttrs[ContentTypeBinding] = value;
            }
        }
        /// <summary>
        /// Data Type
        /// </summary>
        public string DataType
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(DataTypeBinding) ? _refreshTargetAttrs[DataTypeBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(DataTypeBinding))
                    _refreshTargetAttrs.Add(DataTypeBinding, value);
                else
                    _refreshTargetAttrs[DataTypeBinding] = value;
            }
        }
        /// <summary>
        /// Url for processing the ajax request
        /// </summary>
        public string Url
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(UrlBinding) ? _refreshTargetAttrs[UrlBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(UrlBinding))
                    _refreshTargetAttrs.Add(UrlBinding, value);
                else
                    _refreshTargetAttrs[UrlBinding] = value;
            }
        }
        /// <summary>
        /// Dependencies of an element from an elements on the page.
        /// </summary>
        public object Dependecies
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(DependeciesBinding) ? _refreshTargetAttrs[DependeciesBinding] : String.Empty;
            }
            set
            {
                var dependencies = value as string;
                if (dependencies != null)
                    SetDependencies(dependencies);
                else
                    SetDependencies(value);
            }
        }
        /// <summary>
        /// Transforms options to dictionary
        /// </summary>
        public IDictionary<string, string> OptionsToDictionary
        {
            get
            {
                return _refreshTargetAttrs;
            }
        }
    }
    /// <summary>
    /// It is Cascade Refresh Options object
    /// </summary>
    public class CascadeOptions
    {
        IDictionary<string, string> cascadeAttrs = new Dictionary<string, string>
        {
            { "data-cascade", "true" }
        };
        #region defaultBindings
        private const string RefreshTargetsBinding = "data-refresh-targets";
        private const string LoadingElementBinding = "data-loading-element";
        private const string EnableProgress = "data-enable-progress";
        
        
        #endregion
        /// <summary>
        /// Selector for a loadingElement
        /// </summary>
        public string LoadingElement
        {
            get
            {
                return cascadeAttrs.ContainsKey(LoadingElementBinding) ? cascadeAttrs[LoadingElementBinding] : String.Empty;
            }
            set
            {
                if (!cascadeAttrs.ContainsKey(LoadingElementBinding))
                    cascadeAttrs.Add(EnableProgress,"true");

                if (!cascadeAttrs.ContainsKey(LoadingElementBinding))
                    cascadeAttrs.Add(LoadingElementBinding, value);
                else
                    cascadeAttrs[LoadingElementBinding] = value;
            }
        }
        /// <summary>
        /// THis flag shows:"Is current Refresh Targets selectors?"
        /// </summary>
        public bool RefreshTargetsAsSelectors { get; set; }
        /// <summary>
        /// Sets Refresh targets
        /// </summary>
        /// <param name="obj"></param>
        private void SetRefreshTargets(string obj)
        {
            if (!cascadeAttrs.ContainsKey(RefreshTargetsBinding))
                cascadeAttrs.Add(RefreshTargetsBinding, obj);
            else
                cascadeAttrs[RefreshTargetsBinding] = obj;
        }
        /// <summary>
        /// Sets Refresh Targets
        /// </summary>
        /// <param name="obj"></param>
        private void SetRefreshTargets(object obj)
        {
            if (RefreshTargetsAsSelectors)
                return;

            var sb = new StringBuilder();
            foreach (var propertyInfo in obj.GetType().GetProperties())
                sb.Append("#" + propertyInfo.Name + ";");

            if (!cascadeAttrs.ContainsKey(RefreshTargetsBinding))
                cascadeAttrs.Add(RefreshTargetsBinding, sb.ToString());
            else
                cascadeAttrs[RefreshTargetsBinding] = sb.ToString();
        }
        /// <summary>
        /// Get or sets refresh targets as object
        /// </summary>
        public object RefreshTargets
        {
            get
            {
                return cascadeAttrs.ContainsKey(RefreshTargetsBinding) ? cascadeAttrs[RefreshTargetsBinding] : String.Empty;
            }
            set
            {
                var refreshTargets = value as string;
                if (refreshTargets != null)
                    SetRefreshTargets(refreshTargets);
                else
                    SetRefreshTargets(value);
            }
        }

        /// <summary>
        /// Transforms Options to dictionary object
        /// </summary>
        public IDictionary<string, string> OptionsToDictionary
        {
            get
            {
                return cascadeAttrs;
            }
        }


    }
}