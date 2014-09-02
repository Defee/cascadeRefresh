using System;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CascadeRefresh.Infrastructure.CustomActionResults
{
    public class JsonpResult : JsonResult
    {

        public string Callback { get; set; }

        /// <summary>
        /// Enables processing of the result of an action method by a
        /// custom type that inherits from <see cref="T:System.Web.Mvc.ActionResult"/>.
        /// </summary>
        /// <param name="context">The context within which the
        /// result is executed.</param>
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            var response = context.HttpContext.Response;
            response.ContentType = !String.IsNullOrEmpty(ContentType) ? ContentType : "application/javascript";

            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            if (string.IsNullOrEmpty(Callback))
                Callback = context.HttpContext.Request.QueryString["callback"];

            if (Data == null) return;

            // The JavaScriptSerializer type was marked as obsolete
            // prior to .NET Framework 3.5 SP1 
#pragma warning disable 0618
            var serializer = new JavaScriptSerializer();
            var ser = serializer.Serialize(Data);
            response.Write(Callback + "(" + ser + ");");
#pragma warning restore 0618vip
        }
    }
}