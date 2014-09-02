using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Xml.Linq;

namespace CascadeRefresh.Infrastructure.HelperExtentions
{
    public static class ControlExtentions
    {
        public static MvcHtmlString CascadeRefresh(this MvcHtmlString control,CascadeOptions options)
        {
            var tagBuilder = control.ToTagBuilder();
            tagBuilder.Key.MergeAttributes(options.OptionsToDictionary);
            return new MvcHtmlString(tagBuilder.Key.ToString(tagBuilder.Value));
        }
        public static MvcHtmlString SelfResfreshTarget(this MvcHtmlString control, SelfRefreshTargetOptions options)
        {
            var tagBuilder = control.ToTagBuilder();
            tagBuilder.Key.MergeAttributes(options.OptionsToDictionary);
            return new MvcHtmlString(tagBuilder.Key.ToString(tagBuilder.Value));
        }

        public static KeyValuePair<TagBuilder,TagRenderMode> ToTagBuilder(this MvcHtmlString control)
        {
            var xDoc = XDocument.Parse(control.ToHtmlString());
            var firtsNode = xDoc.FirstNode;
            var htmlElement = (XElement)firtsNode;
            var selfClosing = htmlElement.IsEmpty ? TagRenderMode.SelfClosing : TagRenderMode.Normal;
            var nodeName =htmlElement.Name;

            var tagBuilder = new TagBuilder(nodeName.ToString());
            var attrs =htmlElement.Attributes();
            tagBuilder.MergeAttributes(attrs.ToDictionary(key=> key.Name,value=>value.Value));

            if (selfClosing != TagRenderMode.Normal)
                return new KeyValuePair<TagBuilder, TagRenderMode>(tagBuilder, selfClosing);
            
            var sb = new StringBuilder();
            foreach (var xNode in htmlElement.Nodes())
                sb.Append(xNode);
            tagBuilder.InnerHtml=sb.ToString();

            return new KeyValuePair<TagBuilder, TagRenderMode>(tagBuilder, selfClosing);
        }
    }

    public class SelfRefreshTargetOptions
    {
        private readonly IDictionary<string, string> _refreshTargetAttrs = new Dictionary<string, string>();
        
          #region defaultBindings 
private const string UrlBinding = "data-url";
        private const string DataTypeBinding = "data-dataType";
        private const string ContentTypeBinding = "data-contentType";
        private const string MethodBinding = "data-contentType"; 
        private const string ClearDataBinding = "data-clear-onRefresh";
        private const string PropertyNameBinding = "data-use-as-name"; 
        private const string TargetBinding = "data-target";
        private const string AjaxCacheBinding = "data-cache";
        private const string TraditionalBinding = "data-traditional";
        private const string DependeciesBinding = "data-dependent-on";
          #endregion 
        void SetDependencies(string obj)
        {
            if (!_refreshTargetAttrs.ContainsKey(DependeciesBinding))
                _refreshTargetAttrs.Add(DependeciesBinding, obj);
            else
                _refreshTargetAttrs[DependeciesBinding] = obj;
        }
        public bool DependenciesAsSelectors { get; set; }
        void SetDependencies(object obj)
        {
            if (DependenciesAsSelectors)
                return;

            var sb = new StringBuilder();
            foreach (var propertyInfo in obj.GetType().GetProperties())
                sb.Append("#" + propertyInfo.Name +";");

            if (!_refreshTargetAttrs.ContainsKey(DependeciesBinding))
                _refreshTargetAttrs.Add(DependeciesBinding, sb.ToString());
            else
                _refreshTargetAttrs[DependeciesBinding] = sb.ToString();
        }



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

        public string DataType
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(DataTypeBinding) ? _refreshTargetAttrs[DataTypeBinding] : String.Empty;
            }
            set
            {
                if (!_refreshTargetAttrs.ContainsKey(UrlBinding))
                    _refreshTargetAttrs.Add(DataTypeBinding, value);
                else
                    _refreshTargetAttrs[DataTypeBinding] = value;
            }
        }

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
        public object Dependecies
        {
            get
            {
                return _refreshTargetAttrs.ContainsKey(DependeciesBinding) ? _refreshTargetAttrs[DependeciesBinding] : String.Empty;
            }
            set
            {
                if (value as string != null)
                    SetDependencies(value as string);
                else
                    SetDependencies(value);
            }
        }
        public IDictionary<string,string> OptionsToDictionary
        {
            get
            {
                return _refreshTargetAttrs;
            }
        }
    }

    public class CascadeOptions
    {
        IDictionary<string, string> cascadeAttrs = new Dictionary<string, string>()
        {
            { "data-cascade", "true" }
        };
        #region defaultBindings 

        
        
       
       

        private const string RefreshTargetsBinding = "data-refresh-targets";
        #endregion
        public bool RefreshTargetsAsSelectors { get; set; }
        void SetRefreshTargets(string obj)
        {
            if (!cascadeAttrs.ContainsKey(RefreshTargetsBinding))
                cascadeAttrs.Add(RefreshTargetsBinding, obj);
            else
                cascadeAttrs[RefreshTargetsBinding] = obj;
        }
        void SetRefreshTargets(object obj)
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
        public object RefreshTargets
        {
            get
            {
                return cascadeAttrs.ContainsKey(RefreshTargetsBinding) ? cascadeAttrs[RefreshTargetsBinding] : String.Empty;
            }
            set
            {
                if (value as string != null)
                    SetRefreshTargets(value as string);
                else
                    SetRefreshTargets(value);
            }
        }
        public IDictionary<string,string> OptionsToDictionary
        {
            get
            {
                return cascadeAttrs;
            }
        }

        
    }
}