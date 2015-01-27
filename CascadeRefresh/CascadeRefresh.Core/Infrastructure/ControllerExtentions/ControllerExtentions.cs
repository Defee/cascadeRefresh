using System.Text;
using System.Web.Mvc;
using CascadeRefresh.Infrastructure.CustomActionResults;

namespace CascadeRefresh.Infrastructure.ControllerExtentions
{
    public static class ControllerExtentions
    {
        /// <summary>
        /// Returns Jsonp result for CORS requests    
        /// </summary>
        /// <param name="controller">controller instance</param>
        /// <param name="data">json data object</param>
        /// <param name="contentType">content data type</param>
        /// <param name="behavior">JsonBehavior</param>
        /// <param name="contentEncoding">Encoding of the content</param>
        /// <returns>Jsonp result for CORS requests</returns>
        public static JsonpResult Jsonp(this Controller controller, object data, string contentType=null,JsonRequestBehavior behavior =JsonRequestBehavior.DenyGet, Encoding contentEncoding=null)
        {
            return new JsonpResult
            {
                JsonRequestBehavior = behavior,
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding
            };
        }
    }

}